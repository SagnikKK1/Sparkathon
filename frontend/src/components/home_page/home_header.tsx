import React from 'react';
import '../../components_css/home_page_css/home_header.css';
import { Login } from '../home_auth_buttons/login_button';
import { SignUp } from '../home_auth_buttons/sign_up_button';
import { Logout } from '../home_auth_buttons/logout_button';
import { Link, useLocation } from 'react-router-dom';
import { authService } from '../../utils/auth';

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const isAuthenticated = authService.isAuthenticated();
  const location = useLocation();

  // If on homepage, show About Us link; if on About Us, show Home link
  const isAboutUs = location.pathname === '/aboutus';

  return (
    <header className="app-header-wrapper">
      <div className="header-container">
        <nav className="header-nav">
          {isAboutUs ? (
            <Link to="/" className="about-us-link">Home</Link>
          ) : (
            <Link to="/aboutus" className="about-us-link">About Us</Link>
          )}
          <div className="button-group-box">
            {!isAuthenticated && (
              <>
                <Login />
                <SignUp />
              </>
            )}
            {isAuthenticated && (
              <>
                <Logout />
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
