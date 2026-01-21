// src/pages/Support.jsx
import React, { useState } from 'react';
import { Button } from '@mui/material';

const Support = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // Send support ticket
    alert('Ticket Submitted');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-[#FF5252]">Support</h2>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue" className="w-full p-2 border rounded mb-4" rows={4} />
      <Button onClick={handleSubmit} variant="contained" style={{ backgroundColor: '#FF5252' }}>Submit Ticket</Button>
    </div>
  );
};

export default Support;