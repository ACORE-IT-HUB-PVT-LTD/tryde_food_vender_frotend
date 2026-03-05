import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const useOrder = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        // ✅ baseURL already has /kitchen — so just /orders/vendor/orders
        const result = await axiosInstance.get(
          "/orders/vendor/orders",
          { withCredentials: true }
        );
        console.log("data here orders=>", result.data.data);
        setAllOrders(result.data.data);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  return {
    allOrders,
    loading,
    error,
  };
};

export default useOrder;