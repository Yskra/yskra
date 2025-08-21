import type { RemovableRef } from '@vueuse/core';
import type { App, Reactive, Ref, VNode } from 'vue';
import type { PluginManifest } from '@/modules/pluginManager/Public';

export type Config = RemovableRef<ConfigRaw>;
export type UserProfile = RemovableRef<UserProfileRaw>;
export type UserProfiles = RemovableRef<UserProfileRaw[]>;

export type ConfigRaw = BaseConfig & PluginsConfigs;
export type UserProfileRaw = BaseUserProfile & PluginsConfigs;

interface BaseConfig {
  language: string;
  activeProfileIdx: number;
  router: {
    mode: 'hash' | 'history'; // 'memory' ?
    baseUrl?: string;
  };
  ui: {
    indexPage: string;
    fontSize: number;
  };
  player: {
    default: string;
  };
  pluginManager: {
    disabled: PluginManifest['id'][];
    installed: PluginManifest['source'][];
    repositories: string[];
    pluginsTos: {
      accepted: boolean;
      href: string;
    };
  };
  legal: {
    privacy_policy: string;
    terms_of_service: string;
    dmca: string;
  };
  links: { name: string; href: string }[];
}

interface BaseUserProfile {
  meta: {
    name: string;
    avatar: string;
  };
}

interface PluginsConfigs {
  [key: PluginManifest['id']]: Record<string, any>;
}

export interface ModuleContext {
  config: Config;
  userProfile: UserProfile;
  isRecoveryMode: Ref<boolean>; // Load the minimum for the internal work of the app
  requestRecoveryMode: (reason: string) => void; // Request to recovery mode. Allowed oly for create module, not for install
  awaitModules: (...modules: string[]) => Promise<any>;
  rootComponents: Reactive<Set<VNode>>;
}

export interface Module {
  (ctx: ModuleContext): {
    /**
     * Name and id of the module. Name for logger, id for awaitModules
     */
    displayName: string;

    /**
     * install as vue plugin
     */
    install: (app: App) => void;

    /**
     * Call to init devtools
     */
    devtoolsPlugin?: (app: App) => void;

    /**
     * will help to more finely control the readiness of a separate module, even if the code in install has already been executed
     */
    isReady?: Promise<void>;

    /**
     * Exposed global variables to the app
     */
    global?: Record<string, unknown>;
  };
}
