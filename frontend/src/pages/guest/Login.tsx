import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Music2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PublicRoute } from '../../components/ProtectedRoute';

/* ─── Animations ─── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-14px) rotate(2deg); }
  66%       { transform: translateY(-7px) rotate(-1deg); }
`;
const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%       { opacity: 0.7; transform: scale(1.05); }
`;
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;
const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;

/* ─── Layout ─── */
const Page = styled.div`
  min-height: 100vh;
  display: flex;
  font-family: 'Inter', -apple-system, sans-serif;
  background: #0a0a0f;
  overflow: hidden;
`;

/* Left decorative panel */
const LeftPanel = styled.div`
  display: none;
  position: relative;
  overflow: hidden;
  background: linear-gradient(145deg, #0d1117 0%, #0f1b2d 50%, #091623 100%);

  @media (min-width: 900px) {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px;
  }
`;

const Blob = styled.div<{ $size: number; $x: number; $y: number; $delay: number; $color: string }>`
  position: absolute;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  left: ${p => p.$x}%;
  top: ${p => p.$y}%;
  border-radius: 50%;
  background: ${p => p.$color};
  filter: blur(60px);
  animation: ${pulse} ${p => 4 + p.$delay}s ease-in-out infinite;
  animation-delay: ${p => p.$delay}s;
`;

const LogoMark = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 22px;
  background: linear-gradient(135deg, #1db954, #1565c0);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  animation: ${float} 6s ease-in-out infinite;
  box-shadow: 0 20px 60px rgba(29, 185, 84, 0.35);
`;

const LeftTitle = styled.h1`
  color: #fff;
  font-size: 42px;
  font-weight: 800;
  line-height: 1.15;
  margin: 0 0 16px;
  text-align: center;
  letter-spacing: -1px;

  span {
    background: linear-gradient(135deg, #1db954, #4fc3f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const LeftSub = styled.p`
  color: rgba(255,255,255,0.5);
  font-size: 16px;
  text-align: center;
  line-height: 1.7;
  max-width: 340px;
`;

const FloatingCard = styled.div<{ $delay?: number }>`
  position: absolute;
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${float} ${p => 5 + (p.$delay ?? 0)}s ease-in-out infinite;
  animation-delay: ${p => p.$delay ?? 0}s;
`;

const NowPlayingCard = styled(FloatingCard)`
  bottom: 25%;
  left: 8%;
  width: 220px;
`;

const StatsCard = styled(FloatingCard)`
  top: 20%;
  right: 6%;
  flex-direction: column;
  align-items: flex-start;
`;

const CardDot = styled.div<{ $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${p => p.$color};
  flex-shrink: 0;
`;

const CardText = styled.div`
  .title { color: #fff; font-size: 13px; font-weight: 600; }
  .sub   { color: rgba(255,255,255,0.5); font-size: 11px; }
`;

const MiniBar = styled.div<{ $w: number; $color: string }>`
  height: 4px;
  width: ${p => p.$w}px;
  border-radius: 2px;
  background: ${p => p.$color};
`;

/* Right form panel */
const RightPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background: #0a0a0f;

  @media (min-width: 900px) {
    padding: 60px 80px;
    max-width: 520px;
  }
`;

const FormWrap = styled.div`
  width: 100%;
  max-width: 400px;
  animation: ${fadeUp} 0.6s ease both;
`;

const TopLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 48px;

  .icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, #1db954, #1565c0);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span {
    color: #fff;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }
`;

const FormHeading = styled.div`
  margin-bottom: 36px;

  h2 {
    color: #fff;
    font-size: 30px;
    font-weight: 800;
    margin: 0 0 8px;
    letter-spacing: -0.5px;
  }

  p {
    color: rgba(255,255,255,0.45);
    font-size: 15px;
    margin: 0;
  }
`;

// Quick-fill demo buttons
const DemoPills = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 28px;
  flex-wrap: wrap;
`;

const DemoPill = styled.button`
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid rgba(29,185,84,0.3);
  background: rgba(29,185,84,0.07);
  color: #1db954;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(29,185,84,0.15);
    border-color: #1db954;
    transform: translateY(-1px);
  }
`;

const FieldLabel = styled.label`
  display: block;
  color: rgba(255,255,255,0.6);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const FieldWrap = styled.div<{ $focused?: boolean; $error?: boolean }>`
  position: relative;
  margin-bottom: 20px;
  border-radius: 14px;
  border: 1.5px solid ${p => p.$error ? '#ff5252' : p.$focused ? '#1db954' : 'rgba(255,255,255,0.09)'};
  background: rgba(255,255,255,0.04);
  transition: all 0.25s;
  ${p => p.$focused && css`
    box-shadow: 0 0 0 4px rgba(29,185,84,0.1);
  `}

  &:hover {
    border-color: ${p => p.$error ? '#ff5252' : p.$focused ? '#1db954' : 'rgba(255,255,255,0.18)'};
  }
`;

const FieldIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255,255,255,0.3);
  display: flex;
  pointer-events: none;
`;

const FieldInput = styled.input`
  width: 100%;
  padding: 16px 48px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 15px;
  outline: none;

  &::placeholder { color: rgba(255,255,255,0.25); }
`;

const FieldToggle = styled.button`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255,255,255,0.35);
  cursor: pointer;
  padding: 4px;
  display: flex;
  transition: color 0.2s;

  &:hover { color: rgba(255,255,255,0.7); }
