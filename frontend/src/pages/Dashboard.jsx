import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get('https://businessassistant-production.up.railway.app/auth/me', {
            withCredentials: true,
        })
            .then((res) => setUser(res.data))
            .catch(() => {
                window.location.href = '/';
            });
    }, []);

    const handleLogout = () => {
        window.open(
            'https://businessassistant-production.up.railway.app/auth/logout',
            '_self'
        );
    };

    if (!user) return <div className="text-center p-10 text-gray-500">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex justify-between items-center p-4 bg-white shadow">
                <div className="text-xl font-semibold">Dashboard</div>
                <div className="flex items-center gap-4">
                    <img src={user.photo} alt={user.displayName} className="w-10 h-10 rounded-full" />
                    <button
                        onClick={handleLogout}
                        className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow p-4">📈 Business Score: <strong>78</strong></div>
                <div className="bg-white rounded-xl shadow p-4">👥 Customers Engaged: <strong>142</strong></div>
                <div className="bg-white rounded-xl shadow p-4">📊 Weekly Traffic: <strong>12.4k</strong></div>
                <div className="bg-white rounded-xl shadow p-4 col-span-1 md:col-span-2 xl:col-span-3">
                    <p className="font-medium mb-2">📌 Insights</p>
                    <ul className="list-disc list-inside text-gray-700">
                        <li>Improve your homepage CTA to boost conversions</li>
                        <li>Consider targeting returning visitors with offers</li>
                        <li>Engagement from mobile users is 30% lower</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};


export default Dashboard;