import type { VNode } from 'vue';

export interface FilmCardIDs {
  tmdb?: number;
  imdb?: string; // format 'tt1234567'
  wikidata?: string;
}
export interface FilmCardAction {
  id: string;
  name: string;
  icon: string | VNode;
  isAvailable: (payload: FilmCardButtonPayload) => boolean | Promise<boolean>;
  action: (payload: FilmCardButtonPayload) => void;
}

export interface FilmCardButtonPayload {
  ids: FilmCardIDs;
  type: 'movie' | 'tv';
  title?: string;
  originalTitle?: string;
  releaseDate?: Date;
  image?: string;
  event?: Event;
}

export interface FilmCardOrderItem {
  id: string;
  hide?: boolean;
}
