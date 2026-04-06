import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Track } from '../types';

interface QueueState {
  queue: Track[];
  currentQueueIndex: number;
  originalQueue: Track[];
  isShuffled: boolean;
  repeatMode: 'off' | 'all' | 'one';
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  moveInQueue: (fromIndex: number, toIndex: number) => void;
  setQueue: (tracks: Track[]) => void;
  nextInQueue: () => Track | null;
  previousInQueue: () => Track | null;
  jumpToQueueIndex: (index: number) => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: 'off' | 'all' | 'one') => void;
  addPlaylistToQueue: (tracks: Track[]) => void;
  getUpNext: () => Track[];
}

export const useQueueStore = create<QueueState>()(
  persist(
    (set, get) => ({
      queue: [],
      currentQueueIndex: -1,
      originalQueue: [],
      isShuffled: false,
      repeatMode: 'off',

      addToQueue: (track) => {
        set((state) => ({
          queue: [...state.queue, track],
        }));
      },

      removeFromQueue: (index) => {
        set((state) => {
          const newQueue = state.queue.filter((_, i) => i !== index);
          const newIndex = index === state.currentQueueIndex ? -1 :
                          index < state.currentQueueIndex ? state.currentQueueIndex - 1 :
                          state.currentQueueIndex;
          return {
            queue: newQueue,
            currentQueueIndex: newIndex,
          };
        });
      },

      clearQueue: () => {
        set({
          queue: [],
          currentQueueIndex: -1,
          originalQueue: [],
        });
      },

      moveInQueue: (fromIndex, toIndex) => {
        set((state) => {
          const newQueue = [...state.queue];
          const [moved] = newQueue.splice(fromIndex, 1);
          newQueue.splice(toIndex, 0, moved);
          
          // Update current index if necessary
          let newIndex = state.currentQueueIndex;
          if (fromIndex === state.currentQueueIndex) {
            newIndex = toIndex;
          } else if (fromIndex < state.currentQueueIndex && toIndex >= state.currentQueueIndex) {
            newIndex = state.currentQueueIndex - 1;
          } else if (fromIndex > state.currentQueueIndex && toIndex <= state.currentQueueIndex) {
            newIndex = state.currentQueueIndex + 1;
          }
          
          return {
            queue: newQueue,
            currentQueueIndex: newIndex,
          };
        });
      },

      setQueue: (tracks) => {
        const { isShuffled } = get();
        let queue = tracks;
        const originalQueue = tracks;
        
        if (isShuffled) {
          queue = [...tracks].sort(() => Math.random() - 0.5);
        }
        
        set({
          queue,
          originalQueue,
          currentQueueIndex: tracks.length > 0 ? 0 : -1,
        });
      },

      nextInQueue: () => {
        const { queue, currentQueueIndex, repeatMode } = get();
        
        if (repeatMode === 'one') {
          return queue[currentQueueIndex] || null;
        }
        
        if (currentQueueIndex < queue.length - 1) {
          const nextIndex = currentQueueIndex + 1;
          set({ currentQueueIndex: nextIndex });
          return queue[nextIndex];
        } else if (repeatMode === 'all' && queue.length > 0) {
          set({ currentQueueIndex: 0 });
          return queue[0];
        }
        
        return null;
      },

      previousInQueue: () => {
        const { queue, currentQueueIndex, repeatMode } = get();
        
        if (repeatMode === 'one') {
          return queue[currentQueueIndex] || null;
        }
        
        if (currentQueueIndex > 0) {
          const prevIndex = currentQueueIndex - 1;
          set({ currentQueueIndex: prevIndex });
          return queue[prevIndex];
        } else if (repeatMode === 'all' && queue.length > 0) {
          set({ currentQueueIndex: queue.length - 1 });
          return queue[queue.length - 1];
        }
        
        return null;
      },

      jumpToQueueIndex: (index) => {
        const { queue } = get();
        if (index >= 0 && index < queue.length) {
          set({ currentQueueIndex: index });
        }
      },

      toggleShuffle: () => {
        set((state) => {
          const newShuffledState = !state.isShuffled;
          let newQueue = state.queue;
          const originalQueue = state.originalQueue.length ? state.originalQueue : [...state.queue];
          
          if (newShuffledState) {
            newQueue = [...originalQueue].sort(() => Math.random() - 0.5);
          } else {
            // Restore original order, but keep current track position
            const currentTrack = state.queue[state.currentQueueIndex];
            newQueue = [...originalQueue];
            const newCurrentIndex = newQueue.findIndex(t => t.id === currentTrack?.id);
            set({ currentQueueIndex: newCurrentIndex });
          }
          
          return {
            isShuffled: newShuffledState,
            queue: newQueue,
            originalQueue,
          };
        });
      },

      setRepeatMode: (mode) => {
        set({ repeatMode: mode });
      },

      addPlaylistToQueue: (tracks) => {
        set((state) => ({
          queue: [...state.queue, ...tracks],
        }));
      },

      getUpNext: () => {
        const { queue, currentQueueIndex } = get();
        return queue.slice(currentQueueIndex + 1, currentQueueIndex + 6);
      },
    }),
    {
      name: 'queue-storage',
      partialize: (state) => ({
        queue: state.queue,
        currentQueueIndex: state.currentQueueIndex,
        isShuffled: state.isShuffled,
        repeatMode: state.repeatMode,
      }),
    }
  )
);
