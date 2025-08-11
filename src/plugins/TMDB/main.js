/** @import {PluginExecute, PluginContext} from '@/modules/pluginManager/Public'; */
/** @import {SearchResultItem, Config} from './Public'; */

import { storeToRefs } from 'pinia';
import { h, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppBus } from '@/modules/appBus';
import { useFetchSearch } from '@/plugins/TMDB/api/collectSearch.js';
import { useTMDBStore } from '@/plugins/TMDB/api/tmdb.js';
import languages from '@/plugins/TMDB/languages.js';
import routes from '@/plugins/TMDB/routes.js';
import configDefault from './config.json';
import { Trailers, WatchProviders } from './views';

import './main.css';

// noinspection JSUnusedGlobalSymbols
/** @type {PluginExecute} */
export default function plugin({ router, defineConfig, defineBusService, defineSettings }) {
  const config = defineConfig(configDefault);
  const store = useTMDBStore();

  routes.forEach(router.addRoute);
  store.setConfig(config);

  const removeActions = initServicesActions();

  initServices(defineBusService);
  initSettings(defineSettings, config);


  return () => {
    removeActions();
  };
}


/**
 * @param {PluginContext['defineBusService']} defineBusService defineBusService
 */
function initServices(defineBusService) {
  const store = useTMDBStore();
  const { altApiEndpoint, altImageCdnEndpoint } = storeToRefs(store);

  defineBusService('tmdb.endpoints', {
    set: {
      type: 'method',
      /**
       * @param {{apiUrl: string, imageCdn: string}} args args
       */
      value: ({ apiUrl, imageCdn }) => {
        altApiEndpoint.value = apiUrl;
        altImageCdnEndpoint.value = imageCdn;
      },
    },
  });
}

/**
 * @param {PluginContext['defineSettings']} defineSettings defineSettings
 * @param {Config} config config
 */
function initSettings(defineSettings, config) {
  // const LinkDocs = h(() => h(resolveComponent('BaseLink'), {
  //   href: DOCUMENTATION_HREF,
  //   target: '_blank',
  //   text: t('details'),
  // }));

  defineSettings([
    {
      name: 'apiEndpoint',
      ref: toRef(config, 'apiUrl'),
      type: 'url',
    },
    // {
    //   name: 'apiToken',
    //   note: h(I18nT, { keypath: 'apiTokenNote' }, {
    //     details: LinkDocs,
    //   }),
    //   ref: toRef(config, 'token'),
    //   type: 'text',
    // },
    {
      name: 'language',
      note: 'languageNote',
      ref: toRef(config, 'language'),
      type: 'select',
      options: [
        { name: 'languageDefault', value: '' },
        ...languages,
      ],
    },
  ]);
}

function initServicesActions() {
  const bus = useAppBus();
  const { t } = useI18n();

  const rmBtn1 = bus.call('ui.filmCard:addActionBtn', {
    id: 'watchProviders',
    name: 'justWatch',
    icon: 'cbi--just-watch',
    isAvailable: ({ ids }) => !!ids.tmdb,
    action: (ctx) => bus.call('ui.dialog:drawer', {
      title: t('justWatch'),
      // @ts-ignore
      targetRef: ctx?.event?.target,
      body: h(() => h(WatchProviders, { id: ctx.ids.tmdb, type: ctx.type })),
    }),
  });

  const rmBtn2 = bus.call('ui.filmCard:addActionBtn', {
    id: 'trailers',
    name: 'trailers',
    icon: 'i-mingcute:film-fill',
    isAvailable: ({ ids }) => !!ids.tmdb,
    action: (ctx) => bus.call('ui.dialog:drawer', {
      title: t('trailers'),
      // @ts-ignore
      targetRef: ctx?.event?.target,
      body: h(() => h(Trailers, { id: ctx.ids.tmdb, type: ctx.type })),
    }),
  });

  const rmSearch = bus.call('search:addProvider', {
    id: 'tmdb',
    name: 'TMDB',
    search: (query) => {
      const movies = useFetchSearch('movie', query);
      const tvShows = useFetchSearch('tv', query);
      const person = useFetchSearch('person', query);

      const shell = {
        abort: () => [movies, tvShows, person].forEach((e) => e.abort()),
        error: null,
        data: null,
      };

      return {
        ...shell,

        then: (onFulfilled, onRejected) => {
          return waitUntilFinish().then(onFulfilled, onRejected);
        },
      };

      /**
       *  Wait until all data is ready
       */
      async function waitUntilFinish() {
        return {
          ...shell,
          data: await packData(),
          error: [movies.error.value, tvShows.error.value, person.error.value].find((e) => e !== null) ?? null,
        };
      }

      /**
       * Pack raw result from api by category name
       */
      async function packData() {
        await Promise.all([movies, tvShows, person]);

        return /** @type {({name: string, items: SearchResultItem[]})[]} */ (
          [
            movies.data.value ? ({ name: 'Movies', items: movies.data.value }) : undefined,
            tvShows.data.value ? ({ name: 'TV Shows', items: tvShows.data.value }) : undefined,
            person.data.value ? ({ name: 'People', items: person.data.value }) : undefined,
          ]
            .filter(Boolean)
        );
      }
    },
  });

  return () => {
    rmSearch();
    rmBtn1();
    rmBtn2();
  };
}
