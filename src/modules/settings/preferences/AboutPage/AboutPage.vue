<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getAppInfo, getLinks, ICONS } from '.';

const links = getLinks();
const { t } = useI18n();
const info = getAppInfo();

const linkColumns = [
  [
    {
      name: t('sourceCode'),
      href: links.sourceCode.href,
      icon: getIcon(links.sourceCode),
    },
    ...links.other.map((link) => ({
      name: link.name,
      href: link.url.href,
      icon: getIcon(link.url),
    })),
  ],
  [
    {
      name: t('termsOfService'),
      href: links.tos.href,
      icon: getIcon('tos'),
    },
    {
      name: t('privacyPolicy'),
      href: links.privacy.href,
      icon: getIcon('privacy'),
    },
    {
      name: t('dmca'),
      href: links.dmca.href,
      icon: getIcon('dmca'),
    },
  ],
];

function getIcon(name: string | URL) {
  if (name instanceof URL) {
    if (name.host in ICONS) {
      return ICONS[name.host];
    }
    return '';
  }
  if (name in ICONS) {
    return ICONS[name];
  }
  return '';
}
</script>

<template>
  <div class="w-full flex flex-col items-center justify-center">
    <div class="w-50% flex justify-between bg-base-300 p-4 pr-50 rounded-box">
      <img
        src="/logo.svg"
        alt="Yskra"
        class="w-40"
      >
      <div>
        <p class="mb-5 text-xl">
          {{ $t('aboutYskra') }}
        </p>

        <div class="flex">
          <ul
            v-for="(column, columnIndex) in linkColumns"
            :key="columnIndex"
            class="mx-3 flex flex-col"
          >
            <li
              v-for="link in column"
              :key="link.href"
              class="my-1"
            >
              <a
                :href="link.href"
                target="_blank"
                class="flex items-center link"
              >
                <div
                  class="mr-2 h-2rem w-2rem"
                  :class="link.icon"
                />
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>

        <div class="mt-5 text-center text-sm">
          <p>
            {{ info.version }}
          </p>
          <a
            :href="links.commitHash.href"
            target="_blank"
            class="link"
          >
            {{ info.shortHash }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
