export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  imageUrl: string;
  previewUrl?: string;
  audioUrl?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
  imageUrl?: string;
  owner: string;
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  tracks: Track[];
  imageUrl: string;
  releaseDate: string;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl?: string;
  followers?: number;
  albums?: Album[];
}

export interface PlaybackState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  shuffle: boolean;
  repeat: 'off' | 'track' | 'context';
  queue: Track[];
  queueIndex: number;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  imageUrl?: string;
}
