import React from 'react';
import './ThemeSwitcher.css';

interface ThemeSwitcherProps {
  setTheme: (theme: string) => void;
}

const themes = ['default', 'purple', 'green', 'orange'];

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ setTheme }) => {
  return (
    <div className="theme-switcher">
      {themes.map(theme => (
        <button
          key={theme}
          className={`theme-button ${theme}`}
          onClick={() => setTheme(theme)}
          title={theme}
        />
      ))}
    </div>
  );
};

export default ThemeSwitcher;