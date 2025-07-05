import React from 'react';
import { Link } from 'react-router-dom';
import '../../components_css/dashboard_css/logout_button.css';
import { authService } from '../../utils/auth';

interface LogoutLinkProps {
  onLogout?: () => void; // Make this optional for flexibility
}

export const LogoutLink: React.FC<LogoutLinkProps> = ({ onLogout }) => {
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation until logout completes
    try {
      await authService.logout(); // Backend integration: clear token, call API, etc.
      if (onLogout) onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      window.location.href = '/'; // Redirect to home after logout
    }
  };

  return (
    <Link to="/home" className="logout-home-button" onClick={handleLogout}>
      Logout
    </Link>
  );
};
