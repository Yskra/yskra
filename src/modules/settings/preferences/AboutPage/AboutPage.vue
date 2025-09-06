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
  <div class="w-full flex flex-col items-center">
    <div class="flex items-start bg-base-300 p-4 px-10 rounded-box">
      <img
        src="/logo.svg"
        alt="Yskra"
        class="mt-10 w-30"
      >
      <div class="pl-10">
        <p class="mb-5 text-base line-height-relaxed">
          {{ $t('aboutYskra') }}
        </p>

        <div class="flex text-sm line-height-6">
          <ul
            v-for="(column, columnIndex) in linkColumns"
            :key="columnIndex"
            class="mx-3 flex flex-col"
          >
            <li
              v-for="link in column"
              :key="link.href"
              class="my-1.5"
            >
              <a
                :href="link.href"
                target="_blank"
                class="flex items-center link"
              >
                <div
                  class="mr-2 h-2rem w-2rem flex-shrink-0"
                  :class="link.icon"
                />
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>

        <div class="mt-5 border-t border-base-content border-dotted pt-2 text-center text-sm line-height-relaxed">
          <p>
            <span>{{ $t('version') }}: </span>
            <span class="font-bold">{{ info.version }}</span>
          </p>
          <p>
            <span>{{ $t('buildDate') }}: </span>
            <span class="font-bold">{{ info.buildDate.toLocaleString(undefined, { dateStyle: 'medium' }) }}</span>
          </p>
          <p>
            <span>{{ $t('commitHash') }}: </span>
            <a
              :href="links.commitHash.href"
              target="_blank"
              class="link"
            >
              {{ info.shortCommitHash }}
            </a>
          </p>
          <p>
            <span>{{ $t('buildHash') }}: </span>
            <a
              :href="links.buildHash.href"
              target="_blank"
              class="link"
            >
              {{ info.shortBuildHash }}
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
