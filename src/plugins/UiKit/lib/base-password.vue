<script setup lang="ts">
import { BaseInput } from '.';
import getVanillaInput from './vanila-input';

const Password = getVanillaInput('password');
</script>

<template>
  <BaseInput
    :is="Password"
    name="password"
    autocomplete="current-password"
  >
    <slot />
  </BaseInput>
</template>
