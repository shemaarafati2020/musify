import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Play, Pause, Heart, Clock, MoreHorizontal } from 'lucide-react';
import { usePlaybackStore } from '../../store/playbackStore';
import type { Track } from '../../types';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  min-height: 100%;
  animation: ${fadeIn} 0.4s ease;
`;

const Banner = styled.div`
  background: linear-gradient(135deg, #4a235a 0%, #1a1a2e 100%);
  padding: 88px 32px 32px;
  display: flex;
  align-items: flex-end;
  gap: 28px;
`;

const BannerImage = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 4px;
  background: linear-gradient(135deg, #450af5, #c49bf3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
`;

const BannerInfo = styled.div`
  flex: 1;

  .label {
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 12px;
  }

  h1 {
    color: #fff;
    font-size: 72px;
    font-weight: 900;
    margin: 0 0 16px 0;
    line-height: 1;
  }

  .meta {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
  }
`;

const Controls = styled.div`
  background: linear-gradient(to bottom, #1a1a2e, #121212);
  padding: 24px 32px;
  display: flex;
  align-items: center;
  gap: 24px;
`;

const PlayButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #1db954;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.06);
    background: #1ed760;
  }
`;

const TrackListContainer = styled.div`
  padding: 0 32px 32px;
`;

const TrackListHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 200px 80px 40px;
  gap: 16px;
  padding: 8px 16px;
  color: #b3b3b3;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 8px;
`;

const TrackRow = styled.div<{ $isPlaying?: boolean }>`
  display: grid;
  grid-template-columns: 40px 1fr 200px 80px 40px;
  gap: 16px;
  padding: 10px 16px;
  border-radius: 6px;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s;
  background: ${props => props.$isPlaying ? 'rgba(29, 185, 84, 0.08)' : 'transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.06);

    .track-index {
      display: none;
    }
    .track-play-btn {
      display: flex !important;
    }
  }
`;

const TrackIndex = styled.span`
  color: ${props => (props.color === 'green' ? '#1db954' : '#b3b3b3')};
  font-size: 14px;
  text-align: center;
`;

const TrackPlayBtn = styled.button`
  display: none;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0;
  align-items: center;
  justify-content: center;
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
`;

const TrackImage = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
`;

const TrackDetails = styled.div`
  min-width: 0;

  .track-name {
    color: #fff;
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .track-artist {
    color: #b3b3b3;
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
      text-decoration: underline;
      color: #fff;
    }
  }
`;

const TrackAlbum = styled.div`
  color: #b3b3b3;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
    color: #fff;
  }
`;

const TrackDuration = styled.div`
  color: #b3b3b3;
  font-size: 14px;
  text-align: right;
`;

const LikeButton = styled.button<{ $liked: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => (props.$liked ? '#1db954' : '#b3b3b3')};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s, transform 0.2s;
  opacity: ${props => (props.$liked ? 1 : 0)};

  tr:hover & {
    opacity: 1;
  }
  
  &:hover {
    color: ${props => (props.$liked ? '#1ed760' : '#fff')};
    transform: scale(1.1);
  }
`;

const likedTracksData: Track[] = [
  {
    id: '1',
    name: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    imageUrl: 'https://picsum.photos/seed/blindinglights/44/44',
  },
  {
    id: '2',
    name: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    duration: 233,
    imageUrl: 'https://picsum.photos/seed/shapeofyou/44/44',
  },
  {
    id: '3',
    name: 'Someone Like You',
    artist: 'Adele',
    album: '21',
    duration: 285,
    imageUrl: 'https://picsum.photos/seed/someonelikeyou/44/44',
  },
  {
    id: '4',
    name: 'Starboy',
    artist: 'The Weeknd ft. Daft Punk',
    album: 'Starboy',
    duration: 230,
    imageUrl: 'https://picsum.photos/seed/starboy/44/44',
  },
  {
    id: '5',
    name: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: 203,
    imageUrl: 'https://picsum.photos/seed/levitating/44/44',
  },
  {
    id: '6',
    name: 'Watermelon Sugar',
    artist: 'Harry Styles',
    album: 'Fine Line',
    duration: 174,
    imageUrl: 'https://picsum.photos/seed/watermelonsugar/44/44',
  },
  {
    id: '7',
    name: 'Peaches',
    artist: 'Justin Bieber ft. Daniel Caesar, Giveon',
    album: 'Justice',
    duration: 198,
    imageUrl: 'https://picsum.photos/seed/peaches/44/44',
  },
  {
    id: '8',
    name: 'Stay',
    artist: 'The Kid LAROI & Justin Bieber',
    album: 'F*CK LOVE 3',
    duration: 141,
    imageUrl: 'https://picsum.photos/seed/staysong/44/44',
  },
  {
    id: '9',
    name: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    duration: 178,
    imageUrl: 'https://picsum.photos/seed/good4u/44/44',
  },
  {
    id: '10',
    name: 'Industry Baby',
    artist: 'Lil Nas X & Jack Harlow',
    album: 'MONTERO',
    duration: 212,
    imageUrl: 'https://picsum.photos/seed/industrybaby/44/44',
  },
];

