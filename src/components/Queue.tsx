import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ListMusic,
  X,
  Play,
  Pause,
  Shuffle,
  Repeat,
  Repeat1,
  Trash2,
} from 'lucide-react';
import { useQueueStore } from '../store/queueStore';
import { usePlaybackStore } from '../store/playbackStore';
import type { Track } from '../types';

const QueueContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 400px;
  background: var(--bg-elevated);
  box-shadow: -4px 0 12px var(--shadow);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transform: translateX(${props => props.$isOpen ? '0' : '100%'});
  transition: transform 0.3s ease;
`;

const QueueHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const QueueTitle = styled.h2`
  color: var(--text-primary);
  margin: 0;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
`;

const QueueControls = styled.div`
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid var(--border);
`;

const ControlButton = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.$active ? 'var(--accent)' : 'var(--text-secondary)'};
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: ${props => props.$active ? 'var(--accent-hover)' : 'var(--text-primary)'};
  }
`;

const QueueList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
`;

const QueueItem = styled(motion.div)<{ $isCurrent: boolean; $isDragging?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
  cursor: grab;
  background: ${props => props.$isCurrent ? 'var(--accent)' : 'transparent'};
  opacity: ${props => props.$isDragging ? 0.5 : 1};
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$isCurrent ? 'var(--accent)' : 'var(--bg-secondary)'};
  }

  ${props => props.$isDragging && `
    cursor: grabbing;
    box-shadow: 0 4px 12px var(--shadow);
  `}
`;

const TrackInfo = styled.div`
  flex: 1;
  margin-left: 12px;
  overflow: hidden;
`;

const TrackTitle = styled.div<{ $isCurrent: boolean }>`
  color: ${props => props.$isCurrent ? '#fff' : 'var(--text-primary)'};
  font-size: 14px;
  font-weight: ${props => props.$isCurrent ? 'bold' : 'normal'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.div<{ $isCurrent: boolean }>`
  color: ${props => props.$isCurrent ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-secondary)'};
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackDuration = styled.div<{ $isCurrent: boolean }>`
  color: ${props => props.$isCurrent ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-tertiary)'};
  font-size: 12px;
  margin: 0 12px;
`;

const TrackActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;

  ${QueueItem}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--text-primary);
    background: var(--bg-secondary);
  }
`;

const EmptyQueue = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-tertiary);
`;

const DragOverArea = styled.div<{ $isDragOver: boolean }>`
  height: 4px;
  background: ${props => props.$isDragOver ? 'var(--accent)' : 'transparent'};
  margin: 2px 0;
  border-radius: 2px;
  transition: background 0.2s;
`;

interface QueueProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Queue({ isOpen, onClose }: QueueProps) {
  const {
    queue,
    isShuffled,
    repeatMode,
    removeFromQueue,
    clearQueue,
    moveInQueue,
    jumpToQueueIndex,
    toggleShuffle,
    setRepeatMode,
  } = useQueueStore();

  const { currentTrack, isPlaying, setIsPlaying } = usePlaybackStore();
  
  const handlePlayPause = (track: Track, index: number) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      jumpToQueueIndex(index);
      setIsPlaying(true);
    }
  };
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      moveInQueue(draggedIndex, dragOverIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handlePlayTrack = (track: Track, index: number) => {
    handlePlayPause(track, index);
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'all':
        return <Repeat size={20} />;
      case 'one':
        return <Repeat1 size={20} />;
      default:
        return <Repeat size={20} />;
    }
  };

  const cycleRepeatMode = () => {
    const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  return (
    <QueueContainer $isOpen={isOpen}>
      <QueueHeader>
        <QueueTitle>
          <ListMusic size={24} />
          Queue
        </QueueTitle>
        <CloseButton onClick={onClose}>
          <X size={24} />
        </CloseButton>
      </QueueHeader>

      <QueueControls>
        <ControlButton 
          onClick={toggleShuffle}
          $active={isShuffled}
          title="Shuffle"
        >
          <Shuffle size={20} />
        </ControlButton>
        <ControlButton 
          onClick={cycleRepeatMode}
          $active={repeatMode !== 'off'}
          title={`Repeat: ${repeatMode}`}
        >
          {getRepeatIcon()}
        </ControlButton>
        <div style={{ flex: 1 }} />
        {queue.length > 0 && (
          <ControlButton 
            onClick={clearQueue}
            title="Clear Queue"
          >
            <Trash2 size={20} />
          </ControlButton>
        )}
      </QueueControls>

      <QueueList>
        <AnimatePresence>
          {queue.length === 0 ? (
            <EmptyQueue>
              <ListMusic size={48} />
              <p>Your queue is empty</p>
              <p style={{ fontSize: '12px', marginTop: '8px' }}>
                Add songs to see them here
              </p>
            </EmptyQueue>
          ) : (
            queue.map((track, index) => (
              <div key={track.id}>
                {dragOverIndex === index && (
                  <DragOverArea $isDragOver={true} />
                )}
                <QueueItem
                  $isCurrent={currentTrack?.id === track.id}
                  $isDragging={draggedIndex === index}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={handleDrop}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {currentTrack?.id === track.id ? (
                    isPlaying ? (
                      <Pause size={16} color="#fff" />
                    ) : (
                      <Play size={16} color="#fff" />
                    )
                  ) : (
                    <span style={{ 
                      color: 'var(--text-tertiary)', 
                      fontSize: '14px', 
                      width: '16px',
                      textAlign: 'center'
                    }}>
                      {index + 1}
                    </span>
                  )}

                  <TrackInfo>
                    <TrackTitle $isCurrent={currentTrack?.id === track.id}>
                      {track.name}
                    </TrackTitle>
                    <TrackArtist $isCurrent={currentTrack?.id === track.id}>
                      {track.artist}
                    </TrackArtist>
                  </TrackInfo>

                  <TrackDuration $isCurrent={currentTrack?.id === track.id}>
                    {track.duration}
                  </TrackDuration>

                  <TrackActions>
                    <ActionButton
                      onClick={() => handlePlayTrack(track, index)}
                      title={currentTrack?.id === track.id ? (isPlaying ? 'Pause' : 'Play') : 'Play'}
                    >
                      {currentTrack?.id === track.id ? (
                        isPlaying ? <Pause size={16} /> : <Play size={16} />
                      ) : (
                        <Play size={16} />
                      )}
                    </ActionButton>
                    <ActionButton
                      onClick={() => removeFromQueue(index)}
                      title="Remove from queue"
                    >
                      <X size={16} />
                    </ActionButton>
                  </TrackActions>
                </QueueItem>
              </div>
            ))
          )}
        </AnimatePresence>
      </QueueList>
    </QueueContainer>
  );
}
