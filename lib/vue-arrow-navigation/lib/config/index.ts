import type { App, ComponentInternalInstance, Plugin } from 'vue';
import type { DirectiveFocusConfigBinning, DirectiveSectionConfigBinning, SectionConfig } from './Public';
import { inject, provide, reactive } from 'vue';
import { CONFIG_INJECT_KEY } from './constants';

export type { FocusDirective, FocusSectionDirective, SectionConfig } from './Public';

export function createFocusConfig(config: SectionConfig): Plugin {
  return {
    install(app) {
      app.provide(CONFIG_INJECT_KEY, {
        ...config,
      });
    },
  };
}

export function removeFocusConfig(app: App) {
  delete app._context.provides[CONFIG_INJECT_KEY];
}

export function useConfig(instance?: ComponentInternalInstance): SectionConfig {
  if (instance) {
    // @ts-expect-error it has provides!
    return instance.provides[CONFIG_INJECT_KEY] as SectionConfig;
  }

  return inject(CONFIG_INJECT_KEY) as SectionConfig;
}

export function defineNAConfig(config: Partial<SectionConfig>) {
  const baseConfig = useConfig();
  const cfg = reactive({
    ...baseConfig,
    ...config,
  });

  provide(CONFIG_INJECT_KEY, cfg);
}


export function directiveConfigGen(binding: DirectiveSectionConfigBinning) {
  const modifiers = [
    ['autofocus', binding.modifiers.autofocus],
  ]
    .filter(([, value]) => value !== undefined); // filter undefined values = do not overwrite

  return {
    ...Object.fromEntries(modifiers),
    ...(binding.value ?? {}),
  };
}

export function directiveResolveFocus(binding: DirectiveFocusConfigBinning) {
  let enabled = true;
  let autofocus = false;

  if (binding.modifiers.autofocus) {
    autofocus = true;
  }
  if (binding.value !== undefined) {
    if (typeof binding.value === 'boolean') {
      enabled = binding.value;
    }
    else if (typeof binding.value === 'object') {
      enabled = binding.value.enabled ?? enabled;
      autofocus = binding.value.autofocus ?? autofocus;
    }
  }

  return {
    enabled,
    autofocus,
  };
}
