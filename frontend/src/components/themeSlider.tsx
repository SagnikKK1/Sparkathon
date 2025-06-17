// src/components/ThemeSlider.tsx
import React from 'react';
import '../styles/themeSlider.css'; // We will create this CSS file

interface ThemeSliderProps {
  currentTheme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeSlider: React.FC<ThemeSliderProps> = ({ currentTheme, toggleTheme }) => {
  const isDark = currentTheme === 'dark';

  return (
    <label className="theme-slider-switch">
      <input
        type="checkbox"
        checked={isDark}
        onChange={toggleTheme}
      />
      <span className="slider round"></span>
    </label>
  );
};

export default ThemeSlider;