/**
 * Fix glob imports to simplify usage
 * @param {{ [k: string]: {default?: unknown} }} imports imports
 * @return {{ [k: string]: unknown }}
 */
export default function fixesModuleNames(imports) {
  return Object.fromEntries(
    Object.entries(imports)
      .filter(([, module]) => !('CANNOT_BE_REQUIRED' in module))
      .map(([fileName, module]) => [
        fileName
          .replace(/^\/src\/\w+\//, '') // remove leading /src/**/
          .replace(/\.\w+$/, ''), // remove extension
        module,
      ])
      // flat all exports. like {...module1, ...module2}
      .reduce(
        /**
         * @param {any[]} acc acc
         * @param {any} _ _
         */
        (acc, [fileName, module]) => [
          ...acc,
          ...('default' in module ? [[fileName, module.default]] : Object.entries(module)),
        ],
        [],
      ),
  );
}
