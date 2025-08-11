import { expect, it } from 'vitest';
import deepMerge from '../deepMerge';

it('should merge two objects deeply', () => {
  const obj1 = {
    a: 1,
    b: {
      c: 2,
      d: [3, 4],
    },
  };
  const obj2 = {
    b: {
      c: 5,
      d: [3, 6],
    },
    e: 7,
  };
  const expected = {
    a: 1,
    b: {
      c: 5,
      d: [3, 4, 6],
    },
    e: 7,
  };

  expect(deepMerge(obj1, obj2)).toEqual(expected);
});

it('should handle merging objects with different structures', () => {
  const obj1 = {
    a: {
      b: 1,
    },
  };
  const obj2 = {
    a: {
      c: 2,
    },
  };
  const expected = {
    a: {
      b: 1,
      c: 2,
    },
  };

  expect(deepMerge(obj1, obj2)).toEqual(expected);
});
