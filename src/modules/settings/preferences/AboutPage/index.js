/** @import {Config} from '@/modules/Public'; */
/** @import {ShallowRef} from 'vue' */
/* global __COMMIT_HASH__ */
/* global __BUILD_DATE__ */

import { useFetch } from '@vueuse/core';
import { computed } from 'vue';
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
const commitHash = __COMMIT_HASH__;
const buildDate = __BUILD_DATE__;

/**
 * @return {ReturnType<typeof setLinksFromConfig>}
 */
export function getLinks() {
  return instance;
}

export function getAppInfo() {
  /** @type {{ data: ShallowRef<string> }} */
  const { data: buildHash } = useFetch('/buildHash.txt', { initialData: '' }).get().text();
  const shortBuildHash = computed(() => buildHash.value.slice(0, 7));

  return {
    version: pkg.version,
    shortCommitHash: commitHash.slice(0, 10),
    shortBuildHash,
    buildDate: new Date(buildDate),
  };
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
    commitHash: new URL(`commit/${commitHash}`, pkg.repository),
    buildHash: new URL(`/buildHash.txt`, window.location.origin),

    other: config.value.links.map((link) => ({ url: new URL(link.href), name: link.name })),
  };

  instance = links;

  return links;
}
