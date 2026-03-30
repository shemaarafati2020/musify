import { useState } from 'react';
import styled from 'styled-components';
import { Plus, Search, Heart, Play } from 'lucide-react';
import { ProtectedRoute } from '../../components/ProtectedRoute';

const LibraryContainer = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  h1 {
    color: #fff;
    font-size: 32px;
  }
`;

const SearchBar = styled.div`
  position: relative;
  width: 300px;

  input {
    width: 100%;
    padding: 10px 40px 10px 16px;
    background: #282828;
    border: none;
    border-radius: 20px;
    color: #fff;
    font-size: 14px;

    &::placeholder {
      color: #7c7c7c;
    }

    &:focus {
      outline: none;
      background: #333;
    }
  }

  svg {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #7c7c7c;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid #404040;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 12px 0;
  background: none;
  border: none;
  color: ${props => (props.$active ? '#fff' : '#b3b3b3')};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;

  &:hover {
    color: #fff;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: #1db954;
    transform: ${props => (props.$active ? 'scaleX(1)' : 'scaleX(0)')};
    transition: transform 0.2s;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    color: #fff;
    font-size: 24px;
  }
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #1db954;
  border: none;
  border-radius: 20px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #1ed760;
    transform: scale(1.02);
  }
`;

const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const PlaylistCard = styled.div`
  background: #282828;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #333;
    transform: translateY(-2px);
  }

  .playlist-cover {
    width: 100%;
    aspect-ratio: 1;
    background: #404040;
    border-radius: 4px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    color: #7c7c7c;
    position: relative;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .play-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;

      svg {
        width: 48px;
        height: 48px;
        color: #1db954;
      }
    }

    &:hover .play-overlay {
      opacity: 1;
    }
  }

  .playlist-name {
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .playlist-info {
    color: #b3b3b3;
    font-size: 12px;
  }
`;

function UserLibraryContent() {
  const [activeTab, setActiveTab] = useState('playlists');
  const [searchQuery, setSearchQuery] = useState('');

  const mockPlaylists = [
    { id: 1, name: 'Liked Songs', tracks: 234, type: 'system' },
    { id: 2, name: 'My Playlist #1', tracks: 42, type: 'user' },
    { id: 3, name: 'Workout Mix', tracks: 89, type: 'user' },
    { id: 4, name: 'Chill Vibes', tracks: 156, type: 'user' },
    { id: 5, name: 'Road Trip', tracks: 73, type: 'user' },
    { id: 6, name: 'Focus Flow', tracks: 201, type: 'user' },
  ];

  return (
    <LibraryContainer>
      <Header>
        <h1>Your Library</h1>
        <SearchBar>
          <input
            type="text"
            placeholder="Search in your library"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Search size={20} />
        </SearchBar>
      </Header>

      <Tabs>
        <Tab
          $active={activeTab === 'playlists'}
          onClick={() => setActiveTab('playlists')}
        >
          Playlists
        </Tab>
        <Tab
          $active={activeTab === 'artists'}
          onClick={() => setActiveTab('artists')}
        >
          Artists
        </Tab>
        <Tab
          $active={activeTab === 'albums'}
          onClick={() => setActiveTab('albums')}
        >
          Albums
        </Tab>
        <Tab
          $active={activeTab === 'downloads'}
          onClick={() => setActiveTab('downloads')}
        >
          Downloads
        </Tab>
      </Tabs>

      <SectionHeader>
        <h2>Playlists</h2>
        <CreateButton>
          <Plus size={16} />
          Create Playlist
        </CreateButton>
      </SectionHeader>

      <PlaylistGrid>
        {mockPlaylists.map(playlist => (
          <PlaylistCard key={playlist.id}>
            <div className="playlist-cover">
              {playlist.type === 'system' ? (
                <Heart size={48} />
              ) : (
                <img
                  src={`https://picsum.photos/seed/playlist${playlist.id}/180/180`}
                  alt=""
                />
              )}
              <div className="play-overlay">
                <Play size={48} />
              </div>
            </div>
            <div className="playlist-name">{playlist.name}</div>
            <div className="playlist-info">{playlist.tracks} tracks</div>
          </PlaylistCard>
        ))}
      </PlaylistGrid>
    </LibraryContainer>
  );
}

export default function UserLibrary() {
  return (
    <ProtectedRoute>
      <UserLibraryContent />
    </ProtectedRoute>
  );
}
