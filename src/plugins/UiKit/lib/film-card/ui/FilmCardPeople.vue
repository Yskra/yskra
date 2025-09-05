<script setup lang="ts">
import { UseImage } from '@vueuse/components';
import { computed } from 'vue';

export interface People {
  name?: string;
  subName?: string;
  id: number;
  image?: string;
}

const props = defineProps<{
  peoples?: People[];
}>();

const peoples = computed(() => props.peoples?.length ? props.peoples : [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
</script>

<template>
  <BaseMenu class="w-full max-xl:hidden">
    <BaseMenuItem type="title">
      <slot />
    </BaseMenuItem>
    <BaseMenuItem
      is="BaseButton"
      v-for="people in peoples"
      :key="`${people.id}-${people?.subName}`"
      class="my-1 h-full justify-start py-1"
    >
      <div class="mr-2 avatar">
        <div class="h-8 w-8 rounded-full">
          <UseImage
            :src="people.image as string"
            alt=""
          >
            <template #error>
              <div class="mr-3 h-full w-8 flex items-center justify-center bg-base-300">
                <Icon name="line-md-person-filled" class="h-5 w-5" />
              </div>
            </template>
          </UseImage>
        </div>
      </div>
      <div class="max-w-40 text-start text-nowrap">
        <h1 v-if="people.name" class="mb-1 overflow-hidden text-ellipsis text-sm">
          {{ people.name }}
        </h1>
        <BaseSkeleton v-else class="mb-1 h-5 w-40" />
        <p v-if="people.name" class="overflow-hidden text-ellipsis text-xs op-70">
          {{ people.subName }}
        </p>
        <BaseSkeleton v-else class="h-3 w-20" />
      </div>
    </BaseMenuItem>
  </BaseMenu>
</template>
