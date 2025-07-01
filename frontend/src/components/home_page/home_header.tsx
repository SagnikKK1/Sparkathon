import React from 'react';
import '../../components_css/home_page_css/home_header.css';
import { Login } from '../home_auth_buttons/login_button';
import { Link } from 'react-router-dom';
import { SignUp } from '../home_auth_buttons/sign_up_button';

interface HeaderProps { }

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="app-header-wrapper">
      <div className="header-container">
        <nav className="header-nav">
          <Link to="/about" className="about-us-link">About Us</Link>
          <div className="button-group-box">
            <Login />
            <SignUp />
          </div>
        </nav>
      </div>
    </header>
  );
};