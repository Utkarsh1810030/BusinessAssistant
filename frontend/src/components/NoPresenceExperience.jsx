// NoPresenceExperience.jsx (modified to show One.com roadmap)
import React, { useEffect, useState } from "react";
import axios from "axios";
import { logout as logoutAction } from "../store/slices/authSlice";
import {
  setRoadmap,
  setSummary,
  setIframeHtml,
} from "../store/slices/assistantSlice";
import { useDispatch, useSelector } from "react-redux";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

const NoPresenceExperience = ({ user = {} }) => {
  const dispatch = useDispatch();
  const onboarding = user?.onboarding;
  const iframeHtml = useSelector((state) => state.assistant.iframeHtml);
  const [loading, setLoading] = useState(true);
  const summary = useSelector((state) => state.assistant.summary);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const roadmap = useSelector((state) => state.assistant.roadmap);
  const businessName = onboarding?.name;
  const isRoadmapPopulated =
    roadmap &&
    Array.isArray(roadmap.featureAlignment) &&
    roadmap.featureAlignment.length > 0 &&
    Array.isArray(roadmap.testimonials) &&
    roadmap.testimonials.length > 0 &&
    Array.isArray(roadmap.pricingPlans) &&
    roadmap.pricingPlans.length > 0;

  console.log(summary, iframeHtml);

  const fetchCachedSite = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/user/site-preview`, {
        withCredentials: true,
      });
      if (res.data?.iframeHtml) {
        dispatch(setIframeHtml(res.data.iframeHtml));
        setLoading(false);
      } else {
        generateSitePreview();
      }
    } catch (err) {
      console.error("❌ Failed to fetch cached site", err);
      generateSitePreview();
    }
  };

  const generateSitePreview = async () => {
    setLoading(true);
    try {
      const prompt = `Generate a dark, modern business website for \"${businessName}\" based on:
${JSON.stringify(onboarding)}
Output full HTML.`;

      const res = await axios.post(
        `${BASE_URL}/api/assistant/tool`,
        {
          label: "generate website",
          onboarding: {
            ...onboarding,
            hasOnlinePresence: false,
            promptOverride: prompt,
          },
        },
        { withCredentials: true }
      );

      const cleaned = sanitizeHtml(res.data.result);
      dispatch(setIframeHtml(cleaned));
      await axios.post(
        `${BASE_URL}/api/user/save-site-preview`,
        { iframeHtml: cleaned },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("❌ Failed to generate dummy website", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRagSummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/user/site-summary`, {
        withCredentials: true,
      });
      if (res.data?.features?.length) {
        dispatch(setSummary(res.data));
      } else {
        const newSummary = await axios.post(
          `${BASE_URL}/api/rag/summary`,
          {},
          { withCredentials: true }
        );
        dispatch(setSummary(newSummary.data));
        await axios.post(
          `${BASE_URL}/api/user/save-site-summary`,
          newSummary.data,
          { withCredentials: true }
        );
      }
    } catch (err) {
      console.error("❌ Failed to fetch or generate summary", err);
    } finally {
      setSummaryLoading(false);
    }
  };

  const fetchRoadmap = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/rag/onecom-roadmap`,
        { onboarding },
        { withCredentials: true }
      );
      dispatch(setRoadmap(res.data));
    } catch (err) {
      console.error("❌ Roadmap fetch failed", err);
    }
  };

  const sanitizeHtml = (raw) =>
    raw
      .replace(/```html/g, "")
      .replace(/```/g, "")
      .trim();

  const handleLogout = () => {
    axios.get(`${BASE_URL}/auth/logout`, { withCredentials: true });
    dispatch(logoutAction());
    window.location.href = "/";
  };

  useEffect(() => {
    fetchCachedSite();
    fetchRagSummary();
    if (!isRoadmapPopulated) fetchRoadmap();
  }, [isRoadmapPopulated]);

  return (
    <div className="min-h-screen w-full bg-white text-gray-800 p-6 md:p-12">
      <div className="absolute top-4 right-6 flex items-center gap-4">
        {user?.photo && (
          <img
            src={user.photo}
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover"
          />
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 text-sm shadow"
        >
          Logout
        </button>
      </div>

      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          {summary?.banner || "Your Online Journey Starts Here"}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Let Business Assistant help you launch a powerful digital presence
          with zero hassle.
        </p>
        <button
          onClick={generateSitePreview}
          className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
        >
          Regenerate Preview
        </button>
      </section>

      {/* 🔥 One.com Smart Roadmap */}
      {roadmap && (
        <section className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold mb-4">{roadmap.tagline}</h2>
          <p className="text-sm text-gray-600 mb-6">
            Trust Score: {roadmap.trustScore}
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {roadmap.featureAlignment.map((f, i) => (
              <div key={i} className="p-4 bg-white rounded-lg border shadow-sm">
                {f}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-2">📦 Recommended Plans</h3>
            {roadmap.pricingPlans.map((plan, i) => (
              <div key={i} className="p-4 bg-blue-50 rounded mb-4">
                <h4 className="text-lg font-bold">
                  {plan.plan} — {plan.price}
                </h4>
                <ul className="list-disc ml-6 text-sm mt-1">
                  {plan.benefits.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-2">💬 Testimonials</h3>
            <ul className="space-y-2 text-sm italic text-gray-700">
              {roadmap.testimonials.map((quote, i) => (
                <li key={i}>“{quote}”</li>
              ))}
            </ul>
          </div>

          <div className="mt-8 bg-green-50 p-4 rounded-lg border">
            <p>
              <strong>🌐 Suggested Domain:</strong> {roadmap.domainSuggestion}
            </p>
            <p>
              <strong>💰 Estimated Cost:</strong> {roadmap.totalCostEstimate}
            </p>
          </div>
        </section>
      )}

      {/* RAG Summary */}
      <section className="my-16 max-w-5xl mx-auto">
        {summaryLoading ? (
          <div className="text-center text-gray-500 py-20 animate-pulse">
            Loading your personalized offerings...
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {(summary?.features || []).map((text, i) => (
              <div
                key={i}
                className="p-6 bg-gray-50 border rounded-xl shadow-sm text-center"
              >
                <div className="text-3xl mb-2">✨</div>
                <h3 className="font-semibold text-md text-gray-800">{text}</h3>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Website Preview */}
      <section className="my-12 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Your Future Website
        </h2>
        <div className="border rounded-xl overflow-hidden shadow-lg">
          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Generating website preview...
            </div>
          ) : (
            <iframe
              srcDoc={iframeHtml}
              title="Dummy Website Preview"
              className="w-full h-[600px]"
            />
          )}
        </div>
      </section>

      <section className="mt-20 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Ready to go online?
        </h3>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-lg shadow">
          Talk to Our Team →
        </button>
      </section>
    </div>
  );
};

export default NoPresenceExperience;
