/** global Yskra */
/** @import {PluginContext} from '@/modules/pluginManager/Public' */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import patchComponent from '../patchComponent';

describe('patchComponent', () => {
  beforeEach(() => {
    const componentRegister = {
      get: vi.fn(),
    };

    vi.stubGlobal('Yskra', {
      componentRegister,
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    vi.resetModules();
  });

  const mockComponent = {
    name: 'TestComponent',
    render: vi.fn(),
    setup: vi.fn(),
  };

  /** @type {PluginContext['injector']} */
  const mockInjector = {
    post: vi.fn(),
    pre: vi.fn(),
    uninject: vi.fn(),
  };
  const mockPatch = vi.fn((vnode) => vnode);

  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-ignore
    Yskra.componentRegister.get.mockReturnValue(mockComponent);
  });

  it('should throw an error if component is not found', () => {
    // @ts-ignore
    Yskra.componentRegister.get.mockReturnValueOnce(undefined);

    expect(() =>
      patchComponent(mockInjector, 'NonExistentComponent', mockPatch),
    ).toThrow('Component NonExistentComponent not found');
  });

  it('should patch render in development mode', () => {
    const originalEnv = import.meta.env.DEV;

    import.meta.env.DEV = true;

    patchComponent(mockInjector, 'TestComponent', mockPatch, 'TestDebugId');

    expect(mockInjector.post).toHaveBeenCalledWith(
      mockComponent,
      'render',
      mockPatch,
      'TestDebugId-development',
    );

    import.meta.env.DEV = originalEnv;
  });

  it('should patch setup in production mode', () => {
    const originalEnv = import.meta.env.DEV;

    import.meta.env.DEV = false;

    const mockSetupResult = { foo: 'bar' };

    mockComponent.setup.mockReturnValue(mockSetupResult);

    patchComponent(mockInjector, 'TestComponent', mockPatch, 'TestDebugId');

    expect(mockInjector.post).toHaveBeenCalledWith(
      mockComponent,
      'setup',
      expect.any(Function),
      'TestDebugId-runtime',
    );

    // @ts-ignore
    const setupWrapper = mockInjector.post.mock.calls[0][2];
    const result = setupWrapper(mockComponent.setup);

    const args = ['arg1', 'arg2'];
    const setupResult = result(...args);

    expect(mockComponent.setup).toHaveBeenCalledWith(...args);
    expect(mockPatch).toHaveBeenCalledWith(mockSetupResult);
    expect(setupResult).toBe(mockSetupResult);

    import.meta.env.DEV = originalEnv;
  });
});
