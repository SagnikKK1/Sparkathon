// src/components/loginButton.tsx
import React from 'react';
import '../styles/baseAuthButton.css';
import '../styles/loginButton.css';

const LoginButton: React.FC = () => {
  return (
    <button className="auth-button login-button">
      {/* Original text layer */}
      <span className="login-text-original">
        <span style={{ "--index": 1 }}>L</span>
        <span style={{ "--index": 2 }}>o</span>
        <span style={{ "--index": 3 }}>g</span>
        <span style={{ "--index": 5 }}>i</span>
        <span style={{ "--index": 6 }}>n</span>
      </span>
      {/* Hover text layer */}
      <span className="login-text-hover">
        <span style={{ "--index": 1 }}>L</span>
        <span style={{ "--index": 2 }}>o</span>
        <span style={{ "--index": 3 }}>g</span>
        <span style={{ "--index": 5 }}>i</span>
        <span style={{ "--index": 6 }}>n</span>
      </span>
    </button>
  );
};

export default LoginButton;