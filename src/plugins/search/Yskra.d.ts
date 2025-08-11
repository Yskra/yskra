import type { useProvidersStore } from './stores/providers';
import type { Method } from '@/modules/appBus/BaseBus';
import type { PiniaStore } from '@/types/pinia';


declare global {
  interface AppBusRegistry {
    search: {
      addProvider: Method<PiniaStore<typeof useProvidersStore>['addProvider']>;
      removeProvider: Method<PiniaStore<typeof useProvidersStore>['removeProvider']>;
    };
  }
}

