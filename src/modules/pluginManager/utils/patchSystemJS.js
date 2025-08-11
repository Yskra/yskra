// noinspection JSUnusedGlobalSymbols

/**
 * @param {{ constructor: { prototype: { resolve: (id: any, parentUrl: any) => any; instantiate: (url: any, parentUrl: any) => Promise<any>; }; }; }} System systemJS
 * @param {Record<string, module>} registry registry
 */
export function patchRegister(System, registry) {
  const MODULE_PREFIX_ID = '\0virtual:';

  const origResolve = System.constructor.prototype.resolve;
  const origInstantiate = System.constructor.prototype.instantiate;

  System.constructor.prototype.resolve = function (/** @type {string} */ id, /** @type {any} */ parentUrl) {
    if (registry[id]) {
      return `${MODULE_PREFIX_ID}${id}`;
    }
    return origResolve.call(this, id, parentUrl);
  };

  System.constructor.prototype.instantiate = async function (/** @type {string} */ url, /** @type {any} */ parentUrl) {
    if (url.startsWith(MODULE_PREFIX_ID)) {
      const id = url.slice(MODULE_PREFIX_ID.length);

      return [
        [],
        (/** @type {(arg0: unknown) => void} */ _export) => {
          _export(registry[id]);
          return { execute() {} };
        },
      ];
    }

    return origInstantiate.call(this, url, parentUrl);
  };
}

/**
 * @param {{ constructor: { prototype: { createScript: (url: string) => any; }; }; }} System systemJS
 * @param {() => any} createScriptTag createScriptTag
 */
export function patchCreateScriptTag(System, createScriptTag) {
  const baseOrigin = location.origin;
  // const origCreateScriptTag = System.constructor.prototype.createScript;

  System.constructor.prototype.createScript = function (/** @type {string} */ url) {
    const script = createScriptTag();

    script.async = true;

    if (url.indexOf(`${baseOrigin}/`))
      script.crossOrigin = 'anonymous';

    script.src = url;
    return script;
  };
}
