import type { RouteLocationRaw } from 'vue-router';
import type { LIST_TYPES } from '@/plugins/search/constants';

type ListTypes = typeof LIST_TYPES;

export interface SearchProvider {
  id: string;
  name: string;
  search: (query: string) => SearchReturn & PromiseLike<SearchReturn>;
  passive?: boolean;
  type?: ListTypes[keyof ListTypes];
  onClick?: (item: SearchResultItem) => void;
}

interface SearchReturn {
  data: SearchResult[] | null;
  error: Error | null;
  abort: () => void;
}

export interface SearchResult {
  name: string;
  items: SearchResultItem[];
}

export interface SearchResultItem {
  id?: number | string;
  title?: string;
  image?: string;
  releaseDate?: Date;
  voteAverage?: number;
  backdropImage?: string;
  link?: RouteLocationRaw;
}

export interface SearchUserProfile {
  history: string[];
}
