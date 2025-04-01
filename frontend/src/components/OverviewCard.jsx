import React from 'react';

const OverviewCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default OverviewCard;
