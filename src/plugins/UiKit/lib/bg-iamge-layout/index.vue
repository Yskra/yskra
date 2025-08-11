<script lang="ts">
export { useBackgroundStore } from './store.js';

export default {
  name: 'BgImageLayout',
};
</script>

<script setup lang="ts">
import { refDebounced } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import { useBackgroundStore } from './store.js';

const store = storeToRefs(useBackgroundStore());
const image = refDebounced(store.image, 1);
const lastImage = ref('');
let cancelled = false;

onMounted(() => {
  lastImage.value = image.value;
});
watch(image, (v) => {
  if (!v) {
    lastImage.value = '';
  }
});

function enterCancelled() {
  cancelled = true;
}

function leave() {
  if (cancelled) {
    lastImage.value = '';
    cancelled = false;
    return;
  }
  lastImage.value = image.value;
}
</script>

<template>
  <div class="relative">
    <div class="absolute left-0 top-0 h-full w-full blur-3xl -z-1">
      <div
        :style="{ backgroundImage: `url('${lastImage}')` }"
        class="h-full w-full"
      />
      <Transition @enter-cancelled="enterCancelled" @leave="leave">
        <div
          v-if="image === store.image.value"
          :style="{ backgroundImage: `url('${image}')` }"
          class="absolute top-0 h-full w-full"
        />
      </Transition>
    </div>

    <div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
/*noinspection CssUnusedSymbol*/
.v {
  &-enter-active, &-leave-active {
    transition: opacity 1s linear;
  }

  &-enter-from, &-leave-to {
    opacity: 0;
  }
}
</style>
