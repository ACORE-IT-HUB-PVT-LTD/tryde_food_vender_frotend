import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function OrderDetail() {

  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await axiosInstance.get(`/orders/vendor/orders/${orderId}`);
      setOrder(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  if (!order) return <div className="p-6">Order not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">
        Order #{order.order_id}
      </h1>

      <div className="border p-4 rounded-lg mb-4">
        <h2 className="font-semibold">Customer</h2>
        <p>{order.user?.name}</p>
        <p>{order.user?.phone}</p>
      </div>

      <div className="border p-4 rounded-lg mb-4">
        <h2 className="font-semibold">Items</h2>

        {order.items?.map((item) => (
          <div key={item.id} className="flex justify-between py-2">
            <span>
              {item.quantity} x {item.dish_name || item.dish?.name}
            </span>
            <span>₹{item.total_price}</span>
          </div>
        ))}
      </div>

      <div className="border p-4 rounded-lg">
        <h2 className="font-semibold">Payment</h2>
        <p>Mode: {order.payment_mode}</p>
        <p>Status: {order.payment_status}</p>
        <p className="font-bold text-lg">
          Total ₹{order.total_amount}
        </p>
      </div>

    </div>
  );
}