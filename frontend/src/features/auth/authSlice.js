import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '@/api/services/authService';
import toast from 'react-hot-toast';

// ✅ Safe localStorage parsing
const user = JSON.parse(localStorage.getItem('user') || 'null');

// 🔐 LOGIN THUNK
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const data = await authService.login(userData);

      // ✅ persist user
      localStorage.setItem('user', JSON.stringify(data));

      toast.success('Welcome back!');
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Login failed';

      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 🧠 INITIAL STATE
const initialState = {
  user: user,          // persisted user
  isLoading: false,    // ✅ FIXED (important)
  isError: false,
  message: '',
};

// 🧩 SLICE
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 🚪 LOGOUT
    logout: (state) => {
      localStorage.removeItem('user');
      state.user = null;
      state.isError = false;
      state.message = '';
      toast.success('Logged out successfully');
    },

    // (optional) reset errors
    reset: (state) => {
      state.isError = false;
      state.message = '';
    },
  },

  extraReducers: (builder) => {
    builder
      // ⏳ LOGIN PENDING
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })

      // ✅ LOGIN SUCCESS
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })

      // ❌ LOGIN FAILED
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      });
  },
});

// 🚀 EXPORTS
export const { logout, reset } = authSlice.actions;
export default authSlice.reducer;