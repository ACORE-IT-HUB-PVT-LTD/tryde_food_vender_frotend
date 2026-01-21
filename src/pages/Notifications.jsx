// src/pages/Notifications.jsx
import React from 'react';

const Notifications = () => {
  const notifications = ['New order received', 'Payment settled'];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-[#FF5252]">Notifications</h2>
      <ul>
        {notifications.map((notif, idx) => <li key={idx} className="p-2 border-b">{notif}</li>)}
      </ul>
    </div>
  );
};

export default Notifications;