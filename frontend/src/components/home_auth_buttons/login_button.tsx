import React from "react";
import "../../components_css/home_auth_buttons_css/login_button.css"; 
import { Link } from 'react-router-dom';

interface LoginProps {}

export const Login = ({}: LoginProps): React.ReactElement => {
  return (
    <Link to="/login" className="login-home-button"> 
      <div className="login-text-content">
        Login
      </div>
    </Link>
  );
};