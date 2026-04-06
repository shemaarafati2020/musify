import { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
  Repeat,
  Repeat1,
  Shuffle,
  Maximize2,
  Minimize2,
  Mic2,
  ListMusic,
  MonitorSpeaker,
  Heart,
  PlusCircle,
  Dot,
  Sliders,
} from 'lucide-react';
import { usePlaybackStore } from '../store/playbackStore';
import { api } from '../services/api';

/* ─── Animations ─── */
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;
// const spin = keyframes`
//   from { transform: rotate(0deg); }
//   to   { transform: rotate(360deg); }
// `;
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.15); }
`;
const bars = keyframes`
  0%, 100% { height: 6px; }
  50%       { height: 14px; }
`;

/* ─── Container ─── */
const Bar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90px;
  background: linear-gradient(to top, #0a0a0a, #181818);
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1000;
  gap: 8px;
`;

/* ─── Left: Track Info ─── */
const TrackSection = styled.div`
  flex: 0 0 30%;
  min-width: 180px;
  display: flex;
  align-items: center;
  gap: 14px;
  overflow: hidden;
`;

const AlbumArt = styled.div`
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const AlbumOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;

  ${AlbumArt}:hover & {
    opacity: 1;
  }
`;

const NowPlayingBars = styled.div<{ $playing: boolean }>`
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 16px;

  span {
    display: block;
    width: 3px;
    background: #1db954;
    border-radius: 2px;
    height: 6px;
    ${p =>
      p.$playing &&
      css`
        &:nth-child(1) {
          animation: ${bars} 0.8s ease-in-out infinite;
        }
        &:nth-child(2) {
          animation: ${bars} 0.8s ease-in-out 0.2s infinite;
        }
        &:nth-child(3) {
          animation: ${bars} 0.8s ease-in-out 0.4s infinite;
        }
      `}
  }
`;

const TrackMeta = styled.div`
  min-width: 0;
  flex: 1;
`;

const TrackName = styled.div`
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #1db954;
    text-decoration: underline;
  }
`;

const ArtistName = styled.div`
  color: #b3b3b3;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #fff;
    text-decoration: underline;
  }
`;

const TrackActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

/* ─── Center: Controls ─── */
const CenterSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  max-width: 42%;
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CtrlBtn = styled.button<{ $active?: boolean; $size?: 'sm' | 'md' }>`
  background: none;
  border: none;
  color: ${p => (p.$active ? '#1db954' : '#b3b3b3')};
  cursor: pointer;
  padding: ${p => (p.$size === 'sm' ? '6px' : '8px')};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #1db954;
    opacity: ${p => (p.$active ? 1 : 0)};
    transition: opacity 0.2s;
  }

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.06);
    transform: scale(1.08);
  }

  &:disabled {
    color: #404040;
    cursor: not-allowed;
    &:hover {
      background: none;
      transform: none;
    }
  }
`;

const PlayBtn = styled.button<{ $playing: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #fff;
  color: #000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.08);
    background: #f0f0f0;
    box-shadow: 0 4px 20px rgba(255, 255, 255, 0.25);
  }

  &:active {
    transform: scale(0.96);
  }

  ${p =>
    p.$playing &&
    css`
      animation: ${pulse} 2s ease-in-out infinite;
      animation-play-state: paused; /* CSS pulse only triggers on hover if desired */
    `}
`;

/* ─── Progress ─── */
const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const TimeLabel = styled.span`
  color: #9ca3af;
  font-size: 11px;
  min-width: 36px;
  font-variant-numeric: tabular-nums;
`;

const Track = styled.div`
  flex: 1;
  position: relative;
  height: 4px;
  cursor: pointer;
  padding: 8px 0;
  margin: -8px 0;
`;

const TrackBg = styled.div`
  position: absolute;
  inset: 8px 0;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  overflow: visible;
  transition: height 0.15s;

  ${Track}:hover & {
    height: 5px;
    inset: 7.5px 0;
  }
`;

const TrackFill = styled.div<{ $pct: number; $buffered: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${p => p.$pct}%;
  height: 100%;
  background: #fff;
  border-radius: 2px;
  transition: background 0.15s;

  ${Track}:hover & {
    background: #1db954;
  }

  /* Buffered */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 100%;
    width: ${p => Math.max(0, p.$buffered - p.$pct)}%;
    height: 100%;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 0 2px 2px 0;
  }
`;

