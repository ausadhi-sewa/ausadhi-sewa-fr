import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

console.log('🔵 [AUTH API] API URL configured:', API_URL);

export interface SignupData {
  email: string;
  password: string;
  name: string;
  phone?: number;
  role?: 'user' | 'admin' | 'staff';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: any;
  token: string;
  message?: string;
}

export interface GoogleSignInResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
  };
  statusCode: number;
}

export const authApi = {
  // Sign up with email
  async signup(data: SignupData): Promise<AuthResponse> {
    console.log('🔵 [AUTH API] Signup request:', { email: data.email, name: data.name });
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, data);
      console.log('🟢 [AUTH API] Signup successful:', { user: response.data.user?.email });
      return response.data;
    } catch (error: any) {
      console.error('🔴 [AUTH API] Signup failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Sign in with email
  async login(data: LoginData): Promise<AuthResponse> {
    console.log('🔵 [AUTH API] Login request:', { email: data.email });
    try {
      const response = await axios.post(`${API_URL}/auth/signin`, data);
      console.log('🟢 [AUTH API] Login successful:', { user: response.data.user?.email });
      return response.data;
    } catch (error: any) {
      console.error('🔴 [AUTH API] Login failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Google sign in
  async googleSignIn(): Promise<GoogleSignInResponse> {
    console.log('🔵 [AUTH API] Google sign-in request to:', `${API_URL}/auth/google`);
    try {
      const response = await axios.get(`${API_URL}/auth/google`);
      console.log('🟢 [AUTH API] Google sign-in response:', {
        success: response.data.success,
        message: response.data.message,
        hasUrl: !!response.data.data?.url,
        url: response.data.data?.url?.substring(0, 50) + '...'
      });
      return response.data;
    } catch (error: any) {
      console.error('🔴 [AUTH API] Google sign-in failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Handle Google callback - This is not needed for the current flow
  // The backend handles the callback and redirects to frontend
  async handleGoogleCallback(code: string): Promise<AuthResponse> {
    console.log('🔵 [AUTH API] Google callback request with code:', code.substring(0, 20) + '...');
    try {
      const response = await axios.get(`${API_URL}/auth/callback?code=${code}`);
      console.log('🟢 [AUTH API] Google callback successful:', { user: response.data.user?.email });
      return response.data;
    } catch (error: any) {
      console.error('🔴 [AUTH API] Google callback failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Check current session
  async checkSession(): Promise<{ success: boolean; user?: any; message?: string }> {
    console.log('🔵 [AUTH API] Checking session status');
    try {
      const response = await axios.get(`${API_URL}/auth/session`, {
        withCredentials: true // Include cookies
      });
      console.log('🟢 [AUTH API] Session check successful:', { user: response.data.user?.email });
      return response.data;
    } catch (error: any) {
      console.log('🔴 [AUTH API] Session check failed:', error.response?.data || error.message);
      return { success: false, message: 'Not authenticated' };
    }
  },

  // Logout
  async logout(): Promise<{ success: boolean; message: string }> {
    console.log('🔵 [AUTH API] Logging out');
    try {
      const response = await axios.post(`${API_URL}/auth/logout`, {}, {
        withCredentials: true // Include cookies
      });
      console.log('🟢 [AUTH API] Logout successful');
      return response.data;
    } catch (error: any) {
      console.error('🔴 [AUTH API] Logout failed:', error.response?.data || error.message);
      throw error;
    }
  }
}; 