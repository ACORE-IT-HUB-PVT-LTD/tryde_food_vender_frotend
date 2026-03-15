import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await axiosInstance.get(
        "/restaurants/vendor/dashboard/analytics",
        { withCredentials: true }
      );
      setDashboardData(result.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { dashboardData, loading, error, fetchDashboardData };
};

export default useDashboardData;