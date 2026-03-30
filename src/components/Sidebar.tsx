import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Search,
  Library,
  Plus,
  Heart,
  ChevronLeft,
  ChevronRight,
  Music,
  LogOut,
  Settings,
  Crown,
  UserPlus,
} from 'lucide-react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const SidebarContainer = styled.div<{ $collapsed: boolean }>`
  width: ${props => (props.$collapsed ? '80px' : '240px')};
  background-color: #000000;
  padding: 24px 12px;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: relative;
`;

const CollapseButton = styled.button`
  position: absolute;
  right: -12px;
  top: 24px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #282828;
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;

  &:hover {
    background-color: #3e3e3e;
  }
`;

const Logo = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding: 0 12px;

  svg {
    width: 32px;
    height: 32px;
    color: #1db954;
  }

  span {
    color: #fff;
    font-size: 24px;
    font-weight: bold;
    display: ${props => (props.$collapsed ? 'none' : 'block')};
  }
`;

const Navigation = styled.nav`
  flex: 1;
`;

const NavigationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavigationItem = styled.li`
  margin-bottom: 4px;
`;

const NavigationLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 16px;
  color: #b3b3b3;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    color: #fff;
    background-color: #282828;
  }

  &.active {
    color: #fff;
    background-color: #282828;
  }

  svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }

  span {
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: #282828;
  margin: 16px 0;
`;

const PlaylistSection = styled.div`
  margin-top: 20px;
`;

const PlaylistHeader = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  margin-bottom: 16px;

  h3 {
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin: 0;
    display: ${props => (props.$collapsed ? 'none' : 'block')};
  }

  button {
    background: none;
    border: none;
    color: #b3b3b3;
    cursor: pointer;
    padding: 0;
    display: ${props => (props.$collapsed ? 'none' : 'flex')};

    &:hover {
      color: #fff;
    }
  }
`;

const PlaylistList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PlaylistItem = styled.li`
  padding: 8px 16px;
  color: #b3b3b3;
  cursor: pointer;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    color: #fff;
    background-color: #282828;
  }
`;

const LibrarySection = styled.div<{ $collapsed: boolean }>`
  margin-top: 20px;

  h3 {
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin: 0 0 16px 16px;
    display: ${props => (props.$collapsed ? 'none' : 'block')};
  }
`;

const UserProfile = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #181818;
  border-radius: 8px;
  margin-top: auto;
  transition: all 0.3s ease;

  ${props =>
    props.$collapsed &&
    `
    justify-content: center;
    padding: 8px;
  `}
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Username = styled.div`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    color: #1db954;
  }
`;

const UserRole = styled.div`
  color: #b3b3b3;
  font-size: 12px;
  text-transform: capitalize;
`;

const UserActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const LoginButton = styled.button`
  flex: 1;
  padding: 12px;
  background: transparent;
  border: 1px solid #7c7c7c;
  border-radius: 20px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #fff;
    transform: scale(1.02);
  }
`;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, isAdmin, isUser } = useAuth();
  const navigate = useNavigate();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const mockPlaylists = [
    'Liked Songs',
    'Daily Mix 1',
    'Chill Vibes',
    'Workout Playlist',
    'Focus Flow',
    'Road Trip',
  ];

  return (
    <SidebarContainer $collapsed={collapsed}>
      <CollapseButton onClick={toggleCollapse}>
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </CollapseButton>

      <Logo $collapsed={collapsed}>
        <Music />
        <span>Musify</span>
      </Logo>

      <Navigation>
        <NavigationList>
          <NavigationItem>
            <NavigationLink to="/">
              <Home size={24} />
              <span>Home</span>
            </NavigationLink>
          </NavigationItem>
          <NavigationItem>
            <NavigationLink to="/search">
              <Search size={24} />
              <span>Search</span>
            </NavigationLink>
          </NavigationItem>
          {(isUser || isAdmin) && (
            <NavigationItem>
              <NavigationLink to="/library">
                <Library size={24} />
                <span>Your Library</span>
              </NavigationLink>
            </NavigationItem>
          )}
        </NavigationList>

        <Divider />

        <NavigationList>
          {(isUser || isAdmin) && (
            <NavigationItem>
              <NavigationLink to="/create-playlist">
                <Plus size={24} />
                <span>Create Playlist</span>
              </NavigationLink>
            </NavigationItem>
          )}
          {(isUser || isAdmin) && (
            <NavigationItem>
              <NavigationLink to="/liked-songs">
                <Heart size={24} />
                <span>Liked Songs</span>
              </NavigationLink>
            </NavigationItem>
          )}
          {isAdmin && (
            <NavigationItem>
              <NavigationLink to="/admin">
                <Crown size={24} />
                <span>Admin Panel</span>
              </NavigationLink>
            </NavigationItem>
          )}
        </NavigationList>
      </Navigation>

      <LibrarySection $collapsed={collapsed}>
        <h3>Library</h3>
        {!collapsed && (
          <PlaylistList>
            <PlaylistItem>Podcasts</PlaylistItem>
            <PlaylistItem>Audiobooks</PlaylistItem>
            {(isUser || isAdmin) && <PlaylistItem>Artists</PlaylistItem>}
            {(isUser || isAdmin) && <PlaylistItem>Albums</PlaylistItem>}
          </PlaylistList>
        )}
      </LibrarySection>

      {!collapsed && (isUser || isAdmin) && (
        <PlaylistSection>
          <PlaylistHeader $collapsed={collapsed}>
            <h3>Playlists</h3>
            <button>
              <Plus size={16} />
            </button>
          </PlaylistHeader>
          <PlaylistList>
            {mockPlaylists.map((playlist, index) => (
              <PlaylistItem key={index}>{playlist}</PlaylistItem>
            ))}
          </PlaylistList>
        </PlaylistSection>
      )}

      {/* User Profile Section */}
      <UserProfile $collapsed={collapsed}>
        {user ? (
          <>
            <UserAvatar src={user.avatar} alt={user.username} />
            {!collapsed && (
              <UserInfo>
                <Username>
                  {user.username}
                  {user.role === 'admin' && <Crown size={14} />}
                  {user.role === 'guest' && <UserPlus size={14} />}
                </Username>
                <UserRole>{user.role}</UserRole>
              </UserInfo>
            )}
            {!collapsed && (
              <UserActions>
                <ActionButton onClick={() => navigate('/settings')}>
                  <Settings size={18} />
                </ActionButton>
                <ActionButton onClick={handleLogout}>
                  <LogOut size={18} />
                </ActionButton>
              </UserActions>
            )}
          </>
        ) : (
          !collapsed && (
            <LoginButton onClick={() => navigate('/login')}>
              Sign In
            </LoginButton>
          )
        )}
      </UserProfile>
    </SidebarContainer>
  );
};

export default Sidebar;
