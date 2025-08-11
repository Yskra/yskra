<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core';
import { ref, watch } from 'vue';
import { useAppBus } from '@/utils/appBus';

const { items = [] } = defineProps<Props>();

export interface Props {
  items?: { href: string; id: number | string; title: string }[];
}

const SLIDE_INTERVAL = 5000;

const currentItem = ref(0);
const bus = useAppBus();
const { resume } = useIntervalFn(step, SLIDE_INTERVAL, { immediate: true });

watch(() => items, (value) => {
  if (value.length) {
    step(0);
  }
}, { immediate: true });

watch(currentItem, () => {
  resume();
});
watch(() => items?.[currentItem.value]?.href, (value) => {
  if (value) {
    bus.call('ui.background:setImage', value);
  }
}, { immediate: true });

function step(step = 1) {
  currentItem.value = currentItem.value + step;

  if (currentItem.value > items.length - 1) {
    currentItem.value = 0;
  }
  if (currentItem.value < -1) {
    currentItem.value = items.length - 1;
  }
}
</script>

<template>
  <div v-focus-section class="h-120 w-full">
    <div class="y-slider">
      <template
        v-for="(item, index) in items"
        :key="item.id"
      >
        <Transition
          class="fan-art-container"
        >
          <div v-show="currentItem === index">
            <img
              :src="item.href"
              :alt="item.title"
              class="fan-art"
            >
          </div>
        </Transition>

        <Transition class="info-container">
          <div v-if="currentItem === index">
            <div class="text-3xl text-white font-bold text-shadow-xl">
              <slot :index="index" :itemm="item" />
            </div>
          </div>
        </Transition>
      </template>

      <div v-focus-section class="statusbar">
        <div
          v-for="(item, index) in items"
          :key="item.id"
          v-focus
          class="statusbar-item"
          @click="currentItem = index"
        >
          <div
            class="statusbar-item-progress"
            :style="{ '--slide-interval': `${SLIDE_INTERVAL / 1000}s` }"
            :class="{
              done: currentItem > index,
              progress: currentItem === index,
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.y-slider {
  @apply relative h-170 overflow-hidden;

  .fan-art-container {
    @apply absolute right-0 -top-5;

    .fan-art {
      @apply w-1280px;
      mask-image: linear-gradient(90deg, #0000 0%, #000 30%), linear-gradient(180deg, #000 0%, #0000 90%);
      mask-composite: intersect;
    }
  }

  .info-container {
    @apply absolute left-5% top-10%
  }

  .statusbar {
    @apply group absolute bottom-60 right-0 h-15 w-90% flex items-end px-2;

    .statusbar-item {
      @apply h-2 flex flex-1 cursor-pointer rounded bg-neutral op-70 transition-height focus:h-5 group-hover:h-5 mx-1;
    }

    .statusbar-item-progress {
      --slide-interval: 1s;

      @apply h-full w-0 rounded bg-neutral-content progress;

      &.done {
        @apply w-full;
      }

      &.progress {
        animation: fill var(--slide-interval) linear infinite;
      }
    }
  }
}

/*noinspection CssUnusedSymbol*/
.v {
  &-enter-active, &-leave-active {
    transition: transform .5s linear, opacity .4s linear;
  }

  &-enter-from, &-leave-to {
    opacity: 0;
  }

  &-enter-from {
    @apply translate-x-70%;
  }

  &-leave-to {
    @apply -translate-x-70%;
  }
}

@keyframes fill {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
</style>
