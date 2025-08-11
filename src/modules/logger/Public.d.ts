import type { ComputedRef, Reactive } from 'vue';

export interface StoreEntry {
  meta: {
    prefix: string;
    context: string;
    color: string;
  };
  getters: {
    hasErrors: ComputedRef<boolean>;
  };
  messages: StoreMessageEntry[];
}
export interface StoreMessageEntry {
  level: LoggerLevel;
  message: unknown;
  date: Date;
}

export type StoreEntries = Reactive<Record<string, StoreEntry>>;

export type LoggerLevel = 'info' | 'warn' | 'error';
