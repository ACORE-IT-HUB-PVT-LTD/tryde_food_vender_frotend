import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { RestaurantContext } from "./getRestaurant";

export const CategoriesContext = createContext(null);

function GetAllCategories({ children }) {
  const { restaurant } = useContext(RestaurantContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchCategories = async () => {
    const token = localStorage.getItem("token");

      try {
        setLoading(true);
        const res = await axiosInstance.get(
          `/categories/${restaurant.id}`,{
            headers:{
              Authorization: `Bearer ${token}`,
            }
          });
        // console.log( "here is the categories " , res.data)
        setCategories(res.data)
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  useEffect(() => {
      if (!restaurant?.id) return;
    fetchCategories();
  }, [restaurant]);
  return (
    <CategoriesContext.Provider value={{ categories, loading ,setCategories,fetchCategories}}>
      {children}
    </CategoriesContext.Provider>
  );
}

export default GetAllCategories;
