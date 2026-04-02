import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Update CSS variables
    const root = document.documentElement;
    if (theme === 'light') {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f5f5f5');
      root.style.setProperty('--bg-elevated', '#ffffff');
      root.style.setProperty('--text-primary', '#000000');
      root.style.setProperty('--text-secondary', '#6b6b6b');
      root.style.setProperty('--text-tertiary', '#b3b3b3');
      root.style.setProperty('--accent', '#1db954');
      root.style.setProperty('--accent-hover', '#1ed760');
      root.style.setProperty('--border', '#e0e0e0');
      root.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.7)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.2)');
    } else {
      root.style.setProperty('--bg-primary', '#000000');
      root.style.setProperty('--bg-secondary', '#121212');
      root.style.setProperty('--bg-elevated', '#282828');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#b3b3b3');
      root.style.setProperty('--text-tertiary', '#7c7c7c');
      root.style.setProperty('--accent', '#1db954');
      root.style.setProperty('--accent-hover', '#1ed760');
      root.style.setProperty('--border', '#404040');
      root.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.5)');
      root.style.setProperty('--glass-bg', 'rgba(0, 0, 0, 0.7)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.1)');
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Theme toggle button component
const ThemeButton = styled(motion.button)`
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 9999;
  box-shadow: 0 4px 12px var(--shadow);

  &:hover {
    background: var(--accent);
    border-color: var(--accent);
  }
`;

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <ThemeButton
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        {theme === 'dark' ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun size={20} color="var(--text-primary)" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon size={20} color="var(--text-primary)" />
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeButton>
  );
}
