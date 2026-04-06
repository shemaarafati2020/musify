import { create } from 'zustand';
import type { PlaybackState, Track } from '../types';

interface PlaybackStore extends PlaybackState {
  setCurrentTrack: (track: Track | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  toggleShuffle: () => void;
  setRepeat: (repeat: 'off' | 'track' | 'context') => void;
  playNext: () => void;
  playPrevious: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
}

const initialState: PlaybackState = {
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  progress: 0,
  duration: 0,
  shuffle: false,
  repeat: 'off',
  queue: [],
  queueIndex: -1,
};

export const usePlaybackStore = create<PlaybackStore>((set, get) => ({
  ...initialState,

  setCurrentTrack: track => {
    set({ currentTrack: track, progress: 0 });
  },

  setIsPlaying: playing => {
    set({ isPlaying: playing });
  },

  setVolume: volume => {
    set({ volume: Math.max(0, Math.min(1, volume)) });
  },

  setProgress: progress => {
    set({ progress });
  },

  setDuration: duration => {
    set({ duration });
  },

  toggleShuffle: () => {
    set(state => ({ shuffle: !state.shuffle }));
  },

  setRepeat: repeat => {
    set({ repeat });
  },

  playNext: () => {
    const { queue, queueIndex, shuffle, repeat } = get();

    if (queue.length === 0) return;

    let nextIndex = queueIndex;

    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = queueIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeat === 'context') {
          nextIndex = 0;
        } else {
          return;
        }
      }
    }

    set({
      currentTrack: queue[nextIndex],
      queueIndex: nextIndex,
      progress: 0,
    });
  },

  playPrevious: () => {
    const { queue, queueIndex } = get();

    if (queue.length === 0) return;

    const prevIndex = queueIndex > 0 ? queueIndex - 1 : queue.length - 1;

    set({
      currentTrack: queue[prevIndex],
      queueIndex: prevIndex,
      progress: 0,
    });
  },

  addToQueue: track => {
    set(state => {
      const newQueue = [...state.queue, track];
      if (state.currentTrack === null) {
        return {
          queue: newQueue,
          queueIndex: 0,
          currentTrack: track,
        };
      }
      return { queue: newQueue };
    });
  },

  removeFromQueue: trackId => {
    set(state => {
      const newQueue = state.queue.filter(track => track.id !== trackId);
      let newIndex = state.queueIndex;

      if (state.currentTrack?.id === trackId) {
        return {
          queue: newQueue,
          currentTrack: newQueue[newIndex] || null,
          queueIndex:
            newIndex >= newQueue.length ? newQueue.length - 1 : newIndex,
        };
      }

      if (state.queueIndex > newQueue.indexOf(state.currentTrack!)) {
        newIndex = state.queueIndex - 1;
      }

      return { queue: newQueue, queueIndex: newIndex };
    });
  },

  clearQueue: () => {
    set({
      queue: [],
      queueIndex: -1,
      currentTrack: null,
      isPlaying: false,
      progress: 0,
    });
  },
}));
