<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useUISettings } from '@/modules/settings';

const router = useRouter();
const { t } = useI18n();
const { indexPage, indexPageRoute, fontSize } = useUISettings();
const pages = computed(() => router.getRoutes()
  .filter((r) => r.meta?.title && !r.path.startsWith('/settings') && r.path !== '/'),
);
const fontSizeTmp = ref(fontSize.value);
const fontSizeSelect = computed({
  get: () => fontSizeTmp.value.toString(),
  set: (value: string) => {
    fontSizeTmp.value = Number.parseInt(value);
  },
});
const percent = computed(() => convertToPercent(fontSizeTmp.value));

function convertToPercent(value: number) {
  if (value < 14) {
    return t('auto');
  }
  return `${(value - 16) * 25 + 100}%`;
}
function onSave() {
  if (fontSizeTmp.value < 14) {
    fontSize.value = 0;
    return;
  }
  fontSize.value = fontSizeTmp.value;
}
</script>

<template>
  <BaseSelect
    :title="$t('homePage')"
    @change="indexPage = $event"
  >
    <BaseSelectItem
      v-for="option in pages"
      :key="option.name"
      :value="option.name"
      :selected="indexPageRoute?.path === option.path"
    >
      {{ $te(option.meta.title as string) ? $t(option.meta.title as string) : option.meta.title }}  [{{ option.name }}]
    </BaseSelectItem>
  </BaseSelect>

  <BaseDivider />

  <h2 class="mb-3 text-base">
    {{ $t('interfaceScale') }}
    <span>:</span>
    <span class="ml-2">{{ percent }}</span>
  </h2>

  <div class="flex items-center">
    <div class="flex items-center">
      <div class="w-2xl">
        <BaseSlider
          v-model="fontSizeSelect"
          class="w-full"
          :min="13"
          :max="24"
        />
      </div>
      <BaseButton
        color="primary"
        class="ml-8"
        @click="onSave"
      >
        {{ $t('apply') }}
      </BaseButton>
    </div>
  </div>
</template>
