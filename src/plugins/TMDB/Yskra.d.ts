import type { Method } from '@/modules/appBus/BaseBus';

declare global {
  interface AppBusRegistry {
    'tmdb.endpoints': {
      set: Method<({ apiUrl, imageCdn }: { apiUrl: string | URL; imageCdn: string | URL }) => void>;
    };
  }
}
