/** @import {PluginExecute} from '@/modules/pluginManager/Public'; */
/** @import {VNode, VNodeArrayChildren} from 'vue' */

import { replaceChildren } from '@skirtle/vue-vnode-utils';
import { h } from 'vue';
import { useProvidersStore } from '@/plugins/search/stores/providers.js';
import { useSearchStore } from '@/plugins/search/stores/search.js';
import SearchBtn from '@/plugins/search/ui/SearchBtn.vue';

// noinspection JSUnusedGlobalSymbols
/** @type {PluginExecute} */
export default function plugin({ defineBusService, injector, defineUserProfile }) {
  const providerStore = useProvidersStore();
  const store = useSearchStore();
  const userProfile = defineUserProfile({ history: [] });
  const TheRootSidebar = Yskra.componentRegister.get('TheRootSidebar');

  store.setProfile(userProfile);

  defineBusService('search', {
    addProvider: providerStore.addProvider,
    removeProvider: providerStore.removeProvider,
  });

  injector.post(TheRootSidebar, 'render', (/** @type {VNode} */ result) => {
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
