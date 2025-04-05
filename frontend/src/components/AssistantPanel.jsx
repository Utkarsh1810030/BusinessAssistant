import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { CheckCircle, Rocket } from 'lucide-react';
import RevenueForecast from './RevenueForecast';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

const AssistantPanel = ({ onboarding , chatHistory = [], initialInsights = null}) => {
  const [messages, setMessages] = useState(chatHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [clickedSuggestions, setClickedSuggestions] = useState([]);
  const [showInsights, setShowInsights] = useState(false);
  const [insightResult, setInsightResult] = useState(initialInsights);
  const [hasLoadedStrategy, setHasLoadedStrategy] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!onboarding || hasLoadedStrategy || messages.length > 0) return;
  
    const loadInitialStrategy = async () => {
      setLoading(true);
      try {
        const [strategyRes, actionsRes] = await Promise.all([
          axios.post(`${BASE_URL}/api/assistant/strategy`, { onboarding }, { withCredentials: true }),
          axios.post(`${BASE_URL}/api/assistant/actions`, { onboarding }, { withCredentials: true })
        ]);
  
        const assistantMessage = {
          role: 'assistant',
          content: strategyRes.data.result || 'Here’s a strategic summary based on your business.'
        };
  
        const initialMessages = [assistantMessage];
        setMessages(initialMessages);
        setSuggestions(actionsRes.data.actions || []);
        setHasLoadedStrategy(true);
  
        // Save strategy to chat history
        await axios.post(`${BASE_URL}/api/assistant/save`, {
          messages: initialMessages
        }, { withCredentials: true });
  
      } catch (err) {
        console.error('Strategy load failed:', err);
      } finally {
        setLoading(false);
      }
    };
  
    loadInitialStrategy();
  }, [onboarding, messages.length, hasLoadedStrategy]);
  
  
  
  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      setMessages(chatHistory);
    }
  }, [chatHistory]);
  
  useEffect(() => {
    if (initialInsights && initialInsights.summary) {
      setInsightResult(initialInsights);
      setShowInsights(true);
    }
  }, [initialInsights]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (customInput = null) => {
    const text = customInput || input;
    if (!text.trim()) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    if (!customInput) setInput('');
    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/assistant/tool`,
        { label: text, onboarding },
        { withCredentials: true }
      );
      setMessages([...newMessages, { role: 'assistant', content: res.data.result }]);
    } catch (err) {
      console.error('Tool request failed:', err);
      setMessages([...newMessages, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = async (label) => {
    setClickedSuggestions([...clickedSuggestions, label]);
    setSuggestions((prev) => prev.filter((s) => s.label !== label));
    await handleSend(label);
  };

  const filteredSuggestions = suggestions
    .filter(s => !clickedSuggestions.includes(s.label))
    .slice(0, 3);

  const generateInsights = async () => {
    setShowInsights(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/assistant/insights`, {
        messages,
        onboarding,
        forceRefresh: true
      }, { withCredentials: true });
      setInsightResult(res.data);
      console.log(insightResult)
    } catch (err) {
      console.error('Insight generation failed:', err);
    }
  };

  return (
    <div id="assistant" className="flex flex-col p-4 bg-gray-50 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">🤖 Business Assistant</h2>

      <div className="flex-1 overflow-y-auto mb-4 space-y-3 max-h-[60vh] px-1" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 text-sm whitespace-pre-line rounded-xl max-w-[80%] ${
              msg.role === 'user' ? 'bg-blue-100 text-right ml-auto' : 'bg-white text-left shadow-sm'
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && <div className="text-sm text-gray-400">Assistant is thinking...</div>}

        {filteredSuggestions.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-semibold text-gray-700 mb-2">💡 Suggested Actions:</p>
            <div className="flex flex-wrap gap-2">
              {filteredSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s.label)}
                  className="px-3 py-1.5 bg-blue-50 text-sm text-blue-700 border border-blue-200 rounded hover:bg-blue-100"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            className="flex-1 p-2 border border-gray-300 rounded shadow resize-none"
            placeholder="Ask something about your business..."
          />
          <button
            onClick={() => handleSend()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Send
          </button>
        </div>

        <div className="mt-4 text-center">
        <button
  onClick={generateInsights}
  className="text-sm px-4 py-2 bg-green-100 text-green-800 border border-green-300 rounded hover:bg-green-200"
>
  {insightResult?.summary ? '🔄 Regenerate Insights' : '📈 Generate Deep Insights'}
</button>

        </div>
      </div>

      {showInsights && insightResult && (
        <div className="mt-6 space-y-6 p-4 bg-white border rounded-lg shadow">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">📊 Business Summary</h3>
            <p className="text-sm text-gray-600">{insightResult.summary || 'No summary available.'}</p>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-2">🛠️ Checklist</h4>
            <ul className="grid gap-2 text-sm text-gray-700">
              {(insightResult.checklist || []).map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-2">🚀 Growth Roadmap</h4>
            <ul className="grid gap-2 text-sm text-gray-700">
              {(insightResult.roadmap || []).map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Rocket className="w-4 h-4 text-purple-500 mt-1" />
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {insightResult.revenue && (
            <RevenueForecast revenue = {insightResult?.revenue}/>
          )}
        </div>
      )}
    </div>
  );
};

export default AssistantPanel;
