import type { PluginManifest } from './Public';
import type { Signal } from '@/modules/appBus/BaseBus';

declare global {
  interface AppBusRegistry {
    'pluginManager.plugin': {
      mounted: Signal<(payload: { manifest: PluginManifest }) => void>;
      // player name 123
      unmounted: Signal<(payload: { name: string }) => void>;
    };
  }
}
