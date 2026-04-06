import { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { ProtectedRoute } from '../../components/ProtectedRoute';

const Container = styled.div`
  padding: 24px 24px 24px;
  max-width: 800px;
  margin: 0 auto;
  min-height: 100%;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 32px;
  margin-bottom: 32px;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  color: #fff;
  font-size: 20px;
  margin-bottom: 24px;
  border-bottom: 1px solid #282828;
  padding-bottom: 12px;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #282828;
`;

const SettingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SettingName = styled.span`
  color: #fff;
  font-size: 16px;
`;

const SettingDescription = styled.span`
  color: #b3b3b3;
  font-size: 14px;
`;

const Toggle = styled.label`
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
    background-color: #535353;
    transition: 0.4s;
    border-radius: 24px;

    &:before {
      position: absolute;
      content: '';
      height: 16px;
      width: 16px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.4s;
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

const Select = styled.select`
  background: #282828;
  color: #fff;
  border: 1px solid #535353;
  padding: 8px 12px;
  border-radius: 4px;
  outline: none;

  &:focus {
    border-color: #1db954;
  }
`;

function SettingsContent() {
  const { user } = useAuth();

  const [autoplay, setAutoplay] = useState(user?.preferences?.autoplay ?? true);
  const [explicit, setExplicit] = useState(
    user?.preferences?.explicitContent ?? false
  );
  const [language, setLanguage] = useState(user?.preferences?.language ?? 'en');

  return (
    <Container>
      <Title>Settings</Title>

      <Section>
        <SectionTitle>Playback</SectionTitle>
        <SettingRow>
          <SettingInfo>
            <SettingName>Autoplay</SettingName>
            <SettingDescription>
              Enjoy nonstop listening. When your audio ends, we'll play you
              something similar.
            </SettingDescription>
          </SettingInfo>
          <Toggle>
            <input
              type="checkbox"
              checked={autoplay}
              onChange={e => setAutoplay(e.target.checked)}
            />
            <span />
          </Toggle>
        </SettingRow>

        <SettingRow>
          <SettingInfo>
            <SettingName>Explicit Content</SettingName>
            <SettingDescription>
              Allow playback of explicit content.
            </SettingDescription>
          </SettingInfo>
          <Toggle>
            <input
              type="checkbox"
              checked={explicit}
              onChange={e => setExplicit(e.target.checked)}
            />
            <span />
          </Toggle>
        </SettingRow>
      </Section>

      <Section>
        <SectionTitle>Display</SectionTitle>
        <SettingRow>
          <SettingInfo>
            <SettingName>Language</SettingName>
            <SettingDescription>
              Choose language for the app.
            </SettingDescription>
          </SettingInfo>
          <Select value={language} onChange={e => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </Select>
        </SettingRow>
      </Section>
    </Container>
  );
}

export default function Settings() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
