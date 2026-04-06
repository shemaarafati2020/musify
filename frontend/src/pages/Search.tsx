import { useState } from 'react';
import styled from 'styled-components';
import { Search as SearchIcon, Play, Pause } from 'lucide-react';
import { usePlaybackStore } from '../store/playbackStore';
import type { Track, Album, Artist } from '../types';

const SearchContainer = styled.div`
  min-height: 100%;
  background: #121212;
  padding: 24px 24px 24px 24px;
`;

const SearchHeader = styled.div`
  margin-bottom: 32px;
`;

const SearchTitle = styled.h1`
  color: #fff;
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 24px 0;
`;

const SearchInputContainer = styled.div`
  position: relative;
  max-width: 600px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 48px 14px 48px;
  border: none;
  border-radius: 500px;
  background-color: #fff;
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: #969696;
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #969696;
`;

const SearchResults = styled.div`
  display: none;

  &.visible {
    display: block;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const CategoryCard = styled.div`
  background-color: #282828;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &:hover {
    background-color: #3e3e3e;
  }
`;

const CategoryIcon = styled.div<{ $color: string }>`
  width: 56px;
  height: 56px;
  background-color: ${props => props.$color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const CategoryName = styled.span`
  color: #fff;
  font-size: 14px;
  font-weight: 700;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 24px 0;
`;

const TrackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TrackRow = styled.div`
  display: grid;
  grid-template-columns: 16px 1fr 200px 100px;
  gap: 16px;
  padding: 12px;
  border-radius: 4px;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #282828;

    .track-index {
      display: none;
    }

    .track-play {
      display: flex;
    }
  }
`;

const TrackIndex = styled.span`
  color: #b3b3b3;
  font-size: 14px;
  text-align: center;
`;

const TrackPlay = styled.button`
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

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TrackImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
`;

const TrackDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const TrackName = styled.div`
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 4px;
`;

const TrackArtist = styled.div`
  color: #b3b3b3;
  font-size: 12px;
`;

const TrackAlbum = styled.div`
  color: #b3b3b3;
  font-size: 14px;
`;

const TrackDuration = styled.div`
  color: #b3b3b3;
  font-size: 14px;
  text-align: right;
`;

const AlbumGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
`;

const AlbumCard = styled.div`
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
  }
`;

const AlbumImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  margin-bottom: 16px;
  object-fit: cover;
`;

const AlbumTitle = styled.h3`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px 0;
`;

const AlbumArtist = styled.p`
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

const ArtistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
`;

const ArtistCard = styled.div`
  text-align: center;
  cursor: pointer;

  &:hover .artist-image {
    filter: brightness(0.9);
  }
`;

const ArtistImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
  transition: filter 0.3s;
`;

const ArtistName = styled.h3`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
`;

const ArtistType = styled.p`
  color: #b3b3b3;
  font-size: 12px;
  margin: 4px 0 0 0;
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
];

const mockAlbums: Album[] = [
  {
    id: '1',
    name: 'After Hours',
    artist: 'The Weeknd',
    imageUrl: 'https://picsum.photos/300/300?random=13',
    releaseDate: '2020',
    tracks: [],
  },
  {
    id: '2',
    name: '÷ (Divide)',
    artist: 'Ed Sheeran',
    imageUrl: 'https://picsum.photos/300/300?random=14',
    releaseDate: '2017',
    tracks: [],
  },
  {
    id: '3',
    name: '21',
    artist: 'Adele',
    imageUrl: 'https://picsum.photos/300/300?random=15',
    releaseDate: '2011',
    tracks: [],
  },
  {
    id: '4',
    name: 'Starboy',
    artist: 'The Weeknd',
    imageUrl: 'https://picsum.photos/300/300?random=16',
    releaseDate: '2016',
    tracks: [],
  },
];

const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'The Weeknd',
    imageUrl: 'https://picsum.photos/300/300?random=17',
    followers: 75432123,
  },
  {
    id: '2',
    name: 'Ed Sheeran',
    imageUrl: 'https://picsum.photos/300/300?random=18',
    followers: 83210987,
  },
  {
    id: '3',
    name: 'Adele',
    imageUrl: 'https://picsum.photos/300/300?random=19',
    followers: 65432109,
  },
  {
    id: '4',
    name: 'Dua Lipa',
    imageUrl: 'https://picsum.photos/300/300?random=20',
    followers: 70234567,
  },
];