`;

const ForgotRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: -12px;
  margin-bottom: 28px;

  a {
    color: rgba(255,255,255,0.4);
    font-size: 13px;
    text-decoration: none;
    transition: color 0.2s;

    &:hover { color: #1db954; }
  }
`;

const SubmitBtn = styled.button<{ $loading?: boolean }>`
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #1db954, #17a545);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: ${p => p.$loading ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.25s;
  position: relative;
  overflow: hidden;
  opacity: ${p => p.$loading ? 0.7 : 1};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    background-size: 200% 100%;
    ${p => p.$loading && css`
      animation: ${shimmer} 1.5s infinite;
    `}
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(29,185,84,0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

const ErrorMsg = styled.div`
  background: rgba(255, 82, 82, 0.1);
  border: 1px solid rgba(255,82,82,0.25);
  border-radius: 10px;
  padding: 12px 16px;
  color: #ff7070;
  font-size: 13px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Divider = styled.div`
  position: relative;
  text-align: center;
  margin: 28px 0;

  &::before {
    content: '';
    position: absolute;
    left: 0; right: 0; top: 50%;
    height: 1px;
    background: rgba(255,255,255,0.07);
  }

  span {
    position: relative;
    background: #0a0a0f;
    padding: 0 14px;
    color: rgba(255,255,255,0.3);
    font-size: 12px;
  }
`;

const SocialRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 28px;
`;

const SocialBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px 16px;
  border-radius: 12px;
  border: 1.5px solid rgba(255,255,255,0.09);
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.75);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.18);
    color: #fff;
    transform: translateY(-1px);
  }

  img { width: 18px; height: 18px; }
`;

const FooterLink = styled.p`
  text-align: center;
  color: rgba(255,255,255,0.4);
  font-size: 14px;
  margin-top: 24px;

  a {
    color: #1db954;
    font-weight: 600;
    text-decoration: none;

    &:hover { text-decoration: underline; }
  }
`;

