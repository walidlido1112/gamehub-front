// Tooltip.js
import React from 'react';

const Tooltip = ({ text, children }) => {
  return (
    <div className="relative flex items-center group">
      {children}
      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
