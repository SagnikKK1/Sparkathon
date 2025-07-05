import React from 'react';
import { SignupCard } from '../components/signup_page_components/signup_card';
import { authService } from '../utils/auth';
import '.././pages_css/signup_page.css';

export const SignupPage: React.FC = () => {
  // REMOVE or comment out this block:
  // useEffect(() => {
  //   if (authService.isAuthenticated()) {
  //     window.location.href = '/';
  //   }
  // }, []);

  const handleSignupSuccess = () => {
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

  if (authService.isAuthenticated()) {
    const user = authService.getUser();
    return (
      <div className="signup-page-wrapper">
        <div className="blurred-ellipse"></div>
        <div className="signup-page-container">
          <div className="signup-card">
            <h2 className="signup-card-title">Welcome!</h2>
            <p className="signup-card-subtitle">You are already logged in</p>
            {user && (
              <div className="user-info">
                <p className="user-name">Hello, {user.name}!</p>
                <p className="user-email">{user.email}</p>
              </div>
            )}
            <div className="signup-actions">
              <button 
                onClick={() => window.location.href = '/'}
                className="signup-button"
              >
                Go to Home
              </button>
              <button 
                onClick={handleLogout}
                className="signup-button logout-button"
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
    <div className="signup-page-wrapper">
      <div className="blurred-ellipse"></div>
      <div className="signup-page-container">
        <SignupCard onSignupSuccess={handleSignupSuccess} />
      </div>
    </div>
  );
};
