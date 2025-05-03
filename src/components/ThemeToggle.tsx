
import React from 'react';
import { useTheme } from './ThemeProvider';
import { Moon, Sun } from 'lucide-react';
import { Switch } from './ui/switch';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex items-center space-x-2">
      <Sun size={16} className="text-gray-600 dark:text-gray-400" />
      <Switch 
        checked={theme === 'dark'} 
        onCheckedChange={toggleTheme}
      />
      <Moon size={16} className="text-gray-600 dark:text-gray-400" />
    </div>
  );
};

export default ThemeToggle;
