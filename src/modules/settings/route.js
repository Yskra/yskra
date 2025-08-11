export const SETTINGS_PAGES_PARENT = Symbol('settings');

// @unocss-include

export default {
  path: '/settings',
  name: SETTINGS_PAGES_PARENT,
  component: () => import('@/modules/settings/SettingsPage.vue'),
  redirect: { name: 'settingsUI' },
  children: [
    {
      path: 'ui',
      name: 'settingsUI',
      component: () => import('@/modules/settings/preferences/UI/SettingsUI.vue'),
      meta: {
        title: 'ui',
        icon: 'i-mingcute:copy-2-fill',
      },
    },
    {
      path: 'player',
      name: 'settingsPlayer',
      component: () => import('@/modules/settings/preferences/player/SettingsPlayer.vue'),
      meta: {
        title: 'player',
        icon: 'i-mingcute:play-fill',
      },
    },
  ],
};
