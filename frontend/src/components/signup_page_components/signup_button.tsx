import React from 'react';
import '../../components_css/signup_page_components_css/signup_button.css';

interface SignupButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const SignupButton: React.FC<SignupButtonProps> = ({
  text,
  onClick,
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      className="signup-button"
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {text}
    </button>
  );
};