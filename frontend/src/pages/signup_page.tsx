import React, { useEffect } from 'react';
import { SignupCard } from '../components/signup_page_components/signup_card';
import { authService } from '../utils/auth';
import '.././pages_css/signup_page.css';

interface SignupPageProps {}

export const SignupPage: React.FC<SignupPageProps> = () => {
  useEffect(() => {
    // Check if user is already authenticated
    if (authService.isAuthenticated()) {
      // Redirect to dashboard if already logged in
      window.location.href = '/dashboard';
    }
  }, []);

  const handleSignupSuccess = () => {
    // You can add any post-signup logic here
    console.log('Signup successful, redirecting to dashboard...');
    
    // Example: If using React Router, you would use navigate
    // const navigate = useNavigate();
    // navigate('/dashboard');
    
    // For now, using window.location
    window.location.href = '/dashboard';
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      // Page will refresh after logout
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // If user is authenticated, show a logout option
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
                onClick={() => window.location.href = '/dashboard'}
                className="signup-button"
              >
                Go to Dashboard
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