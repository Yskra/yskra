import type { useMediaControls } from '@vueuse/core';
import type LibraryError from 'lib/error';
import type { Reactive, Ref } from 'vue';

export interface Player {
  (element: HTMLVideoElement | HTMLAudioElement | null | undefined, playerOpts: PlayerOptions): {
    mediaControls: MediaControls;
    load: (src: string) => Promise<void>;
    destroy: () => void;
    onPlayerError: (handler: (error: LibraryError) => void) => void;
  };
}

export interface BasePlayer {
  name: string;
  canPlay: (src: URL, mimeType: string) => boolean;
  create: Player;
}

type BaseMediaControls = ReturnType<typeof useMediaControls>;
export type MediaControls = Reactive<EnhancedMediaControls>;

interface QualityControls {
  qualities: Ref<{ name: string }[]>; // todo need more info ?
  quality: Ref<number>;
}

interface AudioTrackControls {
  audioTracks: Ref<{ name: string }[]>; // todo need more info ?
  audioTrack: Ref<number>;
}

interface EnhancedMediaControls extends BaseMediaControls, Partial<QualityControls>, Partial<AudioTrackControls> {
  togglePlay: () => void;
  toggleMute: () => void;
  loop: Ref<boolean>;
  endBuffer: Ref<number>;
}

// DASH: https://reference.dashif.org/dash.js/v4.4.0/samples/advanced/monitoring.html
interface Metrics { // todo: add more metrics
  bitrate: Ref<number>;
  framerate: Ref<number>;
  resolution: Ref<string>;
}

interface PlayerOptions extends object {
  logger: {
    info: (...a: any[]) => void;
    warn: (...a: any[]) => void;
    error: (...a: any[]) => void;
  };
}

export interface UseLogger {
  (name: string): {
    info: (...a: any[]) => void;
    warn: (...a: any[]) => void;
    error: (...a: any[]) => void;
  };
}


