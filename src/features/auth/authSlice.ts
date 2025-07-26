import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi, type SignupData, type LoginData } from '../../api/authApi';
import type { AuthState, User } from './types.auth';

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Google sign in - Updated for server-side redirect
export const googleSignIn = createAsyncThunk(
  'auth/googleSignIn',
  async (_, { rejectWithValue }) => {
    console.log('🔵 [AUTH SLICE] Starting Google sign-in thunk');
    try {
      // For server-side redirect, we need to navigate to the backend endpoint
      // The backend will handle the OAuth flow and redirect to Google
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      const googleAuthUrl = `${apiUrl}/auth/google`;
      
      console.log('🟢 [AUTH SLICE] Redirecting to backend Google auth endpoint:', googleAuthUrl);
      
      // Redirect to backend endpoint which will handle the OAuth flow
      window.location.href = googleAuthUrl;
      
      // This will never be reached due to redirect, but we need to return something
      return { success: true, message: 'Redirecting to Google OAuth' };
    } catch (error: any) {
      console.error('🔴 [AUTH SLICE] Google sign-in thunk error:', error);
      return rejectWithValue(error.response?.data?.message || 'Google sign in failed');
    }
  }
);

// Sign up
export const signup = createAsyncThunk(
  'auth/signup',
  async (payload: SignupData, { rejectWithValue }) => {
    try {
      const response = await authApi.signup(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

// Login
export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginData, { rejectWithValue }) => {
    try {
      const response = await authApi.login(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Check session
export const checkSession = createAsyncThunk(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.checkSession();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Session check failed');
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.logout();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      // Clear token from localStorage
      localStorage.removeItem('token');
    },
    clearError(state) {
      state.error = null;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
      // Store token in localStorage
      if (action.payload) {
        localStorage.setItem('token', action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Google Sign In
      .addCase(googleSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.loading = false;
        // The redirect is handled in the thunk itself
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        // Store token in localStorage
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        // Store token in localStorage
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
       // Session Check
      .addCase(checkSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && action.payload.user) {
          state.user = action.payload.user;
          state.token = action.payload.user.id; // Use user ID as token for session-based auth
        }
      })
      .addCase(checkSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.error = null;
        // Clear token from localStorage
        localStorage.removeItem('token');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setUser, setToken } = authSlice.actions;
export default authSlice.reducer; 