// src/components/signupButton.tsx
import React from 'react';
import '../styles/signUpButton.css'; // This will import its specific styles
import '../styles/baseAuthButton.css'

const SignupButton: React.FC = () => {
  return (
    <button className="auth-button signup-button">
      <span className="signup-text-original">
        <span style={{ "--index": 1 }}>S</span>
        <span style={{ "--index": 2 }}>i</span>
        <span style={{ "--index": 3 }}>g</span>
        <span style={{ "--index": 4 }}>n</span>
        <span style={{ "--index": 6 }}>U</span>
        <span style={{ "--index": 7 }}>p</span>
      </span>
      <span className="signup-text-hover">
        <span style={{ "--index": 1 }}>S</span>
        <span style={{ "--index": 2 }}>i</span>
        <span style={{ "--index": 3 }}>g</span>
        <span style={{ "--index": 4 }}>n</span>
        <span style={{ "--index": 6 }}>U</span>
        <span style={{ "--index": 7 }}>p</span>
      </span>
    </button>
  );
};

export default SignupButton;