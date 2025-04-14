// NoPresenceExperience.jsx — Caching RAG summary and fallback for loading state
import React, { useEffect, useState } from "react";
import axios from "axios";
import { logout as logoutAction } from "../store/slices/authSlice";
import { useDispatch } from "react-redux";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

const NoPresenceExperience = ({ user = {} }) => {
  const dispatch = useDispatch()
  const onboarding = user?.onboarding
  const [iframeHtml, setIframeHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const businessName = onboarding?.name;

  const fetchCachedSite = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/user/site-preview`, { withCredentials: true });
      if (res.data?.iframeHtml) {
        setIframeHtml(res.data.iframeHtml);
        setLoading(false);
      } else {
        generateSitePreview();
      }
    } catch (err) {
      console.error('❌ Failed to fetch cached site', err);
      generateSitePreview();
    }
  };

  const generateSitePreview = async () => {
    setLoading(true);
    try {
      const prompt = `Generate a highly UI/UX integrated, responsive, modern one-page business website for a small business called "${businessName}" and with some onboarding data provided by user:\n${JSON.stringify(onboarding)}\n HTML and CSS. It should be dark , minimalist and modern.

It should include the following sections:

0. A Navbar section to scroll to different sections of the page.
1. A hero/header section with a welcoming headline, subtext, and a call-to-action button. Should be aligned properly and UI friendly.
2. An "About Us" section with a short paragraph about the business in good font style and size.
3. A "Services" section that showcases three cards (e.g., Coffee, Baked Goods, Community Events) w.r.t \n${JSON.stringify(onboarding.industry)}\n and \n${JSON.stringify(onboarding.audience)}\n with short descriptions and realistic icons/images.
4. A "Testimonials" section with 2 customer reviews in quote format along with actual customer images.
5. A "Contact" section with a form (name, email, message) and social media icons.
6. Use at least two dummy images generated on your own.
7. Use a stylish font (e.g., Google Fonts – 'Poppins' or 'Inter'), rounded card elements, soft shadows, and clean spacing.
8. Include all CSS inside a <style > tag. No JavaScript is needed.
9. Do NOT use placeholder text like 'Lorem ipsum' — write realistic-sounding content instead.

The output should be a complete raw HTML file.`;

      const res = await axios.post(
        `${BASE_URL}/api/assistant/tool`,
        {
          label: "generate website",
          onboarding: {
            name: businessName,
            hasOnlinePresence: false,
            promptOverride: prompt,
          },
        },
        { withCredentials: true }
      );

      const cleaned = sanitizeHtml(res.data.result);
      setIframeHtml(cleaned);
      await axios.post(`${BASE_URL}/api/user/save-site-preview`, {
        iframeHtml: cleaned
      }, { withCredentials: true });
    } catch (err) {
      console.error("❌ Failed to generate dummy website", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRagSummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/user/site-summary`, { withCredentials: true });
      if (res.data?.features) {
        setSummary(res.data);
      } else {
        const newSummary = await axios.post(`${BASE_URL}/api/rag/summary`, {}, { withCredentials: true });
        setSummary(newSummary.data);
        await axios.post(`${BASE_URL}/api/user/save-site-summary`, newSummary.data, { withCredentials: true });
      }
    } catch (err) {
      console.error("❌ Failed to fetch or generate summary", err);
    } finally {
      setSummaryLoading(false);
    }
  };

  const sanitizeHtml = (raw) => {
    return raw
      .replace(/```html/g, '')
      .replace(/```/g, '')
      .replace(/This HTML will create[^]*?<html/, '<html')
      .trim();
  };

  const handleLogout =  () => {
    try {
       axios.get(`${BASE_URL}/auth/logout`, { withCredentials: true });
      dispatch(logoutAction());
      window.location.href = '/';
    } catch (err) {
      console.error('❌ Logout failed', err);
    }
  };

  useEffect(() => {
    fetchCachedSite();
    fetchRagSummary();
  }, []);

  return (
    <div className="min-h-screen w-full bg-white text-gray-800 p-6 md:p-12">
       <div className="absolute top-4 right-6 flex items-center gap-4">
        {user?.photo && (
          <img src={user.photo} alt="Profile" className="w-9 h-9 rounded-full object-cover" />
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

      {/* Features Section — RAG summary features */}
      <section className="my-16 max-w-5xl mx-auto">
        {summaryLoading ? (
          <div className="text-center text-gray-500 py-20 animate-pulse">
            Loading your personalized offerings...
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {(summary?.features || [
              "Smart Assistant Guidance",
              "Automated Growth Insights",
              "Easy Website Setup",
              "Built-in CRM Suggestions",
              "Email & Social Marketing Tools",
              "24/7 AI Advisor Support"
            ]).map((text, i) => (
              <div
                key={i}
                className="p-6 bg-gray-50 border rounded-xl shadow-sm text-center"
              >
                <div className="text-3xl mb-2">✨</div>
                <h3 className="font-semibold text-md text-gray-800">
                  {text}
                </h3>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Testimonials Section */}
      {summary?.testimonials && (
        <section className="my-10 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">What Our Customers Say</h2>
          <ul className="space-y-4">
            {summary.testimonials.map((quote, i) => (
              <li key={i} className="text-gray-600 italic">“{quote}”</li>
            ))}
          </ul>
        </section>
      )}

      {/* Impact Quote */}
      {summary?.impact && (
        <section className="my-10 max-w-4xl mx-auto text-center">
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <p className="text-green-800 font-semibold">🚀 {summary.impact}</p>
          </div>
        </section>
      )}

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

      {/* CTA Section */}
      <section className="mt-20 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Ready to go online?
        </h3>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-lg shadow">
          Talk to Our Team &rarr;
        </button>
      </section>
    </div>
  );
};
export default NoPresenceExperience;