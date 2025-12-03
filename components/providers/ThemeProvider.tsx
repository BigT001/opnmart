'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const defaultValue: ThemeContextType = {
  theme: 'dark',
  toggleTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultValue);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage, default to dark
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) {
      setTheme(saved);
      applyTheme(saved);
    } else {
      // Default to dark mode
      setTheme('dark');
      applyTheme('dark');
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  const applyTheme = (themeToApply: Theme) => {
    const html = document.documentElement;
    if (themeToApply === 'dark') {
      html.classList.remove('light');
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  return context;
}
