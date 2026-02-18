// import React, { createContext, useContext, useEffect, useState } from "react";
// import axiosInstance from "../api/axiosInstance";
// import { RestaurantContext } from "./getRestaurant";

// export const CategoriesContext = createContext(null);

// function GetAllCategories({ children }) {
//   const { restaurant } = useContext(RestaurantContext);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });


//   const fetchCategories = async () => {
//     const token = localStorage.getItem("token");

//       try {
//         setLoading(true);
//         const res = await axiosInstance.get(
//           `/categories/${restaurant.id}`,{
//             headers:{
//               Authorization: `Bearer ${token}`,
//             }
//           });
//         console.log( "here is the categories " , res)
//         setCategories(res.data.data)
//         setPagination(res.data.pagination); // <-- store pagination info

//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     }
//   useEffect(() => {
//       if (!restaurant?.id) return;
//     fetchCategories();
//   }, [restaurant]);
//   return (
//     <CategoriesContext.Provider value={{ categories,pagination, loading ,setCategories,setPagination,fetchCategories}}>
//       {children}
//     </CategoriesContext.Provider>
//   );
// }

// export default GetAllCategories;

import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { RestaurantContext } from "./getRestaurant";

export const CategoriesContext = createContext(null);

function GetAllCategories({ children }) {
  const { restaurant } = useContext(RestaurantContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  
  // page param backend ko bhejo
  const fetchCategories = async (page = 1) => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/categories/${restaurant.id}`, {
        params: { page, limit: 10 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!restaurant?.id) return;
    fetchCategories(1);
  }, [restaurant]);

  return (
    <CategoriesContext.Provider
      value={{ categories, pagination, loading, setCategories, setPagination, fetchCategories }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export default GetAllCategories;