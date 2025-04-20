// Dashboard.jsx — Final onboarding-aware version
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setUser,
  logout as logoutAction,
  setBusinessProfile,
} from "../store/slices/authSlice";
import {
  setChatHistory,
  setInsights,
  setSuggestions,
  setWebsiteReport,
  setIframeHtml,
  setSummary,
  setRoadmap,
} from "../store/slices/assistantSlice";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import OverviewCard from "../components/OverviewCard";
import AnalyticsCharts from "../components/AnalyticsCharts";
import AssistantPanel from "../components/AssistantPanel";
import BusinessWizard from "../components/BusinessWizard";
import NoPresenceExperience from "../components/NoPresenceExperience";

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const businessProfile = useSelector((state) => state.auth.businessProfile);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState({ visits: [], sources: [] });
  const [statsLoading, setStatsLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // 🔁 1. Load user once
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/auth/me`, {
          withCredentials: true,
        });
        dispatch(
          setUser({
            user: res.data,
            onboarding: res.data.onboarding,
            onboarded: res.data.onboarded,
          })
        );
        dispatch(setChatHistory(res.data.chatHistory || []));
        dispatch(setInsights(res.data.insights || null));
        dispatch(setSuggestions(res.data.suggestions || []));
        dispatch(setWebsiteReport(res.data.websiteReport || null));
        dispatch(setRoadmap(res.data?.roadmap || {}));
      } catch (err) {
        console.error("User load failed", err);
        window.location.href = "/";
      }
    };
    loadUser();
  }, []);

  // 🔁 2. Trigger onboarding complete update
  useEffect(() => {
    const handleOnboarded = () => {
      if (!user) return;
      dispatch(
        setUser({
          user,
          onboarding: user.onboarding,
          onboarded: true,
        })
      );
    };
    window.addEventListener("onboardingComplete", handleOnboarded);
    return () =>
      window.removeEventListener("onboardingComplete", handleOnboarded);
  }, [user]);

  // 🔁 3. Fetch stats + analytics after onboarding
  useEffect(() => {
    if (!user?.onboarded) return;

    const fetchDashboard = async () => {
      try {
        const statsRes = await axios.get(`${BASE_URL}/api/stats`, {
          withCredentials: true,
        });
        const analyticsRes = await axios.get(`${BASE_URL}/api/analytics`, {
          withCredentials: true,
        });

        setStats(statsRes.data);
        setAnalytics({
          visits: analyticsRes.data.visits || [],
          sources: analyticsRes.data.sources || [],
        });
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      } finally {
        setStatsLoading(false);
      }
    };
    const loadBusinessProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/business-profile`, {
          withCredentials: true,
        });
        dispatch(setBusinessProfile(res.data));
        dispatch(setSummary(res.data.siteSummary));
        dispatch(setIframeHtml(res.data.iframeHtml));
      } catch (err) {
        console.error("Business data fetch failed", err);
      }
    };

    fetchDashboard();
    if (user.onboarding?.hasOnlinePresence === false) {
      loadBusinessProfile();
    }
  }, [user?.onboarded]);

  const handleLogout = () => {
    axios.get(`${BASE_URL}/auth/logout`, { withCredentials: true });
    dispatch(logoutAction());
    window.location.href = "/";
  };

  if (!user)
    return (
      <div className="text-center p-10 text-gray-500">Loading user...</div>
    );
  if (!user.onboarded) return <BusinessWizard />;
  if (user.onboarding?.hasOnlinePresence === false)
    return <NoPresenceExperience user={user} />;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 p-6 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">Welcome, {user.displayName}</h1>
          <div className="flex items-center gap-4">
            <img
              src={user.photo}
              alt={user.displayName}
              className="w-10 h-10 rounded-full"
            />
            <button
              onClick={handleLogout}
              className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Overview Section */}
        <div
          id="overview"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10"
        >
          {statsLoading ? (
            Array(3)
              .fill(null)
              .map((_, i) => (
                <OverviewCard key={i} title="Loading..." value="--" icon="⏳" />
              ))
          ) : (
            <>
              <OverviewCard
                title="Revenue"
                value={`$${stats.revenue}`}
                icon="💰"
              />
              <OverviewCard
                title="Conversion Rate"
                value={`${stats.conversionRate}%`}
                icon="📈"
              />
              <OverviewCard
                title="Active Sessions"
                value={stats.activeSessions}
                icon="🟢"
              />
            </>
          )}
        </div>

        {/* Analytics Section */}
        <AnalyticsCharts
          analyticsData={analytics.visits}
          trafficSources={analytics.sources}
          loading={statsLoading}
          user={user}
        />

        {/* Assistant Section */}
        <AssistantPanel
          onboarding={user.onboarding}
          chatHistory={user.chatHistory}
          initialInsights={user.insights}
        />
      </main>
    </div>
  );
};

export default Dashboard;
