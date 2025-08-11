import type { ComponentInternalInstance } from 'vue';
import type { FocusSectionDirective } from '../config';
import { directiveConfigGen, useConfig } from '../config';
import { elementProvide } from '../elements-inject';
import { useStore } from '../store';
import { FS_DEFAULT_VALUE, FS_KEY } from './constants';

export { FS_DEFAULT_VALUE, FS_KEY };

interface Logger {
  error: (...a: any) => void;
  warn: (...a: any) => void;
}

export function createFocusSectionDirective(opts: { logger: Logger }): FocusSectionDirective {
  return {
    created(el, binding) {
      const instance = binding.instance!.$ as ComponentInternalInstance;
      const store = useStore(instance);
      const baseConfig = useConfig(instance);

      elementProvide(el, FS_KEY, store.initFocusSection(el, () => ({
        ...baseConfig,
        ...directiveConfigGen(binding),
      })));
    },
    beforeUnmount(el, binding) {
      const instance = binding.instance!.$ as ComponentInternalInstance;
      const store = useStore(instance);

      store.removeFocusSection(el);
    },
  };
}

