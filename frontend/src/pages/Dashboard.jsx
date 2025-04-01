import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import OverviewCard from "../components/OverviewCard";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const lineChartData = [
    { day: "Mon", visits: 200 },
    { day: "Tue", visits: 300 },
    { day: "Wed", visits: 500 },
    { day: "Thu", visits: 400 },
    { day: "Fri", visits: 600 },
    { day: "Sat", visits: 700 },
    { day: "Sun", visits: 550 },
  ];

  const pieChartData = [
    { name: "Organic", value: 400 },
    { name: "Referral", value: 300 },
    { name: "Social", value: 300 },
    { name: "Email", value: 200 },
  ];
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

  const BASE_URL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    axios
      .get(`${BASE_URL}/auth/me`, {
        withCredentials: true,
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      });
  }, []);

  const handleLogout = () => {
    axios.get(`${BASE_URL}auth/logout`, {
      withCredentials: true,
    });
    window.location.href = "/";
  };

  const handleAskAssistant = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/assistant", {
        message,
      });
      setResponse(res.data.reply || "No response");
    } catch (err) {
      setResponse("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return <div className="text-center p-10 text-gray-500">Loading...</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-6 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="text-xl font-semibold">
            Welcome, {user.displayName}
          </div>
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

        <div
          id="overview"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10"
        >
          <OverviewCard title="Revenue" value="$14.2K" icon="💰" />
          <OverviewCard title="Conversion Rate" value="4.5%" icon="📈" />
          <OverviewCard title="Active Sessions" value="1,237" icon="🟢" />
        </div>

        <div id="analytics" className="bg-white rounded-xl shadow p-6 mb-10">
          <h3 className="text-xl font-semibold mb-6">📊 Analytics Overview</h3>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div>
              <h4 className="text-md font-medium mb-2">📈 Weekly Visitors</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className="text-md font-medium mb-2">🌐 Traffic Sources</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div id="assistant" className="bg-white rounded-xl shadow p-6">
          <p className="font-medium mb-2">🧠 AI Assistant</p>
          <p className="text-gray-600 mb-4">
            Ask anything related to your business and get helpful insights
            instantly.
          </p>

          <div className="flex flex-col gap-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask your assistant..."
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
            />
            <button
              onClick={handleAskAssistant}
              disabled={loading}
              className="self-start px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow disabled:opacity-50"
            >
              {loading ? "Thinking..." : "Ask"}
            </button>
            {response && (
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-gray-800 whitespace-pre-wrap">
                {response}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
