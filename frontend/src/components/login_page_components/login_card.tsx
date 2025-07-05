import React, { useState } from 'react';
import { LoginButton } from './login_button';
import { authService } from '../../utils/auth';
import '../../components_css/login_page_components_css/login_card.css';

interface LoginCardProps {
  onLoginSuccess?: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginCard: React.FC<LoginCardProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Backend integration: login API call
      const response = await authService.login(formData.email, formData.password);

      // Store authentication data (token & user) in localStorage
      authService.setAuth(response.token, response.user);

      setSuccess('Login successful! Redirecting...');

      // Call the success callback if provided
      if (onLoginSuccess) {
        setTimeout(() => {
          onLoginSuccess();
        }, 1000);
      } else {
        // Default redirect behavior: Redirect to home page
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-card">
      <h2 className="login-card-title">Login</h2>
      <p className="login-card-subtitle">Sign in to an existing account</p>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {success && (
        <div className="success-message">
          {success}
        </div>
      )}
      
      <div className="input-group">
        <div className="label-wrapper">
          <label htmlFor="email-input" className="input-label">Email</label>
        </div>
        <div className="input-box-wrapper">
          <input
            type="email"
            id="email-input"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className="login-input"
            required
            disabled={isLoading}
            autoComplete="email"
          />
        </div>
      </div>
      
      <div className="input-group">
        <div className="label-wrapper">
          <label htmlFor="password-input" className="input-label">Password</label>
        </div>
        <div className="input-box-wrapper">
          <input
            type="password"
            id="password-input"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            className="login-input"
            required
            disabled={isLoading}
            autoComplete="current-password"
          />
        </div>
      </div>
      
      <a href="/forgot-password" className="forgot-password-link">Forgot password?</a>
      
      <div className="login-actions">
        <LoginButton 
          text={isLoading ? "Logging in..." : "Login"} 
          type="submit" 
          disabled={isLoading || !formData.email.trim() || !formData.password.trim()}
        />
        <p className="no-account-text">
          Don't have an account? <a href="/signup" className="signup-link">Sign Up</a>
        </p>
      </div>
    </form>
  );
};
