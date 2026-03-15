import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

const useAnalytics = () => {
  const [menuAnalytics, setMenuAnalytics] = useState(null);
  const [orderAnalytics, setOrderAnalytics] = useState(null);
  const [availabilityAnalytics, setAvailabilityAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [menuRes, orderRes, availabilityRes] = await Promise.all([
        axiosInstance.get("/analytics/cat-sub-menu/vendor", { withCredentials: true }),
        axiosInstance.get("/analytics/orders-analytics", { withCredentials: true }),
        axiosInstance.get("/analytics/menuitems-availabity", { withCredentials: true }),
      ]);
      setMenuAnalytics(menuRes.data.data);
      setOrderAnalytics(orderRes.data.data);
      setAvailabilityAnalytics(availabilityRes.data.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { menuAnalytics, orderAnalytics, availabilityAnalytics, loading, error, fetchAnalytics };
};

export default useAnalytics;