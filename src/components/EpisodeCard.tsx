import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Headphones } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface EpisodeCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  duration: string;
  date: string;
  isActive?: boolean;
  onPlay?: () => void;
}

const EpisodeCard = ({
  title,
  description,
  imageUrl,
  duration,
  date,
  isActive = false,
  onPlay
}: EpisodeCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Card
      className={`bg-charcoal-300 overflow-hidden transition-colors duration-300 group ${
        isActive ? 'border-white' : 'border-charcoal-400 hover:border-gray-500'
      }`}
    >
      <div className="aspect-[4/3] bg-charcoal-400 relative overflow-hidden">
        {imageUrl ? (
          <>
            {!isImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Skeleton className="w-full h-full" />
              </div>
            )}
            <img
              src={imageUrl}
              alt=""
              loading="lazy"
              onLoad={() => setIsImageLoaded(true)}
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <Headphones className="w-8 h-8 sm:w-12 sm:h-12 opacity-50" />
          </div>
        )}
        {duration && (
          <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black/70 text-[10px] sm:text-xs text-white py-0.5 sm:py-1 px-1.5 sm:px-2 rounded-full">
            {duration}
          </div>
        )}
      </div>
      <CardContent className="p-3 sm:p-4">
        <div className="text-[10px] sm:text-xs text-gray-400 mb-1 sm:mb-2">{date}</div>
        <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 line-clamp-2 group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 line-clamp-2">{description}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={onPlay}
          className="w-full h-8 sm:h-9 text-xs sm:text-sm border-gray-600 hover:bg-white hover:text-charcoal-100 flex gap-1 sm:gap-2 items-center justify-center group-hover:border-white transition-colors"
        >
          {isActive ? (
            <>
              <Pause size={14} /> Spelas nu
            </>
          ) : (
            <>
              <Play size={14} /> Lyssna nu
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EpisodeCard;
