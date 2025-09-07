<script setup lang="ts">
import { computed } from 'vue';
import { useNoticesStore } from '.';

defineOptions({
  registerIgnore: true,
});
const store = useNoticesStore();
const notifications = computed(() => [...store.notifications.entries()].toReversed());
</script>

<template>
  <Teleport v-if="notifications.length" to="#notifications">
    <div class="notifications-container">
      <div class="relative h-full overflow-x-hidden">
        <div class="absolute bottom-8 right-8 flex flex-col">
          <TransitionGroup name="notification">
            <YNotification
              v-for="[id, notification] in notifications"
              :key="id"
              v-bind="notification"
              class="my-1"
              @timeout="store.removeNotification(id)"
            />
          </TransitionGroup>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.notifications-container {
  @apply pointer-events-none absolute right-0 top-0 h-screen w-screen;
}

.notification-enter-active, .notification-leave-active {
  transition: all 0.5s ease-in;
}
.notification-enter-from, .notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
