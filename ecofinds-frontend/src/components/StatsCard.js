import React from 'react';

const StatsCard = ({ icon: Icon, value, label }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col items-center space-y-2">
        <div className="text-primary-600 mb-2">
          <Icon size={24} />
        </div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-gray-500 text-sm">{label}</div>
      </div>
    </div>
  );
};

export default StatsCard;
