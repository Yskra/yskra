<script setup lang="ts">
import type SourceError from '@/modules/pluginManager/utils/SourceError';

const props = defineProps<{
  error: SourceError;
}>();
</script>

<template>
  <BaseButton
    class="h-100% border-base-300 p-0 op-60"
  >
    <BaseCard
      class="relative h-60 w-70"
      size="sm"
    >
      <template #figure>
        <figure class="h-40">
          <Icon name="line-md-image-twotone" class="h-5em w-5em" />
        </figure>
      </template>
      <template #title>
        <h1>{{ props.error.source.pathname }}</h1>
      </template>
      <p class="absolute left-50% top-50% w-full bg-neutral text-2xl line-height-loose text-shadow-xl -translate-1/2">
        <span class="text-error">{{ $t ('notAvailable') }}</span>
      </p>
    </BaseCard>
  </BaseButton>
</template>
