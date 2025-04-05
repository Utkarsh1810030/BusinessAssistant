// AnalyticsCharts.jsx (now with time range filter)
import React, { useState } from 'react';
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
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const AnalyticsCharts = ({ analyticsData = [], trafficSources = [], loading }) => {
  const [range, setRange] = useState(7);

  const filteredData = analyticsData.slice(-range);

  if (loading) {
    return (
      <div id="analytics" className="bg-white rounded-xl shadow p-6 mb-10">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div
      id="analytics"
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow mb-10"
    >
      {/* Line Chart */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Website Visits</h3>
          <select
            className="text-sm text-gray-700 rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 px-4 py-2 transition ease-in-out duration-200 hover:cursor-pointer"
            value={range}
            onChange={(e) => setRange(parseInt(e.target.value))}
          >
            <option value={7}>Last 7 Days</option>
            <option value={14}>Last 14 Days</option>
            <option value={30}>Last 30 Days</option>
          </select>
        </div>
        <p className="text-sm text-gray-500 mb-2">
  Showing last {filteredData.length} days of {analyticsData.length} total
</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="visits" stroke="#4F46E5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Traffic Sources</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={trafficSources}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {trafficSources.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
