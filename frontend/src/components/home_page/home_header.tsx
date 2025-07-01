import React from 'react';
import { Login } from '../auth_buttons/login_button';
import { SignUp } from '../auth_buttons/sign_up_button';
import '../../components_css/home_page_css/header_box.css';

interface HeaderProps {
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="app-header-wrapper">
      <div className="header-container">
        <nav className="header-nav">
          <a href="#" className="about-us-link">About Us</a>
          <div className="button-group-box">
            <Login property1="default" />
            <SignUp property1="default" />
          </div>
        </nav>
      </div>
    </header>
  );
};