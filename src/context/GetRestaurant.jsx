import React, { createContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export const RestaurantContext = createContext(null);

function GetRestaurant({ children }) {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentRestaurant = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/restaurants");
      const restaurantdata = res.data.restaurants?.[0] || null;
       setRestaurant(restaurantdata);
      console.log(res.data.restaurants?.[0])
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentRestaurant();
  }, []);

  return (
    <RestaurantContext.Provider
      value={{
        restaurant,
        setRestaurant,
        loading,
        getCurrentRestaurant,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export default GetRestaurant;
