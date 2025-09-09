/** @import {StoreEntries, StoreGroups, Group, EntryLevel, GroupMeta} from '@/modules/logger/Public'; */
/** @import {Ref, Reactive} from 'vue' */

import { shallowReactive, shallowRef } from 'vue';
import { ALLOWED_LEVELS, ENTRIES_GROUP_ID, MAX_ENTRIES, MESSAGES_GROUP_ID } from './constants';

/** @type {Reactive<Record<EntryLevel, number>>} */
// @ts-ignore
const defaultLevelStats = Object.fromEntries(ALLOWED_LEVELS.map((l) => [l, 0]));

/** @type {StoreEntries} */
const entries = shallowReactive(new Map());
/** @type {StoreGroups} */
const groups = shallowReactive(new Map());

/** @type {Ref<number>} */
const totalEntries = shallowRef(0);
/** @type {Reactive<Record<EntryLevel, number>>} */
const globalStats = shallowReactive({ ...defaultLevelStats });

export {
  addEntry,
  entries,

  exportFlatArray,

  globalStats,
  groups,
  totalEntries,
};


/**
 * Pushes new entry to the store and updates global stats
 * @param {GroupMeta} meta
 * @param {EntryLevel} level
 * @param {number} timestamp
 * @param {unknown} message
 */
function addEntry(meta, level, timestamp, message) {
  const { prefix, context } = meta;
  const groupId = `${prefix}-${context}`;
  const group = initGroup(groupId, meta);
  const entryId = `${groupId}-${Date.now()}`;

  if (!ALLOWED_LEVELS.includes(level)) {
    console.error(`[Yskra Logger]: Invalid level ${level} for "${groupId}"`);
    return;
  }

  updateGlobalStats(level);
  updateGroupStats(group, level);

  entries.set(entryId, {
    id: entryId,
    level,
    message,
    get date() {
      return new Date(timestamp);
    },
    get group() {
      return /** @type {Group} */ (groups.get(groupId));
    },
    [ENTRIES_GROUP_ID]: groupId,
  });
  group[MESSAGES_GROUP_ID].add(entryId);
}

/**
 * Exports all entries as flat array
 * @return {{id: string; level: EntryLevel; meta: GroupMeta; message: unknown; date: Date}[]}
 */
function exportFlatArray() {
  const result = [];

  for (const entry of entries.values()) {
    result.push({
      id: entry.id,
      level: entry.level,
      meta: entry.group.meta,
      message: entry.message,
      date: entry.date,
    });
  }

  return result;
}


/**
 * @param {string} groupId
 * @param {GroupMeta} meta
 * @return {Group}
 */
function initGroup(groupId, meta) {
  if (!groups.has(groupId)) {
    groups.set(groupId, {
      meta,
      id: groupId,
      stats: {
        total: 0,
        byLevel: { ...defaultLevelStats },
        hasErrors: false,
      },
      get messages() {
        return this[MESSAGES_GROUP_ID]
          .values()
          .take(MAX_ENTRIES)
          .map((/** @type {string} */ id) => entries.get(id));
      },
      [MESSAGES_GROUP_ID]: new Set(),
    });
  }

  // @ts-ignore
  return groups.get(groupId);
}

/**
 * @param {EntryLevel} level
 */
function updateGlobalStats(level) {
  globalStats[level]++;
  totalEntries.value++;
}

/**
 * @param {Group} group
 * @param {EntryLevel} level
 */
function updateGroupStats(group, level) {
  group.stats.total++;
  group.stats.byLevel[level]++;
  group.stats.hasErrors = group.stats.byLevel.error > 0;
}
