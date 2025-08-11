import Index from '@/modules/router/pages/Index.vue';

export const ROUTER_PAGES_PARENT = Symbol('pages');

// @unocss-include

export default {
  path: '/',
  name: ROUTER_PAGES_PARENT,
  component: Index,
  // children: [
  //   {
  //     path: 'calendar',
  //     name: 'calendar',
  //     component: Calendar,
  //     meta: {
  //       title: 'Календарь',
  //       icon: line-md-calendar,
  //     },
  //   },
  //   {
  //     path: 'subscribes',
  //     name: 'subscribes',
  //     component: Subscribes,
  //     meta: {
  //       title: 'Подписки',
  //       icon: 'i-mingcute:bookmarks-fill',
  //     },
  //   },
  //   {
  //     path: 'history',
  //     name: 'history',
  //     component: History,
  //     meta: {
  //       title: 'История',
  //       icon: 'i-mingcute:history-fill',
  //     },
  //   },
  //   {
  //     path: 'collections',
  //     name: 'collections',
  //     component: Collections,
  //     meta: {
  //       title: 'Подборки',
  //       icon: 'i-mingcute:classify-2-fill',
  //     },
  //   },
  // ],
};
