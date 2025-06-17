// src/components/header.tsx
import React from 'react';
import '../styles/header.css';
import ThemeSlider from './themeSlider';
import LoginButton from './loginButton';
import SignUpButton from './signUpButton';

interface HeaderProps {
  toggleTheme: () => void;
  currentTheme: 'light' | 'dark';
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, currentTheme }) => {
  return (
    <header className="header-container">
      <div className="header-left">
        <h1 className="header-title">My Dashboard</h1>
      </div>
      <div className="header-right">
        <ThemeSlider toggleTheme={toggleTheme} currentTheme={currentTheme} />
        <LoginButton />
        <SignUpButton />
      </div>
    </header>
  );
};

export default Header;