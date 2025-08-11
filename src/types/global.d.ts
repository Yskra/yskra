import type { Component } from 'vue';
import type { Platform } from '@/modules/platform/Public';
import type { useGlobalInterface } from '@/modules/pluginManager/managers/globalInterface';

type PluginManagerGlobal = ReturnType<typeof useGlobalInterface>;

declare global {
  const Yskra: Readonly<PluginManagerGlobal & {
    componentRegister: Map<string, Component>;
    platform: Platform;
    version: string;
  }>;
  const System: any;
}
