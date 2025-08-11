import { computed, h } from 'vue';
import { useDialogStore } from './store';

export {
  DialogsContainer,
  useDialogStore,
};

function DialogsContainer() {
  const store = useDialogStore();
  const nodes = computed(() => Array.from(store.renderNodes.values()));

  return nodes.value.map(({ node, id }) => h('template', { key: id }, node));
}
