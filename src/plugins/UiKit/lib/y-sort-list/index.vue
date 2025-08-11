<script lang="ts">
export default {
  name: 'VSortList',
};
</script>

<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core';
import { ref } from 'vue';

type List = { id: string; hide: boolean }[];

const list = defineModel<List>({ required: true });
const orderMode = ref(false);
const orderTarget = ref();

function startOrderMode(id: string) {
  orderTarget.value = id;
  orderMode.value = true;
}

function endOrderMode() {
  orderTarget.value = undefined;
  orderMode.value = false;
}

onKeyStroke(['Enter'], (event) => {
  if (orderMode.value) {
    event.stopPropagation();
    endOrderMode();
  }
});

function changeOrder<T>(array: T[], targetIdx: number, offset: number): T[] {
  if (offset <= 0 && targetIdx > 0) {
    [array[targetIdx + offset], array[targetIdx]] = [array[targetIdx], array[targetIdx + offset]];
  }
  else if (offset >= 1 && targetIdx < array.length - 1) {
    [array[targetIdx + offset], array[targetIdx]] = [array[targetIdx], array[targetIdx + offset]];
  }

  return array;
}

function key(event: KeyboardEvent) {
  if (orderMode.value) {
    event.stopPropagation();
    event.preventDefault();
    const targetIndex = list.value.findIndex((element) => element.id === orderTarget.value);

    list.value = changeOrder(list.value, targetIndex, event.code === 'ArrowDown' ? +1 : -1);
  }
}
</script>

<template>
  <ul
    class="list"
    @keydown.down.stop="key"
    @keydown.up.stop="key"
  >
    <li
      v-for="(item, i) in list"
      :key="item.id"
      v-click-outside="endOrderMode"
      :class="{ 'order-target': item.id === orderTarget }"
    >
      <BaseButton
        styling="ghost"
        :disabled="orderMode"
        class="mx-1 p-0"
        modifier="circle"
      >
        <div class="i-mingcute:minus-circle-fill h-1.5rem w-1.5rem" />
      </BaseButton>
      <BaseButton
        styling="ghost"
        class="mx-1 p-0"
        modifier="circle"
        @click="startOrderMode(item.id)"
      >
        <div
          class="i-mingcute:minus-circle-fill h-1.5rem w-1.5rem"
          :class="[i === 0 ? 'down' : i === list.length - 1 ? 'up' : 'middle']"
        />
      </BaseButton>
      <slot
        :id="item.id"
        name="item"
        :item="item"
      >
        {{ item }}
      </slot>
    </li>
  </ul>
</template>

<style scoped>
.list {
  li {
    @apply flex items-center rounded-[--radius-field] px-3 py-1.5 transition-colors text-align-start;

    &:hover {
      @apply cursor-pointer bg-[--color-base-content\\_10\\_transparent] outline-2 outline-transparent outline-offset-2;
    }

    &.order-target {
      box-shadow: 0 0 3pt 2pt var(--color-neutral-content);
      @apply scale-105 bg-[--color-base-content\\_10\\_transparent] outline-2 outline-transparent outline-offset-2 transition-transform-200;
    }

    .up {
      --un-icon: url(./assets/up-arrow.svg)
    }
    .down {
      --un-icon: url(./assets/down-arrow.svg)
    }
    .middle {
      --un-icon: url(./assets/middle-arrow.svg)
    }
  }
}
</style>
