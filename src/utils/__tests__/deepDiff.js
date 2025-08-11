import { describe, expect, it } from 'vitest';
import deepDiff from '../deepDiff';

describe('basic cases', () => {
  it('same object returns empty object', () => {
    const obj1 = { a: 1 };
    const obj2 = { a: 1 };
    const output = {};

    expect(deepDiff(obj1, obj2)).toEqual(output);
  });

  it('different primitive values return differences', () => {
    const obj1 = { a: 1 };
    const obj2 = { a: 2 };
    const output = { a: 2 };

    expect(deepDiff(obj1, obj2)).toEqual(output);
  });

  it('one object has additional properties', () => {
    const obj1 = { a: 1 };
    const obj2 = { a: 1, b: 2 };
    const output = { b: 2 };

    expect(deepDiff(obj1, obj2)).toEqual(output);
  });

  it('different nested objects', () => {
    const obj1 = { a: { b: 1 } };
    const obj2 = { a: { b: 2 } };
    const output = { a: { b: 2 } };

    expect(deepDiff(obj1, obj2)).toEqual(output);
  });
});

describe('edge cases', () => {
  it('objects with null or undefined values', () => {
    const obj1 = { a: null };
    const obj2 = { a: undefined };
    const output = { a: undefined };

    expect(deepDiff(obj1, obj2)).toEqual(output);
  });

  it('arrays as values', () => {
    const obj1 = { arr: [1, 2] };
    const obj2 = { arr: [1, 3] };
    const output = { arr: [1, 3] };

    expect(deepDiff(obj1, obj2)).toEqual(output);
  });
});

describe('deep nesting', () => {
  it('many levels of nested objects', () => {
    const obj1 = { a: { b: { c: { d: 1 } } } };
    const obj2 = { a: { b: { c: { d: 2 } } } };
    const output = { a: { b: { c: { d: 2 } } } };

    expect(deepDiff(obj1, obj2)).toEqual(output);
  });

  it('mixed types in nested structures', () => {
    const obj1 = { arr: [{ x: 'a' }, { y: 2 }] };
    const obj2 = { arr: [{ x: 'a' }, { y: 3 }] };
    const output = { arr: [{ x: 'a' }, { y: 3 }] };

    expect(deepDiff(obj1, obj2)).toEqual(output);
  });

  it('mixed types in nested structures with arrays', () => {
    const obj1 = { obj: { arr: [1, 2] } };
    const obj2 = { obj: { arr: [1, 2] } };
    const output = { };

    expect(deepDiff(obj1, obj2)).toEqual(output);
  });

  it('different array lengths', () => {
    const obj1 = { arr: [1, 2] };
    const obj2 = { arr: [1, 2, 3] };
    const output = { arr: [1, 2, 3] };

    expect(deepDiff(obj1, obj2)).toEqual(output);
  });
});

describe('performance', () => {
  it('large objects with many nested properties', () => {
    const obj1 = { ...Array.from({ length: 100 }, (_, i) => ({ [i]: i })) };
    const obj2 = { ...obj1, a: 1 };
    const output = { a: 1 };

    expect(deepDiff(obj1, obj2)).toEqual(output);
  });
});
