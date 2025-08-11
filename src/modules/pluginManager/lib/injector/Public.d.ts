/* eslint-disable ts/no-unsafe-function-type */

import type { UUID } from 'node:crypto';
import type { INJECTION_FIELD, ORIGINAL_METHODS_FIELD } from './constants';

export interface InjectionRecord {
  patch: PatchInjection;
  debugId: string;
  isPre: boolean;
}

export type InjectionRecords = Record<UUID, InjectionRecord[]>;

export type TargetInjection<T extends Record<string, unknown>, K extends string> = T
  & { [key in K]: Function }
  & { [INJECTION_FIELD]?: Record<K, UUID> } // Here are stored the IDs that link to the ID in the Injector that will run all its patches
  & { [ORIGINAL_METHODS_FIELD]?: Record<string, Function> }; // This is where the original methods are stored, which can be used for debugging.

export type PatchPreInjection = (originalArgs: unknown[]) => unknown[] | false;
export type PatchPostInjection = (returned: any, originalArgs: unknown[]) => unknown | undefined;
export type PatchInjection = PatchPreInjection | PatchPostInjection;
