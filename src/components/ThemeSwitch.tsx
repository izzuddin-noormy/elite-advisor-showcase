import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 p-0 border border-gold/30 hover:border-gold hover:bg-gold/10 transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 text-foreground" />
      ) : (
        <Sun className="h-4 w-4 text-foreground" />
      )}
    </Button>
  );
};

export default ThemeSwitch;