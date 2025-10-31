import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';



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
  accessToken?: string;
  refreshToken?: string;
  message?: string;
  requiresEmailConfirmation?: boolean;
  email?: string;
}

export const authApi = {
  // Sign up with email
  async signup(data: SignupData): Promise<AuthResponse> {

    try {
      const response = await axios.post(`${API_URL}/auth/signup`, data);
      return response.data;
    } catch (error: any) {
      console.error('🔴 [AUTH API] Signup failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Sign in with email
  async login(data: LoginData): Promise<AuthResponse> {

    try {
      const response = await axios.post(`${API_URL}/auth/signin`, data);
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('🔴 [AUTH API] Login failed:', error.response?.data || error.message);
      throw error;
    }
  },
async resendEmail(email: string): Promise<{ success: boolean; message: string; data?: any }> {

  try {
    const response = await axios.post(`${API_URL}/auth/resend`, {
      email
    }, {
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
      
    throw error;
  }
},
  // Check current session
  async checkSession(token?: string): Promise<{ success: boolean; user?: any; message?: string }> {

    try {
      const response = await axios.get(`${API_URL}/auth/session`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        withCredentials: !token,
      });


      return response.data;
    } catch (error: any) {

      return { success: false, message: 'Not authenticated' };
    }
  },

  // Logout
  async logout(token?: string): Promise<{ success: boolean; message: string }> {

    try {
      const response = await axios.post(`${API_URL}/auth/logout`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        withCredentials: !token,
      });

      return response.data;
    } catch (error: any) {

      throw error;
    }
  }
}; 