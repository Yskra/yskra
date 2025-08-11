import type { Ref } from 'vue';

export interface ScaleModes {
  [k: string]: {
    calc: (custom: number) => {
      [k: string]: number | string;
    };
  };
}

export type PlayerRef = Ref<HTMLMediaElement | null>;
export { CustomPlayer } from './lib/player/Public';
