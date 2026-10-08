import { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext(null);

// Light-first design system; dark mode class hook kept for future use / prefers-color-scheme.
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
  );
}
