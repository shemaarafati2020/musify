import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Search, Plus, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import type { Track } from '../../types';

const Container = styled.div`
  padding: 24px 24px 24px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100%;
`;

const Header = styled.div`
  margin-bottom: 32px;

  h1 {
    color: #fff;
    font-size: 32px;
    margin-bottom: 8px;
  }

  p {
    color: #b3b3b3;
    font-size: 16px;
  }
`;

const Form = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PlaylistInfo = styled.div`
  background: #282828;
  padding: 24px;
  border-radius: 8px;

  .form-group {
    margin-bottom: 20px;

    label {
      display: block;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    input,
    textarea {
      width: 100%;
      padding: 12px;
      background: #404040;
      border: 1px solid #535353;
      border-radius: 4px;
      color: #fff;
      font-size: 14px;

      &:focus {
        outline: none;
        border-color: #1db954;
      }

      &::placeholder {
        color: #7c7c7c;
      }
    }

    textarea {
      resize: vertical;
      min-height: 100px;
    }
  }

  .cover-upload {
    width: 100%;
    aspect-ratio: 1;
    background: #404040;
    border: 2px dashed #535353;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: #1db954;
      background: #333;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 6px;
    }

    &.has-image {
      border: none;
    }
  }
`;

const TrackSelection = styled.div`
  background: #282828;
  padding: 24px;
  border-radius: 8px;

  .search-bar {
    position: relative;
    margin-bottom: 20px;

    input {
      width: 100%;
      padding: 12px 40px 12px 16px;
      background: #404040;
      border: 1px solid #535353;
      border-radius: 20px;
      color: #fff;
      font-size: 14px;

      &:focus {
        outline: none;
        border-color: #1db954;
      }

      &::placeholder {
        color: #7c7c7c;
      }
    }

    svg {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #7c7c7c;
    }
  }
`;

const TrackList = styled.div`
  max-height: 400px;
  overflow-y: auto;

  .track-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    &.selected {
      background: rgba(29, 185, 84, 0.1);
    }

    .track-checkbox {
      width: 20px;
      height: 20px;
      border: 2px solid #7c7c7c;
      border-radius: 4px;
      margin-right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;

      &.checked {
        background: #1db954;
        border-color: #1db954;
      }
    }

    .track-cover {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      margin-right: 12px;
    }

    .track-info {
      flex: 1;

      .track-name {
        color: #fff;
        font-size: 14px;
        margin-bottom: 2px;
      }

      .track-artist {
        color: #b3b3b3;
        font-size: 12px;
      }
    }

    .track-duration {
      color: #b3b3b3;
      font-size: 12px;
    }
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 32px;

  .button-group {
    display: flex;
    gap: 12px;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: #1db954;
    color: #fff;
    
    &:hover {
      background: #1ed760;
    }
    
    &:disabled {
      background: #535353;
      cursor: not-allowed;
    }
  `
      : `
    background: transparent;
    color: #fff;
    border: 1px solid #7c7c7c;
    
    &:hover {
      border-color: #fff;
    }
  `}
`;

const SelectedCount = styled.div`
  color: #b3b3b3;
  font-size: 14px;
  padding: 12px 0;
`;

function CreatePlaylistContent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const mockTracks: Track[] = [
    {
      id: '1',
      name: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: 200,
      imageUrl: 'https://picsum.photos/seed/track1/40/40',
    },
    {
      id: '2',
      name: 'Shape of You',
      artist: 'Ed Sheeran',
      album: '÷ (Divide)',
      duration: 233,
      imageUrl: 'https://picsum.photos/seed/track2/40/40',
    },
    {
      id: '3',
      name: 'Someone Like You',
      artist: 'Adele',
      album: '21',
      duration: 285,
      imageUrl: 'https://picsum.photos/seed/track3/40/40',
    },
    {
      id: '4',
      name: 'Starboy',
      artist: 'The Weeknd ft. Daft Punk',
      album: 'Starboy',
      duration: 230,
      imageUrl: 'https://picsum.photos/seed/track4/40/40',
    },
    {
      id: '5',
      name: 'Levitating',
      artist: 'Dua Lipa',
      album: 'Future Nostalgia',
      duration: 203,
      imageUrl: 'https://picsum.photos/seed/track5/40/40',
    },
  ];

  const filteredTracks = mockTracks.filter(
    track =>
      track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTrackToggle = (trackId: string) => {
    setSelectedTracks(prev =>
      prev.includes(trackId)
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  const handleCreatePlaylist = () => {
    if (!playlistName.trim()) {
      alert('Please enter a playlist name');
      return;
    }

    if (selectedTracks.length === 0) {
      alert('Please select at least one track');
      return;
    }

    // Here you would normally save the playlist to your backend
    console.log('Creating playlist:', {
      name: playlistName,
      description,
      tracks: selectedTracks,
      coverImage,
      createdBy: user?.id,
    });

    // Navigate back to library
    navigate('/library');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container>
      <Header>
        <h1>Create Playlist</h1>
        <p>Build your perfect playlist by adding your favorite tracks</p>
      </Header>

      <Form>
        <PlaylistInfo>
          <div className="form-group">
            <label>Playlist Name</label>
            <input
              type="text"
              placeholder="My Awesome Playlist"
              value={playlistName}
              onChange={e => setPlaylistName(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label>Description (optional)</label>
            <textarea
              placeholder="Tell everyone what your playlist is about..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={300}
            />
          </div>

          <div className="form-group">
            <label>Cover Image (optional)</label>
            <div
              className={`cover-upload ${coverImage ? 'has-image' : ''}`}
              onClick={() => document.getElementById('cover-upload')?.click()}
            >
              {coverImage ? (
                <img src={coverImage} alt="Playlist cover" />
              ) : (
                <>
                  <Plus size={32} color="#7c7c7c" />
                  <span style={{ color: '#7c7c7c', marginTop: '8px' }}>
                    Choose image
                  </span>
                </>
              )}
            </div>
            <input
              id="cover-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>
        </PlaylistInfo>

        <TrackSelection>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for songs or artists"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <Search size={20} />
          </div>

          <TrackList>
            {filteredTracks.map(track => (
              <div
                key={track.id}
                className={`track-item ${selectedTracks.includes(track.id) ? 'selected' : ''}`}
                onClick={() => handleTrackToggle(track.id)}
              >
                <div
                  className={`track-checkbox ${selectedTracks.includes(track.id) ? 'checked' : ''}`}
                >
                  {selectedTracks.includes(track.id) && <Check size={14} />}
                </div>
                <img src={track.imageUrl} alt="" className="track-cover" />
                <div className="track-info">
                  <div className="track-name">{track.name}</div>
                  <div className="track-artist">{track.artist}</div>
                </div>
                <div className="track-duration">
                  {Math.floor(track.duration / 60)}:
                  {(track.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>
            ))}
          </TrackList>

          <SelectedCount>
            {selectedTracks.length} track
            {selectedTracks.length !== 1 ? 's' : ''} selected
          </SelectedCount>
        </TrackSelection>
      </Form>

      <Actions>
        <Button $variant="secondary" onClick={() => navigate('/library')}>
          Cancel
        </Button>
        <div className="button-group">
          <Button $variant="primary" onClick={handleCreatePlaylist}>
            Create Playlist
          </Button>
        </div>
      </Actions>
    </Container>
  );
}

export default function CreatePlaylist() {
  return (
    <ProtectedRoute>
      <CreatePlaylistContent />
    </ProtectedRoute>
  );
}
