import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  onboarding: {},
  onboarded: false,
  hasOnlinePresence: null,
  businessProfile: {}
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
      state.hasOnlinePresence = action.payload.onboarding?.hasOnlinePresence || false;
    },
    logout: (state) => {
      state.user = null;
      state.onboarding = {};
      state.onboarded = false;
    },
    setBusinessProfile: (state, action) => {
      state.businessProfile = action.payload
    }
  },
});

export const { setUser, logout, setBusinessProfile } = authSlice.actions;
export default authSlice.reducer;
