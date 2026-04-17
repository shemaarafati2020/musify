import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  TrendingUp,
  TrendingDown,
  Headphones,
  Music,
  Clock,
  Globe,
  BarChart3,
  PieChart,
} from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  padding: 32px;
  max-width: 1400px;
  animation: ${fadeIn} 0.4s ease;
`;

const Header = styled.div`
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

const TimeFilter = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 28px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 4px;
  width: fit-content;
`;

const TimeBtn = styled.button<{ $active?: boolean }>`
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => (props.$active ? '#7c3aed' : 'transparent')};
  color: ${props => (props.$active ? '#fff' : '#9ca3af')};

  &:hover {
    color: #fff;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 28px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr 1fr;
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

const ChartPlaceholder = styled.div`
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 4px;
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .label {
    color: #9ca3af;
    font-size: 12px;
    width: 80px;
    text-align: right;
  }

  .bar-bg {
    flex: 1;
    height: 24px;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 6px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    border-radius: 6px;
    transition: width 1s ease;
    display: flex;
    align-items: center;
    padding-left: 8px;
    font-size: 11px;
    font-weight: 600;
    color: #fff;
  }

  .value {
    color: #9ca3af;
    font-size: 12px;
    width: 50px;
  }
`;

const MetricCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const MetricIcon = styled.div<{ $bg: string }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${props => props.$bg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const MetricInfo = styled.div`
  flex: 1;

  .label {
    color: #9ca3af;
    font-size: 12px;
    margin-bottom: 2px;
  }

  .value {
    color: #fff;
    font-size: 20px;
    font-weight: 700;
  }
`;

const MetricChange = styled.span<{ $positive: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: ${props => (props.$positive ? '#34d399' : '#f87171')};
`;

const DonutChart = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 0;
`;

const DonutVisual = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(
    #8b5cf6 0% 35%,
    #06b6d4 35% 60%,
    #f59e0b 60% 80%,
    #10b981 80% 95%,
    #6b7280 95% 100%
  );
  position: relative;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    inset: 24px;
    background: #0a0a0a;
    border-radius: 50%;
  }
`;

const DonutLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 3px;
  }

  .label {
    color: #9ca3af;
    flex: 1;
  }

  .value {
    color: #fff;
    font-weight: 600;
  }
`;

const CountryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CountryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);

  .flag {
    font-size: 20px;
  }

  .name {
    color: #fff;
    font-size: 13px;
    flex: 1;
  }

  .count {
    color: #9ca3af;
    font-size: 13px;
    font-weight: 600;
  }

  .pct {
    color: #a78bfa;
    font-size: 12px;
    width: 40px;
    text-align: right;
  }
`;

export default function Analytics() {
  const [period, setPeriod] = useState('7d');

  const genreData = [
    { genre: 'Pop', value: 68, color: '#8b5cf6' },
    { genre: 'Hip-Hop', value: 54, color: '#06b6d4' },
    { genre: 'Rock', value: 42, color: '#f59e0b' },
    { genre: 'R&B', value: 38, color: '#10b981' },
    { genre: 'Electronic', value: 31, color: '#ec4899' },
    { genre: 'Latin', value: 25, color: '#f97316' },
    { genre: 'Jazz', value: 18, color: '#14b8a6' },
    { genre: 'Classical', value: 12, color: '#6b7280' },
  ];

  const countries = [
    { flag: '🇺🇸', name: 'United States', count: '4,230', pct: '33.9%' },
    { flag: '🇬🇧', name: 'United Kingdom', count: '2,140', pct: '17.1%' },
    { flag: '🇧🇷', name: 'Brazil', count: '1,890', pct: '15.1%' },
    { flag: '🇩🇪', name: 'Germany', count: '1,240', pct: '9.9%' },
    { flag: '🇫🇷', name: 'France', count: '980', pct: '7.8%' },
    { flag: '🇯🇵', name: 'Japan', count: '870', pct: '7.0%' },
  ];

  return (
    <Container>
      <Header>
        <h1>Analytics & Views</h1>
        <p>
          Track platform engagement, content performance, and user demographics
        </p>
      </Header>

      <TimeFilter>
        {['24h', '7d', '30d', '90d', '1y'].map(p => (
          <TimeBtn key={p} $active={period === p} onClick={() => setPeriod(p)}>
            {p}
          </TimeBtn>
        ))}
      </TimeFilter>

      <Grid>
        <Card>
          <CardTitle>
            <Headphones size={16} color="#8b5cf6" /> Listening Metrics
          </CardTitle>
          <MetricCard>
            <MetricIcon $bg="rgba(139, 92, 246, 0.15)">
              <Headphones size={20} color="#8b5cf6" />
            </MetricIcon>
            <MetricInfo>
              <div className="label">Total Streams</div>
              <div className="value">2.4M</div>
            </MetricInfo>
            <MetricChange $positive>
              <TrendingUp size={14} />
              +18%
            </MetricChange>
          </MetricCard>
          <MetricCard>
            <MetricIcon $bg="rgba(6, 182, 212, 0.15)">
              <Clock size={20} color="#06b6d4" />
            </MetricIcon>
            <MetricInfo>
              <div className="label">Avg. Listen Time</div>
              <div className="value">24m</div>
            </MetricInfo>
            <MetricChange $positive>
              <TrendingUp size={14} />
              +5%
            </MetricChange>
          </MetricCard>
          <MetricCard>
            <MetricIcon $bg="rgba(245, 158, 11, 0.15)">
              <Music size={20} color="#f59e0b" />
            </MetricIcon>
            <MetricInfo>
              <div className="label">Unique Tracks</div>
              <div className="value">18.2K</div>
            </MetricInfo>
            <MetricChange $positive={false}>
              <TrendingDown size={14} />
              -2%
            </MetricChange>
          </MetricCard>
        </Card>

        <Card>
          <CardTitle>
            <PieChart size={16} color="#06b6d4" /> User Demographics
          </CardTitle>
          <DonutChart>
            <DonutVisual />
            <DonutLegend>
              <LegendItem>
                <div className="dot" style={{ background: '#8b5cf6' }} />
                <span className="label">18-24</span>
                <span className="value">35%</span>
              </LegendItem>
              <LegendItem>
                <div className="dot" style={{ background: '#06b6d4' }} />
                <span className="label">25-34</span>
                <span className="value">25%</span>
              </LegendItem>
              <LegendItem>
                <div className="dot" style={{ background: '#f59e0b' }} />
                <span className="label">35-44</span>
                <span className="value">20%</span>
              </LegendItem>
              <LegendItem>
                <div className="dot" style={{ background: '#10b981' }} />
                <span className="label">45-54</span>
                <span className="value">15%</span>
              </LegendItem>
              <LegendItem>
                <div className="dot" style={{ background: '#6b7280' }} />
                <span className="label">55+</span>
                <span className="value">5%</span>
              </LegendItem>
            </DonutLegend>
          </DonutChart>
        </Card>

        <Card>
          <CardTitle>
            <Globe size={16} color="#10b981" /> Top Countries
          </CardTitle>
          <CountryList>
            {countries.map((c, i) => (
              <CountryRow key={i}>
                <span className="flag">{c.flag}</span>
                <span className="name">{c.name}</span>
                <span className="count">{c.count}</span>
                <span className="pct">{c.pct}</span>
              </CountryRow>
            ))}
          </CountryList>
        </Card>
      </Grid>

      <Card>
        <CardTitle>
          <BarChart3 size={16} color="#f59e0b" /> Genre Popularity
        </CardTitle>
        <ChartPlaceholder>
          {genreData.map((g, i) => (
            <BarRow key={i}>
              <span className="label">{g.genre}</span>
              <div className="bar-bg">
                <div
                  className="bar-fill"
                  style={{
                    width: `${g.value}%`,
                    background: `linear-gradient(90deg, ${g.color}, ${g.color}88)`,
                  }}
                >
                  {g.value}%
                </div>
              </div>
            </BarRow>
          ))}
        </ChartPlaceholder>
      </Card>
    </Container>
  );
}
