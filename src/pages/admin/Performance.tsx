import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  Activity,
  Wifi,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Server,
  Database,
  Zap,
} from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const Container = styled.div`
  padding: 32px;
  max-width: 1400px;
  animation: ${fadeIn} 0.4s ease;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;

  h1 {
    color: #fff;
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 6px 0;
  }
  p {
    color: #9ca3af;
    font-size: 14px;
    margin: 0;
  }
`;

const RefreshBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #9ca3af;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.15);
  }
`;

const StatusBanner = styled.div<{ $healthy: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-radius: 12px;
  margin-bottom: 28px;
  background: ${props =>
    props.$healthy
      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.02))'
      : 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(245, 158, 11, 0.02))'};
  border: 1px solid
    ${props =>
      props.$healthy ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'};

  .icon {
    color: ${props => (props.$healthy ? '#34d399' : '#fbbf24')};
  }

  .text {
    flex: 1;
    .title {
      color: #fff;
      font-size: 14px;
      font-weight: 600;
    }
    .desc {
      color: #9ca3af;
      font-size: 12px;
      margin-top: 2px;
    }
  }

  .live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => (props.$healthy ? '#34d399' : '#fbbf24')};
    animation: ${pulse} 2s infinite;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const GaugeCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
`;

const GaugeRing = styled.div<{ $value: number; $color: string }>`
  width: 100px;
  height: 100px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: conic-gradient(
    ${props => props.$color} 0% ${props => props.$value}%,
    rgba(255, 255, 255, 0.06) ${props => props.$value}% 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::after {
    content: '';
    width: 76px;
    height: 76px;
    border-radius: 50%;
    background: #0e0e14;
    position: absolute;
  }

  .value {
    position: relative;
    z-index: 1;
    color: #fff;
    font-size: 22px;
    font-weight: 700;
  }
`;

const GaugeLabel = styled.div`
  color: #9ca3af;
  font-size: 13px;
  font-weight: 500;
`;

const GaugeStatus = styled.div<{ $color: string }>`
  color: ${props => props.$color};
  font-size: 12px;
  font-weight: 600;
  margin-top: 4px;
`;

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 24px;
`;

const CardTitle = styled.h3`
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ServiceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.02);

  &:last-child {
    margin-bottom: 0;
  }
`;

const ServiceIcon = styled.div<{ $bg: string }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${props => props.$bg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ServiceInfo = styled.div`
  flex: 1;
  .name {
    color: #fff;
    font-size: 13px;
    font-weight: 500;
  }
  .desc {
    color: #6b7280;
    font-size: 11px;
  }
`;

const ServiceStatus = styled.div<{ $status: 'healthy' | 'warning' | 'error' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: ${props => {
    switch (props.$status) {
      case 'healthy':
        return '#34d399';
      case 'warning':
        return '#fbbf24';
      case 'error':
        return '#f87171';
    }
  }};
`;

const LogEntry = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 6px;
  font-size: 12px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  background: rgba(255, 255, 255, 0.02);

  &:last-child {
    margin-bottom: 0;
  }

  .time {
    color: #6b7280;
    white-space: nowrap;
  }

  .msg {
    color: #d1d5db;
    flex: 1;
  }
`;

const LogLevel = styled.span<{ $level: string }>`
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;

  ${props => {
    switch (props.$level) {
      case 'info':
        return 'background: rgba(6, 182, 212, 0.15); color: #67e8f9;';
      case 'warn':
        return 'background: rgba(245, 158, 11, 0.15); color: #fbbf24;';
      case 'error':
        return 'background: rgba(248, 113, 113, 0.15); color: #f87171;';
      default:
        return '';
    }
  }}
