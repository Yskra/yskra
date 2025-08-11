<script lang="ts">
export default {
  name: 'PlayerPlaylist',
};
</script>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { usePlayerPlaylistStore } from '@/plugins/webPlayer/ui/player-playlist/store';

const store = usePlayerPlaylistStore();
const route = useRoute();
</script>

<template>
  <BaseMenu class="w-full p-0">
    <template
      v-for="(item, index) in store.list"
      :key="item.id"
    >
      <BaseMenuItem v-if="store.list[index - 1] ? store.list[index - 1].group !== item.group : true" type="title">
        <div v-if="item.group === '__UNKNOWN__'">
          {{ $t('noGroup') }}
        </div>
        <div v-else>
          {{ item.group }}
        </div>
      </BaseMenuItem>
      <BaseMenuItem>
        <AppLink :to="{ name: 'player', query: { ...route.query, index } }" active-class="">
          <div class="col-start-1 col-end-3 flex items-center justify-between">
            <div class="flex items-center">
              <UseImage :src="item.tvgLogo" class="mr-5 h-5rem rounded-sm">
                <template #loading>
                  <BaseSkeleton class="mr-5 h-5rem w-5rem rounded-lg" />
                </template>
                <template #error>
                  <div class="h-5rem w-5rem flex items-center justify-center rounded-lg bg-base-300">
                    <div class="i-mingcute:pic-fill h-3rem w-3rem" />
                  </div>
                </template>
              </UseImage>
              <div class="ml-2 text-start">
                <p class="text-base">
                  {{ item.name }}
                </p>
              </div>
            </div>
            <div v-focus-section>
              <!--              <div -->
              <!--                v-if="index % 2 === 0" -->
              <!--                v-focus -->
              <!--                class="no-followed" -->
              <!--              /> -->
              <!--              <div -->
              <!--                v-else -->
              <!--                v-focus -->
              <!--                class="followed" -->
              <!--              /> -->
            </div>
          </div>
        </AppLink>
      </BaseMenuItem>
    </template>
  </BaseMenu>
</template>

<style scoped>
.no-followed {
  @apply h-2rem w-2rem i-mingcute:star-line focus:color-primary hover:color-primary;
}
.followed {
  @apply h-2rem w-2rem i-mingcute:star-fill color-primary focus:color-secondary hover:color-secondary;
}
</style>
