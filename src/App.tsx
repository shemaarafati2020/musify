import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import PlaybackBar from './components/PlaybackBar';
import Topbar from './components/Topbar';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Login from './pages/guest/Login';
import Signup from './pages/guest/Signup';
import Unauthorized from './pages/guest/Unauthorized';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMusic from './pages/admin/AdminMusic';
import UserLibrary from './pages/user/UserLibrary';
import CreatePlaylist from './pages/user/CreatePlaylist';
import Settings from './pages/user/Settings';
import Profile from './pages/user/Profile';

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
    background-color: #000;
    color: #fff;
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
  margin-bottom: 90px;
`;

const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  position: relative;
`;

function AppContent() {
  return (
    <AppContainer>
      <Sidebar />
      <MainContent>
        <Content>
          <Topbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
            <Route path="/user-library" element={<UserLibrary />} />
            <Route path="/create-playlist" element={<CreatePlaylist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/music" element={<AdminMusic />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Content>
      </MainContent>
      <PlaybackBar />
    </AppContainer>
  );
}

function App() {
  return (
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
  );
}

export default App;
