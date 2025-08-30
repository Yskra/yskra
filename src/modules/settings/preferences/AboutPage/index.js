/** @import {Config} from '@/modules/Public'; */

import pkg from '@/../package.json';

// @unocss-include
/** @type {Record<string, string>} */
export const ICONS = Object.freeze({
  't.me': 'i-mingcute:telegram-fill',
  'telegram.org': 'i-mingcute:telegram-fill',
  'github.com': 'i-mingcute:github-2-fill',
  'tos': 'i-mingcute:safety-certificate-fill',
  'privacy': 'i-mingcute:safe-lock-fill',
  'dmca': 'i-mingcute:safe-alert-fill',
});

/** @type {ReturnType<typeof setLinksFromConfig>} */
let instance;


/**
 * @return {ReturnType<typeof setLinksFromConfig>}
 */
export function getLinks() {
  return instance;
}

/**
 * @param {Config} config app config
 */
export function setLinksFromConfig(config) {
  const links = {
    tos: new URL(config.value.legal.terms_of_service || window.location.origin),
    privacy: new URL(config.value.legal.privacy_policy || window.location.origin),
    dmca: new URL(config.value.legal.dmca || window.location.origin),
    sourceCode: new URL(pkg.repository),

    other: config.value.links.map((link) => ({ url: new URL(link.href), name: link.name })),
  };

  instance = links;

  return links;
}
