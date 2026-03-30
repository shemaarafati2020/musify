import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  Play,
  Pause,
  Heart,
  Plus,
  Search,
  ListMusic,
  Disc3,
  X,
} from 'lucide-react';
import { usePlaybackStore } from '../../store/playbackStore';
import { mockTracks, mockPlaylists } from '../../data/mockData';
import type { Track } from '../../types';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  padding: 32px;
  max-width: 1400px;
  animation: ${fadeIn} 0.4s ease;
  overflow-y: auto;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;

  h1 {
    color: #fff;
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 6px 0;
  }
  p {
    color: #9ca3af;
    font-size: 14px;
    margin: 0;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 28px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 4px;
  width: fit-content;
`;

const Tab = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => (props.$active ? '#7c3aed' : 'transparent')};
  color: ${props => (props.$active ? '#fff' : '#9ca3af')};

  &:hover {
    color: #fff;
  }
`;

const SearchBar = styled.div`
  position: relative;
  max-width: 400px;
  margin-bottom: 24px;

  input {
    width: 100%;
    padding: 10px 16px 10px 40px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    color: #fff;
    font-size: 14px;
    outline: none;

    &:focus {
      border-color: #7c3aed;
    }
    &::placeholder {
      color: #6b7280;
    }
  }

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
  }
`;

const TrackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TrackRow = styled.div<{ $active?: boolean }>`
  display: grid;
  grid-template-columns: 40px 1fr 200px 80px 40px;
  gap: 16px;
  padding: 10px 16px;
  border-radius: 8px;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s;
  background: ${props =>
    props.$active ? 'rgba(139, 92, 246, 0.08)' : 'transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.04);

    .play-icon {
      opacity: 1;
    }
    .track-num {
      opacity: 0;
    }
  }
`;

const TrackNum = styled.div<{ $active?: boolean }>`
  text-align: center;
  position: relative;

  .track-num {
    color: ${props => (props.$active ? '#a855f7' : '#6b7280')};
    font-size: 14px;
  }

  .play-icon {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    color: #fff;
  }
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;

  img {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .details {
    min-width: 0;

    .name {
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .artist {
      color: #9ca3af;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const TrackAlbum = styled.span`
  color: #6b7280;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackDuration = styled.span`
  color: #6b7280;
  font-size: 13px;
  text-align: right;
`;

const LikeBtn = styled.button<{ $liked?: boolean }>`
  background: none;
  border: none;
  color: ${props => (props.$liked ? '#a855f7' : '#6b7280')};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    color: #a855f7;
  }
`;

const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
`;

const PlaylistCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: translateY(-2px);

    .play-overlay {
      opacity: 1;
      transform: translateY(0);
    }
  }

  img {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 8px;
    object-fit: cover;
    margin-bottom: 12px;
  }

  .name {
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .desc {
    color: #6b7280;
    font-size: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const PlayOverlay = styled.button`
  position: absolute;
  bottom: 76px;
  right: 24px;
  width: 44px;
  height: 44px;
  background: #7c3aed;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.3s;
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);

  &:hover {
    background: #9333ea;
    transform: translateY(0) scale(1.05);
  }
`;

const CreatePlaylistCard = styled(PlaylistCard)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  border: 2px dashed rgba(139, 92, 246, 0.3);
  background: rgba(139, 92, 246, 0.04);

  &:hover {
    border-color: rgba(139, 92, 246, 0.5);
    background: rgba(139, 92, 246, 0.08);
  }

  .icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(139, 92, 246, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    color: #a78bfa;
  }

  .text {
    color: #a78bfa;
    font-size: 14px;
    font-weight: 600;
  }
`;

const Modal = styled.div<{ $visible: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: ${props => (props.$visible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 32px;
  width: 450px;
  max-width: 90%;
`;

const ModalTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h2 {
    color: #fff;
    font-size: 20px;
    font-weight: 600;
    margin: 0;
  }

  button {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 4px;
    &:hover {
      color: #fff;
    }
  }
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  outline: none;
  margin-bottom: 16px;

  &:focus {
    border-color: #7c3aed;
  }
  &::placeholder {
    color: #6b7280;
  }
`;

const ModalTextarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  outline: none;
  resize: vertical;
  min-height: 80px;
  margin-bottom: 20px;

  &:focus {
    border-color: #7c3aed;
  }
  &::placeholder {
    color: #6b7280;
  }
`;

const ModalButton = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
  }
`;

export default function AdminMusic() {
  const [activeTab, setActiveTab] = useState<'tracks' | 'playlists'>('tracks');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying, addToQueue } =
    usePlaybackStore();

  const filteredTracks = mockTracks.filter(
    t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlayTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedTracks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      console.log('Creating playlist:', newPlaylistName, newPlaylistDesc);
      setShowCreateModal(false);
      setNewPlaylistName('');
      setNewPlaylistDesc('');
    }
  };

  return (
    <Container>
      <Header>
        <div>
          <h1>My Music</h1>
          <p>Listen to your favorite tracks and manage your playlists</p>
        </div>
      </Header>

      <Tabs>
        <Tab
          $active={activeTab === 'tracks'}
          onClick={() => setActiveTab('tracks')}
        >
          <ListMusic size={14} />
          All Tracks
        </Tab>
        <Tab
          $active={activeTab === 'playlists'}
          onClick={() => setActiveTab('playlists')}
        >
          <Disc3 size={14} />
          My Playlists
        </Tab>
      </Tabs>

      {activeTab === 'tracks' && (
        <>
          <SearchBar>
            <Search size={16} />
            <input
              placeholder="Search tracks or artists..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </SearchBar>

          <TrackList>
            {filteredTracks.map((track, i) => (
              <TrackRow
                key={track.id}
                $active={currentTrack?.id === track.id}
                onClick={() => handlePlayTrack(track)}
              >
                <TrackNum $active={currentTrack?.id === track.id}>
                  <span className="track-num">
                    {currentTrack?.id === track.id && isPlaying ? '♫' : i + 1}
                  </span>
                  <div className="play-icon">
                    {currentTrack?.id === track.id && isPlaying ? (
                      <Pause size={14} />
                    ) : (
                      <Play size={14} fill="currentColor" />
                    )}
                  </div>
                </TrackNum>
                <TrackInfo>
                  <img src={track.imageUrl} alt={track.name} />
                  <div className="details">
                    <div className="name">{track.name}</div>
                    <div className="artist">{track.artist}</div>
                  </div>
                </TrackInfo>
                <TrackAlbum>{track.album}</TrackAlbum>
                <TrackDuration>{formatDuration(track.duration)}</TrackDuration>
                <LikeBtn
                  $liked={likedTracks.has(track.id)}
                  onClick={e => toggleLike(track.id, e)}
                >
                  <Heart
                    size={16}
                    fill={likedTracks.has(track.id) ? 'currentColor' : 'none'}
                  />
                </LikeBtn>
              </TrackRow>
            ))}
          </TrackList>
        </>
      )}

      {activeTab === 'playlists' && (
        <PlaylistGrid>
          <CreatePlaylistCard onClick={() => setShowCreateModal(true)}>
            <div className="icon">
              <Plus size={24} />
            </div>
            <span className="text">Create Playlist</span>
          </CreatePlaylistCard>
          {mockPlaylists.map(playlist => (
            <PlaylistCard
              key={playlist.id}
              onClick={() => {
                playlist.tracks.forEach(t => addToQueue(t));
                if (playlist.tracks.length > 0) {
                  setCurrentTrack(playlist.tracks[0]);
                  setIsPlaying(true);
                }
              }}
            >
              <img src={playlist.imageUrl} alt={playlist.name} />
              <div className="name">{playlist.name}</div>
              <div className="desc">{playlist.description}</div>
              <PlayOverlay
                className="play-overlay"
                onClick={e => e.stopPropagation()}
              >
                <Play size={18} fill="currentColor" />
              </PlayOverlay>
            </PlaylistCard>
          ))}
        </PlaylistGrid>
      )}

      <Modal $visible={showCreateModal}>
        <ModalContent>
          <ModalTitle>
            <h2>Create Playlist</h2>
            <button onClick={() => setShowCreateModal(false)}>
              <X size={20} />
            </button>
          </ModalTitle>
          <ModalInput
            placeholder="Playlist name"
            value={newPlaylistName}
            onChange={e => setNewPlaylistName(e.target.value)}
          />
          <ModalTextarea
            placeholder="Add a description (optional)"
            value={newPlaylistDesc}
            onChange={e => setNewPlaylistDesc(e.target.value)}
          />
          <ModalButton onClick={handleCreatePlaylist}>
            Create Playlist
          </ModalButton>
        </ModalContent>
      </Modal>
    </Container>
  );
}
