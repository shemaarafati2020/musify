import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  LogOut,
  ExternalLink,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';

const TopbarContainer = styled.header<{ $scrolled: boolean }>`
  height: 64px;
  padding: 16px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props =>
    props.$scrolled ? 'rgba(18, 18, 18, 0.8)' : 'transparent'};
  backdrop-filter: ${props => (props.$scrolled ? 'blur(8px)' : 'none')};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: background-color 0.3s ease;
`;

const NavArrows = styled.div`
  display: flex;
  gap: 8px;
`;

const ArrowButton = styled.button`
  background-color: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const InstallButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: transparent;
  color: #fff;
  border: none;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.04);
  }
`;

const IconButton = styled.button`
  background-color: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.04);
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const ProfileContainer = styled.div`
  position: relative;
`;

const ProfileButton = styled.button`
  background-color: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  padding: 2px;
  transition: transform 0.2s;

  img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
  }

  &:hover {
    transform: scale(1.04);
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 120%;
  right: 0;
  background-color: #282828;
  border-radius: 4px;
  padding: 4px;
  min-width: 196px;
  box-shadow:
    0 16px 24px rgba(0, 0, 0, 0.3),
    0 6px 8px rgba(0, 0, 0, 0.2);
  display: ${props => (props.$isOpen ? 'block' : 'none')};
  z-index: 1000;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  border-radius: 2px;

  span {
    flex: 1;
  }

  svg {
    width: 16px;
    height: 16px;
    opacity: 0.8;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
`;

const Separator = styled.div`
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 4px 0;
`;

const LoginButton = styled.button`
  background-color: #fff;
  color: #000;
  border: none;
  border-radius: 24px;
  padding: 8px 32px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.04);
    background-color: #f6f6f6;
  }
`;

const SignupButton = styled.button`
  background-color: transparent;
  color: #a7a7a7;
  border: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition:
    color 0.2s,
    transform 0.2s;

  &:hover {
    color: #fff;
    transform: scale(1.04);
  }
`;

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Find the main scrollable container
      const scrollContainer = document.querySelector('main');
      if (scrollContainer) {
        setScrolled(scrollContainer.scrollTop > 10);
      }
    };

    const container = document.querySelector('main');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <TopbarContainer $scrolled={scrolled}>
      <NavArrows>
        <ArrowButton onClick={() => navigate(-1)}>
          <ChevronLeft size={22} />
        </ArrowButton>
        <ArrowButton onClick={() => navigate(1)}>
          <ChevronRight size={22} />
        </ArrowButton>
      </NavArrows>

      <RightSection>
        {user ? (
          <>
            <InstallButton>
              <ExternalLink size={16} />
              Install App
            </InstallButton>
            <IconButton>
              <Bell size={18} />
            </IconButton>
            <ProfileContainer ref={dropdownRef}>
              <ProfileButton onClick={() => setDropdownOpen(!dropdownOpen)}>
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" />
                ) : (
                  <User size={18} />
                )}
              </ProfileButton>
              <DropdownMenu $isOpen={dropdownOpen}>
                <MenuItem
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/profile');
                  }}
                >
                  <span>Profile</span>
                </MenuItem>
                {user.role === 'admin' && (
                  <MenuItem
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/admin');
                    }}
                  >
                    <span>Admin Dashboard</span>
                  </MenuItem>
                )}
                {user.role === 'admin' && (
                  <MenuItem
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/admin/music');
                    }}
                  >
                    <span>Admin Music</span>
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/settings');
                  }}
                >
                  <span>Settings</span>
                  <SettingsIcon size={16} />
                </MenuItem>
                <Separator />
                <MenuItem onClick={handleLogout}>
                  <span>Log out</span>
                  <LogOut size={16} />
                </MenuItem>
              </DropdownMenu>
            </ProfileContainer>
          </>
        ) : (
          <>
            <SignupButton onClick={() => navigate('/signup')}>
              Sign up
            </SignupButton>
            <LoginButton onClick={() => navigate('/login')}>Log in</LoginButton>
          </>
        )}
      </RightSection>
    </TopbarContainer>
  );
};

export default Topbar;
