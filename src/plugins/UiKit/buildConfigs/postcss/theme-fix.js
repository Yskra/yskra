// noinspection RegExpRedundantEscape
/** @import {Plugin as PostcssPlugin} from 'postcss' */


export default function themeFix() {
  const RULE_REGEX = /:root:has\(input\.theme-controller\[value=(.+?)\]:checked\),/;

  return /** @type {PostcssPlugin} */ ({
    postcssPlugin: 'fix-theme-for-legacy',
    Rule(rule) {
      if (RULE_REGEX.test(rule.selector)) {
        rule.selector = rule.selector.replace(RULE_REGEX, '');
      }
    },
  });
}
