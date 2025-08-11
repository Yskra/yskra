import { toRef } from 'vue';
import { useI18n } from 'vue-i18n';
/** @import {Config} from '@/modules/Public'; */
import { useAppBus } from '@/modules/appBus/index.js';
import { usePlayerStore } from '@/modules/settings/preferences/player/store.js';
import Logger from '@/utils/Logger.js';

/** @type {ReturnType<typeof createPlayerSettings>} */
let instance;

/**
 * @return {ReturnType<typeof createPlayerSettings>}
 */
export function usePlayerSettings() {
  return instance;
}

/**
 * @param {Config} config app config
 */
export function createPlayerSettings(config) {
  const logger = new Logger('Settings/Player');
  const bus = useAppBus();
  const store = usePlayerStore();
  const defaultPlayer = toRef(config.value.player, 'default');


  bus.addService('player', {
    addPlayer: store.addPlayer,
    removePlayer: store.removePlayer,
    open: openOnDefaultPlayer,
  });

  const playerSettings = {
    defaultPlayer,
    players: toRef(() => store.players),
  };

  instance = playerSettings;
  return playerSettings;

  /**
   * @param {URL} url url
   */
  function openOnDefaultPlayer(url) {
    const { t } = useI18n();
    const player = store.players.find((p) => p.name === defaultPlayer.value);

    if (player) {
      player.play(url);
    }
    else {
      logger.error(t('Player {name} not found or not registered', { name: defaultPlayer.value }));

      const firstPlayer = store.players[0];

      if (firstPlayer) {
        firstPlayer.play(url);
      }
      else {
        logger.error(t('No players registered'));
      }
    }
  }
}
