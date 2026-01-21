// src/components/Card.jsx
import React from 'react';

const Card = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-4 text-[#FF5252]">{title}</h2>
      {children}
    </div>
  );
};

export default Card;