import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import showcaseImg from "../assets/hero-chart.png";
import growthImg from "../assets/activation-chart.png";
import actionImg2 from "../assets/growth-bar.png";
import testimonialBg from "../assets/testimonial-bg.jpg";
import { motion } from "framer-motion";
import GetStartedButton from "../components/GoogleLoginButton";
import {
  Globe,
  LineChart,
  Users,
  ShieldCheck,
  Bot,
  BarChartBig,
} from "lucide-react";

const featureIcons = {
  website: <Globe className="w-6 h-6 text-blue-500" />,
  sales: <LineChart className="w-6 h-6 text-blue-500" />,
  productivity: <Users className="w-6 h-6 text-blue-500" />,
  secure: <ShieldCheck className="w-6 h-6 text-blue-500" />,
  assistant: <Bot className="w-6 h-6 text-blue-500" />,
  insights: <BarChartBig className="w-6 h-6 text-blue-500" />,
};

const topFeatures = [
  { icon: featureIcons.website, text: "Launch an Auto Generated Website" },
  { icon: featureIcons.sales, text: "Increase Sales & Revenue" },
  { icon: featureIcons.productivity, text: "Boost Team Productivity" },
];

const bottomFeatures = [
  { icon: featureIcons.secure, text: "Auto Generated Website" },
  { icon: featureIcons.assistant, text: "AI Chat Assistant" },
  { icon: featureIcons.insights, text: "Business Insights" },
  { icon: featureIcons.sales, text: "Growth Roadmap" },
];

const focuses = [
  "Automated Growth Forecasts",
  "Smart Marketing Suggestions",
  "Website Heatmap & Analytics",
  "Built-in CRM Advice",
];
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
    },
  }),
};

const AnimatedSection = ({ children, index = 1 }) => (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeIn}
      custom={index}
    >
      {children}
    </motion.div>
  );

const LandingPage = () => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios
      .get(`${BASE_URL}/auth/me`, { withCredentials: true })
      .then((res) => {
        if (res.data) navigate("/dashboard");
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-[#0A0A0F] text-white min-h-screen font-inter overflow-hidden">
       {/* Layered Gradient Orbs */}
       <motion.div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-purple-800 via-indigo-600 to-blue-500 rounded-full blur-3xl opacity-30 animate-pulse z-0"
      />
      <motion.div
        className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-gradient-to-tr from-blue-700 via-violet-500 to-fuchsia-500 rounded-full blur-2xl opacity-30 animate-pulse z-0"
      />
      <motion.div
        className="absolute bottom-[-30%] left-[10%] w-[300px] h-[300px] bg-gradient-to-tl from-indigo-700 via-purple-600 to-pink-500 rounded-full blur-2xl opacity-20 animate-pulse z-0"
      />


      {/* Content Wrapper */}
      <div className="relative z-10">
        {/* Navbar */}
        <header className="flex justify-between items-center px-6 py-5 border-b border-[#1D1D29]">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.6 }}
            className="text-2xl font-extrabold tracking-widest text-white"
          >
            STRATOVATE
          </motion.h1>
          <nav className="hidden md:flex space-x-6 text-base">
            <a href="#achieve" className="hover:text-blue-400">What You Can Achieve</a>
            <a href="#features" className="hover:text-blue-400">Features</a>
            <a href="#focuses" className="hover:text-blue-400">Focuses</a>
          </nav>
          <GetStartedButton />
        </header>

        {/* Hero Section */}
        <section className="text-center px-6 py-20">
          <AnimatedSection index={1}>
            <h2 className="text-5xl font-extrabold leading-tight mb-8 max-w-4xl mx-auto text-white">
              Your Personal AI Strategist for Business Breakthroughs
            </h2>
          </AnimatedSection>
          <GetStartedButton />
          <AnimatedSection index={2}>
            <div className="mt-10 flex justify-center">
              <img src={showcaseImg} alt="Hero" className="rounded-xl w-full max-w-4xl shadow-md" />
            </div>
          </AnimatedSection>
        </section>
      </div>
      {/* What You Can Achieve */}
      <section id="achieve" className="px-6 py-16 max-w-6xl mx-auto">
      <AnimatedSection index={1}>
        <h3 className="text-3xl font-semibold text-center mb-10">
          What You Can Achieve
        </h3>
        </AnimatedSection>
        <AnimatedSection index={2}>
        <div className="flex flex-wrap justify-center gap-8">
          {topFeatures.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#13131A] w-[240px] p-6 rounded-xl border border-[#1F1F2D] flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl gap-2.5 z-1"
            >
              <div>{item.icon}</div>
              <p className="text-md font-medium leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
        </AnimatedSection>
      </section>

      {/* Stratovate in Action */}
      <section id="action" className="px-6 py-16 max-w-6xl mx-auto">
        <AnimatedSection index={1}>
        <h3 className="text-3xl font-semibold text-center mb-10">
          Stratovate in Action
        </h3>
        </AnimatedSection>
        <AnimatedSection index={2}>
        <div className="grid md:grid-cols-2 gap-6">
          <img
            src={growthImg}
            alt="Growth"
            className="rounded-xl shadow-lg w-full h-full"
          />
          <img
            src={actionImg2}
            alt="Growth 2"
            className="rounded-xl shadow-lg w-full"
          />
        </div>
        </AnimatedSection>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-16 max-w-6xl mx-auto">
        <AnimatedSection index={1}>
        <h3 className="text-3xl font-semibold text-center mb-10">Features</h3>
        </AnimatedSection>
        <AnimatedSection index={2}>
        <div className="flex flex-wrap justify-center gap-6">
          {bottomFeatures.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#13131A] w-[240px] p-6 rounded-xl border border-[#1F1F2D] flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
              <div className="mb-4">{item.icon}</div>
              <p className="text-base font-medium leading-snug">{item.text}</p>
            </div>
          ))}
        </div>
        </AnimatedSection>
      </section>

      {/* Focuses */}
      <section
        id="focuses"
        className="px-6 py-20 max-w-5xl mx-auto text-center"
      >
        <AnimatedSection index={1}>
        <h3 className="text-3xl font-semibold mb-10">Focus Areas</h3>
        </AnimatedSection>
        <AnimatedSection index={2}>
        <div className="flex flex-wrap justify-center gap-6">
          {focuses.map((text, i) => (
            <div
              key={i}
              className="bg-[#13131A] w-[240px] p-6 rounded-xl border border-[#1F1F2D] flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
              {text}
            </div>
          ))}
        </div>
        </AnimatedSection>
      </section>

      {/* Testimonial */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <AnimatedSection index={1}>
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <img
            src={testimonialBg}
            alt="Testimonial background"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="relative bg-black/70 p-10 md:p-14 backdrop-blur rounded-xl flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-2xl italic font-light max-w-xl leading-relaxed">
              “Since switching to Stratovate, we’ve tripled our customer
              engagement. The AI insights feel like having a real business
              coach.”
            </p>
            <GetStartedButton />
          </div>
        </div>
        </AnimatedSection>
      </section>
    </div>
  );
};

export default LandingPage;
