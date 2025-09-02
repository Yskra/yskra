<script setup lang="ts">
import type { Item } from './Public';
import { useScroll, useVirtualList } from '@vueuse/core';
import { computed, watch } from 'vue';
import YCarouselItem from './YCarouselItem.vue';

export interface Props {
  items: Item[];
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});
const emit = defineEmits<{
  (e: 'itemClick', item: Item): void;
}>();

const items = computed(() => props.isLoading ? Array.from({ length: 20 }).map((_, i) => ({ id: i }) as Item) : props.items);
const { list, containerProps, wrapperProps } = useVirtualList(items, { itemWidth: 196 });
const { x, arrivedState, measure } = useScroll(containerProps.ref);
const showNextBtn = computed(() => !arrivedState.right);
const showPrevBtn = computed(() => !arrivedState.left);

watch(items, measure);

function scrollNext() {
  x.value += containerProps.ref.value?.clientWidth ?? 0;
}
function scrollPrev() {
  x.value -= containerProps.ref.value?.clientWidth ?? 0;
}
</script>

<template>
  <div v-focus-section class="y-carousel group">
    <div
      class="w-full carousel"
      v-bind="containerProps"
      :class="{ 'gradient-left': showPrevBtn, 'gradient-right': showNextBtn, 'gradient-between': showPrevBtn && showNextBtn }"
    >
      <div v-bind="wrapperProps">
        <div v-if="$slots['before-items'] && !isLoading" class="h-77 p-2 carousel-item">
          <slot name="before-items" />
        </div>
        <div
          v-for="item in list"
          :key="item.data.id"
          :data-item-id="item.data.id"
          class="h-77 p-2 carousel-item"
        >
          <AppLink
            v-if="item.data.link"
            class="h-full w-full"
            :to="item.data.link"
          >
            <slot name="item" :item="item.data">
              <YCarouselItem :item="item.data" />
            </slot>
          </AppLink>

          <div
            v-else
            @click="emit('itemClick', item.data)"
          >
            <slot name="item" :item="item.data">
              <YCarouselItem :item="item.data" />
            </slot>
          </div>
        </div>

        <div v-if="$slots['after-items'] && !isLoading" class="h-77 p-2 carousel-item">
          <slot name="after-items" />
        </div>
      </div>
    </div>

    <div
      v-if="showPrevBtn"
      class="arrow-btn left-2 op-0 group-hover:op-100"
      @click="scrollPrev"
    >
      <div class="i-mingcute:arrow-left-circle-fill h-full w-full bg-base-300" />
    </div>
    <div
      v-if="showNextBtn"
      class="arrow-btn right-2 op-0 group-hover:op-100"
      @click="scrollNext"
    >
      <div class="i-mingcute:arrow-right-circle-fill h-full w-full bg-base-300" />
    </div>
  </div>
</template>

<style scoped>
.y-carousel {
  @apply w-full relative;

  .gradient-left {
    mask-image: linear-gradient(90deg, #0000 0%, #000 10%);
  }

  .gradient-right {
    mask-image: linear-gradient(90deg, #000 90%, #0000 100%);
  }

  .gradient-between {
    mask-image: linear-gradient(90deg, #0000 0%, #000 10%), linear-gradient(90deg, #000 90%, #0000 100%);
    mask-composite: intersect;
  }

  .arrow-btn {
    @apply absolute top-1/2 h-13 w-13 cursor-pointer rounded-full bg-secondary -translate-y-1/2 transition-all;
  }
}
</style>
