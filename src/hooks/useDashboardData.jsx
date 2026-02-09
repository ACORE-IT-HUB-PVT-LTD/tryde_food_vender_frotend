// import axios from 'axios'
// import React, { useEffect, useState } from 'react'
// import axiosInstance from '../api/axiosInstance';

// function useDashboardData() {
//     const[dashboardData,setDashboardData]=useState(null);
//   useEffect(()=>{
//      const fetchData=async () => {
//         try {
//             const result=await axiosInstance.get(`/restaurants/vendor/dashboard/analytics`,{withCredentials:true});
//             console.log("here the complete dashboard=>",result.data);
//             setDashboardData(result.data);
//         } catch (error) {
//            console.log(error) 
//         }
//      }
//      fetchData()
//   },[])

//     return { dashboardData, loading };

// }

// export default useDashboardData




import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axiosInstance.get(
          "/restaurants/vendor/dashboard/analytics",
          { withCredentials: true }
        );
         console.log(result.data)
        setDashboardData(result.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { dashboardData, loading };
};

export default useDashboardData;
