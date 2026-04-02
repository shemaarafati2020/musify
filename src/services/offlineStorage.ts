import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Track, Playlist } from '../types';

// Define the database schema
interface MusifyDB extends DBSchema {
  tracks: {
    key: string;
    value: {
      id: string;
      blob: Blob;
      metadata: Track;
      cachedAt: number;
      lastPlayed: number;
      playCount: number;
    };
    indexes: {
      'by-cached-at': number;
      'by-last-played': number;
      'by-play-count': number;
    };
  };
  playlists: {
    key: string;
    value: {
      id: string;
      name: string;
      description: string;
      tracks: string[]; // track IDs
      coverImage?: string;
      createdAt: number;
      updatedAt: number;
      isOffline: boolean;
    };
    indexes: {
      'by-created-at': number;
      'by-updated-at': number;
    };
  };
  userPreferences: {
    key: string;
    value: {
      theme: 'light' | 'dark';
      volume: number;
      repeatMode: 'off' | 'all' | 'one';
      shuffle: boolean;
      crossfade: number;
      equalizerSettings: Record<string, number>;
      downloadedQuality: 'low' | 'medium' | 'high';
      autoDownload: boolean;
      wifiOnly: boolean;
    };
  };
  listeningHistory: {
    key: string;
    value: {
      id: string;
      trackId: string;
      playedAt: number;
      duration: number;
      completed: boolean;
    };
    indexes: {
      'by-played-at': number;
    };
  };
  searchCache: {
    key: string;
    value: {
      query: string;
      results: Track[];
      cachedAt: number;
    };
    indexes: {
      'by-cached-at': number;
    };
  };
}

class OfflineStorage {
  private db: IDBPDatabase<MusifyDB> | null = null;
  private readonly DB_NAME = 'musify-offline';
  private readonly DB_VERSION = 1;

