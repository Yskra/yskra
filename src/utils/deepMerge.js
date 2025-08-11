/**
 * @template {Record<string, any>} T
 * @param {T} obj1 source object
 * @param {Record<string, any>} obj2 target object
 * @returns {T} merged object
 */
export default function deepMerge(obj1, obj2) {
  const result = structuredClone(obj2);

  for (const key in obj1) {
    if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
        result[key] = [...obj1[key], ...obj2[key].filter((e) => !obj1[key].includes(e))];
      }
      else {
        result[key] = deepMerge(obj1[key], obj2[key]);
      }
    }
    else {
      result[key] = obj2[key] ?? structuredClone(obj1[key]);
    }
  }
  // @ts-ignore
  return result;
}
