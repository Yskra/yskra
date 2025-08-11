import type { RouteLocationRaw } from 'vue-router';

export interface Item {
  id?: number | string;
  title?: string;
  image?: string;
  releaseDate?: Date;
  voteAverage?: number;
  backdropImage?: string;
  link?: RouteLocationRaw;
}
