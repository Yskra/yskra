<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import TheSettingsSidebar from '@/modules/settings/components/TheSettingsSidebar.vue';
import Index from '@/plugins/UiKit/lib/sidebar-layout/index.vue';
import { useTitle } from '@/utils/title';

const route = useRoute();
const { t } = useI18n();

const title = useTitle(
  () => route.meta.title ? t(route.meta.title as string) : null,
  { titleTemplate: `%s | ${t('settings')}` },
);
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

