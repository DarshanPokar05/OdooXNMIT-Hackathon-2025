import React from 'react';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-[#1a1f2e] p-6 rounded-lg">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-4 rounded-full bg-emerald-500 bg-opacity-20">
          <Icon size={32} className="text-emerald-500" />
        </div>
        <h3 className="text-white text-lg font-semibold">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
