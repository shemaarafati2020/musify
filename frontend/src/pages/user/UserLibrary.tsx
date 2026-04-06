import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Search, Heart, Play, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { api } from '../../services/api';

const LibraryContainer = styled.div`
  padding: 24px 24px 24px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100%;
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

interface PlaylistItem {
  id: string;
  name: string;
  tracks: number;
  type: string;
  imageUrl?: string;
}

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

function UserLibraryContent() {
  const [activeTab, setActiveTab] = useState('playlists');
  const [searchQuery, setSearchQuery] = useState('');
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoading(true);
      try {
        const data = await api.get<{ playlists: Array<{ id: string; name: string; _count?: { tracks: number }; imageUrl?: string | null }> }>('/api/playlists?limit=20');
        setPlaylists((data.playlists || []).map(p => ({
          id: p.id,
          name: p.name,
          tracks: p._count?.tracks || 0,
          type: 'user',
          imageUrl: p.imageUrl || undefined,
        })));
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  const filteredPlaylists = playlists.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <CreateButton onClick={() => navigate('/user/create-playlist')}>
          <Plus size={16} />
          Create Playlist
        </CreateButton>
      </SectionHeader>

      {loading ? (
        <LoadingWrap><Loader2 size={32} /></LoadingWrap>
      ) : (
        <PlaylistGrid>
          {filteredPlaylists.map(playlist => (
            <PlaylistCard key={playlist.id}>
              <div className="playlist-cover">
                {playlist.imageUrl ? (
                  <img src={playlist.imageUrl} alt="" />
                ) : (
                  <Heart size={48} />
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
      )}
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
