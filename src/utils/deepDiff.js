// @ts-nocheck
import isEqual from 'fast-deep-equal';

/**
 * @param {Record<string, any>} obj1 source object
 * @param {Record<string, any>} obj2 target object
 * @returns {Record<string, any>} difference object
 */
export default function deepDiff(obj1, obj2) {
  const result = {};

  for (const key in obj1) {
    if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
        if (!isEqual(obj1[key], obj2[key])) {
          result[key] = obj2[key];
        }
      }
      else {
        const value = deepDiff(obj1[key], obj2[key]);

        if (Object.keys(value).length) {
          result[key] = value;
        }
      }
    }
    else {
      if (obj2[key] !== undefined && !Object.is(obj1[key], obj2[key])) {
        result[key] = obj2[key];
      }
    }
  }

  for (const key in obj2) {
    if (!(key in obj1)) {
      result[key] = obj2[key];
    }
  }

  return result;
}
