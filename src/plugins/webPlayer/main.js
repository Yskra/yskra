/** @import {PluginExecute, PluginContext} from '@/modules/pluginManager/Public'; */
// noinspection JSUnusedGlobalSymbols

import { PlayerErrorType } from 'player';
import { useI18n } from 'vue-i18n';
import { ROUTE_NAME } from '@/plugins/webPlayer/constants.js';
import { useAppBus } from '@/utils/appBus.js';
import Logger from '@/utils/Logger.js';
import { createPlayerInstance } from './instance';
import WebPlayerPage from './views/WebPlayerPage.vue';

/** @type {PluginExecute} */
export default function plugin({ app, router, defineBusService }) {
  const bus = useAppBus();

  const playerInstance = createPlayerInstance(app);
  const rmPlayer = bus.call('player:addPlayer', {
    name: 'WebPlayer',
    play: (url) => {
      router.push({ name: ROUTE_NAME, query: { url: url.href } });
    },
  });

  initServices(defineBusService, playerInstance);
  handleErrors(playerInstance);

  router.addRoute({
    path: '/player',
    name: ROUTE_NAME,
    component: WebPlayerPage,
  });

  return () => {
    rmPlayer();
  };
}

/**
 * @param {PluginContext['defineBusService']} defineBusService
 * @param {ReturnType<typeof createPlayerInstance>} playerInstance
 */
function initServices(defineBusService, playerInstance) {
  defineBusService('webPlayer.custom', {
    add: playerInstance.addCustomPlayer,
    remove: playerInstance.removeCustomPlayer,
  });
}

/**
 * @param {ReturnType<typeof createPlayerInstance>} _
 */
function handleErrors({ onPlayerError, onSourceError, onPlaybackError, onOtherError }) {
  const logger = new Logger('WebPlayer');
  const { t } = useI18n();

  onPlaybackError((e) => {
    logger.error(t('playbackError'), e);
  });

  onSourceError((e) => {
    // @ts-ignore
    logger.error(t('sourceError', { url: e.target.src }));
  });

  onPlayerError((e) => {
    if (e.is(PlayerErrorType.UNSUPPORTED)) {
      logger.error(t('unsupportedFormat', { type: e.message }));
    }
    else if (e.is(PlayerErrorType.CREATE_PLAYER)) {
      logger.error(t('createPlayerFailed', { detail: e.message }));
    }
    else {
      logger.error(t('playerError', { detail: e.message }));
    }
  });

  onOtherError((e) => {
    logger.error(e.message);
  });
}
