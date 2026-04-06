import { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Play,
  Pause,
  Download,
  MoreHorizontal,
  Grid3x3,
  List,
  Loader2,
} from 'lucide-react';
import { usePlaybackStore } from '../store/playbackStore';
import { api } from '../services/api';
import type { Playlist } from '../types';

const LibraryContainer = styled.div`
  min-height: 100%;
  background: #121212;
  padding: 24px 24px 24px 24px;
`;

const LibraryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const LibraryTitle = styled.h1`
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const ViewToggle = styled.div`
  display: flex;
  background-color: #282828;
  border-radius: 500px;
  padding: 4px;
`;

const ViewButton = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  border-radius: 500px;
  padding: 8px;
  color: ${props => (props.$active ? '#000' : '#b3b3b3')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${props => (props.$active ? '#000' : '#fff')};
  }

  ${props =>
    props.$active &&
    `
    background-color: #fff;
  `}
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: #fff;
    background-color: #282828;
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const FilterTab = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  color: ${props => (props.$active ? '#000' : '#b3b3b3')};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${props => (props.$active ? '#000' : '#fff')};
  }

  ${props =>
    props.$active &&
    `
    background-color: #fff;
  `}
`;

const GridView = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
`;

const ListView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PlaylistCard = styled.div`
  background-color: #181818;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
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

const PlaylistImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  margin-bottom: 16px;
  object-fit: cover;
  background-color: #282828;
`;

const PlaylistTitle = styled.h3`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const PlaylistType = styled.p`
  color: #b3b3b3;
  font-size: 12px;
  margin: 0;
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
`;

const CardActions = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  opacity: 0;
  transition: opacity 0.3s;
`;

const ListRow = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 100px 40px;
  gap: 16px;
  padding: 8px;
  border-radius: 4px;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #282828;

    .list-play {
      display: flex;
    }
  }
`;

const ListImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 4px;
  object-fit: cover;
  background-color: #282828;
`;

const ListInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListTitle = styled.div`
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 4px;
`;

const ListSubtitle = styled.div`
  color: #b3b3b3;
  font-size: 12px;
`;

const ListType = styled.div`
  color: #b3b3b3;
  font-size: 14px;
`;

const ListPlay = styled.button`
  display: none;
  background: none;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #fff;
  }
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

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: rgba(255,255,255,0.4);
  font-size: 15px;
`;

interface ApiPlaylist {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  isPublic?: boolean;
  user?: { username: string } | null;
  _count?: { tracks: number } | null;
}

function mapPlaylist(p: ApiPlaylist): Playlist {
  return {
    id: p.id,
    name: p.name,
    description: p.description || `${p._count?.tracks || 0} songs`,
    tracks: [],
    imageUrl: p.imageUrl || `https://picsum.photos/300/300?random=p${p.id}`,
    owner: p.user?.username || 'You',
  };
}

const filters = ['Playlists', 'Podcasts', 'Albums', 'Artists', 'Downloaded'];

const Library = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState('Playlists');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const { isPlaying, setIsPlaying } = usePlaybackStore();

  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoading(true);
      try {
        const data = await api.get<{ playlists: ApiPlaylist[] }>('/api/playlists?limit=20');
        if (data.playlists) {
          setPlaylists(data.playlists.map(mapPlaylist));
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  const handlePlayPlaylist = (playlistId: string) => {
    console.log('Play playlist:', playlistId);
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return (
      <LibraryContainer>
        <LoadingWrap><Loader2 size={32} /></LoadingWrap>
      </LibraryContainer>
    );
  }

  return (
    <LibraryContainer>
      <LibraryHeader>
        <LibraryTitle>Your Library</LibraryTitle>
        <HeaderActions>
          <ViewToggle>
            <ViewButton
              onClick={() => setViewMode('grid')}
              $active={viewMode === 'grid'}
            >
              <Grid3x3 size={16} />
            </ViewButton>
            <ViewButton
              onClick={() => setViewMode('list')}
              $active={viewMode === 'list'}
            >
              <List size={16} />
            </ViewButton>
          </ViewToggle>
          <ActionButton>
            <MoreHorizontal size={20} />
          </ActionButton>
        </HeaderActions>
      </LibraryHeader>

      <FilterTabs>
        {filters.map(filter => (
          <FilterTab
            key={filter}
            onClick={() => setActiveFilter(filter)}
            $active={activeFilter === filter}
          >
            {filter}
          </FilterTab>
        ))}
      </FilterTabs>

      {playlists.length === 0 ? (
        <EmptyState>No playlists yet. Create your first playlist!</EmptyState>
      ) : viewMode === 'grid' ? (
        <GridView>
          {playlists.map(playlist => (
            <PlaylistCard key={playlist.id}>
              <PlaylistImage src={playlist.imageUrl} alt={playlist.name} />
              <PlaylistTitle>{playlist.name}</PlaylistTitle>
              <PlaylistType>{playlist.description}</PlaylistType>
              <CardActions className="card-actions">
                <ActionButton>
                  <Download size={16} />
                </ActionButton>
                <ActionButton>
                  <MoreHorizontal size={16} />
                </ActionButton>
              </CardActions>
              <PlayButtonOverlay
                className="play-button"
                onClick={() => handlePlayPlaylist(playlist.id)}
              >
                {isPlaying ? (
                  <Pause size={20} fill="currentColor" />
                ) : (
                  <Play size={20} fill="currentColor" />
                )}
              </PlayButtonOverlay>
            </PlaylistCard>
          ))}
        </GridView>
      ) : (
        <ListView>
          {playlists.map(playlist => (
            <ListRow
              key={playlist.id}
              onClick={() => handlePlayPlaylist(playlist.id)}
            >
              <ListImage src={playlist.imageUrl} alt={playlist.name} />
              <ListInfo>
                <ListTitle>{playlist.name}</ListTitle>
                <ListSubtitle>{playlist.description}</ListSubtitle>
              </ListInfo>
              <ListType>{playlist.owner}</ListType>
              <ListPlay className="list-play">
                {isPlaying ? (
                  <Pause size={16} fill="currentColor" />
                ) : (
                  <Play size={16} fill="currentColor" />
                )}
              </ListPlay>
            </ListRow>
          ))}
        </ListView>
      )}
    </LibraryContainer>
  );
};

export default Library;
