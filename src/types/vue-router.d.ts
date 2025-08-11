import type { VNode } from 'vue';
import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string | VNode;
    icon?: string | VNode;
  }
}