const Thumb = styled.div<{ $pct: number }>`
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: ${p => p.$pct}%;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  opacity: 0;
  transition: opacity 0.15s;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
  pointer-events: none;

  ${Track}:hover & {
    opacity: 1;
  }
`;

/* ─── Right: Extra Controls ─── */
const RightSection = styled.div`
  flex: 0 0 30%;
  min-width: 180px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
`;

const VolumeWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  max-width: 130px;
`;

const VolumeTrack = styled.div`
  flex: 1;
  position: relative;
  height: 4px;
  cursor: pointer;
  padding: 8px 0;
  margin: -8px 0;
`;

const VolumeBg = styled.div`
  position: absolute;
  inset: 8px 0;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  transition: height 0.15s;

  ${VolumeTrack}:hover & {
    height: 5px;
    inset: 7.5px 0;
  }
`;

const VolumeFillDiv = styled.div<{ $pct: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${p => p.$pct}%;
  height: 100%;
  background: #fff;
  border-radius: 2px;
  transition: background 0.15s;

  ${VolumeTrack}:hover & {
    background: #1db954;
  }
`;

const VolumeThumbDiv = styled.div<{ $pct: number }>`
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: ${p => p.$pct}%;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  opacity: 0;
  transition: opacity 0.15s;
  pointer-events: none;

  ${VolumeTrack}:hover & {
    opacity: 1;
  }
`;

/* ─── Tooltip ─── */
const Tooltip = styled.div<{ $visible: boolean }>`
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: #2a2a2a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  opacity: ${p => (p.$visible ? 1 : 0)};
  transition: opacity 0.15s;
  animation: ${slideUp} 0.15s ease;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #2a2a2a;
  }
`;

const WithTooltip = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* ─── Queue Panel ─── */
const QueuePanel = styled.div<{ $open: boolean }>`
  position: fixed;
  bottom: 90px;
  right: 0;
  width: 320px;
  max-height: 60vh;
  background: #282828;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px 12px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: ${p => (p.$open ? 'translateY(0)' : 'translateY(110%)')};
  opacity: ${p => (p.$open ? 1 : 0)};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 999;
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.6);
`;

const QueueHeader = styled.div`
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  flex-shrink: 0;

  h3 {
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    margin: 0;
  }
  span {
    color: #b3b3b3;
    font-size: 12px;
  }
`;

const QueueList = styled.div`
  overflow-y: auto;
  flex: 1;
  padding: 8px 0;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
  }
`;

const QueueItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 20px;
  cursor: pointer;
  transition: background 0.15s;
  background: ${p => (p.$active ? 'rgba(29,185,84,0.1)' : 'transparent')};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  img {
    width: 38px;
    height: 38px;
    border-radius: 4px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .meta {
    flex: 1;
    min-width: 0;
  }
  .name {
    color: ${p => (p.$active ? '#1db954' : '#fff')};
    font-size: 13px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .artist {
    color: #b3b3b3;
    font-size: 11px;
  }
`;

/* ─── Lyrics Panel ─── */
const LyricsPanel = styled.div<{ $open: boolean }>`
  position: fixed;
  bottom: 90px;
  left: 50%;
  transform: ${p =>
    p.$open
      ? 'translateX(-50%) translateY(0)'
      : 'translateX(-50%) translateY(110%)'};
  opacity: ${p => (p.$open ? 1 : 0)};
  width: 380px;
  max-height: 55vh;
  background: #282828;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px 12px 0 0;
  padding: 24px;
  z-index: 999;
  overflow-y: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.6);

  h3 {
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 20px;
  }

  p {
    color: rgba(255, 255, 255, 0.6);
    font-size: 18px;
    line-height: 1.9;
    margin: 0;
    font-style: italic;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

/* ─── Device Panel ─── */
const DevicePanel = styled.div<{ $open: boolean }>`
  position: fixed;
  bottom: 90px;
  right: 160px;
  width: 280px;
  background: #282828;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px 12px 0 0;
  transform: ${p => (p.$open ? 'translateY(0)' : 'translateY(110%)')};
  opacity: ${p => (p.$open ? 1 : 0)};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 999;
  overflow: hidden;
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.6);
`;

const DeviceHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  h3 {
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    margin: 0 0 4px;
  }
  p {
    color: #b3b3b3;
    font-size: 12px;
    margin: 0;
  }
`;

const DeviceItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: ${p =>
      p.$active ? 'rgba(29,185,84,0.2)' : 'rgba(255,255,255,0.05)'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${p => (p.$active ? '#1db954' : '#b3b3b3')};
  }

  .meta .name {
    color: #fff;
    font-size: 13px;
    font-weight: 500;
  }
  .meta .sub {
    color: #b3b3b3;
    font-size: 11px;
  }
`;

/* ─── Helpers ─── */
const fmt = (secs: number) => {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

/* ─── Main Component ─── */
interface PlaybackBarProps {
  onShowQueue?: () => void;
  onShowAdvancedControls?: () => void;
}

const PlaybackBar = ({
  onShowQueue,
  onShowAdvancedControls,
}: PlaybackBarProps = {}) => {
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
    queue,
    queueIndex,
    setCurrentTrack,
  } = usePlaybackStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  const [liked, setLiked] = useState(false);

  /* ── Record play on track change ── */
  useEffect(() => {
    if (currentTrack?.id) {
      api.post(`/api/tracks/${currentTrack.id}/play`).catch(() => {});
    }
  }, [currentTrack?.id]);
  const [muted, setMuted] = useState(false);
  const [prevVol, setPrevVol] = useState(volume);
  const [dragging, setDragging] = useState(false);
  const [volDragging, setVolDragging] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [showQueue, setShowQueue] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showDevices, setShowDevices] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [tooltips, setTooltips] = useState<Record<string, boolean>>({});

  const showTip = (k: string) => setTooltips(t => ({ ...t, [k]: true }));
  const hideTip = (k: string) => setTooltips(t => ({ ...t, [k]: false }));

  /* ── Play/Pause sync ── */
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) a.play().catch(() => {});
    else a.pause();
  }, [isPlaying]);

  /* ── Volume sync ── */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  /* ── Track change ── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.previewUrl) return;

    audio.src = currentTrack.previewUrl;
    if (isPlaying) {
      audio.play().catch(console.error);
    }
  }, [currentTrack, isPlaying]);

  const calcProgress = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    return (x / rect.width) * 100;
  }, []);

  const handleProgressMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    const pct = calcProgress(e) ?? 0;
    setProgress(pct);
    if (audioRef.current) audioRef.current.currentTime = (pct / 100) * duration;
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent) => {
      const pct = calcProgress(e) ?? 0;
      setProgress(pct);
    };
    const up = (e: MouseEvent) => {
      setDragging(false);
      const pct = calcProgress(e) ?? 0;
      setProgress(pct);
      if (audioRef.current)
        audioRef.current.currentTime = (pct / 100) * duration;
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
  }, [dragging, duration, calcProgress, setProgress, setDuration]);

  /* ── Volume drag ── */
  const calcVolume = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    return x / rect.width;
  }, []);

  const handleVolumeMouseDown = (e: React.MouseEvent) => {
    setVolDragging(true);
    const v = calcVolume(e) ?? volume;
    setVolume(v);
    if (v > 0) setPrevVol(v);
  };

  useEffect(() => {
    if (!volDragging) return;
    const move = (e: MouseEvent) => {
      const v = calcVolume(e) ?? 0;
      setVolume(v);
      if (v > 0) setPrevVol(v);
    };
    const up = (e: MouseEvent) => {
      setVolDragging(false);
      const v = calcVolume(e) ?? 0;
      setVolume(v);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volDragging, calcVolume]);

  /* ── Mute toggle ── */
  const toggleMute = () => {
    if (muted) {
      setMuted(false);
      setVolume(prevVol || 0.5);
    } else {
      setPrevVol(volume);
      setMuted(true);
      setVolume(0);
    }
    /* ... */
  };

  /* ── Repeat cycle ── */
  const cycleRepeat = () => {
    if (repeat === 'off') setRepeat('context');
    else if (repeat === 'context') setRepeat('track');
    else setRepeat('off');
  };

  const effectiveVolume = muted ? 0 : volume;

  /* ── Volume icon ── */
  const VolumeIcon =
    effectiveVolume === 0 ? VolumeX : effectiveVolume < 0.5 ? Volume1 : Volume2;

  /* ── Empty bar when no track ── */
  if (!currentTrack) {
    return (
      <Bar>
        <TrackSection />
        <CenterSection>
          <ControlRow>
            <CtrlBtn disabled>
              <Shuffle size={16} />
            </CtrlBtn>
            <CtrlBtn disabled>
              <SkipBack size={18} />
            </CtrlBtn>
            <PlayBtn $playing={false} disabled>
              <Play size={16} fill="currentColor" />
            </PlayBtn>
            <CtrlBtn disabled>
              <SkipForward size={18} />
            </CtrlBtn>
            <CtrlBtn disabled>
              <Repeat size={16} />
            </CtrlBtn>
          </ControlRow>
          <ProgressRow>
            <TimeLabel>0:00</TimeLabel>
            <Track ref={progressRef}>
              <TrackBg>
                <TrackFill $pct={0} $buffered={0} />
              </TrackBg>
            </Track>
            <TimeLabel style={{ textAlign: 'right' }}>0:00</TimeLabel>
          </ProgressRow>
        </CenterSection>
        <RightSection />
      </Bar>
    );
  }

  return (
    <>
      {/* ── Audio Engine ── */}
      <audio
        ref={audioRef}
        src={currentTrack.previewUrl}
        onTimeUpdate={e => {
          if (dragging) return;
          const a = e.currentTarget;
          setProgress((a.currentTime / a.duration) * 100 || 0);
          setDuration(a.duration || 0);
          // buffered
          if (a.buffered.length > 0) {
            setBuffered(
              (a.buffered.end(a.buffered.length - 1) / a.duration) * 100 || 0
            );
          }
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

      {/* ── Queue Panel ── */}
      <QueuePanel $open={showQueue}>
        <QueueHeader>
          <h3>Queue</h3>
          <span>{queue.length} songs</span>
        </QueueHeader>
        <QueueList>
          {queue.length === 0 ? (
            <div
              style={{
                padding: '24px 20px',
                color: '#6b7280',
                fontSize: 13,
                textAlign: 'center',
              }}
            >
              Your queue is empty
            </div>
          ) : (
            queue.map((track, i) => (
              <QueueItem
                key={`${track.id}-${i}`}
                $active={i === queueIndex}
                onClick={() => {
                  setCurrentTrack(track);
                  setIsPlaying(true);
                }}
              >
                <img src={track.imageUrl} alt={track.name} />
                <div className="meta">
                  <div className="name">{track.name}</div>
                  <div className="artist">{track.artist}</div>
                </div>
                {i === queueIndex && (
                  <NowPlayingBars $playing={isPlaying}>
                    <span />
                    <span />
                    <span />
                  </NowPlayingBars>
                )}
              </QueueItem>
            ))
          )}
        </QueueList>
      </QueuePanel>

      {/* ── Lyrics Panel ── */}
      <LyricsPanel $open={showLyrics}>
        <h3>Lyrics · {currentTrack.name}</h3>
        <p>
          🎵 Lyrics coming soon.
          <br />
          <br />
          Connect a lyrics provider API to display real-time synced lyrics here.
          For now, enjoy the music! 🎶
        </p>
      </LyricsPanel>

      {/* ── Device Panel ── */}
      <DevicePanel $open={showDevices}>
        <DeviceHeader>
          <h3>Connect to a device</h3>
          <p>Play music on any device</p>
        </DeviceHeader>
        {[
          {
            label: 'This Browser',
            sub: 'Current device',
            icon: <MonitorSpeaker size={18} />,
            active: true,
          },
          {
            label: 'Living Room TV',
            sub: 'Smart TV',
            icon: '📺',
            active: false,
          },
          {
            label: 'Kitchen Speaker',
            sub: 'Bluetooth',
            icon: '🔊',
            active: false,
          },
        ].map(d => (
          <DeviceItem key={d.label} $active={d.active}>
            <div className="icon">{d.icon}</div>
            <div className="meta">
              <div className="name">{d.label}</div>
              <div className="sub">{d.sub}</div>
            </div>
            {d.active && <Dot size={20} color="#1db954" />}
          </DeviceItem>
        ))}
      </DevicePanel>

      {/* ── Main Bar ── */}
      <Bar>
        {/* LEFT: Track info */}
        <TrackSection>
          <AlbumArt onClick={() => setExpanded(e => !e)}>
            {currentTrack.imageUrl ? (
              <img src={currentTrack.imageUrl} alt={currentTrack.name} />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#282828',
                  borderRadius: 6,
                }}
              />
            )}
            <AlbumOverlay>
              {expanded ? (
                <Minimize2 size={16} color="#fff" />
              ) : (
                <Maximize2 size={16} color="#fff" />
              )}
            </AlbumOverlay>
          </AlbumArt>

          <TrackMeta>
            <TrackName title={currentTrack.name}>{currentTrack.name}</TrackName>
            <ArtistName title={currentTrack.artist}>
              {currentTrack.artist}
            </ArtistName>
          </TrackMeta>

          <TrackActions>
            <WithTooltip
              onMouseEnter={() => showTip('like')}
              onMouseLeave={() => hideTip('like')}
            >
              <Tooltip $visible={!!tooltips.like}>
                {liked ? 'Remove from Liked' : 'Save to Liked Songs'}
              </Tooltip>
              <CtrlBtn
                $active={liked}
                $size="sm"
                onClick={() => {
                  if (currentTrack?.id) {
                    api.post(`/api/tracks/${currentTrack.id}/like`).catch(() => {});
                  }
                  setLiked(l => !l);
                }}
              >
                <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
              </CtrlBtn>
            </WithTooltip>
            <WithTooltip
              onMouseEnter={() => showTip('add')}
              onMouseLeave={() => hideTip('add')}
            >
              <Tooltip $visible={!!tooltips.add}>Add to playlist</Tooltip>
              <CtrlBtn $size="sm">
                <PlusCircle size={16} />
              </CtrlBtn>
            </WithTooltip>
          </TrackActions>
        </TrackSection>

        {/* CENTER: Controls + Progress */}
        <CenterSection>
          <ControlRow>
            <WithTooltip
              onMouseEnter={() => showTip('shuffle')}
              onMouseLeave={() => hideTip('shuffle')}
            >
              <Tooltip $visible={!!tooltips.shuffle}>
                {shuffle ? 'Disable shuffle' : 'Enable shuffle'}
              </Tooltip>
              <CtrlBtn $active={shuffle} $size="sm" onClick={toggleShuffle}>
                <Shuffle size={16} />
              </CtrlBtn>
            </WithTooltip>

            <WithTooltip
              onMouseEnter={() => showTip('prev')}
              onMouseLeave={() => hideTip('prev')}
            >
              <Tooltip $visible={!!tooltips.prev}>Previous</Tooltip>
              <CtrlBtn onClick={playPrevious}>
                <SkipBack size={18} />
              </CtrlBtn>
            </WithTooltip>

            <PlayBtn
              $playing={isPlaying}
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={16} fill="currentColor" />
              ) : (
                <Play size={16} fill="currentColor" style={{ marginLeft: 2 }} />
              )}
            </PlayBtn>

            <WithTooltip
              onMouseEnter={() => showTip('next')}
              onMouseLeave={() => hideTip('next')}
            >
              <Tooltip $visible={!!tooltips.next}>Next</Tooltip>
              <CtrlBtn onClick={playNext}>
                <SkipForward size={18} />
              </CtrlBtn>
            </WithTooltip>

            <WithTooltip
              onMouseEnter={() => showTip('repeat')}
              onMouseLeave={() => hideTip('repeat')}
            >
              <Tooltip $visible={!!tooltips.repeat}>
                {repeat === 'off'
                  ? 'Enable repeat'
                  : repeat === 'context'
                    ? 'Repeat track'
                    : 'Disable repeat'}
              </Tooltip>
              <CtrlBtn
                $active={repeat !== 'off'}
                $size="sm"
                onClick={cycleRepeat}
              >
                {repeat === 'track' ? (
                  <Repeat1 size={16} />
                ) : (
                  <Repeat size={16} />
                )}
              </CtrlBtn>
            </WithTooltip>
          </ControlRow>

          <ProgressRow>
            <TimeLabel>{fmt((progress / 100) * duration)}</TimeLabel>
            <Track ref={progressRef} onMouseDown={handleProgressMouseDown}>
              <TrackBg>
                <TrackFill $pct={progress} $buffered={buffered} />
              </TrackBg>
              <Thumb $pct={progress} />
            </Track>
            <TimeLabel style={{ textAlign: 'right' }}>
              {fmt(duration)}
            </TimeLabel>
          </ProgressRow>
        </CenterSection>

        {/* RIGHT: Extra icons + volume */}
        <RightSection>
          <WithTooltip
            onMouseEnter={() => showTip('lyrics')}
            onMouseLeave={() => hideTip('lyrics')}
          >
            <Tooltip $visible={!!tooltips.lyrics}>Lyrics</Tooltip>
            <CtrlBtn
              $active={showLyrics}
              $size="sm"
              onClick={() => {
                setShowLyrics(s => !s);
                setShowQueue(false);
                setShowDevices(false);
              }}
            >
              <Mic2 size={16} />
            </CtrlBtn>
          </WithTooltip>

          <WithTooltip
            onMouseEnter={() => showTip('queue')}
            onMouseLeave={() => hideTip('queue')}
          >
            <Tooltip $visible={!!tooltips.queue}>Queue</Tooltip>
            <CtrlBtn
              $active={showQueue}
              $size="sm"
              onClick={() => {
                if (onShowQueue) {
                  onShowQueue();
                } else {
                  setShowQueue(s => !s);
                  setShowLyrics(false);
                  setShowDevices(false);
                }
              }}
            >
              <ListMusic size={16} />
            </CtrlBtn>
          </WithTooltip>

          {onShowAdvancedControls && (
            <WithTooltip
              onMouseEnter={() => showTip('advanced')}
              onMouseLeave={() => hideTip('advanced')}
            >
              <Tooltip $visible={!!tooltips.advanced}>Advanced Audio</Tooltip>
              <CtrlBtn $size="sm" onClick={onShowAdvancedControls}>
                <Sliders size={16} />
              </CtrlBtn>
            </WithTooltip>
          )}

          <WithTooltip
            onMouseEnter={() => showTip('devices')}
            onMouseLeave={() => hideTip('devices')}
          >
            <Tooltip $visible={!!tooltips.devices}>Connect to device</Tooltip>
            <CtrlBtn
              $active={showDevices}
              $size="sm"
              onClick={() => {
                setShowDevices(s => !s);
                setShowQueue(false);
                setShowLyrics(false);
              }}
            >
              <MonitorSpeaker size={16} />
            </CtrlBtn>
          </WithTooltip>

          <VolumeWrap>
            <WithTooltip
              onMouseEnter={() => showTip('mute')}
              onMouseLeave={() => hideTip('mute')}
            >
              <Tooltip $visible={!!tooltips.mute}>
                {muted ? 'Unmute' : 'Mute'}
              </Tooltip>
              <CtrlBtn $size="sm" onClick={toggleMute}>
                <VolumeIcon size={16} />
              </CtrlBtn>
            </WithTooltip>

            <VolumeTrack ref={volumeRef} onMouseDown={handleVolumeMouseDown}>
              <VolumeBg>
                <VolumeFillDiv $pct={effectiveVolume * 100} />
              </VolumeBg>
              <VolumeThumbDiv $pct={effectiveVolume * 100} />
            </VolumeTrack>
          </VolumeWrap>

          <WithTooltip
            onMouseEnter={() => showTip('expand')}
            onMouseLeave={() => hideTip('expand')}
          >
            <Tooltip $visible={!!tooltips.expand}>
              {expanded ? 'Collapse' : 'Full screen'}
            </Tooltip>
            <CtrlBtn
              $size="sm"
              $active={expanded}
              onClick={() => setExpanded(e => !e)}
            >
              {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </CtrlBtn>
          </WithTooltip>
        </RightSection>
      </Bar>
    </>
  );
};

export default PlaybackBar;
