import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  Save,
  Shield,
  Bell,
  Globe,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  padding: 32px;
  max-width: 900px;
  animation: ${fadeIn} 0.4s ease;
`;

const Header = styled.div`
  margin-bottom: 32px;

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

const Section = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;

  h2 {
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    margin: 0;
  }

  svg {
    color: #a78bfa;
  }
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);

  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div`
  flex: 1;

  .name {
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 2px;
  }
  .desc {
    color: #6b7280;
    font-size: 12px;
  }
`;

const Toggle = styled.button<{ $active: boolean }>`
  width: 48px;
  height: 26px;
  border-radius: 13px;
  border: none;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  background: ${props => (props.$active ? '#7c3aed' : '#374151')};

  &::before {
    content: '';
    position: absolute;
    top: 3px;
    left: ${props => (props.$active ? '25px' : '3px')};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    transition: left 0.3s;
  }
`;

const Input = styled.input`
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  width: 280px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #7c3aed;
  }

  &::placeholder {
    color: #6b7280;
  }
`;

const Select = styled.select`
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  width: 280px;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #7c3aed;
  }

  option {
    background: #1a1a2e;
    color: #fff;
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
  }
`;

const DangerZone = styled.div`
  background: rgba(248, 113, 113, 0.04);
  border: 1px solid rgba(248, 113, 113, 0.1);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
`;

const DangerButton = styled.button`
  padding: 10px 20px;
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.3);
  border-radius: 8px;
  color: #f87171;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(248, 113, 113, 0.2);
  }
`;

const Toast = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: 110px;
  right: 32px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  background: #1e1e30;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  color: #fff;
  font-size: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  transform: ${props =>
    props.$visible ? 'translateY(0)' : 'translateY(20px)'};
  opacity: ${props => (props.$visible ? 1 : 0)};
  transition: all 0.3s;
  z-index: 100;
