import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../../store/useThemeStore';

const ThemeToggle = () => {
  
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-bg-sec hover:bg-bg-sec-hov border border-border-pri transition-colors"
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon /> 
      ) : (
        <Sun />
      )}
    </button>
  );
};

export default ThemeToggle;