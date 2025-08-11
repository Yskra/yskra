<script setup>
defineProps(['data']);
</script>

<template>
  <BaseDivider placement="start">
    <slot />
  </BaseDivider>
  <BaseMenu class="w-full p-0">
    <BaseMenuItem
      v-for="item in data"
      :key="item.provider_id"
      class=""
    >
      <div>
        <UseImage :src="item.logo" class="mr-5 h-3rem w-3rem rounded-lg">
          <template #loading>
            <BaseSkeleton class="mr-5 h-3rem w-3rem rounded-lg" />
          </template>
          <template #error>
            <div class="i-mingcute:pic-fill mr-5 h-3rem w-3rem rounded-lg bg-neutral-content" />
          </template>
        </UseImage>
        <span>{{ item.provider_name }}</span>
      </div>
    </BaseMenuItem>
  </BaseMenu>
</template>
