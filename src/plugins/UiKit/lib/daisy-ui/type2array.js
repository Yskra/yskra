/** @import {DaisyUIType} from './Public' */

/**
 * @param {DaisyUIType | undefined} type
 */
export default function type2array(type) {
  if (typeof type === 'string') {
    return type.split(' ');
  }
  if (typeof type === 'object') {
    if (Array.isArray(type)) {
      return type;
    }
    else {
      return Object.entries(type)
        .filter(([, v]) => v)
        .map(([c]) => c);
    }
  }
  return [];
}
