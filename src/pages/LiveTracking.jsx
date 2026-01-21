// src/pages/LiveTracking.jsx
import React from 'react';
// Assume map integration, e.g., react-google-maps
const LiveTracking = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-[#FF5252]">Live Tracking</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Mock map */}
        <div className="h-96 bg-gray-200 flex items-center justify-center">Map Placeholder</div>
      </div>
    </div>
  );
};

export default LiveTracking;