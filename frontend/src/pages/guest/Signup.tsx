import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Music2, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PublicRoute } from '../../components/ProtectedRoute';

/* ─── Animations ─── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
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
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
`;
const checkPop = keyframes`
  0%   { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

/* ─── Layout ─── */
const Page = styled.div`
  min-height: 100vh;
  display: flex;
  font-family: 'Inter', -apple-system, sans-serif;
  background: #0a0a0f;
  overflow: hidden;
`;

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
  animation: ${float} 5s ease-in-out infinite;
  box-shadow: 0 20px 60px rgba(29, 185, 84, 0.35);
`;

const LeftTitle = styled.h1`
  color: #fff;
  font-size: 40px;
  font-weight: 800;
  line-height: 1.2;
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
  margin-bottom: 48px;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 320px;
`;

const FeatureItem = styled.div<{ $delay: number }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  animation: ${fadeUp} 0.6s ease both;
  animation-delay: ${p => p.$delay}s;
`;

const FeatureIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${p => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
`;

const FeatureText = styled.div`
  .title { color: #fff; font-size: 14px; font-weight: 600; }
  .sub   { color: rgba(255,255,255,0.4); font-size: 12px; }
`;

/* ─── Right Panel ─── */
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
    width: 38px; height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, #1db954, #1565c0);
    display: flex; align-items: center; justify-content: center;
  }

  span { color: #fff; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
`;

const FormHeading = styled.div`
  margin-bottom: 32px;

  h2 { color: #fff; font-size: 28px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.5px; }
  p  { color: rgba(255,255,255,0.45); font-size: 15px; margin: 0; }
`;

const FieldLabel = styled.label`
  display: block;
  color: rgba(255,255,255,0.55);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const FieldWrap = styled.div<{ $focused?: boolean; $error?: boolean }>`
  position: relative;
  margin-bottom: 18px;
  border-radius: 14px;
  border: 1.5px solid ${p => p.$error ? '#ff5252' : p.$focused ? '#1db954' : 'rgba(255,255,255,0.09)'};
  background: rgba(255,255,255,0.04);
  transition: all 0.25s;
  ${p => p.$focused && css`box-shadow: 0 0 0 4px rgba(29,185,84,0.1);`}

  &:hover {
    border-color: ${p => p.$error ? '#ff5252' : p.$focused ? '#1db954' : 'rgba(255,255,255,0.18)'};
  }
`;

const FieldIcon = styled.div`
  position: absolute;
  left: 16px; top: 50%;
  transform: translateY(-50%);
  color: rgba(255,255,255,0.3);
  display: flex;
  pointer-events: none;
`;

const FieldInput = styled.input`
  width: 100%;
  padding: 15px 48px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 15px;
  outline: none;

  &::placeholder { color: rgba(255,255,255,0.22); }
`;

const FieldToggle = styled.button`
  position: absolute;
  right: 14px; top: 50%;
  transform: translateY(-50%);
  background: none; border: none;
  color: rgba(255,255,255,0.35);
  cursor: pointer; padding: 4px; display: flex;
  transition: color 0.2s;

  &:hover { color: rgba(255,255,255,0.7); }
`;

/* ── Password strength ── */
const StrengthRow = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 6px;
  margin-bottom: 10px;
`;

const StrengthBar = styled.div<{ $filled: boolean; $color: string }>`
  flex: 1;
  height: 3px;
  border-radius: 2px;
  background: ${p => p.$filled ? p.$color : 'rgba(255,255,255,0.1)'};
  transition: background 0.3s;
`;

const StrengthLabel = styled.div<{ $color: string }>`
  font-size: 11px;
  color: ${p => p.$color};
  text-align: right;
  margin-bottom: 14px;
  font-weight: 600;
`;

const TermsRow = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  margin-bottom: 24px;
  user-select: none;
`;

const CheckBox = styled.div<{ $checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1.5px solid ${p => p.$checked ? '#1db954' : 'rgba(255,255,255,0.2)'};
  background: ${p => p.$checked ? '#1db954' : 'transparent'};
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
  margin-top: 1px;

  svg {
    animation: ${checkPop} 0.3s ease both;
  }
`;

const TermsText = styled.span`
  color: rgba(255,255,255,0.45);
  font-size: 13px;
  line-height: 1.5;

  a { color: #1db954; text-decoration: none; &:hover { text-decoration: underline; } }
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
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all 0.25s;
  position: relative; overflow: hidden;
  opacity: ${p => p.$loading ? 0.7 : 1};

  &::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    background-size: 200% 100%;
    ${p => p.$loading && css`animation: ${shimmer} 1.5s infinite;`}
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(29,185,84,0.4);
  }
`;

const Spinner = styled.div`
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

const ErrorMsg = styled.div`
  background: rgba(255,82,82,0.1);
  border: 1px solid rgba(255,82,82,0.25);
  border-radius: 10px;
  padding: 12px 16px;
  color: #ff7070;
  font-size: 13px;
  margin-bottom: 16px;
`;

const Divider = styled.div`
  position: relative; text-align: center; margin: 24px 0;

  &::before {
    content: ''; position: absolute;
    left: 0; right: 0; top: 50%; height: 1px;
    background: rgba(255,255,255,0.07);
  }

  span {
    position: relative; background: #0a0a0f;
    padding: 0 14px;
    color: rgba(255,255,255,0.3); font-size: 12px;
  }
`;

const SocialRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
`;

const SocialBtn = styled.button`
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 13px 16px;
  border-radius: 12px;
  border: 1.5px solid rgba(255,255,255,0.09);
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.75);
  font-size: 14px; font-weight: 500;
  cursor: pointer; transition: all 0.2s;

  &:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.18);
    color: #fff; transform: translateY(-1px);
  }
`;

const FooterLink = styled.p`
  text-align: center;
  color: rgba(255,255,255,0.4);
  font-size: 14px; margin-top: 20px;

  a { color: #1db954; font-weight: 600; text-decoration: none;
    &:hover { text-decoration: underline; } }
`;

/* ── Strength helpers ── */
function getStrength(pwd: string): { level: number; label: string; color: string } {
  if (!pwd) return { level: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const map = [
    { level: 1, label: 'Weak',    color: '#ff5252' },
    { level: 2, label: 'Fair',    color: '#ffb300' },
    { level: 3, label: 'Good',    color: '#4fc3f7' },
    { level: 4, label: 'Strong',  color: '#1db954' },
  ];
  return map[score - 1] ?? { level: 0, label: '', color: '' };
}

/* ─── Component ─── */
function SignupForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [localError, setLocalError] = useState('');

  const [focused, setFocused] = useState<Record<string, boolean>>({});
  const focus = (k: string, v: boolean) => setFocused(f => ({ ...f, [k]: v }));

  const { signup, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const strength = getStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError('');

    if (password !== confirmPassword) { setLocalError('Passwords do not match.'); return; }
    if (password.length < 6)          { setLocalError('Password must be at least 6 characters.'); return; }
    if (!agreed)                       { setLocalError('Please agree to the Terms of Service.'); return; }

    const ok = await signup({ email, username, password });
    if (ok) navigate('/');
  };

  const displayError = localError || error;

  return (
    <Page>
      {/* ── Left panel ── */}
      <LeftPanel>
        <Blob $size={400} $x={-15} $y={-10} $delay={0} $color="rgba(29,185,84,0.18)" />
        <Blob $size={300} $x={55}  $y={50}  $delay={2} $color="rgba(21,101,192,0.18)" />
        <Blob $size={200} $x={15}  $y={65}  $delay={1} $color="rgba(139,92,246,0.12)" />

        <LogoMark><Music2 size={38} color="#fff" /></LogoMark>
        <LeftTitle>Join <span>millions</span> of music lovers.</LeftTitle>
        <LeftSub>Create your free account and start listening to the music you love, anytime, anywhere.</LeftSub>

        <FeatureList>
          {[
            { icon:'🎵', color:'rgba(29,185,84,0.2)',  title:'90M+ Songs',      sub:'Stream any track, anytime',  delay:0.1 },
            { icon:'📻', color:'rgba(21,101,192,0.2)', title:'Podcasts & Radio', sub:'Exclusive shows & live',     delay:0.2 },
            { icon:'♾️', color:'rgba(139,92,246,0.2)', title:'Unlimited Skips',  sub:'No ads. No limits.',        delay:0.3 },
          ].map(f => (
            <FeatureItem key={f.title} $delay={f.delay}>
              <FeatureIcon $color={f.color}>{f.icon}</FeatureIcon>
              <FeatureText>
                <div className="title">{f.title}</div>
                <div className="sub">{f.sub}</div>
              </FeatureText>
            </FeatureItem>
          ))}
        </FeatureList>
      </LeftPanel>

      {/* ── Right form ── */}
      <RightPanel>
        <FormWrap>
          <TopLogo>
            <div className="icon"><Music2 size={20} color="#fff" /></div>
            <span>Musify</span>
          </TopLogo>

          <FormHeading>
            <h2>Create your account ✨</h2>
            <p>Free forever. No credit card required.</p>
          </FormHeading>

          {displayError && <ErrorMsg>⚠ {displayError}</ErrorMsg>}

          <form onSubmit={handleSubmit}>
            <FieldLabel htmlFor="email">Email address</FieldLabel>
            <FieldWrap $focused={focused.email}>
              <FieldIcon><Mail size={17} /></FieldIcon>
              <FieldInput
                id="email" type="email"
                placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                onFocus={() => focus('email', true)} onBlur={() => focus('email', false)}
                required
              />
            </FieldWrap>

            <FieldLabel htmlFor="username">Username</FieldLabel>
            <FieldWrap $focused={focused.username}>
              <FieldIcon><User size={17} /></FieldIcon>
              <FieldInput
                id="username" type="text"
                placeholder="coollistener"
                value={username} onChange={e => setUsername(e.target.value)}
                onFocus={() => focus('username', true)} onBlur={() => focus('username', false)}
                required minLength={3}
              />
            </FieldWrap>

            <FieldLabel htmlFor="password">Password</FieldLabel>
            <FieldWrap $focused={focused.password}>
              <FieldIcon><Lock size={17} /></FieldIcon>
              <FieldInput
                id="password" type={showPwd ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password} onChange={e => setPassword(e.target.value)}
                onFocus={() => focus('password', true)} onBlur={() => focus('password', false)}
                required minLength={6}
              />
              <FieldToggle type="button" onClick={() => setShowPwd(p => !p)}>
                {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
              </FieldToggle>
            </FieldWrap>

            {password && (
              <>
                <StrengthRow>
                  {[1,2,3,4].map(n => (
                    <StrengthBar key={n} $filled={strength.level >= n} $color={strength.color} />
                  ))}
                </StrengthRow>
                <StrengthLabel $color={strength.color}>{strength.label}</StrengthLabel>
              </>
            )}

            <FieldLabel htmlFor="confirm">Confirm password</FieldLabel>
            <FieldWrap
              $focused={focused.confirm}
              $error={!!(confirmPassword && password !== confirmPassword)}
            >
              <FieldIcon><Lock size={17} /></FieldIcon>
              <FieldInput
                id="confirm" type={showCPwd ? 'text' : 'password'}
                placeholder="Repeat your password"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                onFocus={() => focus('confirm', true)} onBlur={() => focus('confirm', false)}
                required
              />
              <FieldToggle type="button" onClick={() => setShowCPwd(p => !p)}>
                {showCPwd ? <EyeOff size={17} /> : <Eye size={17} />}
              </FieldToggle>
            </FieldWrap>

            <TermsRow>
              <CheckBox $checked={agreed} onClick={() => setAgreed(a => !a)}>
                {agreed && <Check size={13} color="#fff" strokeWidth={3} />}
              </CheckBox>
              <TermsText>
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </TermsText>
            </TermsRow>

            <SubmitBtn type="submit" disabled={isLoading} $loading={isLoading}>
              {isLoading ? (
                <><Spinner />Creating account…</>
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </SubmitBtn>
          </form>

          <Divider><span>or sign up with</span></Divider>

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
            Already have an account? <Link to="/login">Sign in →</Link>
          </FooterLink>
        </FormWrap>
      </RightPanel>
    </Page>
  );
}

export default function Signup() {
  return (
    <PublicRoute>
      <SignupForm />
    </PublicRoute>
  );
}
