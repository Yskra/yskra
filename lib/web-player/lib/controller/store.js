/** @import {Logger} from './Public'; */
/** @import {BasePlayer} from '../base-players/Public' */
import { reactive, readonly } from 'vue';
import { createBasePlayers } from '../base-players';

/**
 * @param {Logger} logger
 */
export function createPlayersStore(logger) {
  const useLogger = (/** @type {string} */ name) => ({
    info: (/** @type {any} */ ...a) => logger.info(`[${name}]`, ...a),
    warn: (/** @type {any} */ ...a) => logger.warn(`[${name}]`, ...a),
    error: (/** @type {any} */ ...a) => logger.error(`[${name}]`, ...a),
  });
  const basePlayers = createBasePlayers(useLogger);

  /** @type {Set<BasePlayer>} */
  const players = reactive(new Set(basePlayers));

  return {
    players: readonly(players),
    addPlayer,
    removePlayer,
    findPlayer,
    getPlayerByName,
  };

  /**
   * @param {BasePlayer} player
   */
  function addPlayer(player) {
    players.add(player);
  }

  /**
   * @param {BasePlayer} player
   */
  function removePlayer(player) {
    players.delete(player);
  }

  /**
   * @param {(p: BasePlayer) => boolean} predicate
   * @return {BasePlayer|null}
   */
  function findPlayer(predicate) {
    const arr = [...players];

    for (let i = arr.length - 1; i >= 0; i--) {
      if (predicate(arr[i])) {
        return arr[i];
      }
    }
    return null;
  }

  /**
   * @param {string} name
   * @return {BasePlayer|null}
   */
  function getPlayerByName(name) {
    return findPlayer((p) => p.name === name);
  }
}
