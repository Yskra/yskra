<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useConfigEditor } from '@/modules/configEditor';
import { useAppBus } from '@/utils/appBus.js';

const isTv = toRef(() => Yskra.platform.type === 'tv');
const { t } = useI18n();
const bus = useAppBus();
const btnReset = useTemplateRef<Element>('btnReset');
const configEditor = useConfigEditor();

function resetConfig() {
  const { onConfirm } = bus.call('ui.dialog:confirm', {
    text: t('resetConfigConfirm'),
    targetRef: btnReset.value,
  });

  onConfirm(configEditor.onResetConfig);
}
</script>

<template>
  <div class="flex flex-col">
    <div ref="btnReset" class="my-5">
      <BaseButton
        @click="resetConfig"
      >
        {{ $t('resetConfig') }}
      </BaseButton>
    </div>

    <div class="my-5">
      <p v-if="isTv" class="mb-3 text-sm">
        {{ $t('configEditorTv') }}
      </p>
      <BaseButton
        is="a"
        href="/config"
        target="_blank"
        :disabled="isTv"
      >
        {{ $t('openConfigTab') }}
      </BaseButton>
    </div>
  </div>
</template>
