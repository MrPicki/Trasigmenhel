
import React, { useState } from 'react';
import EpisodeCard from './EpisodeCard';
import { ListMusic } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Episode {
  id: number;
  title: string;
  description: string;
  duration: string;
  date: string;
  audioUrl: string;
}

const episodes: Episode[] = [
  {
    id: 1,
    title: "Att hitta styrka i sårbarheten",
    description: "I detta avsnitt pratar vi om hur våra svagaste ögonblick kan bli vår största källa till styrka.",
    duration: "42:18",
    date: "14 maj 2023",
    audioUrl: "https://example.com/episode1.mp3"
  },
  {
    id: 2,
    title: "När maskerna faller",
    description: "Har du också känt att du går runt med en mask? Vi diskuterar autenticitet och hur vi kan våga vara äkta.",
    duration: "38:45",
    date: "7 maj 2023",
    audioUrl: "https://example.com/episode2.mp3"
  },
  {
    id: 3,
    title: "De osynliga ärren",
    description: "Alla bär på ärr som inte syns utanpå. I detta avsnitt delar vi berättelser om inre styrka och läkning.",
    duration: "45:22",
    date: "30 april 2023",
    audioUrl: "https://example.com/episode3.mp3"
  },
  {
    id: 4,
    title: "Att bygga från grunden",
    description: "När allt rasat samman - hur börjar man om? Ett samtal om att återuppbygga sitt liv efter kriser.",
    duration: "52:14",
    date: "23 april 2023",
    audioUrl: "https://example.com/episode4.mp3"
  }
];

const PopularEpisodes = () => {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const { toast } = useToast();

  const handlePlay = (episode: Episode) => {
    setCurrentEpisode(episode);
    toast({
      title: `Nu spelar: ${episode.title}`,
      description: "Laddar in avsnittet...",
    });
  };

  return (
    <section className="w-full bg-charcoal-200 py-10 sm:py-16">
      <div className="container px-4 sm:px-6">
        <div className="flex items-center justify-center mb-8 sm:mb-12">
          <ListMusic className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 mr-2" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
            Mest lyssnade
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {episodes.map((episode) => (
            <EpisodeCard 
              key={episode.id}
              title={episode.title}
              description={episode.description}
              duration={episode.duration}
              date={episode.date}
              onPlay={() => handlePlay(episode)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularEpisodes;
