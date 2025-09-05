import type { Platform } from 'parse-ua/Public';
import type { Component } from 'vue';
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
