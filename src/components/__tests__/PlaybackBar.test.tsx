import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PlaybackBar from '../PlaybackBar';
import { usePlaybackStore } from '../../store/playbackStore';

// Mock the store
vi.mock('../../store/playbackStore');

const mockUsePlaybackStore = vi.mocked(usePlaybackStore);

describe('PlaybackBar', () => {
  beforeEach(() => {
    mockUsePlaybackStore.mockReturnValue({
      currentTrack: {
        id: '1',
        name: 'Test Song',
        artist: 'Test Artist',
        album: 'Test Album',
        duration: 200,
        imageUrl: 'test.jpg',
      },
      isPlaying: false,
      volume: 0.7,
      progress: 0,
      duration: 200,
      shuffle: false,
      repeat: 'off',
      queue: [],
      queueIndex: -1,
      setIsPlaying: vi.fn(),
      setVolume: vi.fn(),
      setProgress: vi.fn(),
      setDuration: vi.fn(),
      toggleShuffle: vi.fn(),
      setRepeat: vi.fn(),
      playNext: vi.fn(),
      playPrevious: vi.fn(),
      addToQueue: vi.fn(),
      removeFromQueue: vi.fn(),
      clearQueue: vi.fn(),
    });
  });

  it('renders current track information', () => {
    render(<PlaybackBar />);

    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('renders play button when not playing', () => {
    render(<PlaybackBar />);

    const playButtons = screen.getAllByRole('button');
    const playButton = playButtons.find(btn =>
      btn.querySelector('.lucide-play')
    );
    expect(playButton).toBeInTheDocument();
  });

  it('renders pause button when playing', () => {
    mockUsePlaybackStore.mockReturnValue({
      ...mockUsePlaybackStore(),
      isPlaying: true,
    } as ReturnType<typeof mockUsePlaybackStore>);

    render(<PlaybackBar />);

    const playButtons = screen.getAllByRole('button');
    const playButton = playButtons.find(btn =>
      btn.querySelector('.lucide-pause')
    );
    expect(playButton).toBeDefined();
  });

  it('calls setIsPlaying when play button is clicked', () => {
    const mockSetIsPlaying = vi.fn();
    mockUsePlaybackStore.mockReturnValue({
      ...mockUsePlaybackStore(),
      setIsPlaying: mockSetIsPlaying,
    } as ReturnType<typeof mockUsePlaybackStore>);

    render(<PlaybackBar />);

    const playButtons = screen.getAllByRole('button');
    const playButton = playButtons.find(btn =>
      btn.querySelector('.lucide-play')
    );

    if (playButton) {
      fireEvent.click(playButton);
      expect(mockSetIsPlaying).toHaveBeenCalledWith(true);
    }
  });
});
