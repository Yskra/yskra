import type { VNode } from 'vue';
import type { Method } from '@/modules/appBus/BaseBus';

declare global {
  interface AppBusRegistry {
    rootComponent: {
      add: Method<(component: VNode) => () => void>;
      delete: Method<(component: VNode) => void>;
    };
  }
}
