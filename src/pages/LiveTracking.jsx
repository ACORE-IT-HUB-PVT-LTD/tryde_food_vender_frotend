// src/pages/LiveTracking.jsx
import React from 'react';
// Assume map integration, e.g., react-google-maps
const LiveTracking = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-[#FF5252] font-['Poppins']">Live Tracking</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Mock map */}
        {/* <div className="h-96 bg-gray-200 flex items-center justify-center">Map Placehol</div> */}
        <iframe
          width="100%"
          height="350"
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
          src="https://www.openstreetmap.org/export/embed.html?bbox=77.205%2C28.610%2C77.215%2C28.620&layer=mapnik&marker=28.615%2C77.210">
        </iframe>

      </div>
    </div>
  );
};

export default LiveTracking;