import type { ComputedRef } from 'vue';
import type { useBackgroundStore, useDialogStore, useNoticesStore } from './lib';
import type { Method, Property } from '@/modules/appBus/BaseBus';
import type { FilmCardAction } from '@/plugins/UiKit/lib/film-card/Public';
import type { PiniaStore } from '@/types/pinia';

declare global {
  interface AppBusRegistry {
    'ui.dialog': {
      confirm: Method<PiniaStore<typeof useDialogStore>['confirm']>;
      prompt: Method<PiniaStore<typeof useDialogStore>['prompt']>;
      drawer: Method<PiniaStore<typeof useDialogStore>['drawer']>;
      modal: Method<PiniaStore<typeof useDialogStore>['modal']>;
    };
    'ui.background': {
      setImage: Method<PiniaStore<typeof useBackgroundStore>['setImage']>;
      presentationMode: Property<PiniaStore<typeof useBackgroundStore>['presentationMode']>;
    };
    'ui.notices': {
      pushNotification: Method<PiniaStore<typeof useNoticesStore>['pushNotification']>;
      removeNotification: Method<PiniaStore<typeof useNoticesStore>['removeNotification']>;
    };
    'ui.filmCard': {
      addActionBtn: Method<(btn: FilmCardAction) => (() => void)>;
      removeActionBtn: Method<(btn: FilmCardAction) => true | void>;
    };
    'ui.property': {
      fontSize: Property<ComputedRef<number>>;
      rem: Property<ComputedRef<number>>;
    };
  }
}
