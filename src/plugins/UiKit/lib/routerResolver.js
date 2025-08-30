/** @import {RouteLocationNormalized} from 'vue-router' */
// noinspection JSIgnoredPromiseFromCall

import { onUnmounted } from 'vue';
import { useRouter } from 'vue-router';


/**
 * @param {(to: RouteLocationNormalized, from: RouteLocationNormalized) => boolean} resolveForward
 * @param {(to: RouteLocationNormalized, from: RouteLocationNormalized) => boolean} resolveBack
 */
export function useRouterResolver(resolveForward = () => true, resolveBack = () => true) {
  const router = useRouter();

  let previousPath = window.history.state?.back ?? '';

  const stop = router.beforeResolve((to, from) => {
    if (previousPath === to.path) {
      return resolveBack(to, from);
    }

    previousPath = window.history.state?.back ?? '';
    return resolveForward(to, from);
  });

  onUnmounted(stop);
}
