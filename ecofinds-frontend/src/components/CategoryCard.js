import React from 'react';
import Link from 'next/link';

const CategoryCard = ({ icon: Icon, title, itemCount }) => {
  return (
    <Link href={`/categories/${title.toLowerCase()}`}>
      <div className="bg-[#1a1f2e] p-6 rounded-lg transition-transform hover:scale-105 cursor-pointer">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`p-4 rounded-lg bg-opacity-20 ${getIconColor(title)}`}>
            <Icon size={32} className={getIconTextColor(title)} />
          </div>
          <h3 className="text-white text-lg font-semibold">{title}</h3>
          <p className="text-gray-400 text-sm">{itemCount} items</p>
        </div>
      </div>
    </Link>
  );
};

const getIconColor = (category) => {
  const colors = {
    Electronics: 'bg-blue-500',
    Furniture: 'bg-orange-500',
    Clothing: 'bg-pink-500',
    Books: 'bg-purple-500',
    Sports: 'bg-emerald-500',
    'Home & Garden': 'bg-emerald-500'
  };
  return colors[category] || 'bg-gray-500';
};

const getIconTextColor = (category) => {
  const colors = {
    Electronics: 'text-blue-500',
    Furniture: 'text-orange-500',
    Clothing: 'text-pink-500',
    Books: 'text-purple-500',
    Sports: 'text-emerald-500',
    'Home & Garden': 'text-emerald-500'
  };
  return colors[category] || 'text-gray-500';
};

export default CategoryCard;
