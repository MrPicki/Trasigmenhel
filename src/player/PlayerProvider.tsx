import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { PodcastEpisode } from '@/hooks/use-podcast-feed';

/**
 * One audio element for the whole site.
 *
 * The old player was a block inside the hero: scroll past it and playback
 * controls were gone. Here a single <audio> lives above the routes, every
 * play control on the page talks to it, and the docked bar at the bottom of
 * the viewport is that one element's face. Nothing renders the bar until a
 * visitor has actually pressed play — the page opens uncluttered.
 */

interface PlayerState {
  episode: PodcastEpisode | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  /** Set when the browser refused or failed the load, so the UI can offer Spotify instead. */
  failed: boolean;
}

interface PlayerApi extends PlayerState {
  /** Play this episode, or pause it if it is the one already playing. */
  toggle: (episode: PodcastEpisode) => void;
  /** Pause whatever is playing. */
  pause: () => void;
  /** Pause and put the player away entirely. */
  dismiss: () => void;
  seek: (seconds: number) => void;
  /** Move `delta` seconds relative to the current position. */
  nudge: (delta: number) => void;
  isCurrent: (episode: PodcastEpisode | null) => boolean;
}

const PlayerContext = createContext<PlayerApi | null>(null);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlayerState>({
    episode: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    failed: false,
  });

  // The element is created once, imperatively, so React never re-mounts it
  // mid-playback and cuts the audio.
  if (typeof Audio !== 'undefined' && !audioRef.current) {
    audioRef.current = new Audio();
    audioRef.current.preload = 'metadata';
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setState((s) => ({ ...s, currentTime: audio.currentTime }));
    const onMeta = () =>
      setState((s) => ({ ...s, duration: Number.isFinite(audio.duration) ? audio.duration : s.duration }));
    const onEnded = () => setState((s) => ({ ...s, isPlaying: false, currentTime: 0 }));
    const onPlay = () => setState((s) => ({ ...s, isPlaying: true, failed: false }));
    const onPause = () => setState((s) => ({ ...s, isPlaying: false }));
    const onError = () => setState((s) => ({ ...s, isPlaying: false, failed: true }));

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('durationchange', onMeta);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('durationchange', onMeta);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audio.pause();
    };
  }, []);

  // Lock screen, notification shade and headset buttons. A podcast is
  // listened to with the phone in a pocket, so the OS controls matter more
  // than the ones on screen.
  useEffect(() => {
    const media = typeof navigator !== 'undefined' ? navigator.mediaSession : undefined;
    if (!media || !state.episode) return;

    media.metadata = new MediaMetadata({
      title: state.episode.title,
      artist: 'Trasig men Hel',
      album: 'Trasig men Hel',
      artwork: [
        { src: state.episode.image || '/lovable-uploads/podcast-cover.jpg', sizes: '512x512', type: 'image/jpeg' },
      ],
    });
    media.playbackState = state.isPlaying ? 'playing' : 'paused';
  }, [state.episode, state.isPlaying]);

  const toggle = useCallback((episode: PodcastEpisode) => {
    const audio = audioRef.current;
    if (!audio || !episode.audioUrl) return;

    const isSame = audio.src === episode.audioUrl;

    if (isSame && !audio.paused) {
      audio.pause();
      return;
    }

    if (!isSame) {
      audio.src = episode.audioUrl;
      audio.currentTime = 0;
      setState((s) => ({
        ...s,
        episode,
        currentTime: 0,
        // The feed knows the length before the file does, so the scrubber has
        // a real scale from the first frame instead of jumping when metadata
        // lands.
        duration: episode.durationSeconds || 0,
        failed: false,
      }));
    }

    // Autoplay can be refused (a browser policy, a dead file). Surface it as
    // a paused player with a way out rather than a button that does nothing.
    audio.play().catch(() => setState((s) => ({ ...s, isPlaying: false, failed: true })));
  }, []);

  const pause = useCallback(() => audioRef.current?.pause(), []);

  const dismiss = useCallback(() => {
    audioRef.current?.pause();
    setState((s) => ({ ...s, episode: null, isPlaying: false, currentTime: 0, duration: 0, failed: false }));
  }, []);

  useEffect(() => {
    const media = typeof navigator !== 'undefined' ? navigator.mediaSession : undefined;
    if (!media || !state.episode) return;

    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ['play', () => audioRef.current?.play().catch(() => undefined)],
      ['pause', () => audioRef.current?.pause()],
      ['seekbackward', () => audioRef.current && (audioRef.current.currentTime -= 15)],
      ['seekforward', () => audioRef.current && (audioRef.current.currentTime += 15)],
    ];

    for (const [action, handler] of handlers) {
      try {
        media.setActionHandler(action, handler);
      } catch {
        // Older browsers reject actions they do not implement; skip them.
      }
    }

    return () => {
      for (const [action] of handlers) {
        try {
          media.setActionHandler(action, null);
        } catch {
          /* same */
        }
      }
    };
  }, [state.episode?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    setState((s) => ({ ...s, currentTime: seconds }));
  }, []);

  const nudge = useCallback((delta: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const max = Number.isFinite(audio.duration) ? audio.duration : Infinity;
    const next = Math.min(Math.max(audio.currentTime + delta, 0), max);
    audio.currentTime = next;
    setState((s) => ({ ...s, currentTime: next }));
  }, []);

  const value = useMemo<PlayerApi>(
    () => ({
      ...state,
      toggle,
      pause,
      dismiss,
      seek,
      nudge,
      isCurrent: (episode) => Boolean(episode && state.episode && episode.id === state.episode.id),
    }),
    [state, toggle, pause, dismiss, seek, nudge]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer måste användas inuti en PlayerProvider');
  return context;
};

export const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};