`;

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    registrationOpen: true,
    emailVerification: true,
    twoFactorAuth: false,
    explicitFilter: true,
    autoModeration: true,
    rateLimiting: true,
    debugMode: false,
    siteName: 'Musify',
    supportEmail: 'support@musify.com',
    maxUploadSize: '50',
    sessionTimeout: '30',
    language: 'en',
    timezone: 'UTC',
  });

  const [showToast, setShowToast] = useState(false);

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <Container>
      <Header>
        <h1>System Settings</h1>
        <p>Configure platform behavior, security, and operational settings</p>
      </Header>

      <Section>
        <SectionTitle>
          <Globe size={18} />
          <h2>General</h2>
        </SectionTitle>
        <SettingRow>
          <SettingInfo>
            <div className="name">Site Name</div>
            <div className="desc">The public name of your platform</div>
          </SettingInfo>
          <Input
            value={settings.siteName}
            onChange={e =>
              setSettings(prev => ({ ...prev, siteName: e.target.value }))
            }
          />
        </SettingRow>
        <SettingRow>
          <SettingInfo>
            <div className="name">Default Language</div>
            <div className="desc">Default language for new users</div>
          </SettingInfo>
          <Select
            value={settings.language}
            onChange={e =>
              setSettings(prev => ({ ...prev, language: e.target.value }))
            }
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </Select>
        </SettingRow>
        <SettingRow>
          <SettingInfo>
            <div className="name">Timezone</div>
            <div className="desc">Default timezone for analytics and logs</div>
          </SettingInfo>
          <Select
            value={settings.timezone}
            onChange={e =>
              setSettings(prev => ({ ...prev, timezone: e.target.value }))
            }
          >
            <option value="UTC">UTC</option>
            <option value="EST">Eastern (EST)</option>
            <option value="PST">Pacific (PST)</option>
            <option value="CET">Central European (CET)</option>
          </Select>
        </SettingRow>
      </Section>

      <Section>
        <SectionTitle>
          <Shield size={18} />
          <h2>Security</h2>
        </SectionTitle>
        <SettingRow>
          <SettingInfo>
            <div className="name">Open Registration</div>
            <div className="desc">Allow new users to register</div>
          </SettingInfo>
          <Toggle
            $active={settings.registrationOpen}
            onClick={() => toggleSetting('registrationOpen')}
          />
        </SettingRow>
        <SettingRow>
          <SettingInfo>
            <div className="name">Email Verification</div>
            <div className="desc">
              Require email verification for new accounts
            </div>
          </SettingInfo>
          <Toggle
            $active={settings.emailVerification}
            onClick={() => toggleSetting('emailVerification')}
          />
        </SettingRow>
        <SettingRow>
          <SettingInfo>
            <div className="name">Two-Factor Authentication</div>
            <div className="desc">Require 2FA for admin accounts</div>
          </SettingInfo>
          <Toggle
            $active={settings.twoFactorAuth}
            onClick={() => toggleSetting('twoFactorAuth')}
          />
        </SettingRow>
        <SettingRow>
          <SettingInfo>
            <div className="name">Rate Limiting</div>
            <div className="desc">Enable API rate limiting</div>
          </SettingInfo>
          <Toggle
            $active={settings.rateLimiting}
            onClick={() => toggleSetting('rateLimiting')}
          />
        </SettingRow>
      </Section>

      <Section>
        <SectionTitle>
          <Bell size={18} />
          <h2>Content & Moderation</h2>
        </SectionTitle>
        <SettingRow>
          <SettingInfo>
            <div className="name">Explicit Content Filter</div>
            <div className="desc">Filter explicit content by default</div>
          </SettingInfo>
          <Toggle
            $active={settings.explicitFilter}
            onClick={() => toggleSetting('explicitFilter')}
          />
        </SettingRow>
        <SettingRow>
          <SettingInfo>
            <div className="name">Auto Moderation</div>
            <div className="desc">
              Automatically flag potentially harmful content
            </div>
          </SettingInfo>
          <Toggle
            $active={settings.autoModeration}
            onClick={() => toggleSetting('autoModeration')}
          />
        </SettingRow>
        <SettingRow>
          <SettingInfo>
            <div className="name">Support Email</div>
            <div className="desc">Email for support inquiries</div>
          </SettingInfo>
          <Input
            value={settings.supportEmail}
            onChange={e =>
              setSettings(prev => ({ ...prev, supportEmail: e.target.value }))
            }
          />
        </SettingRow>
      </Section>

      <DangerZone>
        <SectionTitle>
          <AlertTriangle size={18} color="#f87171" />
          <h2 style={{ color: '#f87171' }}>Danger Zone</h2>
        </SectionTitle>
        <SettingRow>
          <SettingInfo>
            <div className="name">Maintenance Mode</div>
            <div className="desc">
              Take the platform offline for maintenance
            </div>
          </SettingInfo>
          <Toggle
            $active={settings.maintenanceMode}
            onClick={() => toggleSetting('maintenanceMode')}
          />
        </SettingRow>
        <SettingRow>
          <SettingInfo>
            <div className="name">Purge All Cache</div>
            <div className="desc">
              Clear all cached data. May cause temporary slowdowns.
            </div>
          </SettingInfo>
          <DangerButton>Purge Cache</DangerButton>
        </SettingRow>
        <SettingRow>
          <SettingInfo>
            <div className="name">Debug Mode</div>
            <div className="desc">
              Enable verbose logging. Not recommended for production.
            </div>
          </SettingInfo>
          <Toggle
            $active={settings.debugMode}
            onClick={() => toggleSetting('debugMode')}
          />
        </SettingRow>
      </DangerZone>

      <SaveButton onClick={handleSave}>
        <Save size={16} />
        Save Changes
      </SaveButton>

      <Toast $visible={showToast}>
        <CheckCircle size={16} color="#34d399" />
        Settings saved successfully
      </Toast>
    </Container>
  );
}
