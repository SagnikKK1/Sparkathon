// utils/auth.ts
export interface User {
  id: string;
  email: string;
  name: string;
  status: {
    isActive: boolean;
    lastOnline: Date;
  };
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiError {
  error: string | Array<{ message: string; path: string[] }>;
}

class AuthService {
  private baseURL = 'http://localhost:3000/api/auth';

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.baseURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(this.formatErrorMessage(data.error));
    }

    return data;
  }

  async logout(): Promise<void> {
    const token = this.getToken();
    if (!token) return;

    try {
      await fetch(`${this.baseURL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage regardless of API success
      this.clearAuth();
    }
  }

  async signup(email: string, password: string, name: string): Promise<LoginResponse> {
    const response = await fetch(`${this.baseURL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(this.formatErrorMessage(data.error));
    }

    return data;
  }

  // Token management
  setAuth(token: string, user: User): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  clearAuth(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // Helper method to format error messages
  private formatErrorMessage(error: string | Array<{ message: string; path: string[] }>): string {
    if (Array.isArray(error)) {
      return error.map(err => err.message).join(', ');
    }
    return error;
  }

  // Method to get authorization headers
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();

// Hook for React components
export const useAuth = () => {
  const user = authService.getUser();
  const isAuthenticated = authService.isAuthenticated();

  return {
    user,
    isAuthenticated,
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    signup: authService.signup.bind(authService),
    setAuth: authService.setAuth.bind(authService),
    clearAuth: authService.clearAuth.bind(authService),
  };
};