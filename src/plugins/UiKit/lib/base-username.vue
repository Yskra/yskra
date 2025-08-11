<script setup lang="ts">
import { BaseInput } from '.';
</script>

<template>
  <BaseInput
    name="username"
    autocomplete="username"
  >
    <slot />
  </BaseInput>
</template>
