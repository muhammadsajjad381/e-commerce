
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthState } from '../types';
import api from '../lib/api';


export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      // Persist token to localStorage for subsequent API calls
      localStorage.setItem('token', data.data.token);
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed.');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    payload: { name: string; email: string; password: string; role?: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post('/auth/register', payload);
      localStorage.setItem('token', data.data.token);
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed.');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/auth/me');
      return data.data;
    } catch (err: any) {
      localStorage.removeItem('token');
      return rejectWithValue(err.response?.data?.message || 'Session expired.');
    }
  }
);


const initialState: AuthState & { error: string | null } = {
  user:            null,
  token:           localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading:       false,
  error:           null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user            = null;
      state.token           = null;
      state.isAuthenticated = false;
      state.error           = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => { state.error = null; },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.isLoading       = false;
        s.user            = a.payload.user;
        s.token           = a.payload.token;
        s.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.isLoading = false;
        s.error     = a.payload as string;
      });

    builder
      .addCase(registerUser.pending,   (s) => { s.isLoading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.isLoading       = false;
        s.user            = a.payload.user;
        s.token           = a.payload.token;
        s.isAuthenticated = true;
      })
      .addCase(registerUser.rejected,  (s, a) => {
        s.isLoading = false;
        s.error     = a.payload as string;
      });

    builder
      .addCase(fetchCurrentUser.pending,   (s) => { s.isLoading = true; })
      .addCase(fetchCurrentUser.fulfilled, (s, a) => {
        s.isLoading       = false;
        s.user            = a.payload;
        s.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected,  (s) => {
        s.isLoading       = false;
        s.isAuthenticated = false;
        s.user            = null;
        s.token           = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
