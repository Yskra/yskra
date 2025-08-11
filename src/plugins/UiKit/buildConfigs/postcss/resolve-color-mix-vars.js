/** @import {Plugin as PostcssPlugin, Root} from 'postcss' */
/** @import {Func, Word, Numeric, Operator, ChildNode} from 'postcss-values-parser' */
// noinspection RegExpRedundantEscape,JSUnusedGlobalSymbols

import { Declaration, Rule } from 'postcss';
import { parse } from 'postcss-values-parser';

const GENERATED_RULE = Symbol('');
const THEME_REGEX = /.+?(\[data-theme=\w+\])/;
const BLACKLIST_SYMBOLS = ['#'];
const CLEAR_NAME_REGEX = new RegExp(`^(${BLACKLIST_SYMBOLS.join('|')})`, 'g');

/**
 * @param {Record<string, string>=} colorVarAliases alias map
 */
export default function resolveColorMixVars(colorVarAliases = {}) {
  return /** @type {PostcssPlugin} */ ({
    postcssPlugin: 'resolve-color-mix-vars',
    Once(root) {
      /** @type {Rule[]} */
      const themes = [];

      root.walkRules((rule) => {
        if (rule.parent && rule.parent.type === 'root' && THEME_REGEX.test(rule.selector)) {
          initTheme(rule);
          themes.push(rule);
        }
      });

      root.walkDecls((decl) => {
        if (
          themes.length === 0
          // @ts-ignore
          || themes.includes(decl.parent)
          || !decl.value.includes('color-mix')
          // @ts-ignore
          || decl.parent.parent.name === 'supports'
          // @ts-ignore
          || decl.parent[GENERATED_RULE]
        ) {
          return;
        }

        const parsedDecl = parse(decl.value);
        const colorMix = findAndFixColorMix(parsedDecl.nodes, decl);

        if (!colorMix) {
          return;
        }

        const hashVarName = buildHash([colorMix]);
        const varName = `--${colorVarAliases[hashVarName] ?? hashVarName}`;

        for (const theme of themes) {
          if (theme.nodes?.find((n) => n.type === 'decl' && n.prop === varName)) {
            continue;
          }

          // @ts-expect-error
          const finalColorMix = resolveColorMix(colorMix, [...theme.nodes, ...decl.parent.nodes]);

          generateVarColorRules(theme, root, finalColorMix, varName);

          const newVar = new Declaration({
            prop: varName,
            value: finalColorMix.toString(),
          });

          newVar.source = theme.nodes[0].source;
          theme.append(newVar);
        }

        colorMix.replaceWith(parse(`var(${varName})`));
        decl.value = parsedDecl.toString();
      });
    },
  });
}

/**
 * @param {Rule} rule rule
 */
function initTheme(rule) {
  // tw is generated in :root, but unocss doesn't anywhere
  if (!rule.nodes.find((n) => n.type === 'decl' && n.prop === '--color-black')) {
    const black = new Declaration({
      prop: '--color-black',
      value: `#000`,
    });

    black.source = rule.nodes[0].source;
    rule.append(black);
  }
}

/**
 * @param {ChildNode[]} nodes nodes
 * @param {Declaration} decl decl
 */
function findAndFixColorMix(nodes, decl) {
  /** @type {Func|undefined} */
  // @ts-ignore
  const colorMix = nodes.find((n) => n.type === 'func' && n.name === 'color-mix');

  if (!colorMix) {
    return;
  }
  const color = colorMix.nodes.find((n) => n.type === 'word' && n.value === 'currentColor');

  if (color) {
    /** @type {Declaration|undefined} */
    // @ts-ignore
    const colorDecl = decl.parent?.nodes.find((n) => n.type === 'decl' && n.prop === 'color' && !n.value.startsWith('color('));

    if (colorDecl) {
      const parsed = parse(colorDecl.value);

      if (parsed.nodes[0].type === 'func' && parsed.nodes[0].name === 'color-mix') {
        return;
      }
      color.replaceWith(parsed);
    }
    else {
      return;
    }
  }

  return colorMix;
}

/**
 * @param {Func} colorMix colorMix
 * @param {ChildNode[]} varsSource varsSource
 * @returns {Func} colorMix
 */
function resolveColorMix(colorMix, varsSource) {
  const colorMixWithVars = colorMix.clone();

  replaceVarsToValue(colorMixWithVars.nodes, varsSource);
  makeMaths(colorMixWithVars.nodes);

  return colorMixWithVars;

  /**
   * Replace (--vars) to value in an array of nodes.
   * @param {ChildNode[]} nodes nodes
   * @param {ChildNode[]} dictVars dictVars
   */
  function replaceVarsToValue(nodes, dictVars) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      if (node.type !== 'func') {
        continue;
      }

      if (node.name === 'var') {
        const value = recursiveResolveVars(node, dictVars);

        nodes[i].replaceWith(value);
      }
      else {
        replaceVarsToValue(node.nodes, dictVars);
      }
    }
  }
  /**
   * @param {ChildNode[]} nodes nodes
   */
  function makeMaths(nodes) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      if (node.type !== 'func') {
        continue;
      }

      if (node.name === 'calc') {
        /** @type {[Numeric, Operator, Numeric]} */
        // @ts-ignore
        const [n1, operator, n2] = node.nodes;
        const num1 = Number.parseInt(n1.value);
        const num2 = Number.parseInt(n2.value);

        if (operator.value === '*') {
          nodes[i].replaceWith(parse(` ${num1 * num2}${n1.unit || n2.unit}`));
        }
      }
      else {
        makeMaths(node.nodes);
      }
    }
  }
}

