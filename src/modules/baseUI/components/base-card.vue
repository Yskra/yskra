<script setup lang="ts">
defineOptions({
  registerIgnore: true,
});
</script>

<template>
  <component
    is="div"
    class="card"
  >
    <slot name="figure" />

    <div class="card-body">
      <h2 class="card-title">
        <slot name="title" />
      </h2>
      <slot />
      <div class="card-actions">
        <slot name="actions" />
      </div>
    </div>
  </component>
</template>

<style scoped>
.card {
  @apply border-dark rounded-box;
}
.card :deep(figure:first-child) {
    display: flex;
    align-items: center;
    justify-content: center;
}
.card-title {
  @apply text-base;
}
.card-actions {
  @apply justify-end;
}
</style>
