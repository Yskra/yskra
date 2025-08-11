/** @import {Player} from '../../Public'; */
import { acceptHMRUpdate, defineStore } from 'pinia';
import { markRaw, reactive } from 'vue';

export const usePlayerStore = defineStore('player', () => {
  /** @type {Player[]} */
  const players = reactive([]);

  return {
    players,
    addPlayer,
    removePlayer,
  };

  /**
   * @param {Player} player
   * @return {() => void} remove player
   */
  function addPlayer(player) {
    if (players.find((e) => e.name === player.name)) {
      throw new Error(`Player ${player.name} already registered`);
    }
    players.push(markRaw(player));

    return () => removePlayer(player);
  }

  /**
   * @param {Player} player
   */
  function removePlayer(player) {
    const i = players.findIndex((e) => e.name === player.name);

    if (i !== -1) {
      players.splice(i, 1);
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePlayerStore, import.meta.hot));
}
