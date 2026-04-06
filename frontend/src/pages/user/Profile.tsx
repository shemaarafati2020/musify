import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  Camera,
  Music,
  Heart,
  ListMusic,
  Clock,
  Shield,
  Save,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { api } from '../../services/api';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  min-height: 100%;
  background: linear-gradient(to bottom, #1a1a2e 0%, #121212 300px);
  animation: ${fadeIn} 0.4s ease;
`;

const ProfileBanner = styled.div`
  padding: 24px 32px 32px;
  display: flex;
  align-items: flex-end;
  gap: 28px;
`;

const AvatarContainer = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const Avatar = styled.img`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(139, 92, 246, 0.3);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
`;

const AvatarOverlay = styled.button`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;

  .label {
    color: #9ca3af;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
  }

  .username {
    color: #fff;
    font-size: 48px;
    font-weight: 800;
    margin-bottom: 8px;
    line-height: 1;
  }

  .role-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
    background: rgba(139, 92, 246, 0.15);
    color: #a78bfa;
    margin-bottom: 12px;
  }

  .stats {
    display: flex;
    gap: 24px;
    color: #9ca3af;
    font-size: 14px;

    span {
      font-weight: 600;
      color: #fff;
    }
  }
`;

const Content = styled.div`
  padding: 0 32px 32px;
`;

const SectionTitle = styled.h2`
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  margin: 32px 0 20px 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
`;

const StatIcon = styled.div<{ $bg: string }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${props => props.$bg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StatInfo = styled.div`
  .value {
    color: #fff;
    font-size: 22px;
    font-weight: 700;
  }
  .label {
    color: #9ca3af;
    font-size: 12px;
  }
`;

const EditSection = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 28px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  label {
    display: block;
    color: #9ca3af;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 8px;
  }

  input {
    width: 100%;
    padding: 10px 14px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: #1db954;
    }
    &::placeholder {
      color: #6b7280;
    }
  }
`;

const SaveBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: #1db954;
  border: none;
  border-radius: 20px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.2s;

  &:hover {
    background: #1ed760;
    transform: scale(1.02);
  }
`;

function ProfileContent() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaveMsg('');
    try {
      await api.put(`/api/users/${user.id}`, formData);
      setSaveMsg('Profile updated!');
    } catch {
      setSaveMsg('Failed to save changes.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  return (
    <Container>
      <ProfileBanner>
        <AvatarContainer>
          <Avatar
            src={
              user?.avatar ||
              'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
            }
            alt="Avatar"
          />
          <AvatarOverlay>
            <Camera size={28} />
          </AvatarOverlay>
        </AvatarContainer>
        <ProfileInfo>
          <div className="label">Profile</div>
          <div className="username">{user?.username || 'User'}</div>
          <div className="role-badge">
            <Shield size={12} />
            {user?.role || 'user'}
          </div>
          <div className="stats">
            <div>
              <span>42</span> Playlists
            </div>
            <div>
              <span>156</span> Following
            </div>
            <div>
              <span>89</span> Followers
            </div>
          </div>
        </ProfileInfo>
      </ProfileBanner>

      <Content>
        <StatsGrid>
          <StatCard>
            <StatIcon $bg="rgba(29, 185, 84, 0.15)">
              <Music size={20} color="#1db954" />
            </StatIcon>
            <StatInfo>
              <div className="value">2,847</div>
              <div className="label">Songs Played</div>
            </StatInfo>
          </StatCard>
          <StatCard>
            <StatIcon $bg="rgba(236, 72, 153, 0.15)">
              <Heart size={20} color="#ec4899" />
            </StatIcon>
            <StatInfo>
              <div className="value">234</div>
              <div className="label">Liked Songs</div>
            </StatInfo>
          </StatCard>
          <StatCard>
            <StatIcon $bg="rgba(139, 92, 246, 0.15)">
              <ListMusic size={20} color="#8b5cf6" />
            </StatIcon>
            <StatInfo>
              <div className="value">42</div>
              <div className="label">Playlists</div>
            </StatInfo>
          </StatCard>
          <StatCard>
            <StatIcon $bg="rgba(6, 182, 212, 0.15)">
              <Clock size={20} color="#06b6d4" />
            </StatIcon>
            <StatInfo>
              <div className="value">148h</div>
              <div className="label">Listen Time</div>
            </StatInfo>
          </StatCard>
        </StatsGrid>

        <SectionTitle>Edit Profile</SectionTitle>
        <EditSection>
          <FormGrid>
            <FormGroup>
              <label>Username</label>
              <input
                value={formData.username}
                onChange={e =>
                  setFormData(p => ({ ...p, username: e.target.value }))
                }
                placeholder="Your username"
              />
            </FormGroup>
            <FormGroup>
              <label>Email</label>
              <input
                value={formData.email}
                onChange={e =>
                  setFormData(p => ({ ...p, email: e.target.value }))
                }
                placeholder="Your email"
                type="email"
              />
            </FormGroup>
          </FormGrid>
          <SaveBtn onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={16} /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </SaveBtn>
          {saveMsg && <span style={{ color: saveMsg.includes('Failed') ? '#ff5252' : '#1db954', fontSize: 13, marginTop: 12, display: 'block' }}>{saveMsg}</span>}
        </EditSection>
      </Content>
    </Container>
  );
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
