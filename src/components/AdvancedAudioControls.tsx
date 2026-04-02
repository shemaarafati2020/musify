import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders,
  Volume2,
  Zap,
  Waves,
  RotateCw,
  RotateCcw,
} from 'lucide-react';

const ControlsContainer = styled.div`
  background: rgba(40, 40, 40, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  min-width: 320px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ControlsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Title = styled.h3`
  color: #fff;
  margin: 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid #404040;
`;

const Tab = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  color: ${props => (props.$active ? '#1db954' : '#b3b3b3')};
  padding: 8px 16px;
  cursor: pointer;
  border-bottom: 2px solid
    ${props => (props.$active ? '#1db954' : 'transparent')};
  transition: all 0.2s;

  &:hover {
    color: #fff;
  }
`;

const EqualizerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FrequencyBand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BandLabel = styled.span`
  color: #b3b3b3;
  font-size: 12px;
  width: 40px;
`;

const Slider = styled.input`
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: #404040;
  border-radius: 2px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #1db954;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.2);
    }
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #1db954;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;

const ValueLabel = styled.span`
  color: #fff;
  font-size: 12px;
  width: 30px;
  text-align: right;
`;

const CrossfadeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CrossfadeSlider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CrossfadeValue = styled.span`
  color: #1db954;
  font-weight: bold;
  min-width: 40px;
`;

const PresetButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 16px;
`;

const PresetButton = styled.button`
  background: #404040;
  border: none;
  color: #fff;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;

  &:hover {
    background: #1db954;
  }
`;

interface AdvancedAudioControlsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdvancedAudioControls({
  isOpen,
  onClose,
}: AdvancedAudioControlsProps) {
  const [activeTab, setActiveTab] = useState<'equalizer' | 'crossfade'>(
    'equalizer'
  );
  const [equalizerBands, setEqualizerBands] = useState({
    '60': 0,
    '230': 0,
    '910': 0,
    '4k': 0,
    '14k': 0,
  });
  const [crossfadeDuration, setCrossfadeDuration] = useState(3);

  const equalizerPresets = {
    Normal: { '60': 0, '230': 0, '910': 0, '4k': 0, '14k': 0 },
    Bass: { '60': 8, '230': 5, '910': -2, '4k': -3, '14k': -4 },
    Treble: { '60': -4, '230': -2, '910': 2, '4k': 6, '14k': 8 },
    Vocal: { '60': -3, '230': 2, '910': 4, '4k': 4, '14k': 2 },
    Electronic: { '60': 6, '230': 4, '910': 0, '4k': 2, '14k': 4 },
  };

  useEffect(() => {
    // This would integrate with Web Audio API
    console.log('Equalizer bands changed:', equalizerBands);
  }, [equalizerBands]);

  const handleEqualizerChange = (frequency: string, value: number) => {
    setEqualizerBands(prev => ({
      ...prev,
      [frequency]: value,
    }));
  };

  const applyPreset = (presetName: keyof typeof equalizerPresets) => {
    setEqualizerBands(equalizerPresets[presetName]);
  };

  const resetAll = () => {
    setEqualizerBands(equalizerPresets.Normal);
    setCrossfadeDuration(3);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
      >
        <ControlsContainer>
          <ControlsHeader>
            <Title>
              <Sliders size={18} />
              Advanced Audio
            </Title>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#b3b3b3',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              ×
            </button>
          </ControlsHeader>

          <TabContainer>
            <Tab
              $active={activeTab === 'equalizer'}
              onClick={() => setActiveTab('equalizer')}
            >
              <Waves size={16} style={{ marginRight: 4 }} />
              Equalizer
            </Tab>
            <Tab
              $active={activeTab === 'crossfade'}
              onClick={() => setActiveTab('crossfade')}
            >
              <Zap size={16} style={{ marginRight: 4 }} />
              Crossfade
            </Tab>
          </TabContainer>

          {activeTab === 'equalizer' && (
            <EqualizerContainer>
              {Object.entries(equalizerBands).map(([frequency, value]) => (
                <FrequencyBand key={frequency}>
                  <BandLabel>{frequency}Hz</BandLabel>
                  <Slider
                    type="range"
                    min="-12"
                    max="12"
                    value={value}
                    onChange={e =>
                      handleEqualizerChange(frequency, parseInt(e.target.value))
                    }
                  />
                  <ValueLabel>{value > 0 ? `+${value}` : value}</ValueLabel>
                </FrequencyBand>
              ))}

              <PresetButtons>
                {Object.keys(equalizerPresets).map(preset => (
                  <PresetButton
                    key={preset}
                    onClick={() =>
                      applyPreset(preset as keyof typeof equalizerPresets)
                    }
                  >
                    {preset}
                  </PresetButton>
                ))}
              </PresetButtons>
            </EqualizerContainer>
          )}

          {activeTab === 'crossfade' && (
            <CrossfadeContainer>
              <CrossfadeSlider>
                <Volume2 size={16} color="#b3b3b3" />
                <Slider
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={crossfadeDuration}
                  onChange={e =>
                    setCrossfadeDuration(parseFloat(e.target.value))
                  }
                />
                <CrossfadeValue>{crossfadeDuration}s</CrossfadeValue>
              </CrossfadeSlider>

              <div
                style={{ color: '#b3b3b3', fontSize: '12px', marginTop: '8px' }}
              >
                Automatically crossfade between tracks with a{' '}
                {crossfadeDuration}-second overlap.
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button
                  onClick={() => setCrossfadeDuration(0)}
                  style={{
                    background: '#404040',
                    border: 'none',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  <RotateCcw size={14} style={{ marginRight: 4 }} />
                  No Crossfade
                </button>
                <button
                  onClick={() => setCrossfadeDuration(5)}
                  style={{
                    background: '#404040',
                    border: 'none',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  <RotateCw size={14} style={{ marginRight: 4 }} />
                  Long Crossfade
                </button>
              </div>
            </CrossfadeContainer>
          )}

          <div
            style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid #404040',
            }}
          >
            <button
              onClick={resetAll}
              style={{
                background: 'none',
                border: '1px solid #404040',
                color: '#b3b3b3',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                width: '100%',
              }}
            >
              Reset All Settings
            </button>
          </div>
        </ControlsContainer>
      </motion.div>
    </AnimatePresence>
  );
}
