import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import axiosInstance from "../api/axiosInstance";

export const RestaurantContext = createContext(null);

function GetRestaurant({ children }) {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);

  // useCallback: stable function
  const getCurrentRestaurant = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/restaurants");
      const restaurantData = res.data?.restaurants?.[0] || null;
      setRestaurant(restaurantData);
      console.log(restaurantData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // call once on mount
  useEffect(() => {
    getCurrentRestaurant();
  }, [getCurrentRestaurant]);

  // useMemo: stable context value
  const contextValue = useMemo(() => {
    return {
      restaurant,
      setRestaurant,
      loading,
      getCurrentRestaurant,
    };
  }, [restaurant, loading, getCurrentRestaurant]);

  return (
    <RestaurantContext.Provider value={contextValue}>
      {children}
    </RestaurantContext.Provider>
  );
}

export default GetRestaurant;
