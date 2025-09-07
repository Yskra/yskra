/** @import {App, VNode} from 'vue' */
/** @import {Module} from '@/modules/Public' */

import { h } from 'vue';
import { useAppBus } from '@/utils/appBus';

import * as components from './components';
import { DialogsContainer, setCurrentApp, useDialogStore } from './dialogs-helper-api';
import * as directives from './directives';
import { NotificationContainer, useNoticesStore } from './notices-api';
import { register } from './register';
import './main.css';

/**
 * @type {Module}
 */
export function createBaseUIModule({ rootComponents }) {
  const bus = useAppBus();

  return {
    displayName: 'BaseUIModule',

    install(app) {
      registerComponents(app);
      registerDirectives(app);
      setCurrentApp(app);
      initNotificationApi();
      initDialogApi();
      initComponentRegister();

      // const storeBg = lib.useBackgroundStore();
      // const noticesStore = lib.useNoticesStore();
      // const filmCardStore = lib.useFilmCardStore();
      // const { presentationMode } = storeToRefs(storeBg);

      // bus.addService('ui.background', {
      //   setImage: storeBg.setImage,
      //   presentationMode: { type: 'property', value: presentationMode },
      // });

      // bus.addService('ui.filmCard', {
      //   addActionBtn: filmCardStore.addAction,
      //   removeActionBtn: filmCardStore.removeAction,
      // });
      // bus.addService('ui.property', {
      //   fontSize: { type: 'property', value: fontSize },
      //   rem: { type: 'property', value: rem },
      // });
    },

    global: {
      componentRegister: Object.seal(register),
    },
  };

  /**
   * @param {App} app
   */
  function registerComponents(app) {
    Object.entries(components).forEach(([name, component]) => {
      app.component(name, component);
    });
  }

  /**
   * @param {App} app
   */
  function registerDirectives(app) {
    Object.entries(directives).forEach(([name, directive]) => {
      app.directive(name, directive);
    });
  }

  function initNotificationApi() {
    const $notifications = document.createElement('div');
    const storeNotices = useNoticesStore();

    $notifications.id = 'notifications';
    document.documentElement.appendChild($notifications);

    rootComponents.add(h(NotificationContainer));

    bus.addService('ui.notices', {
      pushNotification: storeNotices.pushNotification,
      removeNotification: storeNotices.removeNotification,
    });
  }
  function initDialogApi() {
    const storeDialog = useDialogStore();

    rootComponents.add(h(DialogsContainer));

    bus.addService('ui.dialog', {
      confirm: storeDialog.confirm,
      prompt: storeDialog.prompt,
      drawer: storeDialog.drawer,
      modal: storeDialog.modal,
    });
  }

  function initComponentRegister() {
    bus.addService('ui.rootComponent', {
      add: (/** @type {VNode} */ component) => {
        rootComponents.add(component);
        return () => rootComponents.delete(component);
      },
      delete: (/** @type {VNode} */ component) => rootComponents.delete(component),
    });
  }
}

