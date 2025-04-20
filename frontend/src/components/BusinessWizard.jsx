// BusinessWizard.jsx — Fixed input field styling with shared className
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/authSlice';

const steps = [
  'Business Info',
  'Audience & Revenue',
  'Online Presence',
  'Tools & Channels',
  'Budget & Risk',
  'Location',
  'Summary',
];

const inputClass =
  'w-full bg-[#181820] text-white placeholder-gray-400 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500';

const BusinessWizard = () => {
  const dispatch = useDispatch()
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    hasOnlinePresence: null,
    name: '',
    industry: '',
    stage: '',
    audience: '',
    pricingModel: '',
    revenue: '',
    website: '',
    platforms: '',
    tools: '',
    budget: '',
    risk: '',
    location: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const renderDots = () => (
    <div className="flex justify-center gap-1 mb-6">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className={`h-1.5 w-6 rounded-full ${i === step ? 'bg-blue-500' : 'bg-gray-700'}`}
        />
      ))}
    </div>
  );

  const cardClass =
    'bg-[#111118] border border-[#282838] rounded-2xl px-10 py-16 shadow-xl w-full max-w-md text-center';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F] text-white relative overflow-hidden font-inter">
      <motion.div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse" />
      <motion.div className="absolute bottom-[-120px] right-[-80px] w-[300px] h-[300px] bg-gradient-to-tr from-blue-500 to-violet-700 rounded-full blur-2xl opacity-20 animate-pulse" />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6 }}
          className={cardClass}
        >
          {renderDots()}

          {step === 0 && (
            <>
              <h2 className="text-2xl font-semibold mb-6">Tell us about your business</h2>
              <input name="name" placeholder="Business Name" className={inputClass} value={formData.name} onChange={handleChange} />
              <input name="industry" placeholder="Industry" className={`${inputClass} mt-4`} value={formData.industry} onChange={handleChange} />
              <input name="stage" placeholder="Stage" className={`${inputClass} mt-4`} value={formData.stage} onChange={handleChange} />
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-2xl font-semibold mb-6">Audience & Revenue</h2>
              <input name="audience" placeholder="Target Audience" className={inputClass} value={formData.audience} onChange={handleChange} />
              <input name="pricingModel" placeholder="Pricing Model" className={`${inputClass} mt-4`} value={formData.pricingModel} onChange={handleChange} />
              <input name="revenue" placeholder="Revenue" className={`${inputClass} mt-4`} value={formData.revenue} onChange={handleChange} />
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-semibold mb-6">Do you have an online presence?</h2>
              <div className="flex flex-col gap-4 mb-6">
                <button onClick={() => setFormData({ ...formData, hasOnlinePresence: true })} className={`w-full py-3 rounded-lg border ${formData.hasOnlinePresence ? 'border-blue-500' : 'border-gray-700'} bg-[#181820]`}>Yes</button>
                <button onClick={() => setFormData({ ...formData, hasOnlinePresence: false })} className={`w-full py-3 rounded-lg border ${formData.hasOnlinePresence === false ? 'border-blue-500' : 'border-gray-700'} bg-[#181820]`}>No</button>
              </div>
            </>
          )}

{step === 3 && (
  formData.hasOnlinePresence ? (
    <>
      <h2 className="text-2xl font-semibold mb-6">Online tools and platforms</h2>
      <input name="website" placeholder="Website (if any)" className={inputClass} value={formData.website} onChange={handleChange} />
      <input name="platforms" placeholder="e.g. Facebook, Shopify" className={`${inputClass} mt-4`} value={formData.platforms} onChange={handleChange} />
      <input name="tools" placeholder="e.g. HubSpot, Zapier" className={`${inputClass} mt-4`} value={formData.tools} onChange={handleChange} />
    </>
  ) : (
    <>
      <h2 className="text-2xl font-semibold mb-6">How do you interact with customers?</h2>
      <input name="platforms" placeholder="e.g. In-person, WhatsApp" className={inputClass} value={formData.platforms} onChange={handleChange} />
      <input name="tools" placeholder="Any tools you're planning to use?" className={`${inputClass} mt-4`} value={formData.tools} onChange={handleChange} />
    </>
  )
)}

          {step === 4 && (
            <>
              <h2 className="text-2xl font-semibold mb-6">Budget & Risk</h2>
              <input name="budget" placeholder="e.g. 500" className={inputClass} value={formData.budget} onChange={handleChange} />
              <input name="risk" placeholder="e.g. Low, Medium, High" className={`${inputClass} mt-4`} value={formData.risk} onChange={handleChange} />
            </>
          )}

          {step === 5 && (
            <>
              <h2 className="text-2xl font-semibold mb-6">Where are you located?</h2>
              <input name="location" placeholder="City, Country" className={inputClass} value={formData.location} onChange={handleChange} />
            </>
          )}

          {step === 6 && (
            <>
              <h2 className="text-2xl font-semibold mb-6">Summary</h2>
              <pre className="text-left bg-[#181820] text-green-400 text-sm p-4 rounded-lg mb-6 overflow-x-auto">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </>
          )}

          <div className="flex justify-between mt-6">
            <button onClick={prevStep} disabled={step === 0} className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50">Back</button>
            {step < steps.length - 1 ? (
              <button onClick={nextStep} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Continue</button>
            ) : (
              <button
              onClick={async () => {
                try {
                  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
                  const res = await fetch(`${BASE_URL}/api/onboard`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(formData)
                  });

                  if (res.ok) {
                    window.dispatchEvent(new Event('onboardingComplete'));
                    const updated = await res.json();
                    dispatch(setUser({
                      user: updated,
                      onboarding: updated.onboarding,
                      onboarded: true,
                      hasOnlinePresence: updated.onboarding?.hasOnlinePresence || false
                    }));
                    window.location.reload()
                  } else {
                    console.error('❌ Failed to submit onboarding');
                  }
                } catch (err) {
                  console.error('❌ Error submitting form:', err);
                }
              }}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
            >
              Submit
            </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default BusinessWizard;
