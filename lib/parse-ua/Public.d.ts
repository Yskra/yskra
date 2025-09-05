import type { PLATFORMS } from './constants.js';

export interface Platform {
  browser: string | undefined;
  version: number | 1;
  os: {
    family: string | undefined;
    version: number | 1;
  };
  type: typeof PLATFORMS[keyof typeof PLATFORMS];
}
