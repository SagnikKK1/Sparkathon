import React from 'react';
import '../../components_css/login_page_components_css/login_button.css';

interface LoginButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  text,
  onClick,
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      className="login-button"
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {text}
    </button>
  );
};