/* eslint-disable regexp/no-super-linear-backtracking */

import manifest from '@locales/manifest.json';
import { toRef } from 'vue';

const localesImports = import.meta.glob(['@locales/**/*.json', '!@locales/manifest.json', '!@locales/fatalError/*.json'], {
  import: 'default',
});

export const FALLBACK_LOCALE = 'en-US';
export const CODES = manifest.map((/** @type {{code: string}} */ { code }) => code);
export {
  manifest,
};

/**
 * Get all locales and their messages
 * @type {import('vue').Ref<Record<string, () => Promise<object>>>}
 */
export const locales = toRef(() => Object.fromEntries(
  Object.entries(localesImports)
    .map(([fileName, module]) => [
      // /locale/en-US.json -> en-US
      fileName.replace(/.+\/(.+)\.json$/, '$1'),
      module,
    ])
    .reduce(
      /**
       * Pack modules by filename
       * @param {[fileName: string, module: (() => Promise<object>)[]][]} acc modules by filename
       * @param {[string, (() => Promise<object>)]} _ modules by filename
       */
      // @ts-expect-error stupid ts says: currentValue should be: (string | (() => Promise<object>))[]
      (acc, [fileName, module]) => {
        const locale = acc.find(([f]) => f === fileName);

        if (locale) {
          locale[1].push(module);

          return acc;
        }
        return [...acc, [fileName, [module]]];
      },
      [],
    )
    .map(
      /** Call all modules and merge them into one */
      // @ts-expect-error stupid ts says: value should be: (string | (() => Promise<object>))[]
      (/** @type {[filename: string, modules: (() => Promise<object>)[]]} */ [filename, modules]) => [
        filename,
        async () => {
          const allEntries = modules.map(async (m) => Object.entries(await m()));
          const messages = await Promise.all(allEntries);

          return Object.fromEntries(messages.flat());
        },
      ],
    ),
));
