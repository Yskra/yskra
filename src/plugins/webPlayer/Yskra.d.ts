import type { BasePlayer } from 'player';

declare global {
  interface AppBusRegistry {
    'webPlayer.custom': {
      add: (player: BasePlayer) => (() => void);
      remove: (player: BasePlayer) => void;
    };
  }
}
