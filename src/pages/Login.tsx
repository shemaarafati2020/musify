import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Music, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PublicRoute } from '../components/ProtectedRoute';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1db954 0%, #121212 100%);
  padding: 20px;
`;

const LoginCard = styled.div`
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
  justify-content: center;
  
  svg {
    width: 48px;
    height: 48px;
    color: #1db954;
  }
  
  h1 {
    color: #fff;
    font-size: 28px;
    font-weight: 700;
    margin: 0;
  }
`;

const Title = styled.h2`
  color: #fff;
  font-size: 24px;
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #b3b3b3;
  margin-bottom: 32px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 40px 12px 16px;
  background: #282828;
  border: 1px solid #404040;
  border-radius: 6px;
  color: #fff;
  font-size: 16px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #1db954;
    box-shadow: 0 0 0 2px rgba(29, 185, 84, 0.2);
  }
  
  &::placeholder {
    color: #7c7c7c;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #7c7c7c;
  cursor: pointer;
  
  &:hover {
    color: #fff;
  }
`;

const Button = styled.button`
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
  
  &:disabled {
    background: #535353;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: 14px;
  text-align: center;
  padding: 8px;
  background: rgba(244, 67, 54, 0.1);
  border-radius: 4px;
  margin-top: -10px;
`;

const DemoCredentials = styled.div`
  margin-top: 24px;
  padding: 16px;
  background: rgba(29, 185, 84, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(29, 185, 84, 0.3);
`;

const DemoTitle = styled.h4`
  color: #1db954;
  margin: 0 0 8px 0;
  font-size: 14px;
`;

const DemoInfo = styled.div`
  color: #b3b3b3;
  font-size: 12px;
  line-height: 1.5;
  
  code {
    color: #fff;
    background: #282828;
    padding: 2px 6px;
    border-radius: 3px;
  }
`;

const SignupLink = styled.p`
  color: #b3b3b3;
  text-align: center;
  margin-top: 24px;
  
  a {
    color: #1db954;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const success = await login({ email, password });
    if (success) {
      navigate('/');
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          <Music />
          <h1>Musify</h1>
        </Logo>
        
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to your account to continue</Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Mail style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#7c7c7c' }} size={18} />
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ paddingLeft: '40px' }}
            />
          </InputGroup>
          
          <InputGroup>
            <Lock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#7c7c7c' }} size={18} />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingLeft: '40px' }}
            />
            <InputIcon onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </InputIcon>
          </InputGroup>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form>
        
        <DemoCredentials>
          <DemoTitle>Demo Credentials</DemoTitle>
          <DemoInfo>
            <strong>Admin:</strong> <code>admin@musify.com</code> / <code>admin123</code><br />
            <strong>User:</strong> <code>user@musify.com</code> / <code>user123</code><br />
            <strong>Guest:</strong> No login required (limited access)
          </DemoInfo>
        </DemoCredentials>
        
        <SignupLink>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </SignupLink>
      </LoginCard>
    </LoginContainer>
  );
}

export default function Login() {
  return (
    <PublicRoute>
      <LoginForm />
    </PublicRoute>
  );
}
