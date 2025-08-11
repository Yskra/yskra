import { expect, it } from 'vitest';
import { computed, reactive, ref, shallowReactive } from 'vue';
import { deepToRaw } from '../deepToRaw.js';

it('should return primitive values unchanged', () => {
  expect(deepToRaw(42)).toBe(42);
  expect(deepToRaw('test')).toBe('test');
  expect(deepToRaw(true)).toBe(true);
  expect(deepToRaw(null)).toBe(null);
  expect(deepToRaw(undefined)).toBe(undefined);
});

it('should convert simple ref to raw value', () => {
  const simpleRef = ref(42);

  expect(deepToRaw(simpleRef)).toBe(42);
});

it('should convert reactive object to raw object', () => {
  const reactiveObj = reactive({ count: 1 });
  const result = deepToRaw(reactiveObj);

  expect(result).toEqual({ count: 1 });
  expect(result).not.toBe(reactiveObj);
});

it('should convert shallowReactive object to raw object', () => {
  const shallowObj = shallowReactive({ count: 1 });
  const result = deepToRaw(shallowObj);

  expect(result).toEqual({ count: 1 });
});

it('should handle nested refs', () => {
  const nestedRef = ref({
    count: ref(42),
    name: ref('test'),
  });

  const result = deepToRaw(nestedRef);

  expect(result).toEqual({ count: 42, name: 'test' });
});

it('should handle nested reactive objects', () => {
  const nestedReactive = reactive({
    user: reactive({
      name: 'John',
      age: 30,
    }),
    settings: {
      theme: 'dark',
    },
  });

  const result = deepToRaw(nestedReactive);

  expect(result).toEqual({
    user: {
      name: 'John',
      age: 30,
    },
    settings: {
      theme: 'dark',
    },
  });

  // Проверяем, что все вложенные объекты тоже raw
  expect(result.user).not.toBe(nestedReactive.user);
  expect(result.settings).not.toBe(nestedReactive.settings);
});

it('should handle arrays with refs and reactive objects', () => {
  const arrayWithRefs = [
    ref(1),
    reactive({ value: 2 }),
    [ref(3), reactive({ nested: 4 })],
  ];

  const result = deepToRaw(arrayWithRefs);

  expect(result).toEqual([
    1,
    { value: 2 },
    [3, { nested: 4 }],
  ]);
});

it('should handle computed refs', () => {
  const count = ref(5);
  const computedRef = computed(() => count.value * 2);

  const objWithComputed = {
    value: computedRef,
  };

  const result = deepToRaw(objWithComputed);

  expect(result).toEqual({ value: 10 });
});

it('should handle complex nested structure', () => {
  const complexStructure = {
    users: [
      reactive({
        id: ref(1),
        profile: {
          name: ref('Alice'),
          settings: reactive({
            theme: 'light',
            notifications: ref(true),
          }),
        },
      }),
      {
        id: ref(2),
        profile: ref({
          name: 'Bob',
          settings: {
            theme: ref('dark'),
          },
        }),
      },
    ],
    metadata: reactive({
      total: ref(100),
      lastUpdated: new Date(),
    }),
  };

  const result = deepToRaw(complexStructure);

  expect(result).toEqual({
    users: [
      {
        id: 1,
        profile: {
          name: 'Alice',
          settings: {
            theme: 'light',
            notifications: true,
          },
        },
      },
      {
        id: 2,
        profile: {
          name: 'Bob',
          settings: {
            theme: 'dark',
          },
        },
      },
    ],
    metadata: {
      total: 100,
      lastUpdated: result.metadata.lastUpdated,
    },
  });
});

it('should preserve non-reactive objects unchanged', () => {
  const regularObject = {
    plain: 'value',
    date: new Date(),
    regex: /test/g,
    func: () => 'test',
  };

  const result = deepToRaw(regularObject);

  expect(result).toEqual(regularObject);
  expect(result.date).toBe(regularObject.date);
  expect(result.regex).toBe(regularObject.regex);
  expect(result.func).toBe(regularObject.func);
});

it('should handle empty objects and arrays', () => {
  expect(deepToRaw({})).toEqual({});
  expect(deepToRaw([])).toEqual([]);
  expect(deepToRaw({ empty: {} })).toEqual({ empty: {} });
  expect(deepToRaw([[]])).toEqual([[]]);
});

it('should handle mixed reactive and non-reactive properties', () => {
  const mixedObject = {
    reactiveProp: reactive({ value: 1 }),
    refProp: ref(2),
    plainProp: { value: 3 },
    arrayProp: [ref(4), { nested: ref(5) }],
  };

  const result = deepToRaw(mixedObject);

  expect(result).toEqual({
    reactiveProp: { value: 1 },
    refProp: 2,
    plainProp: { value: 3 },
    arrayProp: [4, { nested: 5 }],
  });
});
