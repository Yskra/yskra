/** @import {Logger} from '@/modules/logger/Logger'; */
import { useI18n } from 'vue-i18n';

/**
 * @param {Logger} logger logger
 * @param {Record<string, {module: unknown, version: string, author: string}>} packagesRegistry registry
 */
export function useGlobalInterface(logger, packagesRegistry) {
  const { t } = useI18n();

  return {
    import: importFn,
    package: Object.freeze({
      // add: addPkg, // todo support virtual registry systemJS
      getInfo: getPkgInfo,
      get list() {
        return Object.keys(packagesRegistry);
      },
    }),
  };

  /**
   * Get package by name
   * @param {keyof packagesRegistry} name name
   */
  function importFn(name) {
    if (name in packagesRegistry) {
      return packagesRegistry[name].module;
    }

    logger.error(t('Package {name} not found', { name }));
  }

  /**
   * Get package info by name
   * @param {keyof packagesRegistry=} name name
   */
  function getPkgInfo(name) {
    if (name) {
      if (name in packagesRegistry) {
        return packagesRegistry[name];
      }
      logger.error(t('Package {name} not found', { name }));
    }
  }

  /**
   * Register package to registry
   * @param {{name: string, module: unknown, version: string, author: string}} pkg package
   * @returns {() => void} unregister function
   */
  // eslint-disable-next-line unused-imports/no-unused-vars
  function addPkg(pkg) {
    if (Object.keys(packagesRegistry).includes(pkg.name)) {
      throw new Error(`Package ${pkg.name} already registered`);
    }

    packagesRegistry[pkg.name] = Object.freeze({
      module: pkg.module,
      version: pkg.version,
      author: pkg.author,
    });

    return () => removePkg(pkg);
  }

  /**
   * Unregister package from registry
   * @param {{name: string, module: unknown, version: string, author: string}} pkg package
   */
  function removePkg(pkg) {
    if (pkg.name in packagesRegistry) {
      delete packagesRegistry[pkg.name];
    }
  }
}

