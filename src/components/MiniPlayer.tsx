import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize2,
  Minimize2,
  ListMusic,
} from 'lucide-react';
import { usePlaybackStore } from '../store/playbackStore';
import { AudioVisualizer } from './AudioVisualizer';
import type { Track } from '../types';

const slideUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const MiniPlayerContainer = styled(motion.div)<{ $isExpanded: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-elevated);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--border);
  box-shadow: 0 -4px 20px var(--shadow);
  z-index: 999;
  transform-origin: bottom;
`;

const MiniPlayerStyled = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
`;

const ExpandedPlayer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.3s ease;
`;

const PlayerHeader = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid var(--border);
`;

const TrackInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const AlbumArt = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 4px;
  object-fit: cover;
`;

const TrackDetails = styled.div`
  min-width: 0;
`;

const TrackTitle = styled.div`
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.div`
  color: var(--text-secondary);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlayerControls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: var(--bg-secondary);
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const PlayButton = styled(ControlButton)`
  background: var(--accent);
  color: #fff;
  width: 40px;
  height: 40px;

  &:hover {
    background: var(--accent-hover);
    transform: scale(1.1);
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const VolumeSlider = styled.input`
  width: 100px;
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    background: var(--accent);
    border-radius: 50%;
    cursor: pointer;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ExpandedContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const ExpandedAlbumArt = styled.img`
  width: 300px;
  height: 300px;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  margin-bottom: 40px;
`;

const ExpandedTrackInfo = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const ExpandedTrackTitle = styled.h1`
  color: var(--text-primary);
  font-size: 32px;
  margin: 0 0 8px 0;
`;

const ExpandedTrackArtist = styled.p`
  color: var(--text-secondary);
  font-size: 18px;
  margin: 0;
`;

const ExpandedControls = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 40px;
`;

const ProgressBar = styled.div`
  width: 100%;
  max-width: 600px;
`;

const ProgressTrack = styled.div`
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  position: relative;
  cursor: pointer;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  width: ${props => props.$progress}%;
  transition: width 0.1s linear;
`;

const TimeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 12px;
`;

interface MiniPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function MiniPlayer({
  currentTrack,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
}: MiniPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { volume, setVolume, duration, setProgress } = usePlaybackStore();

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    setProgress(duration * percentage);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = 0;

  if (!currentTrack) return null;

  return (
    <>
      <MiniPlayerContainer
        $isExpanded={isExpanded}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        layout
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <MiniPlayerStyled key="mini">
              <TrackInfo>
                <AlbumArt src={currentTrack.imageUrl} alt={currentTrack.name} />
                <TrackDetails>
                  <TrackTitle>{currentTrack.name}</TrackTitle>
                  <TrackArtist>{currentTrack.artist}</TrackArtist>
                </TrackDetails>
              </TrackInfo>

              <PlayerControls>
                <ControlButton onClick={onPrevious}>
                  <SkipBack size={20} />
                </ControlButton>
                <PlayButton onClick={isPlaying ? onPause : onPlay}>
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </PlayButton>
                <ControlButton onClick={onNext}>
                  <SkipForward size={20} />
                </ControlButton>
              </PlayerControls>

              <AudioVisualizer height={40} barCount={16} />

              <VolumeControl>
                <Volume2 size={20} color="var(--text-secondary)" />
                <VolumeSlider
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                />
              </VolumeControl>

              <ActionButtons>
                <ControlButton onClick={() => console.log('Show queue')}>
                  <ListMusic size={20} />
                </ControlButton>
                <ControlButton onClick={() => setIsExpanded(true)}>
                  <Maximize2 size={20} />
                </ControlButton>
              </ActionButtons>
            </MiniPlayerStyled>
          ) : (
            <ExpandedPlayer key="expanded">
              <PlayerHeader>
                <ControlButton onClick={() => setIsExpanded(false)}>
                  <Minimize2 size={20} />
                </ControlButton>
                <div />
                <ControlButton onClick={() => console.log('Show queue')}>
                  <ListMusic size={20} />
                </ControlButton>
              </PlayerHeader>

              <ExpandedContent>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlbumArt
                    src={currentTrack.imageUrl}
                    alt={currentTrack.name}
                  />
                </motion.div>

                <ExpandedTrackInfo>
                  <ExpandedTrackTitle>{currentTrack.name}</ExpandedTrackTitle>
                  <ExpandedTrackArtist>{currentTrack.artist}</ExpandedTrackArtist>
                </ExpandedTrackInfo>

                <ExpandedControls>
                  <ControlButton onClick={onPrevious}>
                    <SkipBack size={24} />
                  </ControlButton>
                  <PlayButton onClick={isPlaying ? onPause : onPlay}>
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </PlayButton>
                  <ControlButton onClick={onNext}>
                    <SkipForward size={24} />
                  </ControlButton>
                </ExpandedControls>

                <ProgressBar>
                  <ProgressTrack onClick={handleProgressClick}>
                    <ProgressFill $progress={progress} />
                  </ProgressTrack>
                  <TimeDisplay>
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </TimeDisplay>
                </ProgressBar>

                <AudioVisualizer height={80} barCount={64} />
              </ExpandedContent>
            </ExpandedPlayer>
          )}
        </AnimatePresence>
      </MiniPlayerContainer>

      {/* Queue component would be rendered here when showQueue is true */}
    </>
  );
}
