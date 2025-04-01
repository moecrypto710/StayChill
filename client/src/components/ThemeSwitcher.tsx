import React, { useState, useEffect, createContext, useContext } from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Theme context type
type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Create theme context
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {}
});

// Theme provider component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Get theme from localStorage or use system as default
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) || 'system'
  );

  // Update theme in localStorage and apply it to document
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Apply theme effect
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        const root = document.documentElement;
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        root.classList.remove('light', 'dark');
        root.classList.add(systemTheme);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use theme
export const useTheme = () => useContext(ThemeContext);

// Theme switcher component
export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };
  
  // Determine current effective theme
  const currentTheme = () => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="rounded-full w-10 h-10 bg-white/10 hover:bg-white/20 text-white"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {currentTheme() === 'dark' ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
}