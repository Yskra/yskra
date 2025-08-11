const RULES_SELECTORS_TO_REMOVE = [ // todo add dynamic rules from actual build
  '.text-xs',
  '.text-sm',
  '.text-base',
  '.text-xl',
  '.text-lg',
];
const REGEX_PATTERN = new RegExp(`${RULES_SELECTORS_TO_REMOVE.join('|')}`, 'g');

/**
 * @param {string} cssString
 */
export default function styleClear(cssString) {
  return cssString.replace(REGEX_PATTERN, '.__removed__');
};
