
import React, { useRef, useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl?: string;
  title?: string;
  description?: string;
  durationText?: string;
}

const AudioPlayer = ({ 
  audioUrl = "https://example.com/podcast.mp3",
  title = "Vårt senaste avsnitt",
  description = "Episode 42 - När allt faller på plats",
  durationText = "00:00"
}: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setAudioDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;
    const newVolume = value[0] / 100;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const skip = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(
      Math.max(currentTime + seconds, 0),
      audioDuration
    );
  };

  return (
    <>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <div className="bg-charcoal-300 rounded-lg p-4 shadow-xl border border-charcoal-400 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 bg-charcoal-400 rounded-md flex-shrink-0"></div>
          <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">{title}</h3>
          <p className="text-sm text-gray-400 truncate">{description}</p>
          </div>
        </div>
        
        <div className="space-y-2 mb-2">
          <Slider 
            value={[currentTime]}
            max={audioDuration || 100}
            step={1}
            className="cursor-pointer"
            onValueChange={handleSeek}
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{durationText}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white"
              onClick={() => skip(-10)}
            >
              <SkipBack size={20} />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-full bg-white text-black hover:bg-gray-200 hover:text-black"
              onClick={togglePlayPause}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white"
              onClick={() => skip(10)}
            >
              <SkipForward size={20} />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-gray-400" />
            <Slider 
              value={[volume * 100]}
              max={100}
              step={1}
              className="w-24 cursor-pointer"
              onValueChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AudioPlayer;
