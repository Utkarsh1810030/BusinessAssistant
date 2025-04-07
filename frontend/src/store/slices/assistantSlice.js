import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatHistory: [],
  insights: null,
  suggestions: [],
  hasLoadedStrategy: false,
  websiteReport: null,
};

const assistantSlice = createSlice({
  name: "assistant",
  initialState,
  reducers: {
    setChatHistory: (state, action) => {
      state.chatHistory = action.payload;
    },
    setInsights: (state, action) => {
      state.insights = action.payload;
    },
    setSuggestions: (state, action) => {
      state.suggestions = action.payload;
    },
    setHasLoadedStrategy: (state, action) => {
      state.hasLoadedStrategy = action.payload;
    },
    setWebsiteReport: (state, action) => {
      state.websiteReport = action.payload;
    },
  },
});

export const {
  setChatHistory,
  setInsights,
  setSuggestions,
  setHasLoadedStrategy,
  setWebsiteReport
} = assistantSlice.actions;
export default assistantSlice.reducer;