const formatDuration = (secs: number) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export default function LikedSongs() {
  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying, addToQueue } =
    usePlaybackStore();
  const [likedTracks, setLikedTracks] = useState<Set<string>>(
    new Set(likedTracksData.map(t => t.id))
  );

  const handlePlay = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handlePlayAll = () => {
    likedTracksData.forEach(t => addToQueue(t));
    setIsPlaying(true);
  };

  const toggleLike = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedTracks(prev => {
      const next = new Set(prev);
      if (next.has(trackId)) next.delete(trackId);
      else next.add(trackId);
      return next;
    });
  };

  const isCurrentlyPlaying = (track: Track) =>
    currentTrack?.id === track.id && isPlaying;

  return (
    <Container>
      <Banner>
        <BannerImage>
          <Heart size={80} fill="white" color="white" />
        </BannerImage>
        <BannerInfo>
          <div className="label">Playlist</div>
          <h1>Liked Songs</h1>
          <div className="meta">
            <strong>You</strong> • {likedTracksData.length} songs
          </div>
        </BannerInfo>
      </Banner>

      <Controls>
        <PlayButton onClick={handlePlayAll}>
          {isPlaying && likedTracksData.some(t => t.id === currentTrack?.id) ? (
            <Pause size={24} fill="currentColor" />
          ) : (
            <Play size={24} fill="currentColor" />
          )}
        </PlayButton>
        <MoreHorizontal size={24} color="#b3b3b3" style={{ cursor: 'pointer' }} />
      </Controls>

      <TrackListContainer>
        <TrackListHeader>
          <span style={{ textAlign: 'center' }}>#</span>
          <span>Title</span>
          <span>Album</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={14} />
          </span>
          <span></span>
        </TrackListHeader>

        {likedTracksData.map((track, index) => (
          <TrackRow
            key={track.id}
            onClick={() => handlePlay(track)}
            $isPlaying={isCurrentlyPlaying(track)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrackIndex
                className="track-index"
                color={isCurrentlyPlaying(track) ? 'green' : undefined}
              >
                {isCurrentlyPlaying(track) ? '▶' : index + 1}
              </TrackIndex>
              <TrackPlayBtn className="track-play-btn">
                {isCurrentlyPlaying(track) ? (
                  <Pause size={16} fill="currentColor" />
                ) : (
                  <Play size={16} fill="currentColor" />
                )}
              </TrackPlayBtn>
            </div>
            <TrackInfo>
              <TrackImage src={track.imageUrl} alt={track.name} />
              <TrackDetails>
                <div
                  className="track-name"
                  style={{ color: isCurrentlyPlaying(track) ? '#1db954' : '#fff' }}
                >
                  {track.name}
                </div>
                <div className="track-artist">{track.artist}</div>
              </TrackDetails>
            </TrackInfo>
            <TrackAlbum>{track.album}</TrackAlbum>
            <TrackDuration>{formatDuration(track.duration)}</TrackDuration>
            <LikeButton
              $liked={likedTracks.has(track.id)}
              onClick={e => toggleLike(track.id, e)}
            >
              <Heart
                size={16}
                fill={likedTracks.has(track.id) ? 'currentColor' : 'none'}
              />
            </LikeButton>
          </TrackRow>
        ))}
      </TrackListContainer>
    </Container>
  );
}
