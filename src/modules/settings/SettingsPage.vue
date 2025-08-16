<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import TheSettingsSidebar from '@/modules/settings/components/TheSettingsSidebar.vue';
import Index from '@/plugins/UiKit/lib/sidebar-layout/index.vue';
import { useTitle } from '@/utils/title';

const route = useRoute();
const { t, te } = useI18n();

const title = useTitle(
  () => route.meta.title && resolveI18nTitle(route.meta.title),
  { titleTemplate: `%s | ${t('settings')}` },
);

function resolveI18nTitle(key: string) {
  return te(key) ? t(key) : key;
}
</script>

<template>
  <Index>
    <template #sidebar>
      <TheSettingsSidebar />
    </template>

    <div class="w-full p-5">
      <h1 class="my-3 text-lg font-bold">
        {{ title }}
      </h1>
      <BaseDivider />

      <div v-focus-section class="w-full p-2">
        <RouterView />
      </div>
    </div>
  </Index>
</template>

