// @ts-nocheck
/** @import {PluginManifest} from './Public'; */

import arrowNavigationPkg from '@lib/vue-arrow-navigation/package.json';
import * as vueVNodeUtils from '@skirtle/vue-vnode-utils';
import vueVNodeUtilsPkg from '@skirtle/vue-vnode-utils/package.json';
import * as pinia from 'pinia';
import piniaPkg from 'pinia/package.json';
import * as vue from 'vue';
import * as arrowNavigation from 'vue-arrow-navigation';
import * as i18n from 'vue-i18n';
import vueI18nPkg from 'vue-i18n/package.json';
import * as router from 'vue-router';
import routerPkg from 'vue-router/package.json';
import vuePkg from 'vue/package.json';
import yskraPkg from '@/../package.json';
import { DOCS_BASE_URL } from '@/constants.js';
import fixesModuleNames from './utils/fixesModuleNames.js';

export const PLUGIN_STATUS = Object.freeze({
  UNKNOWN: -1,
  OK: 0,
  DISABLED: 1,
  DEPENDENCIES: 2,
  MOUNTING: 3,
  ERROR: 4,
});

export const PLUGIN_RUNTIME = Object.freeze({
  ES: 'es',
  SYSTEM: 'system',
});

export const INJECT_KEY = Symbol(import.meta.env.DEV ? 'pluginManager' : '');

/** @type {Readonly<Set<URL['href']>>} */
export const BLACKLIST_URLS = Object.freeze(new Set([
  new URL('config.json', window.location.href).href,
]));

/** @type {Readonly<Set<string>>} */
export const BLACKLIST_TAGS = Object.freeze(new Set([
  'script',
]));

/** @type {Readonly<Set<string>>} */
export const BLACKLIST_EVENTS = Object.freeze(new Set([
  'storage',
  'beforeunload',
  'unload',
  'error',
  'unhandledrejection',
]));

/** @type {(keyof PluginManifest)[]} */
export const PLUGIN_REQUIRED_FIELDS = ['name', 'id', 'version', 'author', 'source', 'apiVersion', 'license'];

export const appPkg = yskraPkg;


/** @type {Record<string, {default?: unknown}>} */
const utilsImports = import.meta.glob('@/utils/*.js', {
  eager: true,
});

/** @type {Record<string, {module: module, version: string, author: string, package: string}>} */
export const appPackageRegistry = {
  'vue': {
    module: vue,
    version: vuePkg.version,
    author: vuePkg.author,
    package: 'vue',
  },
  'vnode-utils': {
    module: vueVNodeUtils,
    version: vueVNodeUtilsPkg.version,
    author: vueVNodeUtilsPkg.author,
    package: 'vue-vnode-utils',
  },
  'pinia': {
    module: pinia,
    version: piniaPkg.version,
    author: piniaPkg.author.name,
    package: 'pinia',
  },
  'arrow-navigation': {
    module: arrowNavigation,
    version: arrowNavigationPkg.version,
    author: arrowNavigationPkg.author,
    package: 'vue-arrow-navigation',
  },
  'router': {
    module: router,
    version: routerPkg.version,
    author: routerPkg.author.name,
    package: 'vue-router',
  },
  'i18n': {
    module: i18n,
    version: vueI18nPkg.version,
    author: vueI18nPkg.author.name,
    package: 'vue-i18n',
  },
  'utils': {
    module: fixesModuleNames(utilsImports),
    version: appPkg.version,
    author: appPkg.author,
    package: 'utils',
  },
};

export const DOCS_URL = Object.freeze({
  PLUGIN_MANIFEST: new URL('reference/plugin-manifest', DOCS_BASE_URL),
  PLUGIN_MANAGER_MODULE: new URL('reference/modules/plugin-manager', DOCS_BASE_URL),
  GUIDE_INTRODUCTION: new URL('guide/introduction', DOCS_BASE_URL),
});

