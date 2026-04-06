import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Play, Pause, Heart, MoreHorizontal, Loader2 } from 'lucide-react';
import { usePlaybackStore } from '../store/playbackStore';
import { api } from '../services/api';
import type { Track } from '../types';

const HomeContainer = styled.div`
  min-height: 100%;
  background: linear-gradient(to bottom, #1f1f1f, #121212);
  padding: 24px 24px 24px 24px;
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

const LoadingWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #b3b3b3;

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

interface ApiTrack {
  id: string;
  title: string;
  duration: number;
  imageUrl?: string | null;
  audioUrl?: string | null;
  artist?: { name: string } | null;
  album?: { title: string; imageUrl?: string | null } | null;
}

interface ApiPlaylist {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
}

function mapTrack(t: ApiTrack): Track {
  return {
    id: t.id,
    name: t.title,
    artist: t.artist?.name || 'Unknown Artist',
    album: t.album?.title || 'Unknown Album',
    duration: t.duration,
    imageUrl: t.imageUrl || t.album?.imageUrl || `https://picsum.photos/300/300?random=${t.id}`,
    audioUrl: t.audioUrl || undefined,
  };
}

const Home = () => {
  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying, addToQueue } =
    usePlaybackStore();
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<ApiPlaylist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tracksRes, playlistsRes] = await Promise.allSettled([
          api.get<{ tracks: ApiTrack[] }>('/api/tracks?limit=12'),
          api.get<{ playlists: ApiPlaylist[] }>('/api/playlists?limit=6'),
        ]);

        if (tracksRes.status === 'fulfilled' && tracksRes.value.tracks) {
          setTracks(tracksRes.value.tracks.map(mapTrack));
        }
        if (playlistsRes.status === 'fulfilled' && playlistsRes.value.playlists) {
          setPlaylists(playlistsRes.value.playlists);
        }
      } catch {
        // Silently fail — UI shows empty state
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
    api.post(`/api/tracks/${trackId}/like`).catch(() => {});
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

  if (loading) {
    return (
      <HomeContainer>
        <LoadingWrap><Loader2 size={32} /></LoadingWrap>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      {playlists.length > 0 && (
        <Section>
          <SectionHeader>
            <SectionTitle>Recently played</SectionTitle>
            <ShowAllButton>Show all</ShowAllButton>
          </SectionHeader>
          <RecentlyPlayedGrid>
            {playlists.map(playlist => (
              <RecentlyPlayedCard key={playlist.id}>
                <RecentlyPlayedImage
                  src={playlist.imageUrl || `https://picsum.photos/300/300?random=${playlist.id}`}
                  alt={playlist.name}
                />
                <div style={{ flex: 1 }}>
                  <CardTitle>{playlist.name}</CardTitle>
                  <CardSubtitle>{playlist.description}</CardSubtitle>
                </div>
                <PlayButtonOverlay
                  className="play-button"
                  onClick={() => {
                    tracks.slice(0, 6).forEach(track => addToQueue(track));
                  }}
                >
                  <Play size={20} fill="currentColor" />
                </PlayButtonOverlay>
              </RecentlyPlayedCard>
            ))}
          </RecentlyPlayedGrid>
        </Section>
      )}

      {playlists.length > 0 && (
        <Section>
          <SectionHeader>
            <SectionTitle>Made for you</SectionTitle>
            <ShowAllButton>Show all</ShowAllButton>
          </SectionHeader>
          <Grid>
            {playlists.map(playlist => (
              <Card key={playlist.id}>
                <CardImage src={playlist.imageUrl || `https://picsum.photos/300/300?random=m${playlist.id}`} alt={playlist.name} />
                <CardTitle>{playlist.name}</CardTitle>
                <CardSubtitle>{playlist.description}</CardSubtitle>
                <PlayButtonOverlay
                  className="play-button"
                  onClick={() => {
                    tracks.slice(0, 6).forEach(track => addToQueue(track));
                  }}
                >
                  <Play size={20} fill="currentColor" />
                </PlayButtonOverlay>
              </Card>
            ))}
          </Grid>
        </Section>
      )}

      <Section>
        <SectionHeader>
          <SectionTitle>Popular tracks</SectionTitle>
          <ShowAllButton>Show all</ShowAllButton>
        </SectionHeader>
        <Grid>
          {tracks.map(track => (
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
