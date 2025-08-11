/** @import {Plugin as PostcssPlugin} from 'postcss' */

import parser from 'postcss-selector-parser';

const Selector = parser.selector;

export default function wherePseudo() {
  const selectorParser = parser(transform);

  return /** @type {PostcssPlugin} */ ({
    postcssPlugin: 'where-pseudo',
    Rule(rule) {
      selectorParser.processSync(rule, { updateSelector: true });
    },
  });
}

/** @type {parser.SyncProcessor<void>} */
function transform(selector) {
  selector.walkPseudos((pseudo) => {
    if (pseudo.value === ':where') {
      /** @type {parser.Node[]} */
      const newSelectors = [];

      if (!pseudo.parent) {
        return;
      }

      pseudo.nodes.forEach((n) => {
        /** @type {parser.Node[]} */
        const newSelectorNodes = [];

        // @ts-expect-error ts, are u idiot ? parent cant be undefined
        pseudo.parent.nodes.forEach((nn) => {
          if (nn !== pseudo) {
            newSelectorNodes.push(nn.clone());
          }
          else {
            const first = n.first;

            first.spaces = { before: '', after: '' };
            n.nodes.forEach((nnn) => {
              if (nnn.type === 'universal') {
                nnn.spaces = { before: ' ', after: '' };
              }
            });
            newSelectorNodes.push(...n.nodes);
          }
        });

        if (newSelectors.length > 0) {
          newSelectorNodes[0].spaces = { before: ' ', after: '' };
        }

        newSelectors.push(Selector({
          nodes: newSelectorNodes,
          value: '',
        }));
      });

      pseudo.parent.replaceWith(...newSelectors);
    }
  });
}
