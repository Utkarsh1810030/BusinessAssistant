import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import assistantReducer from './slices/assistantSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    assistant: assistantReducer,
    ui: uiReducer,
  },
});

export default store;
