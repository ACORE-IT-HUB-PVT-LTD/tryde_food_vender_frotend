import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { RestaurantContext } from "./getRestaurant";

export const CategoriesContext = createContext(null);

function GetAllCategories({ children }) {
  const { restaurant } = useContext(RestaurantContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(
          `/categories/${restaurant.id}`
        );
        setCategories(res.data|| []);
        console.log(res.data)
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  useEffect(() => {
    fetchCategories();
  }, [restaurant]);

  return (
    <CategoriesContext.Provider value={{ categories, loading ,setCategories,fetchCategories}}>
      {children}
    </CategoriesContext.Provider>
  );
}

export default GetAllCategories;
