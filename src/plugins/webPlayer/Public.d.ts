import type { Ref } from 'vue';

export interface ScaleModes {
  [k: string]: {
    calc: (custom: number) => {
      [k: string]: string;
    };
  };
}

export type PlayerRef = Ref<HTMLMediaElement>;
