export default class SupportedAPI {
  static get webWorkers() {
    return typeof Worker !== 'undefined';
  }

  static get WASM() {
    return supportsWASM();
  }
}

/**
 * @credit https://stackoverflow.com/a/47880734
 * @return {boolean}
 */
function supportsWASM() {
  try {
    if (typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function') {
      const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6D, 0x01, 0x00, 0x00, 0x00));

      if (module instanceof WebAssembly.Module) {
        return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
      }
    }
  }
  catch (e) {}
  return false;
}
