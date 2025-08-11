import makeWorker from '@/utils/makeWorker.js';
import { manifestParse } from '../utils/manifestParse';

/* eslint-disable jsdoc/valid-types */
Object.fromEntries = Object.fromEntries ?? function (/** @type {Iterable<readonly any[]>} */ iterable) {
  /** @type {Record<string, any>} */
  const obj = {};

  for (const pair of iterable) {
    if (pair && Array.isArray(pair)) {
      obj[pair[0]] = pair[1];
    }
  }
  return obj;
};


makeWorker(manifestParse);
