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
        items:[]
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
