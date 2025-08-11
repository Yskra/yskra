import { isProxy, isReactive, isRef, toRaw } from 'vue';

/**
 * Extended toRaw function that deep converts all refs
 * @template T extends Record<string, any>
 * @param {T} sourceObj source object
 * @return {T} result
 */
export function deepToRaw(sourceObj) {
  /**
   * @param {*} input input
   * @return {*}
   */
  const objectIterator = (input) => {
    if (isRef(input)) {
      return objectIterator(input.value);
    }
    if (Array.isArray(input)) {
      return input.map((item) => objectIterator(item));
    }
    else if (isReactive(input) || isProxy(input)) {
      return objectIterator(toRaw(input));
    }
    else if (input && typeof input === 'object') {
      // like Date or RegExp
      if (input.constructor === Object || input.constructor == null) {
        return Object.keys(input).reduce((acc, key) => {
          // @ts-ignore
          acc[key] = objectIterator(input[key]);
          return acc;
        }, {});
      }
      return input;
    }
    return input;
  };

  return objectIterator(sourceObj);
}
