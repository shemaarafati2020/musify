import { useState } from 'react';
import styled from 'styled-components';
import { Music, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  background: #282828;
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  
  svg {
    width: 32px;
    height: 32px;
    color: #1db954;
  }
`;

const Title = styled.h2`
  color: #fff;
  font-size: 24px;
  margin: 0;
`;

const Description = styled.p`
  color: #b3b3b3;
  margin-bottom: 32px;
  line-height: 1.5;
`;

const Features = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
`;

const FeatureIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(29, 185, 84, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 14px;
    height: 14px;
    color: #1db954;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  ${props => props.$variant === 'primary' ? `
    background: #1db954;
    color: #fff;
    
    &:hover {
      background: #1ed760;
    }
  ` : `
    background: transparent;
    color: #fff;
    border: 1px solid #404040;
    
    &:hover {
      border-color: #fff;
    }
  `}
`;

interface GuestAccessProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuestAccess({ isOpen, onClose }: GuestAccessProps) {
  const { login } = useAuth();

  const handleContinueAsGuest = () => {
    // Create a guest user session
    login({ 
      email: 'guest@musify.com', 
      password: 'guest' 
    }).then(() => {
      onClose();
    });
  };

  const handleSignUp = () => {
    onClose();
    // Navigate to signup would be handled by the parent
    window.location.href = '/signup';
  };

  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>
        
        <Header>
          <Music />
          <Title>Welcome to Musify</Title>
        </Header>
        
        <Description>
          Choose how you'd like to experience Musify. Sign up for the full experience or continue as a guest with limited access.
        </Description>
        
        <Features>
          <Feature>
            <FeatureIcon>
              <ChevronRight size={14} />
            </FeatureIcon>
            <span>Search and browse millions of songs</span>
          </Feature>
          <Feature>
            <FeatureIcon>
              <ChevronRight size={14} />
            </FeatureIcon>
            <span>Discover new music and playlists</span>
          </Feature>
          <Feature>
            <FeatureIcon>
              <ChevronRight size={14} />
            </FeatureIcon>
            <span>30-second previews of all tracks</span>
          </Feature>
        </Features>
        
        <Actions>
          <Button onClick={handleContinueAsGuest}>
            Continue as Guest
          </Button>
          <Button $variant="secondary" onClick={handleSignUp}>
            Sign Up Free
          </Button>
        </Actions>
      </Modal>
    </Overlay>
  );
}
