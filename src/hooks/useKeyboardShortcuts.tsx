import { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { usePlaybackStore } from '../store/playbackStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';

// eslint-disable-next-line react-refresh/only-export-components
export function useKeyboardShortcuts() {
  const {
    isPlaying,
    currentTrack,
    setIsPlaying,
    playNext,
    playPrevious,
    setVolume,
    volume,
    setProgress,
    duration,
    toggleShuffle,
    setRepeat,
    repeat,
  } = usePlaybackStore();

  const { logout } = useAuthStore();
  const navigate = useNavigate();

  // Playback controls
  useHotkeys(
    'space',
    e => {
      e.preventDefault();
      setIsPlaying(!isPlaying);
    },
    [isPlaying, setIsPlaying]
  );

  useHotkeys(
    'k',
    e => {
      e.preventDefault();
      setIsPlaying(!isPlaying);
    },
    [isPlaying, setIsPlaying]
  );

  // Next track
  useHotkeys(
    'right',
    e => {
      e.preventDefault();
      playNext();
    },
    [playNext]
  );

  // Previous track
  useHotkeys(
    'left',
    e => {
      e.preventDefault();
      playPrevious();
    },
    [playPrevious]
  );

  // Track navigation
  useHotkeys(
    'arrowright',
    e => {
      if (!e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        playNext();
      }
    },
    [playNext]
  );

  useHotkeys(
    'arrowleft',
    e => {
      if (!e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        playPrevious();
      }
    },
    [playPrevious]
  );

  // Seek controls
  useHotkeys(
    'l',
    () => {
      if (duration) {
        setProgress(Math.min(duration * 0.1 + duration, duration));
      }
    },
    [setProgress, duration]
  );

  useHotkeys(
    'j',
    () => {
      if (duration) {
        setProgress(Math.max(duration * 0.1 - 10, 0));
      }
    },
    [setProgress, duration]
  );

  // Volume controls
  useHotkeys(
    'arrowup',
    e => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setVolume(Math.min(volume + 0.1, 1));
      }
    },
    [setVolume, volume]
  );

  useHotkeys(
    'arrowdown',
    e => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setVolume(Math.max(volume - 0.1, 0));
      }
    },
    [setVolume, volume]
  );

  useHotkeys(
    'm',
    () => {
      setVolume(volume > 0 ? 0 : 0.5);
    },
    [setVolume, volume]
  );

  // Shuffle and repeat
  useHotkeys(
    's',
    e => {
      if (!e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toggleShuffle();
      }
    },
    [toggleShuffle]
  );

  useHotkeys(
    'r',
    () => {
      const modes: ('off' | 'track' | 'context')[] = [
        'off',
        'track',
        'context',
      ];
      const currentIndex = modes.indexOf(repeat);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      setRepeat(nextMode);
    },
    [repeat, setRepeat]
  );

  // Navigation shortcuts
  useHotkeys('g h', () => navigate('/'), [navigate]);
  useHotkeys('g s', () => navigate('/search'), [navigate]);
  useHotkeys('g l', () => navigate('/library'), [navigate]);

  // User shortcuts
  useHotkeys('g p', () => navigate('/profile'), [navigate]);
  useHotkeys('g c', () => navigate('/create-playlist'), [navigate]);

  // Admin shortcuts
  useHotkeys('g a', () => navigate('/admin'), [navigate]);

  // Logout
  useHotkeys(
    'ctrl+shift+q',
    () => {
      logout();
      navigate('/login');
    },
    [logout, navigate]
  );

  // Like current track
  useHotkeys(
    'enter',
    e => {
      if (!e.ctrlKey && !e.metaKey && currentTrack) {
        e.preventDefault();
        // Toggle like functionality would go here
        console.log('Like track:', currentTrack.name);
      }
    },
    [currentTrack]
  );

  // Help modal
  useHotkeys('?', () => {
    // Show keyboard shortcuts help
    console.log('Keyboard shortcuts help');
  });

  // Number keys for percentage seeking
  useEffect(() => {
    const handleNumberKey = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9' && duration) {
        const percentage = parseInt(e.key) / 10;
        setProgress(duration * percentage);
      }
    };

    window.addEventListener('keydown', handleNumberKey);
    return () => window.removeEventListener('keydown', handleNumberKey);
  }, [duration, setProgress]);
}

// Keyboard shortcuts help component

const HelpOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HelpContent = styled.div`
  background: #282828;
  border-radius: 12px;
  padding: 32px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const HelpHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const ShortcutGrid = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 12px;
`;

const ShortcutKey = styled.kbd`
  background: #404040;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  border: 1px solid #535353;
`;

const ShortcutDescription = styled.div`
  color: #b3b3b3;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsHelp({
  isOpen,
  onClose,
}: KeyboardShortcutsHelpProps) {
  const shortcuts = [
    { keys: ['Space', 'K'], description: 'Play / Pause' },
    { keys: ['→'], description: 'Next Track' },
    { keys: ['←'], description: 'Previous Track' },
    { keys: ['L'], description: 'Forward 10 seconds' },
    { keys: ['J'], description: 'Rewind 10 seconds' },
    { keys: ['↑', 'Ctrl/Cmd'], description: 'Volume Up' },
    { keys: ['↓', 'Ctrl/Cmd'], description: 'Volume Down' },
    { keys: ['M'], description: 'Mute / Unmute' },
    { keys: ['S'], description: 'Toggle Shuffle' },
    { keys: ['R'], description: 'Toggle Repeat' },
    { keys: ['0-9'], description: 'Seek to percentage' },
    { keys: ['G', 'H'], description: 'Go to Home' },
    { keys: ['G', 'S'], description: 'Go to Search' },
    { keys: ['G', 'L'], description: 'Go to Library' },
    { keys: ['G', 'P'], description: 'Go to Profile' },
    { keys: ['G', 'C'], description: 'Create Playlist' },
    { keys: ['G', 'A'], description: 'Admin Panel' },
    { keys: ['Enter'], description: 'Like Current Track' },
    { keys: ['Ctrl+Shift+Q'], description: 'Logout' },
    { keys: ['?'], description: 'Show This Help' },
  ];

  if (!isOpen) return null;

  return (
    <HelpOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <HelpContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>

        <HelpHeader>
          <Keyboard size={24} color="#1db954" />
          <h2 style={{ margin: 0, color: '#fff' }}>Keyboard Shortcuts</h2>
        </HelpHeader>

        <ShortcutGrid>
          {shortcuts.map((shortcut, index) => (
            <div key={index}>
              <div>
                {shortcut.keys.map((key, i) => (
                  <ShortcutKey key={i}>{key}</ShortcutKey>
                ))}
              </div>
              <ShortcutDescription>{shortcut.description}</ShortcutDescription>
            </div>
          ))}
        </ShortcutGrid>
      </HelpContent>
    </HelpOverlay>
  );
}
