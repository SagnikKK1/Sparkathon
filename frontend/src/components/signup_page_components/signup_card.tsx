import React, { useState } from 'react';
import { SignupButton } from './signup_button';
import { authService } from '../../utils/auth';
import '../../components_css/signup_page_components_css/signup_card.css';

interface SignupCardProps {
  onSignupSuccess?: () => void;
}

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const SignupCard: React.FC<SignupCardProps> = ({ onSignupSuccess }) => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    if (!formData.confirmPassword.trim()) {
      setError('Please confirm your password');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
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
      const response = await authService.signup(
        formData.email,
        formData.password,
        formData.name
      );
      
      // Store authentication data
      authService.setAuth(response.token, response.user);
      
      setSuccess('Account created successfully! Redirecting...');
      
      // Call the success callback if provided
      if (onSignupSuccess) {
        setTimeout(() => {
          onSignupSuccess();
        }, 1000);
      } else {
        // Default redirect behavior
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      }
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Signup failed');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-card">
      <h2 className="signup-card-title">Sign Up</h2>
      <p className="signup-card-subtitle">Create a new account</p>
      
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
          <label htmlFor="name-input" className="input-label">Full Name</label>
        </div>
        <div className="input-box-wrapper">
          <input
            type="text"
            id="name-input"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="signup-input"
            required
            disabled={isLoading}
            autoComplete="name"
          />
        </div>
      </div>
      
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
            className="signup-input"
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
            className="signup-input"
            required
            disabled={isLoading}
            autoComplete="new-password"
          />
        </div>
      </div>
      
      <div className="input-group">
        <div className="label-wrapper">
          <label htmlFor="confirm-password-input" className="input-label">Confirm Password</label>
        </div>
        <div className="input-box-wrapper">
          <input
            type="password"
            id="confirm-password-input"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            className="signup-input"
            required
            disabled={isLoading}
            autoComplete="new-password"
          />
        </div>
      </div>
      
      <div className="signup-actions">
        <SignupButton 
          text={isLoading ? "Creating Account..." : "Sign Up"} 
          type="submit" 
          disabled={isLoading || !formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.confirmPassword.trim()}
        />
        <p className="have-account-text">
          Already have an account? <a href="/login" className="login-link">Login</a>
        </p>
      </div>
    </form>
  );
};