/** @import {PluginManifest} from '../Public'; */

const JSDOC_REGEX = /\/\*\*\n?((?:.|\n)+?)\*\/\n?/; // jsdoc block
const JSDOC_ROW_REGEX = /\s\*\s?@([\w|:]+)\s(.+)$/; // like " * @name            NAME"
const FIELD_TYPE_ARRAY = ['flags', 'permissions'];
const FIELD_TYPE_OBJECT = ['dependencies'];

export const isJsDoc = (/** @type {string} */ str) => JSDOC_REGEX.test(str);

/**
 * Parse manifest from JSDoc string
 * @param {string} str
 * @return {PluginManifest|undefined}
 */
export function manifestParse(str) {
  const jsDoc = JSDOC_REGEX.exec(str)?.[1];

  if (!jsDoc) {
    return;
  }

  /** @type {[keyof PluginManifest, any][]} */
  const entries = jsDoc
    .split('\n')
    .map(
      /** @return {[keyof PluginManifest, any]} */
      // @ts-expect-error ts not see next filter for undefended values
      (r) => JSDOC_ROW_REGEX.exec(r)?.slice(1, 3).map((s) => s.trim()),
    )
    .filter(Boolean)
    .reduce(
      /**
       * Transforms array-like and object-like fields to manifest
       * @param {[keyof PluginManifest, any][]} acc
       * @param {[keyof PluginManifest, string]} _
       * @return {[keyof PluginManifest, any][]}
       */
      (acc, [key, value]) => {
        const parent = acc.find(([k]) => k === key);

        if (FIELD_TYPE_ARRAY.includes(key)) {
          if (parent) {
            parent[1].push(value);
            return acc;
          }
          else {
            return [...acc, [key, [value]]];
          }
        }
        if (FIELD_TYPE_OBJECT.includes(key)) {
          const [k, v] = value.split(':');

          if (parent) {
            parent[1][k] = v;
            return acc;
          }
          else {
            return [...acc, [key, { [k]: v }]];
          }
        }
        return [...acc, [key, value]];
      },
      [],
    );

  // @ts-ignore "{ [k: string]: any; }" ts not know about fromEntries ?
  return Object.fromEntries(entries);
}
