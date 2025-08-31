/** @import {PluginExecute} from '@/modules/pluginManager/Public'; */

import { replaceChildren } from '@skirtle/vue-vnode-utils';
import { h } from 'vue';
import { useProvidersStore } from '@/plugins/search/stores/providers.js';
import { useSearchStore } from '@/plugins/search/stores/search.js';
import SearchBtn from '@/plugins/search/ui/SearchBtn.vue';
import patchComponent from '@/utils/patchComponent.js';

// noinspection JSUnusedGlobalSymbols
/** @type {PluginExecute} */
export default function plugin({ defineBusService, injector, defineUserProfile }) {
  const providerStore = useProvidersStore();
  const store = useSearchStore();
  const userProfile = defineUserProfile({ history: [] });

  store.setProfile(userProfile);

  defineBusService('search', {
    addProvider: providerStore.addProvider,
    removeProvider: providerStore.removeProvider,
  });

  patchComponent(injector, 'TheRootSidebar', (result) => {
    if (Array.isArray(result.children)) {
      const newChildren = replaceChildren(result.children, (child) => {
        return [h(SearchBtn), child];
      });

      return h(result, newChildren);
    }

    return result;
  }, 'search-button');


  return () => null;
}
