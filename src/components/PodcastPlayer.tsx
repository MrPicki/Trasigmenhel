import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { PodcastEpisode } from '@/hooks/use-podcast-feed';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Reset playback state whenever the selected episode changes.
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
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
      <Alert variant="destructive" className="text-left">
        <AlertDescription>
          Kunde inte hämta senaste avsnittet just nu. Lyssna direkt på{' '}
          <a
            href="https://podcasters.spotify.com/pod/show/trasigmenhel"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-white"
          >
            Spotify
          </a>{' '}
          istället.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading || !episode) {
    return (
      <div className="bg-charcoal-300 rounded-lg p-4 space-y-4 border border-charcoal-400" aria-busy="true" aria-label="Laddar avsnitt">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-charcoal-400 rounded-md flex-shrink-0 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-charcoal-400 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-charcoal-400 rounded w-1/2 animate-pulse" />
          </div>
        </div>
        <div className="h-2 bg-charcoal-400 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-charcoal-300 rounded-lg p-3 sm:p-4 shadow-xl border border-charcoal-400">
      <audio
        ref={audioRef}
        src={episode.audioUrl}
        preload="metadata"
      />

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="h-14 w-14 sm:h-16 sm:w-16 bg-charcoal-400 rounded-md flex-shrink-0 overflow-hidden mx-auto sm:mx-0">
          {episode.image && (
            <img
              src={episode.image}
              alt=""
              className="w-full h-full object-cover rounded-md"
            />
          )}
        </div>
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h3 className="text-base sm:text-lg font-semibold text-white truncate">
            {episode.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 truncate">
            {episode.pubDate}
          </p>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-1 sm:space-y-2">
          <Slider
            value={[currentTime]}
            max={duration || 1}
            step={0.1}
            disabled={!duration}
            onValueChange={handleSeek}
            aria-label="Spolningsläge"
            className={`w-full ${duration ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
          />
          <div className="flex justify-between text-xs text-gray-400 tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center gap-2 sm:gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white text-black hover:bg-gray-200 hover:text-black flex-shrink-0"
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pausa' : 'Spela'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </Button>

          <div className="flex items-center gap-1 sm:gap-2 flex-1">
            {volume === 0 ? (
              <VolumeX size={14} className="text-gray-400 hidden sm:block flex-shrink-0" />
            ) : (
              <Volume2 size={14} className="text-gray-400 hidden sm:block flex-shrink-0" />
            )}
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              aria-label="Volym"
              className="w-16 sm:w-24 cursor-pointer"
              onValueChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastPlayer;
