import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, ThemeToggle } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import PlaybackBar from './components/PlaybackBar';
import Topbar from './components/Topbar';
import { MiniPlayer } from './components/MiniPlayer';
import { Queue } from './components/Queue';
import { AdvancedAudioControls } from './components/AdvancedAudioControls';
import { KeyboardShortcutsHelp, useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useState } from 'react';
import { usePlaybackStore } from './store/playbackStore';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Login from './pages/guest/Login';
import Signup from './pages/guest/Signup';
import Unauthorized from './pages/guest/Unauthorized';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMusic from './pages/admin/AdminMusic';
import Analytics from './pages/admin/Analytics';
import Performance from './pages/admin/Performance';
import UsersManagement from './pages/admin/UsersManagement';
import SystemSettings from './pages/admin/SystemSettings';
import UserLibrary from './pages/user/UserLibrary';
import CreatePlaylist from './pages/user/CreatePlaylist';
import Settings from './pages/user/Settings';
import Profile from './pages/user/Profile';
import LikedSongs from './pages/user/LikedSongs';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--bg-primary, #000);
    color: var(--text-primary, #fff);
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
  }

  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: #5a5a5a;
    border-radius: 6px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #6a6a6a;
  }
`;

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #000;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: relative;
  padding-bottom: 90px;
`;

function AppContent() {
  const [showQueue, setShowQueue] = useState(false);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const { currentTrack, isPlaying, setIsPlaying, playNext, playPrevious } = usePlaybackStore();
  
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <AppContainer>
      <Sidebar />
      <MainContent>
        <Topbar />
        <Content>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
            <Route path="/user-library" element={<UserLibrary />} />
            <Route path="/liked-songs" element={<LikedSongs />} />
            <Route path="/create-playlist" element={<CreatePlaylist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/music" element={<AdminMusic />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/performance" element={<Performance />} />
            <Route path="/admin/users" element={<UsersManagement />} />
            <Route path="/admin/settings" element={<SystemSettings />} />
          </Routes>
        </Content>
      </MainContent>
      <PlaybackBar 
        onShowQueue={() => setShowQueue(true)}
        onShowAdvancedControls={() => setShowAdvancedControls(true)}
      />
      
      {/* Advanced Components */}
      {currentTrack && (
        <MiniPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onNext={playNext}
          onPrevious={playPrevious}
        />
      )}
      
      <Queue 
        isOpen={showQueue} 
        onClose={() => setShowQueue(false)} 
      />
      
      <AdvancedAudioControls
        isOpen={showAdvancedControls}
        onClose={() => setShowAdvancedControls(false)}
      />
      
      <KeyboardShortcutsHelp
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
      />
      
      <ThemeToggle />
    </AppContainer>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <GlobalStyle />
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
