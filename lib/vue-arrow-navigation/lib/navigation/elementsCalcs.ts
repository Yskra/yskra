import type { MaybeRefOrGetter } from 'vue';
import type { Adapter, Direction } from './Public';
import { toRef } from 'vue';
import {directionCalcByCenter, directionCalcBySide, getAdjustedDistance, getCenter, isIntersecting} from './algebra';

interface ClosestElement<T extends Element> { target: T; rect: DOMRectReadOnly }

export function useElementsUtils(adapter: Adapter) {
  return {
    getClosedElements: <T extends Element, I extends T>(target: T, rects: Iterable<[I, DOMRectReadOnly]>, direction: Direction) => getClosedElements<T, I>(target, rects, direction, adapter),
    filterByDirection: <T extends Element, I extends T>(target: Element, rects: Iterable<[I, DOMRectReadOnly]>, direction: Direction) => filterByDirection<T, I>(target, rects, direction, adapter),
    useRectIterator: <T extends Element>(elements: MaybeRefOrGetter<Iterable<T>>) => useRectIterator<T>(elements, adapter),
  };
}

export function getClosedElements<T extends Element, I extends T>(target: T, rects: Iterable<[I, DOMRectReadOnly]>, direction: Direction, adapter: Adapter): ClosestElement<I>[] {
  const targetRect = adapter.getNodeRect(target);
  const targetCenter = getCenter(targetRect);
  const filteredElements: Array<{ element: I; rect: DOMRectReadOnly; distance: number }> = [];

  for (const [element, rect] of rects) {
    if (element === target)
      continue;

    const elementCenter = getCenter(rect);
    const isValidDirection = directionCalcByCenter[direction](targetCenter, elementCenter);


    if (isValidDirection) {
      filteredElements.push({
        element,
        rect,
        distance: getAdjustedDistance(targetCenter, elementCenter, direction)
      });
    }
  }

  return filteredElements
    .toSorted((a, b) => a.distance - b.distance)
    .map((i) => ({ target: i.element, rect: i.rect }));
}

export function filterByDirection<T extends Element, I extends T>(target: Element, rects: Iterable<[I, DOMRectReadOnly]>, direction: Direction, adapter: Adapter): Element[] {
  const targetRect = adapter.getNodeRect(target);
  const candidates: Array<{ element: I; distance: number }> = [];

  for (const [element, rect] of rects) {
    if (element === target)
      continue;

    const directionDistance = directionCalcBySide[direction](targetRect, rect);

    if (directionDistance < 0) {
      if (isIntersecting(targetRect, rect)) {
        candidates.push({ element, distance: 0 });
      }

      continue; // Не в нужном направлении
    }
    candidates.push({ element, distance: directionDistance });
  }
  return candidates
    .toSorted((a, b) => a.distance - b.distance)
    .map((i) => i.element);
}

export function useRectIterator<T extends Element>(elements: MaybeRefOrGetter<Iterable<T>>, adapter: Adapter): Iterable<[T, DOMRectReadOnly]> {
  const elementsRef = toRef(elements);

  return {
    [Symbol.iterator]: () => {
      const iterator = Array.from(elementsRef.value); // Безопасное создание массива
      let index = 0;

      return {
        next: () => {
          if (index >= iterator.length) {
            return { done: true, value: undefined };
          }

          const element: T = iterator[index++];
          const rect = adapter.getNodeRect(element);

          return {
            done: false,
            value: [element, rect],
          };
        },
      };
    },
  };
}
