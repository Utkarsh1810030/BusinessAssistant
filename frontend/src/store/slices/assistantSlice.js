import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatHistory: [],
  insights: null,
  suggestions: [],
  hasLoadedStrategy: false,
  websiteReport: null,
  roadmap: null,
  summary : null,
  iframeHtml: ""
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
    setRoadmap: (state, action) => {
      state.roadmap = action.payload;
    },
    setSummary: (state, action) => {
      state.summary = action.payload
    },
    setIframeHtml : (state, action) => {
      state.iframeHtml = action.payload
    }
  },
});

export const {
  setChatHistory,
  setInsights,
  setSuggestions,
  setHasLoadedStrategy,
  setWebsiteReport,
  setRoadmap,
  setSummary,
  setIframeHtml
} = assistantSlice.actions;
export default assistantSlice.reducer;
