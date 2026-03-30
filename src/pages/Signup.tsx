import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Music, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PublicRoute } from '../components/ProtectedRoute';

const SignupContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1db954 0%, #121212 100%);
  padding: 20px;
`;

const SignupCard = styled.div`
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
  padding: 12px 40px 12px 40px;
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

const LoginLink = styled.p`
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

function SignupForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    const success = await signup({ email, username, password });
    if (success) {
      navigate('/');
    }
  };

  return (
    <SignupContainer>
      <SignupCard>
        <Logo>
          <Music />
          <h1>Musify</h1>
        </Logo>
        
        <Title>Create Account</Title>
        <Subtitle>Join Musify to enjoy your favorite music</Subtitle>
        
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
            <User style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#7c7c7c' }} size={18} />
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
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
              minLength={6}
              style={{ paddingLeft: '40px' }}
            />
            <InputIcon onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </InputIcon>
          </InputGroup>
          
          <InputGroup>
            <Lock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#7c7c7c' }} size={18} />
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ paddingLeft: '40px' }}
            />
            <InputIcon onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </InputIcon>
          </InputGroup>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </Form>
        
        <LoginLink>
          Already have an account? <Link to="/login">Sign in</Link>
        </LoginLink>
      </SignupCard>
    </SignupContainer>
  );
}

export default function Signup() {
  return (
    <PublicRoute>
      <SignupForm />
    </PublicRoute>
  );
}
