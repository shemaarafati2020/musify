import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Lock, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #121212;
  padding: 20px;
`;

const Card = styled.div`
  background: #282828;
  border-radius: 12px;
  padding: 48px;
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const Icon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: rgba(244, 67, 54, 0.1);
  border-radius: 50%;
  margin-bottom: 24px;
  
  svg {
    width: 40px;
    height: 40px;
    color: #f44336;
  }
`;

const Title = styled.h1`
  color: #fff;
  font-size: 24px;
  margin-bottom: 12px;
`;

const Message = styled.p`
  color: #b3b3b3;
  margin-bottom: 32px;
  line-height: 1.5;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #1db954;
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #1ed760;
    transform: scale(1.02);
  }
`;

const RoleInfo = styled.div`
  margin-top: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
`;

const RoleTitle = styled.h3`
  color: #fff;
  font-size: 16px;
  margin: 0 0 8px 0;
`;

const RoleDescription = styled.p`
  color: #b3b3b3;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
`;

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container>
      <Card>
        <Icon>
          <Lock />
        </Icon>
        
        <Title>Access Denied</Title>
        <Message>
          Sorry, you don't have permission to access this page.
          {user && ` Your current role is: ${user.role}`}
        </Message>
        
        <Button onClick={handleGoHome}>
          <Home size={18} />
          Go Home
        </Button>
        
        {user && (
          <RoleInfo>
            <RoleTitle>Role Permissions:</RoleTitle>
            <RoleDescription>
              {user.role === 'guest' && (
                <>
                  As a <strong>Guest</strong>, you can:
                  <br />• Search and browse music
                  <br />• Listen to previews
                  <br />• Sign up for full access
                </>
              )}
              {user.role === 'user' && (
                <>
                  As a <strong>User</strong>, you can:
                  <br />• Create and manage playlists
                  <br />• Like and save songs
                  <br />• Access your library
                  <br />• Full music streaming
                </>
              )}
              {user.role === 'admin' && (
                <>
                  As an <strong>Admin</strong>, you have full access to:
                  <br />• All user features
                  <br />• System administration
                  <br />• User management
                  <br />• Analytics and reports
                </>
              )}
            </RoleDescription>
            
            <Button 
              onClick={handleLogout} 
              style={{ 
                marginTop: '16px', 
                background: '#f44336',
                width: '100%'
              }}
            >
              Sign Out
            </Button>
          </RoleInfo>
        )}
      </Card>
    </Container>
  );
}
