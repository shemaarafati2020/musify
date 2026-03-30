import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import PlaybackBar from './components/PlaybackBar';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Unauthorized from './pages/Unauthorized';
import AdminDashboard from './pages/AdminDashboard';
import UserLibrary from './pages/UserLibrary';
import CreatePlaylist from './pages/CreatePlaylist';

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
  overflow: hidden;
`;

function AppContent() {
  return (
    <AppContainer>
      <Sidebar />
      <MainContent>
        <Content>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
            <Route path="/user-library" element={<UserLibrary />} />
            <Route path="/create-playlist" element={<CreatePlaylist />} />
            <Route path="/admin" element={<AdminDashboard />} />
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
          <Route path="/*" element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
