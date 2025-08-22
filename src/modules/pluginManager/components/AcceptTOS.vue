<script setup lang="ts">
import { autoResetRef } from '@vueuse/core';
import { ref } from 'vue';
import { BaseCheckbox } from '@/plugins/UiKit/lib';

const props = defineProps<{
  href: string;
}>();
const emit = defineEmits<{
  (e: 'accepted', result: boolean): void;
}>();

const checked = ref(false);
const redColor = autoResetRef(false, 1000);

function onAccepted() {
  if (checked.value) {
    emit('accepted', checked.value);
  }
  else {
    redColor.value = true;
  }
}
</script>

<template>
  <div v-focus-section.autofocus>
    <p>{{ $t('acceptYskraPluginTosToContinue') }}</p>

    <div
      v-focus
      class="mt-4 flex items-center rounded focus:focus-cursor"
      :class="{ 'outline-width-.3rem outline-offset-.3rem outline-solid outline-error shake-horizontal': redColor }"
      @click="checked = !checked"
    >
      <BaseCheckbox
        :color="redColor ? 'error' : 'primary'"
        :checked="checked"
      />
      <p class="ml-2">
        <i18n-t
          keypath="acceptConditionsAndContinue"
          tag="label"
          for="tos"
        >
          <a
            class="link"
            :href="props.href"
            target="_blank"
          >{{ $t('conditionsPluginTos') }}</a>
        </i18n-t>
      </p>
    </div>

    <div class="mt-4 flex items-center justify-end">
      <BaseButton class="w-30" @click="$emit('accepted', false)">
        {{ $t('cancel') }}
      </BaseButton>
      <BaseButton
        class="ml-2 w-30"
        color="primary"
        @click="onAccepted"
      >
        {{ $t('ok') }}
      </BaseButton>
    </div>
  </div>
</template>
