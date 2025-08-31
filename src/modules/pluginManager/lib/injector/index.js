/** @import {InjectionRecords, TargetInjection, PatchInjection, PatchPreInjection, PatchPostInjection} from './Public'; */
/** @import {ModuleContext} from '@/modules/Public' */
/** @import {UUID} from 'node:crypto'; */

import { useI18n } from 'vue-i18n';
import { Logger } from '@/modules/logger/index.js';
import generateUUID from '@/utils/generateUUID.js';
import { INJECTION_FIELD, ORIGINAL_METHODS_FIELD } from './constants';

/** @type {ReturnType<typeof createInjectorModule>} */
let instance;


/**
 * @return {ReturnType<typeof createInjectorModule>}
 */
export function useInjector() {
  return instance;
}

/**
 * Function patching manager
 */
export function createInjectorModule() {
  /** @type {InjectionRecords} */
  const injections = {};
  const logger = new Logger('Injector');

  // noinspection JSUnusedGlobalSymbols
  const injector = {
    pre: preInject,
    post: postInject,
    uninject,
  };

  instance = injector;

  return injector;

  /**
   * Inject before method call, receives the original method's argument array. Return 'false' to cancel function execution
   * @param {TargetInjection<any, methodName>} target target module
   * @param {string} methodName method name
   * @param {PatchPreInjection} patch patch function
   * @param {string=} debugId injectionId for ease of debugging will be generated automatically if not provided
   */
  function preInject(target, methodName, patch, debugId) {
    return addInject(target, methodName, patch, debugId, true);
  }

  /**
   * Injection after method execution, receives the result of execution and an array of arguments
   * @param {TargetInjection<any, methodName>} target target module
   * @param {string} methodName method name
   * @param {PatchPostInjection} patch patch function
   * @param {string=} debugId injectionId for ease of debugging will be generated automatically if not provided
   */
  function postInject(target, methodName, patch, debugId) {
    return addInject(target, methodName, patch, debugId, false);
  }

  /**
   * Injects into a module method
   * @param {TargetInjection<any, methodName>} target Module with needed method
   * @param {string} methodName Name of method to patch
   * @param {PatchInjection} patch Patch function
   * @param {string=} injectionId injectionId for ease of debugging will be generated automatically if not provided
   * @param {boolean} isPre Whether the patch should run before original method
   * @return {string|undefined} injectionId for uninject
   */
  function addInject(target, methodName, patch, injectionId, isPre = false) {
    const { t } = useI18n();

    if (!target || !target[methodName]) {
      throw new Error(t('invalidInjectTarget', { injectionId, methodName }));
    }

    if (!(methodName in (target[INJECTION_FIELD] || {}))) {
      initInjection(target, methodName);
    }

    const id = target[INJECTION_FIELD][methodName];
    const debugId = injectionId || `${methodName}-${generateUUID()}`;

    injections[id].push({
      debugId,
      patch,
      isPre,
    });

    return debugId;
  }

  /**
   * @param {string} injectionId The injection specified during addInject (as debugId)
   */
  function uninject(injectionId) {
    for (const id in injections) {
      // @ts-expect-error - UUID is a string
      injections[id] = injections[id].filter((i) => i.debugId !== injectionId);
    }
  }


  /**
   * @param {TargetInjection<any, methodName>} target target module
   * @param {string} methodName method name
   */
  function initInjection(target, methodName) {
    const id = generateUUID();
    const funcCopy = { ...target }[methodName];

    target[INJECTION_FIELD] = { ...(target[INJECTION_FIELD] || {}), [methodName]: id };
    target[ORIGINAL_METHODS_FIELD] = { ...(target[ORIGINAL_METHODS_FIELD] || {}), [methodName]: funcCopy };
    injections[id] = [];

    target[methodName] = ((_oldMethod) =>
    /**
     * @param {unknown[]} args args
     * @this {TargetInjection<{}, methodName>}
     */
      function (...args) {
        const finalArgs = processPreInjections(id, args, this);

        if (finalArgs !== false && Array.isArray(finalArgs)) {
          const returned = _oldMethod ? _oldMethod.apply(this, finalArgs) : undefined;

          return processPostInjections(id, finalArgs, returned, this);
        }
      }
    )(target[methodName]);

    Object.defineProperties(target[methodName], {
      length: { value: funcCopy.length },
      name: { value: funcCopy.name },
      toString: { value: funcCopy.toString },
    });
  }

  /**
   * @param {UUID} id injection id
   * @param {any[]} originalArgs original arguments
   * @param {unknown} _this this
   * @return {any[]|false}
   */
  function processPreInjections(id, originalArgs, _this) {
    const { t } = useI18n();
    const filteredInjections = injections[id].filter((i) => i.isPre);
    /** @type {any[]|false} */
    let args = originalArgs;

    for (const injection of filteredInjections) {
      /** @type {any[]|false} */
      let testArgs = args;

      try {
        // @ts-ignore
        testArgs = injection.patch.call(_this, args);
      }
      catch (e) {
        logger.error(t('Error in pre-injection {injectionId}', { injectionId: injection.debugId }), e);
        continue;
      }

      if (testArgs === false) {
        return false;
      }

      if (!Array.isArray(testArgs)) {
        logger.error(t('Pre-inject {injectionId} returned not array. Injection will be ignored', { injectionId: injection.debugId }), args);
      }
      else {
        args = testArgs;
      }
    }

    return args;
  }

  /**
   * @param {UUID} id injection id
   * @param {unknown[]} originalArgs original arguments
   * @param {unknown} originReturn origin return
   * @param {unknown} _this this
   */
  function processPostInjections(id, originalArgs, originReturn, _this) {
    const { t } = useI18n();
    const filteredInjections = injections[id].filter((i) => !i.isPre);
    let finalReturn = originReturn;

    for (const injection of filteredInjections) {
      let testReturn;

      try {
        // @ts-ignore // idk
        testReturn = injection.patch.call(_this, finalReturn, originalArgs);
      }
      catch (e) {
        logger.error(t('Error in post-injection {injectionId}', { injectionId: injection.debugId }), e);
        continue;
      }

      if (testReturn !== undefined) {
        finalReturn = testReturn;
      }
    }
    return finalReturn;
  }
}
