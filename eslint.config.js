import antfu from '@antfu/eslint-config';
import jsdoc from 'eslint-plugin-jsdoc';
import oxlint from 'eslint-plugin-oxlint';
import pluginVue from 'eslint-plugin-vue';

// noinspection JSUnusedGlobalSymbols,SpellCheckingInspection
export default antfu(
  /** @type {import('antfu').OptionsConfig} */
  {
    stylistic: {
      semi: true,
      jsx: false,
    },
    formatters: true,
    unocss: true,
    jsonc: false,
    yaml: false,
    toml: false,
  },
  [
    ...pluginVue.configs['flat/essential'],
    jsdoc.configs['flat/recommended'],
    ...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json'),
    {
      name: 'eslint conf',
      rules: {
        'style/padding-line-between-statements': [
          'error',
          { blankLine: 'always', prev: ['const', 'let'], next: '*' },
          { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] },
          { blankLine: 'always', prev: ['case', 'default'], next: '*' },
        ],
        'style/lines-between-class-members': [
          'error',
          {
            enforce: [
              { blankLine: 'always', prev: '*', next: 'method' },
              { blankLine: 'always', prev: 'method', next: '*' },
              { blankLine: 'never', prev: 'field', next: 'field' },
            ],
          },
        ],
        'style/arrow-parens': [
          'error',
          'always',
        ],
        'style/no-multiple-empty-lines': ['error', { max: 2 }],
        'unused-imports/no-unused-vars': ['error', { caughtErrors: 'none' }],
        'import/no-duplicates': ['error'],
      },
      languageOptions: {
        globals: {
          Yskra: 'readonly',
        },
      },
    },
    {
      name: 'jsdoc',
      rules: {
        'jsdoc/require-property-description': 0,
        'jsdoc/require-jsdoc': 0,
        'jsdoc/require-param-description': 0,
        'jsdoc/require-returns': 0, // ts-lsp is calc type
        'jsdoc/no-undefined-types': 0, // useles shit
        'jsdoc/valid-types': 0, // useles shit
        'jsdoc/check-tag-names': 0,
      },
    },
    {
      name: 'vue pages',
      files: ['**/pages/*.vue', '**/index.vue'],
      rules: {
        'vue/multi-word-component-names': 0,
      },
    },
    {
      name: 'vue',
      files: ['**/*.vue'],
      rules: {
        'vue/max-attributes-per-line': ['error', {
          singleline: { max: 2 },
          multiline: { max: 1 },
        }],
      },
    },
  ],
);
