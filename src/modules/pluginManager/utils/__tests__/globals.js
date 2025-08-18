// @ts-nocheck

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { applyRemoveApis } from '../globals.js';

describe('applyRemoveApis', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {});
    vi.stubGlobal('open', vi.fn());
    vi.stubGlobal('eval', vi.fn());
    vi.stubGlobal('navigator', {
      serviceWorker: {},
      geolocation: {},
      mediaDevices: {},
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should remove localStorage from window', () => {
    applyRemoveApis();

    expect(window.localStorage).toBeUndefined();
  });

  it('should remove open, serviceWorker, geolocation, mediaDevices and eval from navigator', () => {
    applyRemoveApis();

    expect(window.open).toBeUndefined();
    expect(navigator.serviceWorker).toBeUndefined();
    expect(navigator.geolocation).toBeUndefined();
    expect(navigator.mediaDevices).toBeUndefined();
    expect(window.eval).toBeUndefined();
  });
});

// describe('applyFreezePrototypes', () => {
//   applyFreezePrototypes();
//
//   it('should freeze Object prototype', () => {
//     expect(Object.isFrozen(Object.prototype)).toBe(true);
//   });
//
//   it('should freeze Array prototype', () => {
//     expect(Object.isFrozen(Array.prototype)).toBe(true);
//   });
//
//   it('should throw error when trying to modify frozen prototypes', () => {
//     // const obj = {};
//     // expect(() => Object.defineProperty(obj, 'newProp', { value: 1 })).toThrow();
//
//     expect(() => Array.prototype.push = () => {}).toThrow();
//   });
// });

// describe('applyBlockNetwork', () => {
//   it('should block requests to blacklisted URLs using fetch', async () => {
//     const blacklist = new Set([
//       new URL('https://blacklisted.com').href,
//     ]);
//
//     applyBlockNetwork(blacklist);
//
//     const response = await fetch('https://blacklisted.com');
//
//     expect(response.status).toBe(403);
//   });
//
//   it('should allow requests to non-blacklisted URLs using fetch', async () => {
//     const blacklist = new Set([
//       new URL('https://blacklisted.com').href,
//     ]);
//
//     applyBlockNetwork(blacklist);
//
//     const response = await window.fetch('https://allowed.com');
//
//     expect(response.status).toBe(200);
//   });
//
//   it('should block requests to blacklisted URLs using XMLHttpRequest', (done) => {
//     const blacklist = new Set([
//       new URL('https://blacklisted.com').href,
//     ]);
//
//     applyBlockNetwork(blacklist);
//
//     const xhr = new XMLHttpRequest();
//
//     xhr.onreadystatechange = () => {
//       if (xhr.readyState === xhr.DONE) {
//         expect(xhr.status).toBe(0);
//         done();
//       }
//     };
//     xhr.open('GET', 'https://blacklisted.com');
//     xhr.send();
//   });
//
//   it('should allow requests to non-blacklisted URLs using XMLHttpRequest', (done) => {
//     const blacklist = new Set(['https://blacklisted.com']);
//
//     applyBlockNetwork(blacklist);
//
//     const xhr = new XMLHttpRequest();
//
//     xhr.onreadystatechange = () => {
//       if (xhr.readyState === xhr.DONE) {
//         expect(xhr.status).toBe(200);
//         done();
//       }
//     };
//     xhr.open('GET', 'https://allowed.com');
//     xhr.send();
//   });
// });
