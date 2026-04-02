import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity,
  Users,
  Heart,
  Play,
  Plus,
  TrendingUp,
  X,
  Sparkles,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const FeedContainer = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  width: 320px;
  max-height: 500px;
  z-index: 999;
`;

const FeedHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg-elevated);
  border-radius: 12px 12px 0 0;
  border: 1px solid var(--border);
  border-bottom: none;
`;

const FeedTitle = styled.h3`
  margin: 0;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LiveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ef4444;
  font-size: 12px;
  font-weight: 500;
`;

const LiveDot = styled.div`
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const FeedContent = styled.div`
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-top: none;
  border-radius: 0 0 12px 12px;
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 2px;
  }
`;

const ActivityItem = styled(motion.div)<{ $type: string }>`
  padding: 12px 16px;
  display: flex;
  gap: 12px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--bg-secondary);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div<{ $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ActivityDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const ActivityText = styled.div`
  color: var(--text-primary);
  font-size: 13px;
  line-height: 1.4;
  margin-bottom: 4px;
`;

const ActivityMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-tertiary);
  font-size: 11px;
`;

const TrackPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  padding: 6px;
  background: var(--bg-secondary);
  border-radius: 6px;
`;

const TrackArt = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  object-fit: cover;
`;

const TrackInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const TrackName = styled.div`
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.div`
  color: var(--text-secondary);
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyState = styled.div`
  padding: 40px 16px;
  text-align: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
`;

interface ActivityEvent {
  id: string;
  type: 'play' | 'like' | 'follow' | 'playlist' | 'trending';
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  track?: {
    id: string;
    title: string;
    artist: string;
    albumArt: string;
  };
  message?: string;
  timestamp: Date;
  metadata?: any;
}

interface ActivityFeedProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockActivities: ActivityEvent[] = [
  {
    id: '1',
    type: 'play',
    user: { id: '1', name: 'Alex Johnson' },
    track: {
      id: '1',
      title: 'Midnight Dreams',
      artist: 'Luna Echo',
      albumArt: 'https://picsum.photos/seed/track1/64/64',
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
  {
    id: '2',
    type: 'like',
    user: { id: '2', name: 'Sarah Chen' },
    track: {
      id: '2',
      title: 'Electric Feel',
      artist: 'Neon Pulse',
      albumArt: 'https://picsum.photos/seed/track2/64/64',
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '3',
    type: 'playlist',
    user: { id: '3', name: 'Mike Rodriguez' },
    message: 'created "Summer Vibes 2024"',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
  },
  {
    id: '4',
    type: 'trending',
    user: { id: '4', name: 'Emma Wilson' },
    track: {
      id: '4',
      title: 'Golden Hour',
      artist: 'Sunset Boulevard',
      albumArt: 'https://picsum.photos/seed/track4/64/64',
    },
    message: 'is trending in your area',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: '5',
    type: 'follow',
    user: { id: '5', name: 'David Kim' },
    message: 'started following you',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
];

export function ActivityFeed({ isOpen, onClose }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityEvent[]>(mockActivities);
  const showLiveIndicator = true;

  useEffect(() => {
    if (!isOpen) return;

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newActivity: ActivityEvent = {
        id: Date.now().toString(),
        type: ['play', 'like', 'playlist', 'trending'][Math.floor(Math.random() * 4)] as any,
        user: {
          id: Math.random().toString(),
          name: `User ${Math.floor(Math.random() * 1000)}`,
        },
        track: Math.random() > 0.5 ? {
          id: Math.random().toString(),
          title: `Track ${Math.floor(Math.random() * 100)}`,
          artist: `Artist ${Math.floor(Math.random() * 50)}`,
          albumArt: `https://picsum.photos/seed/${Date.now()}/64/64`,
        } : undefined,
        message: Math.random() > 0.5 ? 'is listening to this' : undefined,
        timestamp: new Date(),
      };

      setActivities(prev => [newActivity, ...prev].slice(0, 50));
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'play':
        return <Play size={18} />;
      case 'like':
        return <Heart size={18} />;
      case 'follow':
        return <Users size={18} />;
      case 'playlist':
        return <Plus size={18} />;
      case 'trending':
        return <TrendingUp size={18} />;
      default:
        return <Activity size={18} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'play':
        return 'rgba(29, 185, 84, 0.2)';
      case 'like':
        return 'rgba(255, 82, 82, 0.2)';
      case 'follow':
        return 'rgba(59, 130, 246, 0.2)';
      case 'playlist':
        return 'rgba(255, 159, 67, 0.2)';
      case 'trending':
        return 'rgba(255, 215, 0, 0.2)';
      default:
        return 'rgba(0, 0, 0, 0.2)';
    }
  };

  const formatActivityText = (activity: ActivityEvent) => {
    const userName = activity.user.name;
    
    switch (activity.type) {
      case 'play':
        return <>{userName} is playing</>;
      case 'like':
        return <>{userName} liked</>;
      case 'follow':
        return <>{userName} {activity.message}</>;
      case 'playlist':
        return <>{userName} {activity.message}</>;
      case 'trending':
        return <>{activity.track?.title} {activity.message}</>;
      default:
        return <>{userName} updated</>;
    }
  };

  if (!isOpen) return null;

  return (
    <FeedContainer>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
      >
        <FeedHeader>
          <FeedTitle>
            <Activity size={16} />
            Live Activity
          </FeedTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LiveIndicator>
              <LiveDot />
              LIVE
            </LiveIndicator>
            <CloseButton onClick={onClose}>
              <X size={16} />
            </CloseButton>
          </div>
        </FeedHeader>

        <FeedContent>
          <AnimatePresence>
            {activities.length === 0 ? (
              <EmptyState>
                <Activity size={48} color="var(--text-tertiary)" />
                <p style={{ color: 'var(--text-tertiary)', marginTop: '12px' }}>
                  No recent activity
                </p>
              </EmptyState>
            ) : (
              activities.map((activity, index) => (
                <ActivityItem
                  key={activity.id}
                  $type={activity.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ActivityIcon $color={getActivityColor(activity.type)}>
                    {getActivityIcon(activity.type)}
                  </ActivityIcon>

                  <ActivityDetails>
                    <ActivityText>
                      {formatActivityText(activity)}
                    </ActivityText>
                    
                    {activity.track && (
                      <TrackPreview>
                        <TrackArt src={activity.track.albumArt} alt={activity.track.title} />
                        <TrackInfo>
                          <TrackName>{activity.track.title}</TrackName>
                          <TrackArtist>{activity.track.artist}</TrackArtist>
                        </TrackInfo>
                      </TrackPreview>
                    )}

                    <ActivityMeta>
                      <span>{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</span>
                      {activity.type === 'trending' && (
                        <>
                          <Users size={16} />
                          <span style={{ color: '#f59e0b' }}>Trending</span>
                        </>
                      )}
                    </ActivityMeta>
                  </ActivityDetails>
                </ActivityItem>
              ))
            )}
          </AnimatePresence>
        </FeedContent>
      </motion.div>
    </FeedContainer>
  );
}
