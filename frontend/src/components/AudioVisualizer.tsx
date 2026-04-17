import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { usePlaybackStore } from '../store/playbackStore';

const VisualizerContainer = styled.div<{ $height?: number }>`
  width: 100%;
  height: ${props => props.$height || 60}px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2px;
  padding: 8px;
  background: linear-gradient(
    180deg,
    rgba(29, 185, 84, 0.1) 0%,
    transparent 100%
  );
  border-radius: 8px;
  overflow: hidden;
`;

const Bar = styled(motion.div)<{ $height: number; $color?: string }>`
  width: 3px;
  background: ${props => props.$color || '#1db954'};
  border-radius: 2px 2px 0 0;
  min-height: 2px;
`;

interface AudioVisualizerProps {
  barCount?: number;
  height?: number;
  color?: string;
  animated?: boolean;
}

export function AudioVisualizer({
  barCount = 32,
  height = 60,
  color,
  animated = true,
}: AudioVisualizerProps) {
  const { currentTrack, isPlaying } = usePlaybackStore();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize bars based on props
  const [bars, setBars] = useState<number[]>(() =>
    !animated
      ? new Array(barCount).fill(height * 0.3)
      : new Array(barCount).fill(0)
  );

  useEffect(() => {
    if (!animated) return;

    // Initialize audio context and analyser
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext
        )();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 64;
      }
    };

    // Simulate audio visualization with mock data
    const animate = () => {
      if (isPlaying && currentTrack) {
        setBars(prev =>
          prev.map(() => Math.random() * height * 0.8 + height * 0.1)
        );
      } else {
        setBars(
          prev => prev.map(h => h * 0.9) // Gradual decay when paused
        );
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    initAudioContext();
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentTrack, height, animated]);

  return (
    <VisualizerContainer $height={height}>
      {bars.map((barHeight, index) => (
        <Bar
          key={index}
          $height={barHeight}
          $color={color}
          animate={{
            height: barHeight,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            mass: 0.8,
          }}
        />
      ))}
    </VisualizerContainer>
  );
}

// Waveform visualizer component
const WaveformContainer = styled.div`
  width: 100%;
  height: 80px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
`;

const WaveformPath = styled(motion.path)<{ $progress: number }>`
  fill: none;
  stroke: #1db954;
  stroke-width: 2;
  opacity: 0.8;
`;

const ProgressPath = styled.path`
  fill: none;
  stroke: #fff;
  stroke-width: 2;
  opacity: 1;
`;

interface WaveformVisualizerProps {
  duration: number;
  currentTime: number;
  onSeek?: (time: number) => void;
}

export function WaveformVisualizer({
  duration,
  currentTime,
  onSeek,
}: WaveformVisualizerProps) {
  // Generate mock waveform data on initialization
  const [waveformData] = useState<number[]>(() =>
    new Array(200).fill(0).map(() => Math.random() * 40 + 10)
  );
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onSeek || !duration) return;

    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    onSeek(percentage * duration);
  };

  const pathData = waveformData.reduce((path, value, index) => {
    const x = (index / waveformData.length) * 100;
    const y = 40 - value;
    return `${path} ${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }, '');

  const progressPathData = waveformData.reduce((path, value, index) => {
    const x = (index / waveformData.length) * 100;
    const y = 40 - value;
    return `${path} ${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }, '');

  return (
    <WaveformContainer>
      <svg width="100%" height="80" viewBox="0 0 100 80" onClick={handleClick}>
        {/* Full waveform */}
        <WaveformPath
          d={pathData}
          $progress={progress}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />

        {/* Progress indicator */}
        <clipPath id="progressClip">
          <rect x="0" y="0" width={progress} height="80" />
        </clipPath>
        <ProgressPath d={progressPathData} clipPath="url(#progressClip)" />

        {/* Current time indicator */}
        <line
          x1={progress}
          y1="0"
          x2={progress}
          y2="80"
          stroke="#fff"
          strokeWidth="2"
        />
      </svg>
    </WaveformContainer>
  );
}
