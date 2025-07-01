import React from "react";
import "../../components_css/home_auth_buttons_css/sign_up_button.css"; 
import { Link } from 'react-router-dom';

interface SignUpProps {}

export const SignUp = ({}: SignUpProps): React.ReactElement => {
  return (
    <Link to="/signup" className="signup-home-button"> 
      <div className="sign-up-text-content">
        Sign Up
      </div>
    </Link>
  );
};