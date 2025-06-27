import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [colorTheme] = useState('default'); // This seems constant for now

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.body.setAttribute('data-color-theme', colorTheme);
  }, [theme, colorTheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};