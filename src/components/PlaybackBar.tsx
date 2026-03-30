import { useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Repeat,
  Shuffle,
  Maximize2,
  Mic2,
  List,
  Laptop,
  Speaker,
} from 'lucide-react';
import styled from 'styled-components';
import { usePlaybackStore } from '../store/playbackStore';

const PlaybackBarContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90px;
  background-color: #181818;
  border-top: 1px solid #282828;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1000;
`;

const TrackInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 180px;
  max-width: 30%;
`;

const AlbumArt = styled.img`
  width: 56px;
  height: 56px;
  background-color: #282828;
  border-radius: 4px;
`;

const TrackDetails = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
`;

const TrackName = styled.div`
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const ArtistName = styled.div`
  color: #b3b3b3;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    color: #fff;
    text-decoration: underline;
    cursor: pointer;
  }
`;

const Controls = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  max-width: 722px;
`;

const ControlButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ControlButton = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  color: ${props => (props.$active ? '#1DB954' : '#b3b3b3')};
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;

  &:hover {
    color: #fff;
  }

  &:disabled {
    color: #4a4a4a;
    cursor: not-allowed;
  }
`;

const PlayButton = styled.button`
  background-color: #fff;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #000;
  transition: transform 0.1s;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 680px;
`;

const Time = styled.span`
  color: #b3b3b3;
  font-size: 11px;
  min-width: 40px;
  text-align: center;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background-color: #535353;
  border-radius: 2px;
  position: relative;
  cursor: pointer;

  &:hover .progress-thumb {
    opacity: 1;
  }
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  background-color: #fff;
  border-radius: 2px;
  width: ${props => props.$progress}%;
  position: relative;
`;

const ProgressThumb = styled.div`
  position: absolute;
  right: -6px;
  top: -6px;
  width: 12px;
  height: 12px;
  background-color: #fff;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const ExtraControls = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  min-width: 180px;
  max-width: 30%;
`;

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const VolumeSlider = styled.div`
  width: 100px;
  height: 4px;
  background-color: #535353;
  border-radius: 2px;
  position: relative;
  cursor: pointer;

  &:hover .volume-thumb {
    opacity: 1;
  }
`;

const VolumeFill = styled.div<{ $volume: number }>`
  height: 100%;
  background-color: #fff;
  border-radius: 2px;
  width: ${props => props.$volume}%;
  position: relative;
`;

const VolumeThumb = styled.div`
  position: absolute;
  right: -6px;
  top: -6px;
  width: 12px;
  height: 12px;
  background-color: #fff;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  padding: 8px;
  transition: color 0.2s;

  &:hover {
    color: #fff;
  }
`;

const PlaybackBar = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    shuffle,
    repeat,
    setIsPlaying,
    setVolume,
    setProgress,
    setDuration,
    toggleShuffle,
    setRepeat,
    playNext,
    playPrevious,
  } = usePlaybackStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setProgress(percentage);
    if (audioRef.current) {
      audioRef.current.currentTime = (percentage / 100) * duration;
    }
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setVolume(percentage / 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRepeat = () => {
    if (repeat === 'off') {
      setRepeat('track');
    } else if (repeat === 'track') {
      setRepeat('context');
    } else {
      setRepeat('off');
    }
  };

  if (!currentTrack) {
    return (
      <PlaybackBarContainer>
        <TrackInfo />
        <Controls />
        <ExtraControls />
      </PlaybackBarContainer>
    );
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.previewUrl}
        onTimeUpdate={e => {
          const audio = e.currentTarget;
          setProgress((audio.currentTime / audio.duration) * 100 || 0);
          setDuration(audio.duration || 0);
        }}
        onEnded={() => {
          if (repeat === 'track') {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play();
            }
          } else {
            playNext();
          }
        }}
      />
      <PlaybackBarContainer>
        <TrackInfo>
          <AlbumArt src={currentTrack.imageUrl} alt={currentTrack.name} />
          <TrackDetails>
            <TrackName>{currentTrack.name}</TrackName>
            <ArtistName>{currentTrack.artist}</ArtistName>
          </TrackDetails>
        </TrackInfo>

        <Controls>
          <ControlButtons>
            <ControlButton onClick={toggleShuffle} $active={shuffle}>
              <Shuffle size={16} />
            </ControlButton>
            <ControlButton onClick={playPrevious}>
              <SkipBack size={18} />
            </ControlButton>
            <PlayButton onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? (
                <Pause size={16} fill="currentColor" />
              ) : (
                <Play size={16} fill="currentColor" />
              )}
            </PlayButton>
            <ControlButton onClick={playNext}>
              <SkipForward size={18} />
            </ControlButton>
            <ControlButton onClick={handleRepeat} $active={repeat !== 'off'}>
              <Repeat size={16} />
            </ControlButton>
          </ControlButtons>

          <ProgressContainer>
            <Time>{formatTime((progress / 100) * duration)}</Time>
            <ProgressBar onClick={handleProgressClick}>
              <ProgressFill $progress={progress}>
                <ProgressThumb className="progress-thumb" />
              </ProgressFill>
            </ProgressBar>
            <Time>{formatTime(duration)}</Time>
          </ProgressContainer>
        </Controls>

        <ExtraControls>
          <IconButton>
            <Mic2 size={16} />
          </IconButton>
          <IconButton>
            <List size={16} />
          </IconButton>
          <IconButton>
            <Laptop size={16} />
          </IconButton>
          <IconButton>
            <Speaker size={16} />
          </IconButton>
          <VolumeContainer>
            <ControlButton>
              <Volume2 size={16} />
            </ControlButton>
            <VolumeSlider onClick={handleVolumeClick}>
              <VolumeFill $volume={volume * 100}>
                <VolumeThumb className="volume-thumb" />
              </VolumeFill>
            </VolumeSlider>
          </VolumeContainer>
          <IconButton>
            <Maximize2 size={16} />
          </IconButton>
        </ExtraControls>
      </PlaybackBarContainer>
    </>
  );
};

export default PlaybackBar;
