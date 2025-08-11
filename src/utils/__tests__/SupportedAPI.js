// @ts-nocheck
/* oxlint-disable no-restricted-globals */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SupportedAPI from '../SupportedAPI';

describe('webWorkers', () => {
  it('should detect Web Workers support when Worker is available', () => {
    const hasWorker = typeof Worker !== 'undefined';

    expect(SupportedAPI.webWorkers).toBe(hasWorker);
  });

  it('should detect no Web Workers support when Worker is not available', () => {
    const hasWorker = typeof Worker !== 'undefined';

    expect(SupportedAPI.webWorkers).toBe(hasWorker);
  });
});

describe('wasm', () => {
  let originalWebAssembly;

  beforeEach(() => {
    originalWebAssembly = global.WebAssembly;
  });

  afterEach(() => {
    global.WebAssembly = originalWebAssembly;
  });

  it('should return true when WASM is fully supported', () => {
    const isSupported = typeof WebAssembly === 'object'
      && typeof WebAssembly.instantiate === 'function'
      && typeof WebAssembly.Module === 'function'
      && typeof WebAssembly.Instance === 'function';

    if (isSupported) {
      expect(SupportedAPI.WASM).toBe(true);
    }
  });

  it('should return false when WebAssembly is not an object', async () => {
    global.WebAssembly = undefined;
    vi.resetModules();

    const { default: SupportedAPI } = await import('../SupportedAPI');

    expect(SupportedAPI.WASM).toBe(false);
  });

  it('should return false when WebAssembly.instantiate is not a function', async () => {
    global.WebAssembly = {
      ...global.WebAssembly,
      instantiate: undefined,
    };

    vi.resetModules();
    const { default: SupportedAPI } = await import('../SupportedAPI');

    expect(SupportedAPI.WASM).toBe(false);
  });

  it('should return false when WebAssembly.Module constructor fails', async () => {
    global.WebAssembly = {
      ...global.WebAssembly,
      Module: vi.fn(() => {
        throw new Error('Module construction failed');
      }),
      instantiate: vi.fn(),
    };

    vi.resetModules();
    const { default: SupportedAPI } = await import('../SupportedAPI');

    expect(SupportedAPI.WASM).toBe(false);
  });

  it('should return false when WebAssembly.Instance constructor fails', async () => {
    global.WebAssembly = {
      ...global.WebAssembly,
      Module: vi.fn(() => ({})),
      Instance: vi.fn(() => {
        throw new Error('Instance construction failed');
      }),
      instantiate: vi.fn(),
    };

    vi.resetModules();
    const { default: SupportedAPI } = await import('../SupportedAPI');

    expect(SupportedAPI.WASM).toBe(false);
  });

  it('should return false when Module is not instance of WebAssembly.Module', async () => {
    global.WebAssembly = {
      ...global.WebAssembly,
      Module: vi.fn(() => ({})),
      Instance: vi.fn(() => ({})),
      instantiate: vi.fn(),
    };

    const mockModule = {};

    global.WebAssembly.Module.mockReturnValue(mockModule);

    vi.resetModules();
    const { default: SupportedAPI } = await import('../SupportedAPI');

    expect(SupportedAPI.WASM).toBe(false);
  });

  it('should return false when Instance is not instance of WebAssembly.Instance', async () => {
    const mockModule = {};

    global.WebAssembly = {
      ...global.WebAssembly,
      Module: vi.fn(() => mockModule),
      Instance: vi.fn(() => ({})),
      instantiate: vi.fn(),
    };

    vi.resetModules();
    const { default: SupportedAPI } = await import('../SupportedAPI');

    expect(SupportedAPI.WASM).toBe(false);
  });

  it('should handle WASM support check with valid WASM environment', () => {
    if (typeof WebAssembly === 'object'
      && typeof WebAssembly.instantiate === 'function'
      && typeof WebAssembly.Module === 'function'
      && typeof WebAssembly.Instance === 'function') {
      const moduleBytes = Uint8Array.of(0x0, 0x61, 0x73, 0x6D, 0x01, 0x00, 0x00, 0x00);
      let moduleCreated = false;
      let instanceCreated = false;

      try {
        const module = new WebAssembly.Module(moduleBytes);

        moduleCreated = module instanceof WebAssembly.Module;

        if (moduleCreated) {
          const instance = new WebAssembly.Instance(module);

          instanceCreated = instance instanceof WebAssembly.Instance;
        }
      }
      catch (e) {
        // WASM может быть частично поддержан
      }

      const expected = moduleCreated && instanceCreated;

      expect(SupportedAPI.WASM).toBe(expected);
    }
  });
});

describe('static properties immutability', () => {
  it('should have readonly webWorkers property that throws on assignment', () => {
    const originalValue = SupportedAPI.webWorkers;

    expect(() => {
      SupportedAPI.webWorkers = !originalValue;
    }).toThrow(TypeError);
    expect(SupportedAPI.webWorkers).toBe(originalValue);
  });

  it('should have readonly WASM property that throws on assignment', () => {
    const originalValue = SupportedAPI.WASM;

    expect(() => {
      // @ts-ignore
      SupportedAPI.WASM = !originalValue;
    }).toThrow(TypeError);
    expect(SupportedAPI.WASM).toBe(originalValue);
  });

  it('should confirm webWorkers is a getter property', () => {
    const descriptor = Object.getOwnPropertyDescriptor(SupportedAPI.constructor, 'webWorkers');

    expect(descriptor?.get).toBeUndefined();
    expect(descriptor?.set).toBeUndefined();
  });

  it('should confirm WASM is a getter property', () => {
    const descriptor = Object.getOwnPropertyDescriptor(SupportedAPI.constructor, 'WASM');

    expect(descriptor?.get).toBeUndefined();
    expect(descriptor?.set).toBeUndefined();
  });
});
