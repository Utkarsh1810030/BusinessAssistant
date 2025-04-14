// BusinessMemoryUploader.jsx — Drop-in RAG memory uploader
import React, { useState } from 'react';
import axios from 'axios';

const BusinessMemoryUploader = () => {
  const [text, setText] = useState('');
  const [type, setType] = useState('offerings');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setStatus(null);

    try {
      await axios.post(`${BASE_URL}/api/rag/upload`, {
        items: [
            {
                "text": "Since switching to Business Assistant, we've tripled our customer engagement. The insights are accurate and the AI assistant feels like a real business coach.",
                "type": "testimonials",
                "source": "manual"
              },
              {
                "text": "Business Assistant helped us launch our online store in under 5 days. The forecasting tools gave us confidence to expand beyond local sales.",
                "type": "testimonials",
                "source": "manual"
              },
              {
                "text": "We offer a complete digital presence launch kit, including landing page design, SEO setup, and integration with platforms like Google My Business and Facebook.",
                "type": "offerings",
                "source": "manual"
              },
              {
                "text": "Our AI assistant provides daily business insights based on your sales, goals, and customer behavior — all personalized to your industry and size.",
                "type": "offerings",
                "source": "manual"
              },
              {
                "text": "Case Study: Cozy Crafts increased their monthly revenue by 250% after implementing Business Assistant. Our AI roadmap helped them set realistic growth goals and execute with confidence. They used our social scheduling and CRM suggestions to re-engage old customers and upsell new ones.",
                "type": "case_study",
                "source": "manual"
              },
              {
                "text": "Q: Do I need a website to use Business Assistant?\nA: Not at all! We help you build your presence from scratch, including launching your first website, setting up social channels, and tracking offline engagement.",
                "type": "faq",
                "source": "manual"
              },
              {
                "text": "Q: Is Business Assistant suitable for small local businesses?\nA: Absolutely. Our tools are designed to help solo entrepreneurs, family businesses, and local service providers get digital without needing a tech team.",
                "type": "faq",
                "source": "manual"
              }
              
        ]
      }, { withCredentials: true });

      setStatus('success');
      setText('');
    } catch (err) {
      console.error('Upload failed:', err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 border rounded-xl bg-white shadow">
      <h2 className="text-xl font-bold mb-4 text-blue-600">Add Business Memory</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        placeholder="Paste testimonials, case studies, FAQs, etc..."
        className="w-full p-3 border rounded-md text-sm mb-4"
      />

      <div className="flex items-center gap-4 mb-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border px-4 py-2 rounded-md text-sm"
        >
          <option value="offerings">Offerings</option>
          <option value="testimonials">Testimonials</option>
          <option value="case_study">Case Study</option>
          <option value="faq">FAQ</option>
          <option value="generic">Generic</option>
        </select>
        <button
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {status === 'success' && (
        <p className="text-green-600 text-sm">✅ Memory uploaded successfully!</p>
      )}
      {status === 'error' && (
        <p className="text-red-600 text-sm">❌ Upload failed. Try again.</p>
      )}
    </div>
  );
};

export default BusinessMemoryUploader;
