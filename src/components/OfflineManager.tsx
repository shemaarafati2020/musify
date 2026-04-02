import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Download,
  Wifi,
  WifiOff,
  Trash2,
  CheckCircle,
  XCircle,
  Pause,
  HardDrive,
  AlertTriangle,
} from 'lucide-react';
import { useOfflineStorage } from '../services/offlineStorage';
import type { Track } from '../types';

const ManagerContainer = styled.div`
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 380px;
  max-height: 600px;
  z-index: 1000;
`;

const ManagerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--bg-elevated);
  border-radius: 12px 12px 0 0;
  border: 1px solid var(--border);
  border-bottom: none;
`;

const ManagerTitle = styled.h3`
  margin: 0;
  color: var(--text-primary);
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusIndicator = styled.div<{ $online: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => (props.$online ? '#1db954' : '#ef4444')};
  font-size: 12px;
`;

const ManagerContent = styled.div`
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-top: none;
  border-radius: 0 0 12px 12px;
  max-height: 500px;
  overflow-y: auto;
`;

const StorageInfo = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
`;

const StorageBar = styled.div`
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 8px;
`;

const StorageFill = styled.div<{ $percentage: number }>`
  height: 100%;
  background: ${props => {
    if (props.$percentage > 90) return '#ef4444';
    if (props.$percentage > 70) return '#f59e0b';
    return '#1db954';
  }};
  transition: width 0.3s ease;
`;

const StorageText = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-secondary);
`;

const DownloadItem = styled.div`
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border);
  transition: background 0.2s;

  &:hover {
    background: var(--bg-secondary);
  }
`;

const TrackInfo = styled.div`
  flex: 1;
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

const DownloadProgress = styled.div`
  width: 40px;
  height: 40px;
  position: relative;
`;

const ProgressRing = styled.svg<{ $progress: number }>`
  transform: rotate(-90deg);

  circle {
    fill: none;
    stroke-width: 3;
  }

  .background {
    stroke: var(--border);
  }

  .progress {
    stroke: #1db954;
    stroke-dasharray: ${() => 2 * Math.PI * 18};
    stroke-dashoffset: ${({ $progress }) =>
      2 * Math.PI * 18 * (1 - $progress / 100)};
    transition: stroke-dashoffset 0.3s ease;
  }
`;

const DownloadStatus = styled.div<{
  $status: 'downloading' | 'completed' | 'error' | 'paused';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => {
    switch (props.$status) {
      case 'completed':
        return 'rgba(29, 185, 84, 0.2)';
      case 'error':
        return 'rgba(239, 68, 68, 0.2)';
      case 'paused':
        return 'rgba(245, 158, 11, 0.2)';
      default:
        return 'transparent';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'completed':
        return '#1db954';
      case 'error':
        return '#ef4444';
      case 'paused':
        return '#f59e0b';
      default:
        return 'var(--text-secondary)';
    }
  }};
`;

const SettingsSection = styled.div`
  padding: 16px 20px;
  border-top: 1px solid var(--border);
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SettingLabel = styled.div`
  color: var(--text-primary);
  font-size: 14px;
`;

const Toggle = styled.label<{ $checked: boolean }>`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--border);
    transition: 0.3s;
    border-radius: 24px;

    &:before {
      position: absolute;
      content: '';
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }
  }

  input:checked + span {
    background-color: #1db954;
  }

  input:checked + span:before {
    transform: translateX(24px);
  }
`;

interface DownloadManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DownloadState {
  trackId: string;
  track: Track;
  progress: number;
  status: 'downloading' | 'completed' | 'error' | 'paused';
  error?: string;
}

export function OfflineManager({ isOpen }: DownloadManagerProps) {
  const { isOnline, storageUsage, clearCache } = useOfflineStorage();
  const [downloads, setDownloads] = useState<DownloadState[]>([]);
  const [settings, setSettings] = useState({
    autoDownload: false,
    wifiOnly: true,
    downloadQuality: 'medium' as 'low' | 'medium' | 'high',
  });

  const storagePercentage = (storageUsage.used / storageUsage.available) * 100;

  const formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleRemoveDownload = (trackId: string) => {
    setDownloads(prev => prev.filter(d => d.trackId !== trackId));
  };

  const handleClearCache = async () => {
    await clearCache();
    setDownloads([]);
  };

  if (!isOpen) return null;

  return (
    <ManagerContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <ManagerHeader>
          <ManagerTitle>
            <HardDrive size={20} />
            Offline Downloads
          </ManagerTitle>
          <StatusIndicator $online={isOnline}>
            {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
            {isOnline ? 'Online' : 'Offline'}
          </StatusIndicator>
        </ManagerHeader>

        <ManagerContent>
          <StorageInfo>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
                Storage Used
              </span>
              {storagePercentage > 90 && (
                <AlertTriangle size={16} color="#ef4444" />
              )}
            </div>
            <StorageBar>
              <StorageFill $percentage={storagePercentage} />
            </StorageBar>
            <StorageText>
              <span>{formatBytes(storageUsage.used)}</span>
              <span>{formatBytes(storageUsage.available)}</span>
            </StorageText>
          </StorageInfo>

          {downloads.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <Download size={48} color="var(--text-tertiary)" />
              <p style={{ color: 'var(--text-tertiary)', marginTop: '16px' }}>
                No downloads yet
              </p>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>
                Download tracks to listen offline
              </p>
            </div>
          ) : (
            downloads.map(download => (
              <DownloadItem key={download.trackId}>
                {download.status === 'downloading' ? (
                  <DownloadProgress>
                    <ProgressRing
                      $progress={download.progress}
                      width="40"
                      height="40"
                    >
                      <circle cx="20" cy="20" r="18" className="background" />
                      <circle cx="20" cy="20" r="18" className="progress" />
                    </ProgressRing>
                  </DownloadProgress>
                ) : (
                  <DownloadStatus $status={download.status}>
                    {download.status === 'completed' && (
                      <CheckCircle size={20} />
                    )}
                    {download.status === 'error' && <XCircle size={20} />}
                    {download.status === 'paused' && <Pause size={20} />}
                  </DownloadStatus>
                )}

                <TrackInfo>
                  <TrackTitle>{download.track.name}</TrackTitle>
                  <TrackArtist>{download.track.artist}</TrackArtist>
                </TrackInfo>

                <button
                  onClick={() => handleRemoveDownload(download.trackId)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-tertiary)',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </DownloadItem>
            ))
          )}

          <SettingsSection>
            <SettingRow>
              <SettingLabel>Auto-download</SettingLabel>
              <Toggle $checked={settings.autoDownload}>
                <input
                  type="checkbox"
                  checked={settings.autoDownload}
                  onChange={e =>
                    setSettings(prev => ({
                      ...prev,
                      autoDownload: e.target.checked,
                    }))
                  }
                />
                <span />
              </Toggle>
            </SettingRow>

            <SettingRow>
              <SettingLabel>Wi-Fi only</SettingLabel>
              <Toggle $checked={settings.wifiOnly}>
                <input
                  type="checkbox"
                  checked={settings.wifiOnly}
                  onChange={e =>
                    setSettings(prev => ({
                      ...prev,
                      wifiOnly: e.target.checked,
                    }))
                  }
                />
                <span />
              </Toggle>
            </SettingRow>

            <div style={{ marginTop: '16px' }}>
              <button
                onClick={handleClearCache}
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                }}
              >
                Clear All Cache
              </button>
            </div>
          </SettingsSection>
        </ManagerContent>
      </motion.div>
    </ManagerContainer>
  );
}