/* ─── Component ─── */
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [pwdFocused, setPwdFocused] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const ok = await login({ email, password });
    if (ok) navigate('/');
  };

  const quickFill = (role: 'admin' | 'user') => {
    clearError();
    if (role === 'admin') { setEmail('admin@musify.com'); setPassword('admin123'); }
    else                  { setEmail('user@musify.com');  setPassword('user123'); }
  };

  return (
    <Page>
      {/* ── Left decorative panel ── */}
      <LeftPanel>
        <Blob $size={400} $x={-10} $y={-10} $delay={0} $color="rgba(29,185,84,0.18)" />
        <Blob $size={300} $x={60} $y={50}  $delay={2} $color="rgba(21,101,192,0.18)" />
        <Blob $size={200} $x={20} $y={70}  $delay={1} $color="rgba(139,92,246,0.12)" />

        <LogoMark><Music2 size={38} color="#fff" /></LogoMark>
        <LeftTitle>Music that <br /><span>moves you.</span></LeftTitle>
        <LeftSub>
          Stream 90 million songs, podcasts, and live sessions. Discover something new every day with Musify.
        </LeftSub>

        {/* floating now-playing card */}
        <NowPlayingCard>
          <CardDot $color="linear-gradient(135deg,#1db954,#0d7a37)" />
          <CardText>
            <div className="title">Blinding Lights</div>
            <div className="sub">The Weeknd · After Hours</div>
          </CardText>
        </NowPlayingCard>

        {/* floating stats card */}
        <StatsCard>
          <CardText>
            <div className="title" style={{ marginBottom: 10 }}>Listening Stats</div>
          </CardText>
          {[['Pop', 68, '#1db954'], ['Hip-Hop', 52, '#4fc3f7'], ['Rock', 41, '#f06292']].map(([g,w,c]) => (
            <div key={String(g)} style={{ display:'flex', alignItems:'center', gap:8, width:'100%' }}>
              <span style={{ color:'rgba(255,255,255,0.5)', fontSize:11, width:52 }}>{String(g)}</span>
              <MiniBar $w={Number(w)} $color={String(c)} />
              <span style={{ color:'rgba(255,255,255,0.4)', fontSize:11 }}>{w}%</span>
            </div>
          ))}
        </StatsCard>
      </LeftPanel>

      {/* ── Right form panel ── */}
      <RightPanel>
        <FormWrap>
          <TopLogo>
            <div className="icon"><Music2 size={20} color="#fff" /></div>
            <span>Musify</span>
          </TopLogo>

          <FormHeading>
            <h2>Welcome back 👋</h2>
            <p>Sign back in to your account to continue listening.</p>
          </FormHeading>

          {/* Quick-fill demo pills */}
          <DemoPills>
            <span style={{ color:'rgba(255,255,255,0.35)', fontSize:12, display:'flex', alignItems:'center' }}>Try demo:</span>
            <DemoPill onClick={() => quickFill('admin')}>Admin</DemoPill>
            <DemoPill onClick={() => quickFill('user')}>User</DemoPill>
          </DemoPills>

          {error && (
            <ErrorMsg>
              <span style={{ fontSize: 16 }}>⚠</span> {error}
            </ErrorMsg>
          )}

          <form onSubmit={handleSubmit}>
            <FieldLabel htmlFor="email">Email address</FieldLabel>
            <FieldWrap $focused={emailFocused}>
              <FieldIcon><Mail size={17} /></FieldIcon>
              <FieldInput
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                required
              />
            </FieldWrap>

            <FieldLabel htmlFor="password">Password</FieldLabel>
            <FieldWrap $focused={pwdFocused}>
              <FieldIcon><Lock size={17} /></FieldIcon>
              <FieldInput
                id="password"
                type={showPwd ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setPwdFocused(true)}
                onBlur={() => setPwdFocused(false)}
                required
              />
              <FieldToggle type="button" onClick={() => setShowPwd(p => !p)}>
                {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
              </FieldToggle>
            </FieldWrap>

            <ForgotRow>
              <a href="#">Forgot password?</a>
            </ForgotRow>

            <SubmitBtn type="submit" disabled={isLoading} $loading={isLoading}>
              {isLoading ? (
                <><Spinner />Signing in…</>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </SubmitBtn>
          </form>

          <Divider><span>or continue with</span></Divider>

          <SocialRow>
            <SocialBtn type="button">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </SocialBtn>
            <SocialBtn type="button">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              GitHub
            </SocialBtn>
          </SocialRow>

          <FooterLink>
            Don't have an account? <Link to="/signup">Create one free →</Link>
          </FooterLink>
        </FormWrap>
      </RightPanel>
    </Page>
  );
}

export default function Login() {
  return (
    <PublicRoute>
      <LoginForm />
    </PublicRoute>
  );
}
