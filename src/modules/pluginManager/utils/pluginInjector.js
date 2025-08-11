/** @import {Logger} from '@/modules/logger'; */
/** @import {TargetInjection, PatchPreInjection, PatchPostInjection} from '@/modules/pluginManager/lib/injector/Public'; */
/** @import {PluginContext} from '@/modules/pluginManager/Public'; */
/** @import {PluginUnmount} from '@/modules/pluginManager/managers/mountManager'; */

import { useI18n } from 'vue-i18n';
import { useInjector } from '@/modules/pluginManager/lib/injector';

/**
 * @param {Logger} logger
 * @param {PluginUnmount} unmountPlugin
 * @returns {PluginContext['injector']} warped injector with auto-uninject
 */
export function createPluginInjector(logger, unmountPlugin) {
  const { t } = useI18n();
  const injector = useInjector();

  return {
    /**
     * @param {TargetInjection<any, methodName>} target
     * @param {string} methodName
     * @param {PatchPreInjection} patch
     * @param {string=} debugId
     */
    pre: (target, methodName, patch, debugId) => {
      if (debugId === undefined) {
        debugId = `pre-${target?.__name ? `${target.__name}.` : ''}${methodName}-${Math.random().toString(36).slice(2)}`;
      }

      const uninjectId = injector.pre(target, methodName, patch, debugId);

      if (uninjectId) {
        logger.info(t('Injected {name}', { name: debugId }), patch);

        unmountPlugin.step(() => {
          injector.uninject(debugId);
          logger.info(t('Uninjected {name}', { name: debugId }));
        });
      }
      return uninjectId;
    },

    /**
     * @param {TargetInjection<any, methodName>} target
     * @param {string} methodName
     * @param {PatchPostInjection} patch
     * @param {string=} debugId
     */
    post: (target, methodName, patch, debugId) => {
      if (debugId === undefined) {
        debugId = `post-${target?.__name ? `${target.__name}.` : ''}${methodName}-${Math.random().toString(36).slice(2)}`;
      }

      const uninjectId = injector.post(target, methodName, patch, debugId);

      if (uninjectId) {
        logger.info(t('Injected {name}', { name: debugId }), patch);

        unmountPlugin.step(() => {
          injector.uninject(debugId);
          logger.info(t('Uninjected {name}', { name: debugId }));
        });
      }
      return uninjectId;
    },

    uninject: injector.uninject,
  };
}
