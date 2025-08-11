// @ts-nocheck

export function catchRouterWarn() {
  const defaultConsoleWarn = window.console.warn;

  /**
   * @param {any[]} data some log data
   */
  function newConsoleWarn(...data) {
    // there will be false positives, since the router does not wait the plugins to be mounted
    if (typeof data[0] === 'string' && data[0].startsWith('[Vue Router warn]: No match found for location with path')) {
      return;
    }
    return defaultConsoleWarn(...data);
  }

  delete window.console.warn;
  Object.defineProperty(window.console, 'warn', {
    value: newConsoleWarn,
    writable: true,
    configurable: true,
  });
}
