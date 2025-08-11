<script setup lang="ts">
import { onUnmounted, ref, useTemplateRef } from 'vue';
import SearchOverlay from '../view/SearchOverlay.vue';

const showModal = ref(false);
const btnRef = useTemplateRef('btn');

onUnmounted(() => {
  console.log('unmounted');
});
</script>

<template>
  <div
    ref="btn"
    v-focus-section
    class="px-5 pt-5"
  >
    <BaseButton
      class="h-3rem w-3rem w-full p-0 rounded-box"
      color="primary"
      styling="soft"
      @click="showModal = true"
    >
      <div class="i-mingcute:search-2-fill h-2rem w-2rem" />
    </BaseButton>
  </div>

  <YModal v-model:show="showModal" :target-ref="btnRef">
    <SearchOverlay />
  </YModal>
</template>
