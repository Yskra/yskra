import type { NavigationGuard } from './Public';

export type { NavigationGuard };

interface Logger {
  error: (...a: any) => void;
  warn: (...a: any) => void;
}

export function createNavigationGuards<T = any, F = T, beforeCb = NavigationGuard<T, F>, afterCb = NavigationGuard<T, F>>({ logger }: { logger: Logger } = { logger: window.console }) {
  const beforeHooks = new Set<beforeCb>();
  const afterHooks = new Set<afterCb>();

  return {
    beforeEach(hook: beforeCb) {
      beforeHooks.add(hook);

      return () => {
        beforeHooks.delete(hook);
      };
    },

    afterEach(hook: afterCb) {
      afterHooks.add(hook);

      return () => {
        afterHooks.delete(hook);
      };
    },

    resolveBefore(to: T, from: F) {
      let result = true;

      for (const hook of beforeHooks) {
        try {
          const res = (hook as Function)(to, from);

          if (typeof res === 'boolean') {
            result = res;
          }
        }
        catch (err) {
          logger.error('Error in beforeEach hook:', err);
          return false;
        }
      }
      return result;
    },

    resolveAfter(to: T, from: F) {
      for (const hook of afterHooks) {
        try {
          (hook as Function)(to, from);
        }
        catch (err) {
          logger.warn('Error in afterEach hook:', err);
        }
      }
    },
  };
}
