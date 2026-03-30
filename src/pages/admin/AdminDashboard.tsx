import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Users, Music, Activity, ArrowUpRight, Headphones } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  padding: 88px 32px 32px;
  max-width: 1400px;
  min-height: 100%;
  animation: ${fadeIn} 0.4s ease;
`;

const Header = styled.div`
  margin-bottom: 36px;

  h1 {
    color: #fff;
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 6px 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  p {
    color: #9ca3af;
    font-size: 15px;
    margin: 0;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div<{ $accent: string }>`
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.04),
    rgba(255, 255, 255, 0.01)
  );
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;

  &:hover {
    border-color: ${props => props.$accent}33;
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.$accent};
    opacity: 0.7;
  }
`;

const StatIcon = styled.div<{ $bg: string }>`
  width: 44px;
  height: 44px;
  background: ${props => props.$bg};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  color: #9ca3af;
  font-size: 13px;
  font-weight: 500;
`;

const StatChange = styled.div<{ $positive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 12px;
  padding: 4px 10px;
  border-radius: 20px;
  color: ${props => (props.$positive ? '#34d399' : '#f87171')};
  background: ${props =>
    props.$positive ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)'};
`;

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.04),
    rgba(255, 255, 255, 0.01)
  );
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 24px;
`;

const CardTitle = styled.h3`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 20px 0;
`;

const RecentActivity = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ActivityAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
`;

const ActivityInfo = styled.div`
  flex: 1;

  .name {
    color: #fff;
    font-size: 13px;
    font-weight: 500;
  }

  .action {
    color: #9ca3af;
    font-size: 12px;
  }
`;

const ActivityTime = styled.span`
  color: #6b7280;
  font-size: 11px;
`;

const TopTrackItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
  }

  .rank {
    color: #6b7280;
    font-size: 14px;
    font-weight: 600;
    width: 24px;
    text-align: center;
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    object-fit: cover;
  }

  .track-info {
    flex: 1;
    .name {
      color: #fff;
      font-size: 13px;
      font-weight: 500;
    }
    .artist {
      color: #9ca3af;
      font-size: 12px;
    }
  }

  .streams {
    color: #9ca3af;
    font-size: 12px;
  }
`;

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 12470,
    activeUsers: 8920,
    totalSongs: 45632,
    totalStreams: 892341,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalStreams: prev.totalStreams + Math.floor(Math.random() * 50),
        activeUsers: prev.activeUsers + (Math.random() > 0.5 ? 1 : -1),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const activities = [
    {
      name: 'Sarah K.',
      action: 'Created playlist "Summer Vibes"',
      time: '2 min ago',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    },
    {
      name: 'Mike D.',
      action: 'Reported a track',
      time: '15 min ago',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    },
    {
      name: 'Emma W.',
      action: 'Upgraded to Premium',
      time: '1 hr ago',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    },
    {
      name: 'Alex T.',
      action: 'Deleted account',
      time: '3 hr ago',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    },
    {
      name: 'Lisa M.',
      action: 'Changed email address',
      time: '5 hr ago',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
    },
  ];

  const topTracks = [
    {
      name: 'Blinding Lights',
      artist: 'The Weeknd',
      streams: '1.2M',
      img: 'https://picsum.photos/seed/track1/40/40',
    },
    {
      name: 'Shape of You',
      artist: 'Ed Sheeran',
      streams: '980K',
      img: 'https://picsum.photos/seed/track2/40/40',
    },
    {
      name: 'Levitating',
      artist: 'Dua Lipa',
      streams: '870K',
      img: 'https://picsum.photos/seed/track5/40/40',
    },
    {
      name: 'Stay',
      artist: 'The Kid LAROI',
      streams: '750K',
      img: 'https://picsum.photos/seed/track7/40/40',
    },
    {
      name: 'Good 4 U',
      artist: 'Olivia Rodrigo',
      streams: '690K',
      img: 'https://picsum.photos/seed/track9/40/40',
    },
  ];

  return (
    <Container>
      <Header>
        <h1>Dashboard</h1>
        <p>
          Welcome back, {user?.username}. Here's what's happening with Musify
          today.
        </p>
      </Header>

      <StatsGrid>
        <StatCard $accent="#8b5cf6">
          <StatIcon $bg="rgba(139, 92, 246, 0.15)">
            <Users size={22} color="#8b5cf6" />
          </StatIcon>
          <StatValue>{stats.totalUsers.toLocaleString()}</StatValue>
          <StatLabel>Total Users</StatLabel>
          <StatChange $positive>
            <ArrowUpRight size={12} /> +12.3% this month
          </StatChange>
        </StatCard>

        <StatCard $accent="#06b6d4">
          <StatIcon $bg="rgba(6, 182, 212, 0.15)">
            <Activity size={22} color="#06b6d4" />
          </StatIcon>
          <StatValue>{stats.activeUsers.toLocaleString()}</StatValue>
          <StatLabel>Active Users</StatLabel>
          <StatChange $positive>
            <ArrowUpRight size={12} /> +8.1% this week
          </StatChange>
        </StatCard>

        <StatCard $accent="#f59e0b">
          <StatIcon $bg="rgba(245, 158, 11, 0.15)">
            <Music size={22} color="#f59e0b" />
          </StatIcon>
          <StatValue>{stats.totalSongs.toLocaleString()}</StatValue>
          <StatLabel>Total Songs</StatLabel>
          <StatChange $positive>
            <ArrowUpRight size={12} /> +523 new
          </StatChange>
        </StatCard>

        <StatCard $accent="#10b981">
          <StatIcon $bg="rgba(16, 185, 129, 0.15)">
            <Headphones size={22} color="#10b981" />
          </StatIcon>
          <StatValue>{(stats.totalStreams / 1000).toFixed(0)}K</StatValue>
          <StatLabel>Total Streams</StatLabel>
          <StatChange $positive>
            <ArrowUpRight size={12} /> +23.5% today
          </StatChange>
        </StatCard>
      </StatsGrid>

      <BottomGrid>
        <Card>
          <CardTitle>Recent Activity</CardTitle>
          <RecentActivity>
            {activities.map((activity, i) => (
              <ActivityItem key={i}>
                <ActivityAvatar src={activity.avatar} alt={activity.name} />
                <ActivityInfo>
                  <div className="name">{activity.name}</div>
                  <div className="action">{activity.action}</div>
                </ActivityInfo>
                <ActivityTime>{activity.time}</ActivityTime>
              </ActivityItem>
            ))}
          </RecentActivity>
        </Card>

        <Card>
          <CardTitle>Top Tracks Today</CardTitle>
          {topTracks.map((track, i) => (
            <TopTrackItem key={i}>
              <span className="rank">{i + 1}</span>
              <img src={track.img} alt={track.name} />
              <div className="track-info">
                <div className="name">{track.name}</div>
                <div className="artist">{track.artist}</div>
              </div>
              <span className="streams">{track.streams}</span>
            </TopTrackItem>
          ))}
        </Card>
      </BottomGrid>
    </Container>
  );
}