  async init(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<MusifyDB>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        // Tracks store
        const trackStore = db.createObjectStore('tracks', { keyPath: 'id' });
        trackStore.createIndex('by-cached-at', 'cachedAt');
        trackStore.createIndex('by-last-played', 'lastPlayed');
        trackStore.createIndex('by-play-count', 'playCount');

        // Playlists store
        const playlistStore = db.createObjectStore('playlists', { keyPath: 'id' });
        playlistStore.createIndex('by-created-at', 'createdAt');
        playlistStore.createIndex('by-updated-at', 'updatedAt');

        // User preferences store
        db.createObjectStore('userPreferences', { keyPath: 'key' });

        // Listening history store
        const historyStore = db.createObjectStore('listeningHistory', { keyPath: 'id' });
        historyStore.createIndex('by-played-at', 'playedAt');

        // Search cache store
        const searchStore = db.createObjectStore('searchCache', { keyPath: 'query' });
        searchStore.createIndex('by-cached-at', 'cachedAt');
      },
    });
  }

  // Track management
  async cacheTrack(track: Track, audioBlob: Blob): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const existingTrack = await this.db.get('tracks', track.id);
    
    await this.db.put('tracks', {
      id: track.id,
      blob: audioBlob,
      metadata: track,
      cachedAt: Date.now(),
      lastPlayed: existingTrack?.lastPlayed || 0,
      playCount: existingTrack?.playCount || 0,
    });

    // Update storage quota
    this.updateStorageQuota();
  }

  async getCachedTrack(trackId: string): Promise<{ track: Track; blob: Blob } | null> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const cachedTrack = await this.db.get('tracks', trackId);
    if (!cachedTrack) return null;

    return {
      track: cachedTrack.metadata,
      blob: cachedTrack.blob,
    };
  }

  async removeCachedTrack(trackId: string): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.delete('tracks', trackId);
    this.updateStorageQuota();
  }

  async getCachedTracks(): Promise<Track[]> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const tracks = await this.db.getAll('tracks');
    return tracks.map(t => t.metadata);
  }

  async updateTrackPlayCount(trackId: string): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const track = await this.db.get('tracks', trackId);
    if (track) {
      await this.db.put('tracks', {
        ...track,
        playCount: track.playCount + 1,
        lastPlayed: Date.now(),
      });
    }
  }

  // Playlist management
  async savePlaylist(playlist: Playlist): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.put('playlists', {
      ...playlist,
      tracks: playlist.tracks.map(t => t.id),
      coverImage: playlist.imageUrl,
      description: playlist.description || '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isOffline: true,
    });
  }

  async getOfflinePlaylists(): Promise<Playlist[]> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const playlists = await this.db.getAll('playlists');
    // Convert from stored format to Playlist type
    return playlists.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description || '',
      tracks: [], // Empty tracks array for offline playlists
      imageUrl: p.coverImage,
      owner: 'offline',
    }));
  }

  // User preferences
  async saveUserPreferences(preferences: MusifyDB['userPreferences']['value']): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.put('userPreferences', preferences);
  }

  async getUserPreferences(): Promise<MusifyDB['userPreferences']['value'] | null> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.get('userPreferences', 'preferences');
    return result || null;
  }

  // Listening history
  async addToListeningHistory(
    trackId: string,
    duration: number,
    completed: boolean
  ): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const id = `${trackId}-${Date.now()}`;
    await this.db.put('listeningHistory', {
      id,
      trackId,
      playedAt: Date.now(),
      duration,
      completed,
    });

    // Clean old history (keep last 1000 entries)
    const allHistory = await this.db.getAllFromIndex(
      'listeningHistory',
      'by-played-at'
    );
    if (allHistory.length > 1000) {
      const toDelete = allHistory.slice(0, allHistory.length - 1000);
      for (const entry of toDelete) {
        await this.db.delete('listeningHistory', entry.id);
      }
    }
  }

  async getListeningHistory(): Promise<MusifyDB['listeningHistory']['value'][]> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.getAllFromIndex(
      'listeningHistory',
      'by-played-at',
      IDBKeyRange.upperBound(Date.now())
    );
  }

  // Search cache
  async cacheSearchResults(query: string, results: Track[]): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.put('searchCache', {
      query: query as string,
      results,
      cachedAt: Date.now(),
    });
  }

  async getCachedSearchResults(query: string): Promise<Track[] | null> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const cached = await this.db.get('searchCache', query);
    if (!cached) return null;

    // Return null if cache is older than 1 hour
    const hour = 60 * 60 * 1000;
    if (Date.now() - cached.cachedAt > hour) {
      await this.db.delete('searchCache', query);
      return null;
    }

    return cached.results;
  }

  // Storage management
  async getStorageUsage(): Promise<{
    used: number;
    available: number;
    tracks: number;
    playlists: number;
  }> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const estimate = await navigator.storage.estimate();
    const tracks = await this.db.count('tracks');
    const playlists = await this.db.count('playlists');

    return {
      used: estimate.usage || 0,
      available: estimate.quota || 0,
      tracks,
      playlists,
    };
  }

  async clearCache(): Promise<void> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.clear('tracks');
    await this.db.clear('searchCache');
    this.updateStorageQuota();
  }

  private updateStorageQuota(): void {
    // Trigger storage quota update event
    window.dispatchEvent(new CustomEvent('storage-quota-updated'));
  }

  // Check if online/offline
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Download track for offline playback
  async downloadTrack(track: Track, progressCallback?: (progress: number) => void): Promise<void> {
    try {
      // Fetch the audio file
      if (!track.audioUrl) throw new Error('Track has no audio URL');
      const response = await fetch(track.audioUrl);
      if (!response.ok) throw new Error('Failed to download track');

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let loaded = 0;

      const reader = response.body?.getReader();
      const chunks: Uint8Array[] = [];

      if (!reader) throw new Error('No reader available');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        loaded += value.length;

        if (progressCallback && total > 0) {
          progressCallback((loaded / total) * 100);
        }
      }

      // Create blob from chunks
      const blob = new Blob(chunks as BlobPart[], { type: 'audio/mpeg' });
      
      // Cache the track
      await this.cacheTrack(track, blob);

      // Update playlist if track is part of one
      const playlists = await this.getOfflinePlaylists();
      for (const playlist of playlists) {
        if (playlist.tracks.some(t => t.id === track.id)) {
          await this.savePlaylist(playlist);
        }
      }
    } catch (error) {
      console.error('Failed to download track:', error);
      throw error;
    }
  }

  // Get download status
  async getDownloadStatus(trackId: string): Promise<boolean> {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    const track = await this.db.get('tracks', trackId);
    return !!track;
  }
}

// Export singleton instance
export const offlineStorage = new OfflineStorage();

// Hook for using offline storage
import { useEffect, useState } from 'react';

export function useOfflineStorage() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [storageUsage, setStorageUsage] = useState({
    used: 0,
    available: 0,
    tracks: 0,
    playlists: 0,
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const updateStorage = () => {
      offlineStorage.getStorageUsage().then(setStorageUsage);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('storage-quota-updated', updateStorage);

    // Initial update
    updateStorage();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('storage-quota-updated', updateStorage);
    };
  }, []);

  return {
    isOnline,
    storageUsage,
    cacheTrack: offlineStorage.cacheTrack.bind(offlineStorage),
    getCachedTrack: offlineStorage.getCachedTrack.bind(offlineStorage),
    removeCachedTrack: offlineStorage.removeCachedTrack.bind(offlineStorage),
    downloadTrack: offlineStorage.downloadTrack.bind(offlineStorage),
    getDownloadStatus: offlineStorage.getDownloadStatus.bind(offlineStorage),
    clearCache: offlineStorage.clearCache.bind(offlineStorage),
  };
}
