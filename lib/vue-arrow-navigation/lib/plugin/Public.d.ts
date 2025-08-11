import type { SectionConfig } from '../config';
import type { Adapter, KeyboardMap, NavigatorOptions } from '../navigation';

export interface Config {
  adapter: Adapter;
  sectionConfig: SectionConfig; // default global section config
  navigatorOptions: NavigatorOptions;
  keyboardMap: KeyboardMap;
  logger: {
    warn: (...a: any) => void;
    error: (...a: any) => void;
  };
}

