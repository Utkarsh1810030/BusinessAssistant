// server/controllers/analytics.controller.js

// Dummy data — replace with DB or service call later
const getStatsOverview = (req, res) => {
    res.json({
      revenue: 14200,
      conversionRate: 4.5,
      activeSessions: 1237,
    });
  };
  
  const getEngagementAnalytics = (req, res) => {
    res.json({ "visits" : [
        { date: '2024-03-28', visits: 100 },
      { date: '2025-03-28', visits: 190 },
      { date: '2025-03-29', visits: 240 },
      { date: '2025-03-30', visits: 210 },
      { date: '2025-03-31', visits: 310 },
      { date: '2025-04-01', visits: 265 },
      { date: '2025-04-02', visits: 330 },
    ] , 
    "sources": [
        {"name": "Google" , value: 300},
        {"name": "Facebook" , value: 150},
        {"name": "Direct" , value: 100}
    ]

});
  };
  
  module.exports = {
    getStatsOverview,
    getEngagementAnalytics,
  };
  