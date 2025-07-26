export interface User {
  id: string;
  email: string;
  name: string;
  phone?: number;
  role: 'user' | 'admin' | 'staff';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone?: number;
  role?: 'user' | 'admin' | 'staff';
}