import type {App, Plugin} from 'vue';
import {effectScope, hasInjectionContext, inject, reactive} from 'vue';
import type {Elements, Options} from '../navigation';
import {createNavigation} from '../navigation';
import type {Config} from './Public';
import {createEventHook} from '@vueuse/core';
import {createFocusConfig, removeFocusConfig} from '../config';
import {createFocusDirective} from '../focus';
import {createFocusSectionDirective} from '../focus-section';
import {createStore} from '../store';
import {NAVIGATION_INJECT_KEY} from './constants';
import defaultConfig from './defaultConfig';

export * from './componentHooks';

export function createArrowNavigation(fabricConfig?: Partial<Config>): Plugin & { uninstall: (app: App) => void } {
  const uninstall = createEventHook<App>();

  uninstall.on((app) => {
    removeFocusConfig(app);

    delete app._context.provides[NAVIGATION_INJECT_KEY];
    delete app._context.directives.focus;
    delete app._context.directives['focus-section'];
  });

  return {
    install(app, config: Partial<Config> | undefined = fabricConfig) {
      const devtoolsData = reactive({});
      const store = createStore();
      const scope = effectScope();
      const logger = config?.logger ?? defaultConfig.logger;

      app.use(store);
      app.use(createFocusConfig({
        ...defaultConfig.sectionConfig,
        ...config?.sectionConfig,
      }));

      app.directive('focus-section', createFocusSectionDirective({ logger }));
      app.directive('focus', createFocusDirective({ logger }));

      const navigatorOpts: Options = {
        logger,
        elements: store.storage as Elements,
        adapter: { ...defaultConfig.adapter, ...config?.adapter },
        keyboardMap: { ...defaultConfig.keyboardMap, ...config?.keyboardMap },
        navigatorOptions: { ...defaultConfig.navigatorOptions, ...config?.navigatorOptions },
        keyboardThrottleTimeout: config?.navigatorOptions?.keyboardThrottleTimeout ?? defaultConfig.navigatorOptions.keyboardThrottleTimeout,
      };

      scope.run(() => {
        app.provide(NAVIGATION_INJECT_KEY, createNavigation(navigatorOpts, uninstall.on, devtoolsData));
      });

      if (import.meta.env.DEV) {
        import('../devtools').then(({ registerDevtoolsPlugin }) => {
          registerDevtoolsPlugin(app, devtoolsData)
        })
      }

      patchBody();
      uninstall.on(() => {
        scope.stop();
        store.storage.clear();
      });
    },
    uninstall: (app) => {
      // noinspection JSIgnoredPromiseFromCall
      uninstall.trigger(app);
    },
  };
}

export function useArrowNavigation(): ReturnType<typeof createNavigation> {
  return (hasInjectionContext() && inject(NAVIGATION_INJECT_KEY)) as ReturnType<typeof createNavigation>;
}

/**
 * https://firefox-source-docs.mozilla.org/performance/scroll-linked_effects.html
 */
function patchBody() {
  document.documentElement.style.scrollSnapType = 'both proximity';
  document.body.style.scrollSnapType = 'both proximity';
}
