// BusinessWizard.jsx — Fullscreen classy onboarding wizard
import React, { useState } from 'react';

const steps = [
  'Business Basics',
  'Target & Revenue',
  'Presence & Tools',
  'Risk & Region',
  'Summary'
];

const BusinessWizard = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '', industry: '', stage: '',
    audience: '', pricingModel: '', revenue: '',
    website: '', platforms: '', tools: '',
    budget: '', risk: '', location: ''
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const inputClass = "w-full border border-gray-300 bg-gray-50 rounded-lg px-4 py-2 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-900";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <label className={labelClass}>Business Name</label>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. ConsoleVortex" className={inputClass} />
            <label className={labelClass}>Industry</label>
            <input name="industry" value={formData.industry} onChange={handleChange} placeholder="e.g. SaaS, Retail, Services" className={inputClass} />
            <label className={labelClass}>Stage</label>
            <input name="stage" value={formData.stage} onChange={handleChange} placeholder="Idea, Early, Scaling" className={inputClass} />
          </div>
        );
      case 1:
        return (
          <div>
            <label className={labelClass}>Target Audience</label>
            <input name="audience" value={formData.audience} onChange={handleChange} placeholder="e.g. Freelancers, Startups" className={inputClass} />
            <label className={labelClass}>Revenue Model</label>
            <input name="pricingModel" value={formData.pricingModel} onChange={handleChange} placeholder="e.g. Subscription, One-time, Freemium" className={inputClass} />
            <label className={labelClass}>Current Revenue</label>
            <input name="revenue" value={formData.revenue} onChange={handleChange} placeholder="e.g. $5,000/month" className={inputClass} />
          </div>
        );
      case 2:
        return (
          <div>
            <label className={labelClass}>Website URL</label>
            <input name="website" value={formData.website} onChange={handleChange} placeholder="e.g. www.consolevortex.com" className={inputClass} />
            <label className={labelClass}>Online Platforms Used</label>
            <input name="platforms" value={formData.platforms} onChange={handleChange} placeholder="e.g. Instagram, Shopify" className={inputClass} />
            <label className={labelClass}>Tools / CRM</label>
            <input name="tools" value={formData.tools} onChange={handleChange} placeholder="e.g. Notion, HubSpot" className={inputClass} />
          </div>
        );
      case 3:
        return (
          <div>
            <label className={labelClass}>Monthly Budget</label>
            <input name="budget" value={formData.budget} onChange={handleChange} placeholder="e.g. $500" className={inputClass} />
            <label className={labelClass}>Risk Willingness</label>
            <input name="risk" value={formData.risk} onChange={handleChange} placeholder="Low, Medium, High" className={inputClass} />
            <label className={labelClass}>Business Location</label>
            <input name="location" value={formData.location} onChange={handleChange} placeholder="City, Country" className={inputClass} />
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="font-semibold text-lg mb-2 text-gray-800">Review</h2>
            <pre className="text-sm bg-gray-100 p-4 rounded mb-4 text-gray-700">
              {JSON.stringify(formData, null, 2)}
            </pre>
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
                    // 👇 Inform parent that onboarding is done
                    window.dispatchEvent(new Event('onboardingComplete'));
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
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white p-10 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">{steps[step]}</h1>
        {renderStep()}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={step === 0}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded disabled:opacity-50"
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow"
            >
              Next
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BusinessWizard;
