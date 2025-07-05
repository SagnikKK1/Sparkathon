import React from "react";
import "../../components_css/home_auth_buttons_css/logout_button.css";
import { Link } from "react-router-dom";
import { authService } from "../../utils/auth";

interface LogoutProps {}

export const Logout = ({}: LogoutProps): React.ReactElement => {
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await authService.logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Link to="/" className="logout-home-button" onClick={handleLogout}>
      <div className="logout-text-content">
        Logout
      </div>
    </Link>
  );
};
