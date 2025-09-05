<script setup lang="ts">
import type { Item } from './Public';
import { useScroll } from '@vueuse/core';
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
const { x, arrivedState, measure } = useScroll(null);
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
      :class="{ 'gradient-left': showPrevBtn, 'gradient-right': showNextBtn, 'gradient-between': showPrevBtn && showNextBtn }"
    >
      <div v-if="$slots['before-items'] && !isLoading" class="h-77 p-2 carousel-item">
        <slot name="before-items" />
      </div>
      <div
        v-for="item in items"
        :key="item.id"
        :data-item-id="item.id"
        class="h-77 p-2 carousel-item"
      >
        <AppLink
          v-if="item.link"
          class=""
          :to="item.link"
        >
          <slot name="item" :item="item">
            <YCarouselItem :item="item" />
          </slot>
        </AppLink>

        <div
          v-else
          v-focus
          @click="emit('itemClick', item)"
        >
          <slot name="item" :item="item">
            <YCarouselItem :item="item" />
          </slot>
        </div>
      </div>

      <div v-if="$slots['after-items'] && !isLoading" class="h-77 p-2 carousel-item">
        <slot name="after-items" />
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

.carousel-item > *:focus, .carousel-item > *:not(.no_overlay):hover {
  --open-delay: 950ms;
  --open-duration: 200ms;

  :deep(.r-carousel-item:not(.no_overlay)) {
    @apply w-90;
    transition-delay: var(--open-delay);
    transition-duration: var(--open-duration);

    .poster {
      @apply op-0;
      transition-duration: calc(var(--open-duration) - 100ms);
      transition-delay: var(--open-delay);
    }
    .backdrop {
      @apply op-100;
      transition-duration: var(--open-duration);
      transition-delay: var(--open-delay);
      animation-fill-mode: forwards;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .carousel {
    @apply scroll-auto;
  }
}
.reduce-motion .carousel {
  @apply scroll-auto;
}
</style>
