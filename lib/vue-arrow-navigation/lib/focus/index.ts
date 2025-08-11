import type { FocusDirective } from '../config';
import { directiveResolveFocus } from '../config';
import { elementInject } from '../elements-inject';
import { FS_DEFAULT_VALUE, FS_KEY } from '../focus-section';

interface Logger {
  error: (...a: any) => void;
  warn: (...a: any) => void;
}

export function createFocusDirective(opts: { logger: Logger }): FocusDirective {
  return {
    mounted(el, binding) {
      const { addChildren } = elementInject(el, FS_KEY, FS_DEFAULT_VALUE, opts)!;
      const { enabled, autofocus } = directiveResolveFocus(binding);

      // @ts-expect-error noinspection TypeScriptUnresolvedReference
      el.tabIndex = -1;

      if (enabled) {
        addChildren(el, autofocus);
      }
    },
    updated(el, binding) {
      const { addChildren, delChildren } = elementInject(el, FS_KEY, FS_DEFAULT_VALUE, opts)!;
      const { enabled, autofocus } = directiveResolveFocus(binding);

      if (enabled) {
        addChildren(el, autofocus);
      }
      else {
        delChildren(el);
      }
    },
    beforeUnmount(el) {
      const { delChildren } = elementInject(el, FS_KEY, FS_DEFAULT_VALUE, opts)!;

      delChildren(el);
    },
  };
}
