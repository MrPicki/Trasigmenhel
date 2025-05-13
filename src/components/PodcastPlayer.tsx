import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Episode {
  title: string;
  audioUrl: string;
  description: string;
  image: string;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const PodcastPlayer = () => {
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchLatestEpisode = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://api.rss2json.com/v1/api.json?rss_url=" + 
          encodeURIComponent("https://anchor.fm/s/3c8f8270/podcast/rss")
        );

        if (!response.ok) throw new Error('Kunde inte hämta podcast-feeden');

        const data = await response.json();
        if (!data.items || !data.items.length) throw new Error('Inga avsnitt hittades');

        const latestEpisode = data.items[0];
        
        // Create a temporary audio element to get the duration
        const tempAudio = new Audio(latestEpisode.enclosure.link);
        tempAudio.preload = "metadata";
        
        await new Promise((resolve) => {
          tempAudio.addEventListener('loadedmetadata', () => {
            setDuration(tempAudio.duration);
            resolve(null);
          }, { once: true });
          
          // Handle if metadata loading fails
          tempAudio.addEventListener('error', () => {
            console.error('Failed to load audio metadata');
            resolve(null);
          }, { once: true });
        });

        setEpisode({
          title: latestEpisode.title,
          audioUrl: latestEpisode.enclosure.link,
          description: latestEpisode.description.replace(/<[^>]*>/g, ''),
          image: latestEpisode.thumbnail || latestEpisode.itunes?.image || '/lovable-uploads/66affaea-122f-4746-a96e-42d56ffbecaa.png'
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ett fel uppstod');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestEpisode();
  }, []);

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
      setError('Kunde inte spela upp ljudet. Kontrollera din internetanslutning.');
      console.error('Playback error:', err);
    }
  };

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Update time display and slider position during playback
    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const setAudioDuration = () => {
      setDuration(audio.duration);
      console.log("Duration set:", audio.duration);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    const handleError = (e: ErrorEvent) => {
      setError('Kunde inte spela upp ljudet. Försök igen senare.');
      console.error('Audio error:', e);
    };

    // Add all event listeners
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', setAudioDuration);
    audio.addEventListener('durationchange', setAudioDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    // Force an initial update
    if (audio.readyState >= 2) {
      setAudioDuration();
      updateTime();
    }

    // Clean up event listeners
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
      audio.removeEventListener('durationchange', setAudioDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Set up a timer to force UI updates during playback
  useEffect(() => {
    let intervalId: number | null = null;
    
    if (isPlaying && audioRef.current) {
      intervalId = window.setInterval(() => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      }, 250); // Update 4 times per second
    }
    
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!audioRef.current) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          audioRef.current.currentTime = Math.max(0, currentTime - 10);
          break;
        case 'ArrowRight':
          audioRef.current.currentTime = Math.min(duration, currentTime + 10);
          break;
        case 'ArrowUp':
          const newVolUp = Math.min(1, volume + 0.1);
          audioRef.current.volume = newVolUp;
          setVolume(newVolUp);
          break;
        case 'ArrowDown':
          const newVolDown = Math.max(0, volume - 0.1);
          audioRef.current.volume = newVolDown;
          setVolume(newVolDown);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentTime, duration, volume, togglePlayPause]);

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
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading || !episode) {
    return (
      <div className="bg-charcoal-300 rounded-lg p-4 space-y-4 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-charcoal-400 rounded-md flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-charcoal-400 rounded w-3/4"></div>
            <div className="h-4 bg-charcoal-400 rounded w-1/2"></div>
          </div>
        </div>
        <div className="h-2 bg-charcoal-400 rounded"></div>
        <div className="flex justify-center">
          <div className="h-12 w-12 bg-charcoal-400 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-charcoal-300 rounded-lg p-3 sm:p-4 shadow-xl border border-charcoal-400 backdrop-blur-sm transition-transform duration-700 ${
        !isPlaying ? 'animate-pulse-scale' : ''
      }`}
    >
      <audio 
        ref={audioRef}
        src={episode.audioUrl}
        preload="metadata"
        onLoadedMetadata={(e) => {
          const audio = e.target as HTMLAudioElement;
          setDuration(audio.duration);
          console.log("Metadata loaded, duration:", audio.duration);
        }}
        onTimeUpdate={(e) => {
          const audio = e.target as HTMLAudioElement;
          setCurrentTime(audio.currentTime);
        }}
      />
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="h-14 w-14 sm:h-16 sm:w-16 bg-charcoal-400 rounded-md flex-shrink-0 overflow-hidden mx-auto sm:mx-0">
          <img 
            src={episode.image}
            alt="Episode thumbnail"
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h3 className="text-base sm:text-lg font-semibold text-white truncate">
            {episode.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 truncate">
            {episode.description}
          </p>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-1 sm:space-y-2">
          <Slider 
            value={[currentTime]}
            max={duration}
            step={0.1}
            disabled={!duration}
            onValueChange={handleSeek}
            className={`w-full ${duration ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center gap-2 sm:gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white text-black hover:bg-gray-200 hover:text-black"
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause size={20} className="sm:size-24" /> : <Play size={20} className="ml-0.5 sm:ml-1 sm:size-24" />}
          </Button>
          
          <div className="flex items-center gap-1 sm:gap-2 flex-1">
            <Volume2 size={14} className="text-gray-400 hidden sm:block sm:size-16" />
            <Slider 
              value={[volume * 100]}
              max={100}
              step={1}
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
