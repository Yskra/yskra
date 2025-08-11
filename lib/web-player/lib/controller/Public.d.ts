import type { Reactive } from 'vue';
import type { ErrorType } from '../error';
import type LibraryError from '../error';


export type Errors = Reactive<Set<(ErrorsItemPlayer | ErrorsItemSource | ErrorsItemPlayback | ErrorsItemOther)>>;

interface ErrorsItemPlayer {
  type: ErrorType.PLAYER;
  detail: LibraryError;
}

interface ErrorsItemSource {
  type: ErrorType.SOURCE;
  detail: string;
}

interface ErrorsItemPlayback {
  type: ErrorType.PLAYBACK;
  detail: string;
}

interface ErrorsItemOther {
  type: ErrorType.UNKNOWN;
  detail: LibraryError;
}

export interface Logger {
  info: (...a: any[]) => void;
  warn: (...a: any[]) => void;
  error: (...a: any[]) => void;
}

