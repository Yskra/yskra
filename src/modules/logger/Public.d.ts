import type { ShallowReactive } from 'vue';
import type { ENTRIES_GROUP_ID, MESSAGES_GROUP_ID } from './constants';
import type { EVENT_LOG_MESSAGE } from '@/modules/logger/constants';

export type EntryLevel = 'info' | 'warn' | 'error';
export type GroupId = string;

export interface Entry {
  get group(): Group;
  get date(): Date;
  id: string;
  level: EntryLevel;
  message: unknown;
  [ENTRIES_GROUP_ID]: string;
}
export interface GroupMeta {
  prefix: string;
  context: string;
  color: string;
}
export interface Group {
  id: GroupId;
  meta: GroupMeta;
  stats: {
    total: number;
    byLevel: Record<EntryLevel, number>;
    hasErrors: boolean;
  };
  get messages(): Entry[];
  [MESSAGES_GROUP_ID]: Set<string>;
}


export type StoreEntries = ShallowReactive<Map<string, Entry>>;
export type StoreGroups = ShallowReactive<Map<GroupId, Group>>;


export interface EventPayload {
  meta: GroupMeta;
  level: LoggerLevel;
  message: unknown[];
}

declare global {
  interface WindowEventMap {
    [EVENT_LOG_MESSAGE]: CustomEvent<EventPayload>;
  }
}
