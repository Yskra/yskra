import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref } from 'vue';

export const useBackgroundStore = defineStore('ui.background', () => {
  const image = ref('');
  const presentationMode = ref(false);

  return {
    image,
    presentationMode,
    setImage,
  };

  /**
   * @param {string} url
   */
  function setImage(url) {
    image.value = url;
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBackgroundStore, import.meta.hot));
}