`;

export default function Performance() {
  const [metrics, setMetrics] = useState({
    cpu: 42,
    memory: 67,
    disk: 54,
    network: 23,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.min(100, Math.max(10, prev.cpu + (Math.random() * 10 - 5))),
        memory: Math.min(
          100,
          Math.max(30, prev.memory + (Math.random() * 6 - 3))
        ),
        disk: Math.min(100, Math.max(40, prev.disk + (Math.random() * 2 - 1))),
        network: Math.min(
          100,
          Math.max(5, prev.network + (Math.random() * 8 - 4))
        ),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getColor = (value: number) => {
    if (value < 50) return '#34d399';
    if (value < 80) return '#fbbf24';
    return '#f87171';
  };

  const getStatus = (value: number) => {
    if (value < 50) return 'Normal';
    if (value < 80) return 'Moderate';
    return 'High';
  };

  const services = [
    {
      name: 'API Server',
      desc: 'REST API v3.2.1',
      icon: <Server size={16} color="#8b5cf6" />,
      bg: 'rgba(139,92,246,0.15)',
      status: 'healthy' as const,
    },
    {
      name: 'Database',
      desc: 'PostgreSQL 15',
      icon: <Database size={16} color="#06b6d4" />,
      bg: 'rgba(6,182,212,0.15)',
      status: 'healthy' as const,
    },
    {
      name: 'CDN',
      desc: 'Content Delivery Network',
      icon: <Wifi size={16} color="#10b981" />,
      bg: 'rgba(16,185,129,0.15)',
      status: 'healthy' as const,
    },
    {
      name: 'Auth Service',
      desc: 'OAuth 2.0',
      icon: <Zap size={16} color="#f59e0b" />,
      bg: 'rgba(245,158,11,0.15)',
      status: 'warning' as const,
    },
    {
      name: 'Search Engine',
      desc: 'Elasticsearch 8.x',
      icon: <Activity size={16} color="#ec4899" />,
      bg: 'rgba(236,72,153,0.15)',
      status: 'healthy' as const,
    },
  ];

  const logs = [
    { time: '10:23:45', level: 'info', msg: 'User session started: user_8892' },
    {
      time: '10:23:42',
      level: 'info',
      msg: 'Playlist created: Summer Mix 2026',
    },
    {
      time: '10:23:38',
      level: 'warn',
      msg: 'Auth service response time > 200ms',
    },
    {
      time: '10:23:30',
      level: 'info',
      msg: 'CDN cache refreshed for region: EU-West',
    },
    {
      time: '10:23:25',
      level: 'error',
      msg: 'Failed to fetch album art: timeout',
    },
    {
      time: '10:23:20',
      level: 'info',
      msg: 'Database backup completed successfully',
    },
    {
      time: '10:23:15',
      level: 'info',
      msg: 'New user registered: jane_doe_42',
    },
    {
      time: '10:23:10',
      level: 'warn',
      msg: 'Rate limit approaching for API key: *****3a2f',
    },
  ];

  return (
    <Container>
      <Header>
        <div>
          <h1>Performance Monitoring</h1>
          <p>Real-time system health, resource usage, and service status</p>
        </div>
        <RefreshBtn>
          <RefreshCw size={14} />
          Refresh
        </RefreshBtn>
      </Header>

      <StatusBanner $healthy>
        <CheckCircle size={20} className="icon" />
        <div className="text">
          <div className="title">All Systems Operational</div>
          <div className="desc">
            Last checked 5 seconds ago · Uptime: 99.98%
          </div>
        </div>
        <div className="live-dot" />
      </StatusBanner>

      <Grid>
        <GaugeCard>
          <GaugeRing
            $value={Math.round(metrics.cpu)}
            $color={getColor(metrics.cpu)}
          >
            <span className="value">{Math.round(metrics.cpu)}%</span>
          </GaugeRing>
          <GaugeLabel>CPU Usage</GaugeLabel>
          <GaugeStatus $color={getColor(metrics.cpu)}>
            {getStatus(Math.round(metrics.cpu))}
          </GaugeStatus>
        </GaugeCard>

        <GaugeCard>
          <GaugeRing
            $value={Math.round(metrics.memory)}
            $color={getColor(metrics.memory)}
          >
            <span className="value">{Math.round(metrics.memory)}%</span>
          </GaugeRing>
          <GaugeLabel>Memory</GaugeLabel>
          <GaugeStatus $color={getColor(metrics.memory)}>
            {getStatus(Math.round(metrics.memory))}
          </GaugeStatus>
        </GaugeCard>

        <GaugeCard>
          <GaugeRing
            $value={Math.round(metrics.disk)}
            $color={getColor(metrics.disk)}
          >
            <span className="value">{Math.round(metrics.disk)}%</span>
          </GaugeRing>
          <GaugeLabel>Disk I/O</GaugeLabel>
          <GaugeStatus $color={getColor(metrics.disk)}>
            {getStatus(Math.round(metrics.disk))}
          </GaugeStatus>
        </GaugeCard>

        <GaugeCard>
          <GaugeRing
            $value={Math.round(metrics.network)}
            $color={getColor(metrics.network)}
          >
            <span className="value">{Math.round(metrics.network)}%</span>
          </GaugeRing>
          <GaugeLabel>Network</GaugeLabel>
          <GaugeStatus $color={getColor(metrics.network)}>
            {getStatus(Math.round(metrics.network))}
          </GaugeStatus>
        </GaugeCard>
      </Grid>

      <BottomGrid>
        <Card>
          <CardTitle>
            <Server size={16} color="#8b5cf6" /> Service Health
          </CardTitle>
          {services.map((svc, i) => (
            <ServiceRow key={i}>
              <ServiceIcon $bg={svc.bg}>{svc.icon}</ServiceIcon>
              <ServiceInfo>
                <div className="name">{svc.name}</div>
                <div className="desc">{svc.desc}</div>
              </ServiceInfo>
              <ServiceStatus $status={svc.status}>
                {svc.status === 'healthy' ? (
                  <CheckCircle size={12} />
                ) : (
                  <AlertTriangle size={12} />
                )}
                {svc.status}
              </ServiceStatus>
            </ServiceRow>
          ))}
        </Card>

        <Card>
          <CardTitle>
            <Clock size={16} color="#06b6d4" /> System Logs
          </CardTitle>
          {logs.map((log, i) => (
            <LogEntry key={i}>
              <span className="time">{log.time}</span>
              <LogLevel $level={log.level}>{log.level}</LogLevel>
              <span className="msg">{log.msg}</span>
            </LogEntry>
          ))}
        </Card>
      </BottomGrid>
    </Container>
  );
}
