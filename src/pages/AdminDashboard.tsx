import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Users, 
  Music, 
  TrendingUp, 
  Play, 
  DollarSign, 
  Activity,
  BarChart3,
  Settings,
  Crown,
  Calendar,
  Clock,
  Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';

const DashboardContainer = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
  
  h1 {
    color: #fff;
    font-size: 32px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  p {
    color: #b3b3b3;
    font-size: 16px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: #282828;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #404040;
  
  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .stat-value {
    font-size: 32px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 4px;
  }
  
  .stat-label {
    color: #b3b3b3;
    font-size: 14px;
  }
  
  .stat-change {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    margin-top: 8px;
    padding: 4px 8px;
    border-radius: 4px;
    
    &.positive {
      color: #1db954;
      background: rgba(29, 185, 84, 0.1);
    }
    
    &.negative {
      color: #f44336;
      background: rgba(244, 67, 54, 0.1);
    }
  }
`;

function AdminDashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    totalSongs: 45632,
    totalPlaylists: 8934,
    revenue: 45678,
    streams: 892341
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        streams: prev.streams + Math.floor(Math.random() * 100)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardContainer>
      <Header>
        <h1>
          <Crown />
          Admin Dashboard
        </h1>
        <p>Welcome back, {user?.username}. Here's what's happening with Musify today.</p>
      </Header>

      <StatsGrid>
        <StatCard>
          <div className="stat-header">
            <div className="stat-icon" style={{ background: 'rgba(29, 185, 84, 0.2)' }}>
              <Users size={24} color="#1db954" />
            </div>
          </div>
          <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
          <div className="stat-label">Total Users</div>
          <div className="stat-change positive">
            <TrendingUp size={12} />
            +12% from last month
          </div>
        </StatCard>

        <StatCard>
          <div className="stat-header">
            <div className="stat-icon" style={{ background: 'rgba(29, 185, 84, 0.2)' }}>
              <Activity size={24} color="#1db954" />
            </div>
          </div>
          <div className="stat-value">{stats.activeUsers.toLocaleString()}</div>
          <div className="stat-label">Active Users</div>
          <div className="stat-change positive">
            <TrendingUp size={12} />
            +8% from last week
          </div>
        </StatCard>

        <StatCard>
          <div className="stat-header">
            <div className="stat-icon" style={{ background: 'rgba(255, 193, 7, 0.2)' }}>
              <Music size={24} color="#ffc107" />
            </div>
          </div>
          <div className="stat-value">{stats.totalSongs.toLocaleString()}</div>
          <div className="stat-label">Total Songs</div>
          <div className="stat-change positive">
            <TrendingUp size={12} />
            +523 new songs
          </div>
        </StatCard>

        <StatCard>
          <div className="stat-header">
            <div className="stat-icon" style={{ background: 'rgba(156, 39, 176, 0.2)' }}>
              <Play size={24} color="#9c27b0" />
            </div>
          </div>
          <div className="stat-value">{(stats.streams / 1000000).toFixed(1)}M</div>
          <div className="stat-label">Total Streams</div>
          <div className="stat-change positive">
            <TrendingUp size={12} />
            +23% from yesterday
          </div>
        </StatCard>
      </StatsGrid>
    </DashboardContainer>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
