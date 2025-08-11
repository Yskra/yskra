import type { Method } from '@/modules/appBus/BaseBus';

declare global {
  interface AppBusRegistry {
    'tmdb.endpoints': {
      set: Method<({ apiUrl: string, imageCdn: string }) => void>;
    };
  }
}
