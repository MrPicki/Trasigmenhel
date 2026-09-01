import React, { useState, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import type { PodcastEpisode } from '@/hooks/use-podcast-feed';

const SPOTIFY_URL = 'https://podcasters.spotify.com/pod/show/trasigmenhel';

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

interface PodcastPlayerProps {
  episode: PodcastEpisode | null;
  isLoading: boolean;
  error: string | null;
}

const PodcastPlayer = ({ episode, isLoading, error }: PodcastPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setImageFailed(false);
    setDuration(episode?.durationSeconds || 0);
  }, [episode?.id]);

  const togglePlayPause = async () => {
    if (!audioRef.current) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (err) {
      console.error('Playback error:', err);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', setAudioDuration);
    audio.addEventListener('durationchange', setAudioDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
      audio.removeEventListener('durationchange', setAudioDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [episode?.id]);

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;
    const newVolume = value[0] / 100;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  if (error) {
    return (
      <div className="border-t border-charcoal-400 pt-5 text-sm text-bone-400">
        Avsnittet gick inte att hämta just nu. Lyssna direkt på{' '}
        <a
          href={SPOTIFY_URL}
          target="_blank"
          rel="noreferrer"
          className="text-bone-200 underline underline-offset-4 hover:no-underline"
        >
          Spotify
        </a>
        .
      </div>
    );
  }

  if (isLoading || !episode) {
    return (
      <div className="border-t border-charcoal-400 pt-6" aria-busy="true" aria-label="Hämtar senaste avsnittet">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded bg-charcoal-300 animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-2.5">
            <div className="h-4 w-3/5 rounded bg-charcoal-300 animate-pulse" />
            <div className="h-3 w-2/5 rounded bg-charcoal-400 animate-pulse" />
          </div>
        </div>
        <div className="mt-6 h-px w-full bg-charcoal-400 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="border-t border-charcoal-400 pt-6">
      <audio ref={audioRef} src={episode.audioUrl} preload="metadata" />

      <div className="flex items-start gap-4">
        {episode.image && !imageFailed && (
          <img
            src={episode.image}
            alt=""
            onError={() => setImageFailed(true)}
            className="h-14 w-14 sm:h-16 sm:w-16 rounded object-cover flex-shrink-0 bg-charcoal-300"
          />
        )}
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl sm:text-2xl leading-snug text-bone-200">
            {episode.title}
          </h2>
          <p className="mt-1 text-sm text-bone-600 tabular-nums">
            {episode.pubDate}
            {duration ? ` · ${Math.round(duration / 60)} min` : ''}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pausa avsnittet' : 'Spela avsnittet'}
          className="row-hover flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-bone-200 text-charcoal-100 hover:bg-bone-100 active:scale-[0.97]"
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
        </button>

        <div className="min-w-0 flex-1">
          <Slider
            value={[currentTime]}
            max={duration || 1}
            step={0.1}
            disabled={!duration}
            onValueChange={handleSeek}
            aria-label="Spola i avsnittet"
            className={`w-full ${duration ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}`}
          />
          <div className="mt-2 flex justify-between text-xs text-bone-600 tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 w-28 flex-shrink-0">
          <button
            type="button"
            onClick={() => handleVolumeChange([volume === 0 ? 100 : 0])}
            aria-label={volume === 0 ? 'Slå på ljudet' : 'Stäng av ljudet'}
            className="row-hover text-bone-600 hover:text-bone-200"
          >
            {volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            aria-label="Volym"
            className="flex-1 cursor-pointer"
            onValueChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PodcastPlayer;
