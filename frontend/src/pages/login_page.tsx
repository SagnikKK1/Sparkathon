import React from 'react';
import { LoginCard } from '../components/login_page_components/login_card';
import '.././pages_css/login_page.css';

interface LoginPageProps {}

export const LoginPage: React.FC<LoginPageProps> = () => {
  return (
    <div className="login-page-wrapper">
      <div className="blurred-ellipse"></div> 
      <div className="login-page-container">
        <LoginCard />
      </div>
    </div>
  );
};