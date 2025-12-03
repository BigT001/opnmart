'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-yellow-500 dark:text-green-400"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon size={20} className="transition-transform duration-300" />
      ) : (
        <Sun size={20} className="transition-transform duration-300" />
      )}
    </button>
  );
}
