import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  onboarding: {},
  onboarded: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, onboarding, onboarded } = action.payload;
      state.user = user;
      state.onboarding = onboarding;
      state.onboarded = onboarded;
    },
    logout: (state) => {
      state.user = null;
      state.onboarding = {};
      state.onboarded = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
