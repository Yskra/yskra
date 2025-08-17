import type { UseStyleTagOptions, UseStyleTagReturn } from '@vueuse/core';
import type { Component, MaybeRef, Reactive, Ref, VNode, App as VueApp } from 'vue';
import type { Router } from 'vue-router';
import type { Plugin } from './Plugin';
import type { BaseBusService } from '@/modules/appBus/BaseBus';
import type { createPluginManagerModule } from '@/modules/pluginManager';
import type { PLUGIN_RUNTIME } from '@/modules/pluginManager/constants';
import type { PatchPostInjection, PatchPreInjection, TargetInjection } from '@/modules/pluginManager/lib/injector/Public';

export type App = Ref<VueApp<Element>>;

export type PluginManager = ReturnType<typeof createPluginManagerModule>;

export interface DevToolsPluginServiceFields {
  mountedPlugins: Ref<string[]>;
  mountPlugin: (plugin: Plugin) => void;
  unmountPlugin: (id: string) => void;
  initPlugin: (src: string, id?: string | undefined) => Plugin | Promise<Plugin | undefined>;
}

export interface PluginContext {
  app: VueApp<Element>;
  router: Router;
  defineConfig: <T extends Record<string, any>>(defaults: T) => Reactive<T>;
  defineUserProfile: <T extends Record<string, any>>(defaults: T) => Reactive<T>;
  defineSettings: (fields: RegisterSettingsField[] | Component) => void;
  defineBusService: (name: string, service: BaseBusService) => (() => void);
  defineLocales: (locales: Record<string, Record<string, any>>) => void;
  useStyle: (css: MaybeRef<string>, options?: UseStyleTagOptions) => UseStyleTagReturn;
  injector: {
    post: (target: TargetInjection<any, string>, methodName: string, patch: PatchPostInjection, debugId: string) => void;
    pre: (target: TargetInjection<any, string>, methodName: string, patch: PatchPreInjection, debugId: string) => void;
    uninject: (injectionId: string) => void;
  };
}

type Locales = string; // eg: en, ru, de etc
type LocaleKey<T extends string> = `${T}:${Locales}`;

export type PluginRuntime = Readonly<typeof PLUGIN_RUNTIME[keyof typeof PLUGIN_RUNTIME]>;

export interface PluginManifest extends Record<LocaleKey<'overview'>, string>, Record<LocaleKey<'description'>, string> {
  name: string;
  id: string;
  license: string;
  overview?: string;
  description?: string;
  version: string;
  author: string;
  homepageUrl?: string;
  supportUrl?: string;
  imageUrl?: string;
  source: string;
  flags?: PluginFlag[];
  apiVersion: number;
  runtime?: PluginRuntime;
  permissions?: PluginPermission[]; // @todo
  dependencies?: Record<PluginManifest['id'], PluginManifest['version']>;
}

export type PluginFlag = (
    | 'SafeDisable' // only for built-in, by default disabling built-in is impossible as it can break many things
);

export type PluginPermission = (
    | 'ReadConfig' // read config
);

export interface PluginExecute {
  (context: PluginContext): Promise<void | (() => void)> | (() => void) | void;
}

export interface RegisterSettingsField {
  name: string | VNode;
  note?: string | VNode;
  ref: Ref;
  type: 'text' | 'number' | 'boolean' | 'select' | 'url' | Component;
  options?: { name: string; value: unknown }[];
}

export interface PluginInfo extends PluginManifest {
  status: number;
  description: string;
  isInstalled: boolean;
  canRemove: boolean;
  canDisable: boolean;
  install: () => void;
  remove: () => void;
  enable: () => void;
  disable: () => void;
  formatDependencies?: string;
}
