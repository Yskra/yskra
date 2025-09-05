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

const directionIsOffAxis: Readonly<Record<Direction, (angle: number) => boolean>> = Object.freeze({
  [Direction.LEFT]: (angle) => angle < 135,
  [Direction.RIGHT]: (angle) => angle > 45,
  [Direction.UP]: (angle) => angle < 45,
  [Direction.DOWN]: (angle) => angle > 135,
});

/**
 * Return adjusted distance with priority for elements on one axis.
 */
export function getAdjustedDistance(
  targetCenter: ElementCenter,
  elementCenter: ElementCenter,
  direction: Direction,
  tolerance: number = 120,
  offAxisPenalty: number = 4
): number {
  const deltaX = targetCenter.x - elementCenter.x;
  const deltaY = targetCenter.y - elementCenter.y;

  const squaredDistance = deltaX * deltaX + deltaY * deltaY;

  if (squaredDistance === 0) {
    return 0;
  }

  // Для проверки направления все равно нужно вычислить угол
  const angleDegrees = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  const absAngle = Math.abs(angleDegrees);

  const isOffAxis = (() => {
    switch (direction) {
      case Direction.RIGHT:
        return absAngle > 45;
      case Direction.LEFT:
        return absAngle < 135;
      case Direction.DOWN:
      case Direction.UP:
        return absAngle < 45 || absAngle > 135;
      default:
        return false;
    }
  })();

  if (isOffAxis) {
    const offAxisDistance = (direction === Direction.RIGHT || direction === Direction.LEFT)
      ? Math.abs(deltaY)
      : Math.abs(deltaX);

    if (offAxisDistance > tolerance) {
      // Возвращаем квадрат расстояния + штраф (для сравнения это приемлемо)
      // Или если нужен точный результат, вычисляем корень только в конце:
      const baseDistance = Math.sqrt(squaredDistance);
      return baseDistance + (offAxisDistance - tolerance) * offAxisPenalty;
    }
  }

  // Возвращаем квадрат расстояния вместо самого расстояния
  // (только если функция используется для сравнения, а не как абсолютное значение)
  return Math.sqrt(squaredDistance);
}
