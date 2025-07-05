import React, { useEffect } from 'react';
import { LoginCard } from '../components/login_page_components/login_card';
import { authService } from '../utils/auth';
import '.././pages_css/login_page.css';

interface LoginPageProps {}

export const LoginPage: React.FC<LoginPageProps> = () => {
  useEffect(() => {
    // Redirect to home if already logged in
    if (authService.isAuthenticated()) {
      window.location.href = '/';
    }
  }, []);

  const handleLoginSuccess = () => {
    // You can add any post-login logic here
    console.log('Login successful, redirecting to home...');
    window.location.href = '/';
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // If user is authenticated, show a logout option
  if (authService.isAuthenticated()) {
    const user = authService.getUser();
    return (
      <div className="login-page-wrapper">
        <div className="blurred-ellipse"></div>
        <div className="login-page-container">
          <div className="login-card">
            <h2 className="login-card-title">Welcome Back!</h2>
            <p className="login-card-subtitle">You are already logged in</p>
            
            {user && (
              <div className="user-info">
                <p className="user-name">Hello, {user.name}!</p>
                <p className="user-email">{user.email}</p>
              </div>
            )}
            
            <div className="login-actions">
              <button 
                onClick={() => window.location.href = '/'}
                className="login-button"
              >
                Go to Home
              </button>
              <button 
                onClick={handleLogout}
                className="login-button logout-button"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page-wrapper">
      <div className="blurred-ellipse"></div>
      <div className="login-page-container">
        <LoginCard onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
};