const categories = [
  { name: 'Podcasts', icon: '🎙️', color: '#00D632' },
  { name: 'Live Events', icon: '🎫', color: '#FF0000' },
  { name: 'Made For You', icon: '💎', color: '#1DB954' },
  { name: 'New Releases', icon: '✨', color: '#FF00FF' },
  { name: 'Hip-Hop', icon: '🎤', color: '#BA55D3' },
  { name: 'Pop', icon: '🎵', color: '#FF69B4' },
  { name: 'Rock', icon: '🎸', color: '#FF4500' },
  { name: 'Dance/Electronic', icon: '🎹', color: '#00CED1' },
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying } =
    usePlaybackStore();

  const showResults = searchQuery.trim().length > 0;

  const handlePlayTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SearchContainer>
      <SearchHeader>
        <SearchTitle>Search</SearchTitle>
        <SearchInputContainer>
          <SearchIconWrapper>
            <SearchIcon size={20} />
          </SearchIconWrapper>
          <SearchInput
            type="text"
            placeholder="What do you want to listen to?"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </SearchInputContainer>
      </SearchHeader>

      {!showResults && (
        <CategoryGrid>
          {categories.map((category, index) => (
            <CategoryCard key={index}>
              <CategoryIcon $color={category.color}>
                <span style={{ fontSize: '24px' }}>{category.icon}</span>
              </CategoryIcon>
              <CategoryName>{category.name}</CategoryName>
            </CategoryCard>
          ))}
        </CategoryGrid>
      )}

      <SearchResults className={showResults ? 'visible' : ''}>
        <Section>
          <SectionTitle>Top results</SectionTitle>
          <TrackList>
            {mockTracks.map((track, index) => (
              <TrackRow key={track.id} onClick={() => handlePlayTrack(track)}>
                <TrackIndex className="track-index">{index + 1}</TrackIndex>
                <TrackPlay className="track-play">
                  {currentTrack?.id === track.id && isPlaying ? (
                    <Pause size={16} fill="currentColor" />
                  ) : (
                    <Play size={16} fill="currentColor" />
                  )}
                </TrackPlay>
                <TrackInfo>
                  <TrackImage src={track.imageUrl} alt={track.name} />
                  <TrackDetails>
                    <TrackName>{track.name}</TrackName>
                    <TrackArtist>{track.artist}</TrackArtist>
                  </TrackDetails>
                </TrackInfo>
                <TrackAlbum>{track.album}</TrackAlbum>
                <TrackDuration>{formatDuration(track.duration)}</TrackDuration>
              </TrackRow>
            ))}
          </TrackList>
        </Section>

        <Section>
          <SectionTitle>Albums</SectionTitle>
          <AlbumGrid>
            {mockAlbums.map(album => (
              <AlbumCard key={album.id}>
                <AlbumImage src={album.imageUrl} alt={album.name} />
                <AlbumTitle>{album.name}</AlbumTitle>
                <AlbumArtist>{album.artist}</AlbumArtist>
                <PlayButtonOverlay
                  onClick={() => console.log('Play album', album.id)}
                >
                  <Play size={20} fill="currentColor" />
                </PlayButtonOverlay>
              </AlbumCard>
            ))}
          </AlbumGrid>
        </Section>

        <Section>
          <SectionTitle>Artists</SectionTitle>
          <ArtistGrid>
            {mockArtists.map(artist => (
              <ArtistCard key={artist.id}>
                <ArtistImage
                  src={artist.imageUrl}
                  alt={artist.name}
                  className="artist-image"
                />
                <ArtistName>{artist.name}</ArtistName>
                <ArtistType>Artist</ArtistType>
              </ArtistCard>
            ))}
          </ArtistGrid>
        </Section>
      </SearchResults>
    </SearchContainer>
  );
};

export default Search;
