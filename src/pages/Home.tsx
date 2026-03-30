import { useState } from 'react';
import styled from 'styled-components';
import { Play, Pause, Heart, MoreHorizontal } from 'lucide-react';
import { usePlaybackStore } from '../store/playbackStore';
import type { Track } from '../types';

const HomeContainer = styled.div`
  min-height: 100%;
  background: linear-gradient(to bottom, #1f1f1f, #121212);
  padding: 88px 24px 24px 24px;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
`;

const ShowAllButton = styled.button`
  background: none;
  border: none;
  color: #b3b3b3;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #fff;
    text-decoration: underline;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
`;

const Card = styled.div`
  background-color: #181818;
  border-radius: 8px;
  padding: 16px;
  transition: background-color 0.3s;
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: #282828;

    .play-button {
      opacity: 1;
      transform: translateY(0);
    }

    .card-actions {
      opacity: 1;
    }
  }
`;

const CardImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  margin-bottom: 16px;
  object-fit: cover;
`;

const CardTitle = styled.h3`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const CardSubtitle = styled.p`
  color: #b3b3b3;
  font-size: 12px;
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const PlayButtonOverlay = styled.button`
  position: absolute;
  bottom: 96px;
  right: 16px;
  width: 48px;
  height: 48px;
  background-color: #1db954;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.3s;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(0) scale(1.05);
    background-color: #1ed760;
  }

  &:active {
    transform: translateY(0) scale(0.95);
  }
`;

const CardActions = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  opacity: 0;
  transition: opacity 0.3s;
`;

const ActionButton = styled.button`
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  margin-left: 8px;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.05);
  }
`;

const RecentlyPlayedGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
`;

const RecentlyPlayedCard = styled(Card)`
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 16px;
`;

const RecentlyPlayedImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 4px;
  object-fit: cover;
`;

const mockTracks: Track[] = [
  {
    id: '1',
    name: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    imageUrl: 'https://picsum.photos/300/300?random=1',
  },
  {
    id: '2',
    name: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    duration: 233,
    imageUrl: 'https://picsum.photos/300/300?random=2',
  },
  {
    id: '3',
    name: 'Someone Like You',
    artist: 'Adele',
    album: '21',
    duration: 285,
    imageUrl: 'https://picsum.photos/300/300?random=3',
  },
  {
    id: '4',
    name: 'Starboy',
    artist: 'The Weeknd ft. Daft Punk',
    album: 'Starboy',
    duration: 230,
    imageUrl: 'https://picsum.photos/300/300?random=4',
  },
  {
    id: '5',
    name: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: 203,
    imageUrl: 'https://picsum.photos/300/300?random=5',
  },
  {
    id: '6',
    name: 'Watermelon Sugar',
    artist: 'Harry Styles',
    album: 'Fine Line',
    duration: 174,
    imageUrl: 'https://picsum.photos/300/300?random=6',
  },
];

const mockPlaylists = [
  {
    id: '1',
    name: 'Daily Mix 1',
    description: 'The Weeknd, Dua Lipa, Doja Cat and more',
    imageUrl: 'https://picsum.photos/300/300?random=7',
  },
  {
    id: '2',
    name: 'Chill Hits',
    description: 'Kick back to the best new and recent chill hits',
    imageUrl: 'https://picsum.photos/300/300?random=8',
  },
  {
    id: '3',
    name: 'Focus Flow',
    description: 'Uptempo instrumental beats to help you stay focused',
    imageUrl: 'https://picsum.photos/300/300?random=9',
  },
  {
    id: '4',
    name: 'Workout',
    description: 'Keep the energy high with these workout hits',
    imageUrl: 'https://picsum.photos/300/300?random=10',
  },
  {
    id: '5',
    name: 'Rock Classics',
    description: 'Rock legends & epic songs that continue to inspire',
    imageUrl: 'https://picsum.photos/300/300?random=11',
  },
  {
    id: '6',
    name: 'Jazz Vibes',
    description: 'Smooth jazz for any mood',
    imageUrl: 'https://picsum.photos/300/300?random=12',
  },
];

const Home = () => {
  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying, addToQueue } =
    usePlaybackStore();
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());

  const handlePlayTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleLikeTrack = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  return (
    <HomeContainer>
      <Section>
        <SectionHeader>
          <SectionTitle>Recently played</SectionTitle>
          <ShowAllButton>Show all</ShowAllButton>
        </SectionHeader>
        <RecentlyPlayedGrid>
          {mockPlaylists.map(playlist => (
            <RecentlyPlayedCard key={playlist.id}>
              <RecentlyPlayedImage
                src={playlist.imageUrl}
                alt={playlist.name}
              />
              <div style={{ flex: 1 }}>
                <CardTitle>{playlist.name}</CardTitle>
                <CardSubtitle>{playlist.description}</CardSubtitle>
              </div>
              <PlayButtonOverlay
                className="play-button"
                onClick={() => {
                  mockTracks.slice(0, 6).forEach(track => addToQueue(track));
                }}
              >
                <Play size={20} fill="currentColor" />
              </PlayButtonOverlay>
            </RecentlyPlayedCard>
          ))}
        </RecentlyPlayedGrid>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Made for you</SectionTitle>
          <ShowAllButton>Show all</ShowAllButton>
        </SectionHeader>
        <Grid>
          {mockPlaylists.map(playlist => (
            <Card key={playlist.id}>
              <CardImage src={playlist.imageUrl} alt={playlist.name} />
              <CardTitle>{playlist.name}</CardTitle>
              <CardSubtitle>{playlist.description}</CardSubtitle>
              <PlayButtonOverlay
                className="play-button"
                onClick={() => {
                  mockTracks.slice(0, 6).forEach(track => addToQueue(track));
                }}
              >
                <Play size={20} fill="currentColor" />
              </PlayButtonOverlay>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Popular tracks</SectionTitle>
          <ShowAllButton>Show all</ShowAllButton>
        </SectionHeader>
        <Grid>
          {mockTracks.map(track => (
            <Card key={track.id}>
              <CardImage src={track.imageUrl} alt={track.name} />
              <CardTitle>{track.name}</CardTitle>
              <CardSubtitle>{track.artist}</CardSubtitle>
              <CardActions className="card-actions">
                <ActionButton onClick={e => handleLikeTrack(track.id, e)}>
                  <Heart
                    size={16}
                    fill={likedTracks.has(track.id) ? 'currentColor' : 'none'}
                  />
                </ActionButton>
                <ActionButton>
                  <MoreHorizontal size={16} />
                </ActionButton>
              </CardActions>
              <PlayButtonOverlay
                className="play-button"
                onClick={() => handlePlayTrack(track)}
              >
                {currentTrack?.id === track.id && isPlaying ? (
                  <Pause size={20} fill="currentColor" />
                ) : (
                  <Play size={20} fill="currentColor" />
                )}
              </PlayButtonOverlay>
            </Card>
          ))}
        </Grid>
      </Section>
    </HomeContainer>
  );
};

export default Home;
