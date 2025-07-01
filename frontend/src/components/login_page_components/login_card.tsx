import React from 'react';
import { LoginButton } from './login_button';
import '../../components_css/login_page_components_css/login_card.css';

interface LoginCardProps {}

export const LoginCard: React.FC<LoginCardProps> = () => {
  return (
    <div className="login-card">
      <h2 className="login-card-title">Login</h2>
      <p className="login-card-subtitle">Sign in to an existing account</p>

      <div className="input-group">
        <div className="label-wrapper">
          <label htmlFor="email-input" className="input-label">Email</label>
        </div>
        <div className="input-box-wrapper">
          <input
            type="email"
            id="email-input"
            placeholder="Enter your email"
            className="login-input"
          />
        </div>
      </div>

      <div className="input-group">
        <div className="label-wrapper">
          <label htmlFor="password-input" className="input-label">Password</label>
        </div>
        <div className="input-box-wrapper">
          <input
            type="password"
            id="password-input"
            placeholder="Enter your password"
            className="login-input"
          />
        </div>
      </div>

      <a href="#" className="forgot-password-link">Forgot password?</a>

      <div className="login-actions">
        <LoginButton text="Login" type="submit" />
        <p className="no-account-text">
          Don't have an account? <a href="#" className="signup-link">Sign Up</a>
        </p>
      </div>
    </div>
  );
};