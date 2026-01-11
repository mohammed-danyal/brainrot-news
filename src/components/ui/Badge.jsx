import React from 'react';

const categoryColors = {
  Politics: 'bg-purple-600 text-white',
  Sports: 'bg-pink-600 text-white',
  Tech: 'bg-blue-600 text-white',
  Business: 'bg-green-600 text-white',
  India: 'bg-orange-600 text-white',
  World: 'bg-indigo-600 text-white',
};

export const Badge = ({ category }) => {
  const colorClass = categoryColors[category] || 'bg-gray-600';
  
  return (
    <span className={`${colorClass} px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider`}>
      {category}
    </span>
  );
};