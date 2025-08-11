import { Direction } from './Public.d';

export interface ElementCenter {
  x: number;
  y: number;
}

export function getCenter(rect: DOMRectReadOnly): ElementCenter {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

export function isIntersecting(a: DOMRectReadOnly, b: DOMRectReadOnly): boolean {
  return !(
    a.right <= b.left
    || a.left >= b.right
    || a.bottom <= b.top
    || a.top >= b.bottom
  );
}

export const directionCalcBySide: Readonly<Record<Direction, (t: DOMRectReadOnly, c: DOMRectReadOnly) => number>> = Object.freeze({
  [Direction.LEFT]: (target, current) => target.left - current.right,
  [Direction.RIGHT]: (target, current) => current.left - target.right,
  [Direction.UP]: (target, current) => target.top - current.bottom,
  [Direction.DOWN]: (target, current) => current.top - target.bottom,
});

export const directionCalcByCenter: Readonly<Record<Direction, (t: ElementCenter, c: ElementCenter) => boolean>> = Object.freeze({
  [Direction.LEFT]: (target, current) => current.x < target.x,
  [Direction.RIGHT]: (target, current) => current.x > target.x,
  [Direction.UP]: (target, current) => current.y < target.y,
  [Direction.DOWN]: (target, current) => current.y > target.y,
});

