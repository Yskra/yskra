import type { Method } from '@/modules/appBus/BaseBus';
import type { usePlayerStore } from '@/modules/settings/preferences/player/store.js';
import type { PiniaStore } from '@/types/pinia';


declare global {
  interface AppBusRegistry {
    player: {
      addPlayer: Method<PiniaStore<typeof usePlayerStore>['addPlayer']>;
      removePlayer: Method<PiniaStore<typeof usePlayerStore>['removePlayer']>;
      open: Method<(url: URL) => void>;
    };
  }
}
