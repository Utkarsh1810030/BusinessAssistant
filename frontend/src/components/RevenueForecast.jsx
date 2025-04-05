// components/RevenueForecast.jsx
import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function RevenueForecast({ revenue }) {
    console.log(revenue)
  const [timeframe, setTimeframe] = useState('quarter');
  const [data, setData] = useState([]);

  useEffect(() => {
    if (revenue?.[timeframe]) {
      setData(revenue[timeframe]);
    }
  }, [revenue, timeframe]);

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Revenue Forecast</h2>
        <select
          value={timeframe}
          onChange={e => setTimeframe(e.target.value)}
          className="bg-gray-100 dark:bg-gray-800 text-sm p-2 rounded-md text-gray-700 dark:text-white"
        >
          <option value="quarter">Quarter</option>
          <option value="6months">6 Months</option>
          <option value="1year">1 Year</option>
          <option value="5years">5 Years</option>
        </select>
      </div>
      {data.length ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => `$${v}`} />
            <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
            <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">No data available for {timeframe}.</p>
      )}
    </div>
  );
}
