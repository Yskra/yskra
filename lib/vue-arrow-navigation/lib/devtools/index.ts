import type { App, Reactive } from 'vue';
import { setupDevtoolsPlugin } from '@vue/devtools-api';
import { watch } from 'vue';
// import { DevToolsContextHookKeys } from '@vue/devtools-kit';
import { useStore } from '../store';
import { useHighlight } from './highlight';
import { getElementName } from './highlight/elementName';
import Icon from './streamline-color--arrow-move.svg?no-inline';

const INSPECTOR_ID = 'ArrowNavigation';

export function registerDevtoolsPlugin(app: App, navigator: Reactive<any>) {
  setupDevtoolsPlugin({
    id: INSPECTOR_ID,
    label: 'Arrow Navigation',
    logo: Icon,
    homepage: '',
    app,
  }, (api) => {
    const { highlightElement, unhighlightElement } = useHighlight();
    const store = useStore(app._instance!);

    watch(store.storage, () => {
      api.sendInspectorTree(INSPECTOR_ID);
    });
    watch(navigator, () => {
      api.sendInspectorState(INSPECTOR_ID);
    }, { deep: true });

    api.addInspector({
      id: INSPECTOR_ID,
      label: 'Arrow Navigation',
      nodeActions: [],
    });

    // @ts-expect-error yes
    api.hooks.hook('componentHighlight', () => {
      unhighlightElement();
    });

    api.on.getInspectorTree((payload) => {
      if (payload.inspectorId === INSPECTOR_ID) {
        const nodes = [...store.storage.entries()].map(([element, value]) => ({
          id: value.instance.devtoolsNodeId,
          label: `<${getElementName(element)}/>`,
        }));

        payload.rootNodes = [
          { id: 'state', label: 'General State' },
          ...nodes,
        ];
      }
    });

    api.on.getInspectorState((payload) => {
      if (payload.inspectorId !== 'components') {
        unhighlightElement();
      }

      if (payload.inspectorId === INSPECTOR_ID) {
        // noinspection JSIgnoredPromiseFromCall
        api.unhighlightElement();

        if (payload.nodeId === 'state') {
          payload.state = {
            navigator: Object.entries(navigator).map(([key, value]) => ({
              key,
              value,
            })),
          };

          highlightElement(navigator.activeSection);

          return;
        }

        const [element, val] = [...store.storage.entries()].find(([, v]) => v.instance.devtoolsNodeId === payload.nodeId) ?? [];

        if (element === undefined || val === undefined) {
          return;
        }
        highlightElement(element);

        payload.state = {
          config: Object.entries(val.config).map(([key, value]) => ({
            key,
            value,
          })),
          instance: Object.entries(val.instance).map(([key, value]) => ({
            key,
            value,
          })),
          elements: [...val.children.values()].map((value, index) => ({
            key: index.toString(),
            value,
          })),
        };
      }
    });
  });
}
