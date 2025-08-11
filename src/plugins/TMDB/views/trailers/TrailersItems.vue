<script setup lang="ts">
defineProps(['data']);
</script>

<template>
  <BaseMenu class="w-full p-0">
    <BaseMenuItem
      v-for="item in data"
      :key="item.id"
    >
      <AppLink :to="{ name: 'player', query: { url: item.url } }">
        <div class="flex items-center">
          <div v-if="item.site === 'YouTube'" class="relative">
            <div class="i-mingcute:youtube-fill absolute left-7rem z-1 h-3rem w-3rem color-[#FF0000]" />
          </div>
          <UseImage :src="item.image?.href" class="mr-5 h-5rem rounded-sm">
            <template #loading>
              <BaseSkeleton class="mr-5 h-5rem w-10rem rounded-lg" />
            </template>
            <template #error>
              <div class="h-5rem w-10rem flex items-center justify-center rounded-lg bg-base-300">
                <div class="i-mingcute:pic-fill h-4rem w-4rem" />
              </div>
            </template>
          </UseImage>
          <div class="ml-2 text-start">
            <p class="text-base">
              {{ item.name }}
            </p>
            <p class="op-80">
              {{ item.date.toDateString() }}
            </p>
          </div>
        </div>
      </AppLink>
    </BaseMenuItem>
  </BaseMenu>
</template>