/**
 * Build a human-readable hash from an array of nodes.
 * @param {ChildNode[]} nodes nodes
 */
function buildHash(nodes) {
  return nodes
    .filter((n) => n.type !== 'punctuation' && n.type !== 'operator')
    .map(
      /**
       * @param {ChildNode} node node
       * @returns {string|undefined} hash
       */
      (node) => {
        if (node.type === 'func' && node.nodes) {
          if (node.name === 'color-mix') {
            return buildHash(node.nodes.slice(2));
          }
          return buildHash(node.nodes);
        }

        if (node.type === 'word' && node.isVariable) {
          return node.value.slice(2);
        }

        return ('value' in node) ? node.value.replaceAll(CLEAR_NAME_REGEX, '') : undefined;
      },
    )
    .filter(Boolean)
    .join('_');
}

/**
 * Recursively resolve (--vars, #alt) to value in a parsed node.
 * @param {ChildNode} parsed parsed
 * @param {ChildNode[]} dictVars dictVars
 */
function recursiveResolveVars(parsed, dictVars) {
  if (!parsedIsVarFunction(parsed)) {
    return parsed;
  }

  // @ts-ignore
  const nodeVar = findNodeByProp(dictVars, parsed.nodes[0].value);

  if (!nodeVar) {
    // @ts-ignore
    if (parsed.nodes.length === 3) {
      // @ts-ignore
      parsed.nodes[2].replaceWith(recursiveResolveVars(parsed.nodes[2], dictVars));
      return parsed;
    }
    return parsed;
  }

  return recursiveResolveVars(parse(nodeVar.value).nodes[0], dictVars);

  /**
   * @param {ChildNode[]} nodes - Array of nodes to search.
   * @param {string} propValue - Property value to search for.
   * @returns {Declaration|undefined} - The found node
   */
  function findNodeByProp(nodes, propValue) {
    // @ts-ignore
    return nodes.find((n) => n.prop === propValue);
  }

  /**
   * @param {ChildNode} parsed - The parsed node to check.
   * @returns {boolean} - True if the node is a var
   */
  function parsedIsVarFunction(parsed) {
    return parsed.type === 'func' && parsed.name === 'var';
  }
}

/**
 * Generate new rules with var(--) per theme for var(--) in color-mix. Ex: if color-mix uses var(--color-primary)
 * @param {Rule} theme theme
 * @param {Root} root root
 * @param {Func} colorMix colorMix
 * @param {string} themeVar themeVar
 */
function generateVarColorRules(theme, root, colorMix, themeVar) {
  for (let i = 0; i < colorMix.nodes.length; i++) {
    const node = colorMix.nodes[i];

    if (node.type !== 'func' || node.name !== 'var') {
      continue;
    }

    /** @type {Word} */
    // @ts-ignore
    const varName = node.nodes[0];

    root.walkDecls((decl) => {
      // @ts-ignore
      if (decl.prop !== varName.value || !decl.parent || decl.parent.type === 'supports') {
        return;
      }

      const parsed = parse(decl.value);
      let value;

      if (parsed.nodes[0].type === 'func' && parsed.nodes[0].name === 'var') {
        /** @type {Word} */
        // @ts-ignore
        const themeVar2 = theme.nodes.find((n) => n.prop === parsed.nodes[0].nodes[0].value);

        if (themeVar2) {
          value = themeVar2.value;
        }
      }
      if (decl.value === 'transparent') {
        value = 'transparent';
      }

      if (value) {
        const clonedColorMix = colorMix.clone();
        const clearThemeSelector = theme.selector.replace(THEME_REGEX, '$1');
        const rule = new Rule({
          // @ts-ignore
          selector: `:root${clearThemeSelector} ${decl.parent.selector}, ${clearThemeSelector} ${decl.parent.selector}`,
          source: decl.source,
        });

        clonedColorMix.nodes[i].replaceWith(parse(value));
        const newVar = new Declaration({
          prop: themeVar,
          value: clonedColorMix.toString(),
        });

        newVar.source = decl.source;
        // @ts-ignore
        rule[GENERATED_RULE] = true;

        if (node.nodes.length === 3) {
          node.replaceWith(node.nodes[2]);
        }

        rule.append(newVar);
        decl.root().append(rule);
      }
    });
  }
}
