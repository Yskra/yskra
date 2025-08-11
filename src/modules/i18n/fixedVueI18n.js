// @ts-nocheck

import { useI18n as useI18nPackage } from 'npm:vue-i18n';
import { Logger } from '@/modules/logger';
import { useI18n as useI18nModule } from './index.js';

export {
  createI18n,
  DatetimeFormat,
  I18nD,
  I18nInjectionKey,
  I18nN,
  I18nT,
  NumberFormat,
  Translation,
  VERSION,
  vTDirective,
} from 'npm:vue-i18n';


export function useI18n(...args) {
  try {
    return useI18nPackage(...args);
  }
  catch (err) {
    if (err.code !== 26 /** 'I18nErrorCodes.MUST_BE_CALL_SETUP_TOP' */) {
      (new Logger('i18n')).error(err);
    }
    return useI18nModule(...args).global;
  }
}
