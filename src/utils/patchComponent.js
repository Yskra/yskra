/** @import { VNode, Component, RendererNode, RendererElement } from 'vue' */
/** @import { PluginContext } from '@/modules/pluginManager/Public' */

/**
 * Utility for easy patching components, on development patched render(), after build vue awaits Vnode returned from setup() - so will be patched setup()
 * @param {PluginContext['injector']} injector
 * @param {string} componentName
 * @param {(result: VNode<RendererNode, RendererElement, { [key: string]: any; }>) => VNode} patch
 * @param {string=} debugId
 */
export default function patchComponent(injector, componentName, patch, debugId = componentName) {
  /** @type {Component|undefined} */
  const Component = Yskra.componentRegister.get(componentName);

  if (!Component) {
    throw new Error(`Component ${componentName} not found`);
  }

  if (import.meta.env.DEV) {
    injector.post(Component, 'render', patch, `${debugId}-development`);
  }
  else {
    injector.post(Component, 'setup', (/** @type {Function|object} */ setupFunction) => {
      if (typeof setupFunction === 'function') {
        return (/** @type {any} */...args) => patch(setupFunction(...args));
      }

      return setupFunction;
    }, `${debugId}-runtime`);
  }
}
