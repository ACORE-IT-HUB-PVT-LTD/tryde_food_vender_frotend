// src/components/OrderCard.jsx
import React from 'react';
import { Button } from '@mui/material';

const OrderCard = ({ order, onAccept, onReject }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 font-['Poppins']">
      <div className="flex justify-between">
        <div>
          <h3 className="font-bold">Order #{order.id}</h3>
          <p>{order.items.length} items</p>
          <p>Total: ₹{order.total}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="contained" color="success" onClick={() => onAccept(order.id)}>Accept</Button>
          <Button variant="contained" color="error" onClick={() => onReject(order.id)}>Reject</Button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;