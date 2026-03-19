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
      const res = await axiosInstance.get(
        `/orders/vendor/orders/${orderId}`
      );
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

      {/* ORDER HEADER */}
      <h1 className="text-2xl font-bold mb-4">
        Order #{order.order_id}
      </h1>

      {/* CUSTOMER */}
      <div className="border p-4 rounded-lg mb-4">
        <h2 className="font-semibold mb-2">Customer</h2>
        <p>Name: {order.user?.name}</p>
        <p>Phone: {order.user?.phone}</p>
        <p>Email: {order.user?.email}</p>
      </div>

      {/* DELIVERY ADDRESS */}
      <div className="border p-4 rounded-lg mb-4">
        <h2 className="font-semibold mb-2">Delivery Address</h2>
        <p>{order.delivery_address?.name}</p>
        <p>{order.delivery_address?.phone}</p>
        <p>
          {order.delivery_address?.addressLine1},{" "}
          {order.delivery_address?.addressLine2}
        </p>
        <p>
          {order.delivery_address?.city},{" "}
          {order.delivery_address?.state} -{" "}
          {order.delivery_address?.pincode}
        </p>
      </div>

      {/* ITEMS */}
      <div className="border p-4 rounded-lg mb-4">
        <h2 className="font-semibold mb-2">Items</h2>

        {order.items?.map((item) => (
          <div
            key={item.id}
            className="flex justify-between border-b py-2"
          >
            <div>
              <p className="font-medium">
                {item.dish?.name}
              </p>
              <p className="text-sm text-gray-500">
                Qty: {item.quantity}
              </p>
            </div>

            <div className="text-right">
              <p>₹{item.price}</p>
              <p className="font-semibold">
                ₹{item.total_price}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* DRIVER */}
      {order.driver && (
        <div className="border p-4 rounded-lg mb-4">
          <h2 className="font-semibold mb-2">Driver</h2>
          <p>Name: {order.driver.name}</p>
          <p>Phone: {order.driver.phone}</p>
          <p>Vehicle: {order.driver.vehicle_type}</p>
        </div>
      )}

      {/* ORDER STATUS */}
      <div className="border p-4 rounded-lg mb-4">
        <h2 className="font-semibold mb-2">Order Status</h2>
        <p>Status: {order.order_status}</p>
        <p>Payment: {order.payment_status}</p>
        <p>Driver Status: {order.driver_status}</p>
      </div>

      {/* PAYMENT DETAILS */}
      <div className="border p-4 rounded-lg">
        <h2 className="font-semibold mb-2">Payment Details</h2>

        <p>Subtotal: ₹{order.total_amount}</p>
        <p>Delivery: ₹{order.delivery_charge}</p>
        <p>Platform Fee: ₹{order.platform_fee}</p>
        <p>GST: ₹{order.gst_amount}</p>

        <p className="font-bold text-lg mt-2">
          Total Payable: ₹{order.customer_payable}
        </p>
      </div>

    </div>
  );
}