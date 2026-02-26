// import React, { useState, useRef, useEffect, useContext } from "react";
// import Card from '../components/Card';
// import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

// import {
//   Package,
//   IndianRupee,
//   Clock,
//   Ban,
//   CheckCircle,
//   XCircle,
//   BarChart3,
//   PieChart,
//   TrendingUp,
//   UtensilsCrossed,
//   Utensils,
//   Pizza,
//   Beef,
//   Coffee,
//   IceCreamCone,
//   Soup,
//   Drumstick,
//   Popcorn,
//   ChefHat,
//   Sandwich,
//   Plus,
// } from 'lucide-react';

// // Chart.js + react-chartjs-2 imports
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
// } from 'chart.js';
// import { Bar, Doughnut, Pie } from 'react-chartjs-2';
// import useDashboardData from "../hooks/useDashboardData";
// import { CategoriesContext } from "../context/GetAllCategories";
// import axiosInstance from "../api/axiosInstance";
// import { RestaurantContext } from "../context/getRestaurant";
// import { FaStar } from "react-icons/fa6";

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement
// );

// // Static data for revenue and customers
// const weeklyRevenueData = {
//   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//   datasets: [
//     {
//       label: 'Revenue ₹',
//       data: [5200, 6800, 9200, 14500, 11800, 19800, 24800],
//       backgroundColor: 'rgba(239, 68, 68, 0.65)',
//       borderColor: '#FF5252',
//       borderWidth: 2,
//       borderRadius: 8,
//       hoverBackgroundColor: 'rgba(239, 68, 68, 0.85)',
//     },
//   ],
// };

// const customerBreakdownData = {
//   labels: ['Repeat Customers', 'New Customers'],
//   datasets: [
//     {
//       data: [78, 22],
//       backgroundColor: ['#FF5252', '#e5e7eb'],
//       borderWidth: 0,
//       hoverOffset: 12,
//     },
//   ],
// };

// const Dashboard = () => {
//   const { dashboardData, loading } = useDashboardData();
//   const { categories, loading: contextLoading, fetchCategories } = useContext(CategoriesContext);
//   const { restaurant, getCurrentRestaurant } = useContext(RestaurantContext)
//   const [showLeftArrow, setShowLeftArrow] = useState(false);
//   const [showRightArrow, setShowRightArrow] = useState(false);
//   const [isHovering, setIsHovering] = useState(false);
//   const [items, setItems] = useState([])
//   const scrollContainerRef = useRef(null);



//   // dyanamic data  items
//   const AllMenuItems = async () => {
//     try{
//       const result = await axiosInstance.get(`/menuitems/${restaurant.id}/menu-items`, { withCredentials: true })
//       setItems(result.data.data);
//       //  console.log("All menu=>",result.data);
//     } catch (error) {
//       console.log(error)
//     }
//   }


//   const AllSubCategory = async () => {
//     try {
//       const result = await axiosInstance.get()
//     } catch (error) {

//     }
//   }

//   useEffect(() => {
//     if (restaurant?.id) {
//       AllMenuItems();
//     }
//   }, [restaurant?.id]);

//   // Prepare dynamic chart data from API
//   const prepareCategoryChartData = () => {
//     if (!dashboardData?.analytics?.category_wise) {
//       return null;
//     }

//     const categoryData = dashboardData.analytics.category_wise;

//     return {
//       labels: categoryData.map(cat => cat.name),
//       datasets: [
//         {
//           label: 'Items Count',
//           data: categoryData.map(cat => parseInt(cat.item_count)),
//           backgroundColor: [
//             'rgba(239, 68, 68, 0.75)',
//             'rgba(59, 130, 246, 0.75)',
//             'rgba(16, 185, 129, 0.75)',
//             'rgba(245, 158, 11, 0.75)',
//             'rgba(139, 92, 246, 0.75)',
//           ],
//           borderColor: [
//             '#FF5252',
//             '#3b82f6',
//             '#10b981',
//             '#f59e0b',
//             '#8b5cf6',
//           ],
//           borderWidth: 2,
//           borderRadius: 8,
//           hoverBackgroundColor: [
//             'rgba(239, 68, 68, 0.9)',
//             'rgba(59, 130, 246, 0.9)',
//             'rgba(16, 185, 129, 0.9)',
//             'rgba(245, 158, 11, 0.9)',
//             'rgba(139, 92, 246, 0.9)',
//           ],
//         },
//       ],
//     };
//   };

//   const prepareSubcategoryChartData = () => {
//     if (!dashboardData?.analytics?.subcategory_wise) {
//       return null;
//     }

//     const subcategoryData = dashboardData.analytics.subcategory_wise;

//     return {
//       labels: subcategoryData.map(sub => sub.name),
//       datasets: [
//         {
//           data: subcategoryData.map(sub => parseInt(sub.item_count)),
//           backgroundColor: [
//             '#FF5252',
//             '#3b82f6',
//             '#10b981',
//             '#f59e0b',
//             '#8b5cf6',
//             '#ec4899',
//             '#06b6d4',
//           ],
//           borderWidth: 0,
//           hoverOffset: 12,
//         },
//       ],
//     };
//   };

//   const prepareAvailabilityChartData = () => {
//     if (!dashboardData?.analytics) {
//       return null;
//     }

//     const { available_items, unavailable_items } = dashboardData.analytics;

//     return {
//       labels: ['Available Items', 'Unavailable Items'],
//       datasets: [
//         {
//           data: [parseInt(available_items), parseInt(unavailable_items)],
//           backgroundColor: ['#10b981', '#ef4444'],
//           borderWidth: 0,
//           hoverOffset: 12,
//         },
//       ],
//     };
//   };

//   // Combined stats - static + dynamic
//   const stats = [
//     { title: "Today's Orders", value: 15, color: "bg-[#FF5252]", icon: <Package size={28} strokeWidth={2.2} /> },
//     { title: "Today's Revenue", value: '₹2,500', color: "bg-emerald-500", icon: <IndianRupee size={28} strokeWidth={2.2} /> },
//     { title: "Monthly Revenue", value: '₹78,400', color: "bg-indigo-500", icon: <TrendingUp size={28} strokeWidth={2.2} /> },
//     { title: "Pending Orders", value: 3, color: "bg-amber-500", icon: <Clock size={28} strokeWidth={2.2} /> },
//     { title: "Cancelled Orders", value: 2, color: "bg-rose-600", icon: <Ban size={28} strokeWidth={2.2} /> },
//   ];

//   // Dynamic stats from API
//   const dynamicStats = [
//     {
//       title: "Total Items",
//       value: dashboardData?.analytics?.total_items || '0',
//       color: "bg-purple-500",
//       icon: <Package size={28} strokeWidth={2.2} />
//     },
//     {
//       title: "Available Items",
//       value: dashboardData?.analytics?.available_items || '0',
//       color: "bg-green-500",
//       icon: <CheckCircle size={28} strokeWidth={2.2} />
//     },
//     {
//       title: "Unavailable Items",
//       value: dashboardData?.analytics?.unavailable_items || '0',
//       color: "bg-red-500",
//       icon: <XCircle size={28} strokeWidth={2.2} />
//     },
//     {
//       title: "Total Categories",
//       value: dashboardData?.analytics?.category_wise?.length || '0',
//       color: "bg-blue-500",
//       icon: <BarChart3 size={28} strokeWidth={2.2} />
//     },
//     {
//       title: "Total Subcategories",
//       value: dashboardData?.analytics?.subcategory_wise?.length || '0',
//       color: "bg-orange-500",
//       icon: <PieChart size={28} strokeWidth={2.2} />
//     },
//   ];

//   // Check scroll position and update arrow visibility
//   const checkScrollPosition = () => {
//     if (scrollContainerRef.current) {
//       const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//       setShowLeftArrow(scrollLeft > 10);
//       setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
//     }
//   };

//   useEffect(() => {
//     checkScrollPosition();
//     window.addEventListener('resize', checkScrollPosition);
//     return () => window.removeEventListener('resize', checkScrollPosition);
//   }, []);

//   const handleScroll = (direction) => {
//     if (scrollContainerRef.current) {
//       const scrollAmount = direction === 'left' ? -200 : 200;
//       scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
//       setTimeout(checkScrollPosition, 300);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF5252]"></div>
//       </div>
//     );
//   }

//   const categoryChartData = prepareCategoryChartData();
//   const subcategoryChartData = prepareSubcategoryChartData();
//   const availabilityChartData = prepareAvailabilityChartData();

//   return (
//     <div className="space-y-8 md:space-y-10 font-['Poppins'] pb-12">

//       {/* Static Stats Cards - Orders & Revenue */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
//         {stats.map((stat, idx) => (
//           <Card key={idx} title={stat.title}>
//             <div className="flex flex-col items-center justify-center py-5 md:py-6">
//               <div className={`w-16 h-16 md:w-18 md:h-18 rounded-full ${stat.color} flex items-center justify-center text-white shadow-lg mb-3 md:mb-4 transition-transform duration-300 hover:scale-110`}>
//                 {stat.icon}
//               </div>
//               <p className="text-3xl md:text-4xl font-extrabold text-gray-800">
//                 {stat.value}
//               </p>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Dynamic Stats Cards - Items & Categories from API */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
//         {dynamicStats.map((stat, idx) => (
//           <Card key={idx} title={stat.title}>
//             <div className="flex flex-col items-center justify-center py-5 md:py-6">
//               <div className={`w-16 h-16 md:w-18 md:h-18 rounded-full ${stat.color} flex items-center justify-center text-white shadow-lg mb-3 md:mb-4 transition-transform duration-300 hover:scale-110`}>
//                 {stat.icon}
//               </div>
//               <p className="text-3xl md:text-4xl font-extrabold text-gray-800">
//                 {stat.value}
//               </p>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Static Charts - Revenue & Customers */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Weekly Revenue - Bar Chart */}
//         <Card title="Revenue This Week">
//           <div className="pt-4 pb-6 px-2 md:px-4">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
//               <div>
//                 <p className="text-3xl md:text-4xl font-bold text-emerald-600">₹92,300</p>
//                 <p className="text-gray-500 text-sm">+14% from last week</p>
//               </div>
//               <div className="text-right text-sm text-gray-600">
//                 Highest: <span className="font-semibold text-[#FF5252]">₹24,800</span> (Sat)
//               </div>
//             </div>

//             <div className="h-64 md:h-72">
//               <Bar
//                 data={weeklyRevenueData}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   plugins: {
//                     legend: { display: false },
//                     tooltip: {
//                       backgroundColor: 'rgba(30, 30, 30, 0.92)',
//                       titleFont: { size: 14, weight: 'bold' },
//                       bodyFont: { size: 13 },
//                       padding: 12,
//                       callbacks: {
//                         label: (ctx) => `Revenue: ₹${ctx.parsed.y.toLocaleString()}`,
//                       },
//                     },
//                   },
//                   scales: {
//                     y: {
//                       beginAtZero: true,
//                       ticks: {
//                         callback: (value) => `₹${(value / 1000).toFixed(0)}k`,
//                         color: '#6b7280',
//                       },
//                       grid: { color: '#e5e7eb' },
//                     },
//                     x: {
//                       grid: { display: false },
//                       ticks: { color: '#6b7280' },
//                     },
//                   },
//                 }}
//               />
//             </div>
//           </div>
//         </Card>

//         {/* Customers Breakdown - Doughnut Chart */}
//         <Card title="Customer Breakdown">
//           <div className="flex flex-col md:flex-row items-center justify-between py-6 px-4 gap-6">
//             <div className="text-center md:text-left">
//               <p className="text-5xl md:text-6xl font-extrabold text-[#FF5252]">1,284</p>
//               <p className="text-gray-500 mt-1 text-lg">Total Customers</p>
//             </div>

//             <div className="w-52 h-52 md:w-64 md:h-64 relative">
//               <Doughnut
//                 data={customerBreakdownData}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: true,
//                   cutout: '68%',
//                   plugins: {
//                     legend: {
//                       position: 'bottom',
//                       labels: {
//                         font: { size: 14 },
//                         padding: 20,
//                         usePointStyle: true,
//                         pointStyle: 'circle',
//                       },
//                     },
//                     tooltip: {
//                       callbacks: {
//                         label: (ctx) => `${ctx.label}: ${ctx.parsed}% (${Math.round((ctx.parsed / 100) * 1284)} people)`,
//                       },
//                     },
//                   },
//                 }}
//               />
//               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                 <div className="text-center">
//                   <p className="text-4xl font-bold text-[#FF5252]">78%</p>
//                   <p className="text-sm text-gray-600">Repeat</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Dynamic Charts from API - Category, Subcategory & Availability */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Category-wise Items - Bar Chart */}
//         {categoryChartData && (
//           <Card title="Category-wise Items">
//             <div className="pt-4 pb-6 px-2 md:px-4">
//               <div className="mb-4">
//                 <p className="text-2xl md:text-3xl font-bold text-[#FF5252]">
//                   {dashboardData.analytics.category_wise.length} Categories
//                 </p>
//                 <p className="text-gray-500 text-sm">Distribution across menu</p>
//               </div>

//               <div className="h-64 md:h-72">
//                 <Bar
//                   data={categoryChartData}
//                   options={{
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     plugins: {
//                       legend: { display: false },
//                       tooltip: {
//                         backgroundColor: 'rgba(30, 30, 30, 0.92)',
//                         titleFont: { size: 14, weight: 'bold' },
//                         bodyFont: { size: 13 },
//                         padding: 12,
//                         callbacks: {
//                           label: (ctx) => `Items: ${ctx.parsed.y}`,
//                         },
//                       },
//                     },
//                     scales: {
//                       y: {
//                         beginAtZero: true,
//                         ticks: {
//                           stepSize: 1,
//                           color: '#6b7280',
//                         },
//                         grid: { color: '#e5e7eb' },
//                       },
//                       x: {
//                         grid: { display: false },
//                         ticks: {
//                           color: '#6b7280',
//                           maxRotation: 45,
//                           minRotation: 45,
//                         },
//                       },
//                     },
//                   }}
//                 />
//               </div>
//             </div>
//           </Card>
//         )}

//         {/* Subcategory-wise Items - Doughnut Chart */}
//         {subcategoryChartData && (
//           <Card title="Subcategory Distribution">
//             <div className="flex flex-col items-center justify-center py-6 px-4">
//               <div className="text-center mb-4">
//                 <p className="text-4xl md:text-5xl font-extrabold text-[#FF5252]">
//                   {dashboardData.analytics.subcategory_wise.length}
//                 </p>
//                 <p className="text-gray-500 mt-1 text-base">Total Subcategories</p>
//               </div>

//               <div className="w-52 h-52 md:w-64 md:h-64 relative">
//                 <Doughnut
//                   data={subcategoryChartData}
//                   options={{
//                     responsive: true,
//                     maintainAspectRatio: true,
//                     cutout: '65%',
//                     plugins: {
//                       legend: {
//                         position: 'bottom',
//                         labels: {
//                           font: { size: 12 },
//                           padding: 12,
//                           usePointStyle: true,
//                           pointStyle: 'circle',
//                         },
//                       },
//                       tooltip: {
//                         callbacks: {
//                           label: (ctx) => `${ctx.label}: ${ctx.parsed} items`,
//                         },
//                       },
//                     },
//                   }}
//                 />
//               </div>
//             </div>
//           </Card>
//         )}

//         {/* Item Availability - Pie Chart */}
//         {availabilityChartData && (
//           <Card title="Item Availability Status">
//             <div className="flex flex-col items-center justify-center py-6 px-4">
//               <div className="text-center mb-4">
//                 <p className="text-4xl md:text-5xl font-extrabold text-emerald-600">
//                   {dashboardData.analytics.available_items}
//                 </p>
//                 <p className="text-gray-500 mt-1 text-base">Items Available</p>
//               </div>

//               <div className="w-52 h-52 md:w-56 md:h-56">
//                 <Pie
//                   data={availabilityChartData}
//                   options={{
//                     responsive: true,
//                     maintainAspectRatio: true,
//                     plugins: {
//                       legend: {
//                         position: 'bottom',
//                         labels: {
//                           font: { size: 13 },
//                           padding: 16,
//                           usePointStyle: true,
//                           pointStyle: 'circle',
//                         },
//                       },
//                       tooltip: {
//                         callbacks: {
//                           label: (ctx) => {
//                             const total = parseInt(dashboardData.analytics.total_items);
//                             const percentage = ((ctx.parsed / total) * 100).toFixed(1);
//                             return `${ctx.label}: ${ctx.parsed} (${percentage}%)`;
//                           },
//                         },
//                       },
//                     },
//                   }}
//                 />
//               </div>
//             </div>
//           </Card>
//         )}
//       </div>




//       {/* Static Categories Section */}
//       <div>
//         <h2 className="text-xl md:text-2xl font-bold text-[#FF5252] mb-4 flex items-center gap-2">
//           <UtensilsCrossed size={28} className="text-[#FF5252]" />
//           Categories
//         </h2>
//         <div
//           className="relative"
//           onMouseEnter={() => setIsHovering(true)}
//           onMouseLeave={() => setIsHovering(false)}
//         >
//           <div
//             ref={scrollContainerRef}
//             onScroll={checkScrollPosition}
//             className="flex overflow-x-auto gap-5 md:gap-6 pb-4 scrollbar-hide snap-x snap-mandatory"
//           >
//             {categories.map((cat) => (
//               <div
//                 key={cat.id}
//                 className={`
//       group relative
//       min-w-[120px] xs:min-w-[130px] sm:min-w-[140px] md:min-w-[155px] lg:min-w-[170px]
//       flex flex-col items-center justify-between
//       bg-white
//       rounded-2xl
//       border border-gray-200 hover:border-[#ef4f5f]/40   /* Zomato-ish red border on hover */
//       overflow-hidden
//       shadow-[0_1px_3px_rgba(0,0,0,0.06)]
//       hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]
//       transition-all duration-250 ease-out
//       hover:scale-[1.02] active:scale-[0.98]
//       cursor-pointer
//       p-3.5 sm:p-4
//       snap-start
//     `}
//               >
//                 {/* Square image – Zomato uses square thumbs for categories/dishes */}
//                 <div className="
//       w-20 h-20 xs:w-22 xs:h-22 sm:w-24 sm:h-24 md:w-26 md:h-26 
//       rounded-xl overflow-hidden 
//       bg-gradient-to-b from-gray-50 to-gray-100/70
//       mb-3
//     ">
//                   <img
//                     src={cat.categoryImage}
//                     alt={cat.name}
//                     className={`
//           w-full h-full 
//           object-cover 
//           transition-transform duration-400 
//           group-hover:scale-105 group-active:scale-100
//         `}
//                   />
//                 </div>

//                 {/* Name – centered, semi-bold, red on hover like Zomato interactions */}
//                 <p className={`
//       font-medium text-gray-900 
//       text-center 
//       text-[13px] xs:text-[13.5px] sm:text-sm md:text-[15px]
//       leading-tight tracking-[-0.01em]
//       group-hover:text-[#ef4f5f] group-active:text-[#ef4f5f]   /* Zomato primary red approx #ef4f5f */
//       transition-colors duration-200 font-semibold
//     `}>
//                   {cat.name}
//                 </p>

//                 {/* Optional count badge – very common in Zomato partner menu categories */}
//                 {/* {cat.count && (
//       <span className="
//         absolute top-2 right-2 
//         bg-[#ef4f5f]/90 text-white 
//         text-[10px] font-semibold 
//         px-1.5 py-0.5 rounded-full 
//         shadow-sm
//       ">
//         {cat.count}
//       </span>
//     )} */}
//               </div>
//             ))}

//           </div>


//           {/* Subcategory-wise Breakdown from API */}
//           {/* {dashboardData?.analytics?.subcategory_wise && (
//             <div>
//               <h2 className="text-xl md:text-2xl font-bold text-[#FF5252] mb-4 flex items-center gap-2">
//                 <TrendingUp size={28} className="text-[#FF5252]" />
//                 Subcategories
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
//                 {dashboardData.analytics.subcategory_wise.map((subcategory) => (
//               <div
//                 key={subcategory.id}
//                 className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-l-4 border-[#FF5252]"
//               >
//                 <div className="p-5">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-base md:text-lg text-gray-800 mb-2">
//                         {subcategory.name}
//                       </h3>
//                       <div className="flex items-center gap-2">
//                         <Package size={18} className="text-[#FF5252]" />
//                         <p className="text-gray-600 text-sm">
//                           <span className="font-bold text-[#FF5252] text-xl">{subcategory.item_count}</span> items
//                         </p>
//                       </div>
//                     </div>
//                     <div className="bg-red-50 rounded-full p-3">
//                       <Utensils size={24} className="text-[#FF5252]" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//               </div>
//             </div>
//           )} */}



//           {/* Left Arrow */}
//           {showLeftArrow && isHovering && (
//             <button
//               className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/95 p-3 rounded-full shadow-xl hover:bg-white transition-all duration-200 hover:scale-110 z-10"
//               onClick={() => handleScroll('left')}
//             >
//               <ArrowLeftIcon className="h-6 w-6 text-[#FF5252]" />
//             </button>
//           )}

//           {/* Right Arrow */}
//           {showRightArrow && isHovering && (
//             <button
//               className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/95 p-3 rounded-full shadow-xl hover:bg-white transition-all duration-200 hover:scale-110 z-10"
//               onClick={() => handleScroll('right')}
//             >
//               <ArrowRightIcon className="h-6 w-6 text-[#FF5252]" />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* dynamic Popular Items Section */}
      
//       <div className="mt-8">
//         <h2 className="text-2xl md:text-3xl font-bold text-[#5297ff] mb-6 flex items-center gap-3">
//           <TrendingUp size={30} className="text-[#FF5252]" />
//           Popular Items
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {Array.isArray(items) && items.length > 0 ? (
//             items.map((item) => (
//               <div
//                 key={item.id}
//                 className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100"
//               >
//                 {/* Image */}
//                 <div className="relative overflow-hidden">
//                   <img
//                     src={item.image || "/placeholder.png"}
//                     alt={item.name}
//                     className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
//                   />

//                   {/* gradient overlay */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

//                   {/* Bestseller */}
//                   {item.is_bestseller && (
//                     <span className="absolute top-3 left-3 bg-[#FF5252] text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
//                       Bestseller
//                     </span>
//                   )}

//                   {/* Veg / Non-Veg */}
//                   <span
//                     className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-semibold shadow
//                 ${item.food_type === "VEG"
//                         ? "bg-green-500 text-white"
//                         : "bg-red-500 text-white"
//                       }`}
//                   >
//                     {item.food_type}
//                   </span>
//                 </div>

//                 {/* Content */}
//                 <div className="p-4">
//                   <h3 className="font-semibold text-lg text-gray-800 truncate group-hover:text-[#FF5252] transition-colors">
//                     {item.name}
//                   </h3>

//                   {/* Rating + Time */}
//                   {/* <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
//                     <span>⭐ {item.rating || "4.2"}</span>
//                     <span>{item.preparation_time || 0} min</span>
//                   </div> */}


//                   <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
//                     <span className="flex items-center gap-1 text-yellow-500 font-medium">
//                       <FaStar className="text-yellow-500" />
//                       {item.rating || "4.2"}
//                     </span>

//                     <span>{item.preparation_time || 0} min</span>
//                   </div>


//                   {/* Price */}
//                   <div className="flex items-center gap-2 mt-3">
//                     <span className="text-[#FF5252] font-bold text-xl">
//                       ₹{item.offer_price || item.price}
//                     </span>

//                     {item.offer_price && (
//                       <span className="text-gray-400 line-through text-sm">
//                         ₹{item.price}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="col-span-full text-center py-12 text-gray-500">
//               No popular items available
//             </div>
//           )}
//         </div>
//       </div>

//     </div>
//   );
// };

// export default Dashboard;



import React, { useState, useRef, useEffect, useContext } from "react";
import Card from '../components/Card';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

import {
  Package,
  IndianRupee,
  Clock,
  Ban,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  TrendingUp,
  UtensilsCrossed,
  Utensils,
  Pizza,
  Beef,
  Coffee,
  IceCreamCone,
  Soup,
  Drumstick,
  Popcorn,
  ChefHat,
  Sandwich,
  Plus,
  ArrowUpRight,
  Flame,
  Leaf,
} from 'lucide-react';

// Chart.js + react-chartjs-2 imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Pie, Line } from 'react-chartjs-2';
import useDashboardData from "../hooks/useDashboardData";
import { CategoriesContext } from "../context/GetAllCategories";
import axiosInstance from "../api/axiosInstance";
import { RestaurantContext } from "../context/getRestaurant";
import { FaStar } from "react-icons/fa6";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
);

// Static data for revenue and customers
const weeklyRevenueData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Revenue ₹',
      data: [5200, 6800, 9200, 14500, 11800, 19800, 24800],
      fill: true,
      backgroundColor: 'rgba(232, 62, 62, 0.07)',
      borderColor: '#E83E3E',
      borderWidth: 2.5,
      tension: 0.45,
      pointBackgroundColor: '#E83E3E',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 8,
    },
  ],
};

const customerBreakdownData = {
  labels: ['Repeat Customers', 'New Customers'],
  datasets: [
    {
      data: [78, 22],
      backgroundColor: ['#E83E3E', '#f1f5f9'],
      borderWidth: 0,
      hoverOffset: 10,
    },
  ],
};

const Dashboard = () => {
  const { dashboardData, loading } = useDashboardData();
  const { categories, loading: contextLoading, fetchCategories } = useContext(CategoriesContext);
  const { restaurant, getCurrentRestaurant } = useContext(RestaurantContext);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [items, setItems] = useState([]);
  const scrollContainerRef = useRef(null);

  // dynamic data items
  const AllMenuItems = async () => {
    try {
      const result = await axiosInstance.get(`/menuitems/${restaurant.id}/menu-items`, { withCredentials: true });
      setItems(result.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const AllSubCategory = async () => {
    try {
      const result = await axiosInstance.get();
    } catch (error) {}
  };

  useEffect(() => {
    if (restaurant?.id) {
      AllMenuItems();
    }
  }, [restaurant?.id]);

  // Prepare dynamic chart data from API
  const prepareCategoryChartData = () => {
    if (!dashboardData?.analytics?.category_wise) return null;
    const categoryData = dashboardData.analytics.category_wise;
    return {
      labels: categoryData.map(cat => cat.name),
      datasets: [
        {
          label: 'Items Count',
          data: categoryData.map(cat => parseInt(cat.item_count)),
          backgroundColor: [
            'rgba(232, 62, 62, 0.80)',
            'rgba(59, 130, 246, 0.80)',
            'rgba(16, 185, 129, 0.80)',
            'rgba(245, 158, 11, 0.80)',
            'rgba(139, 92, 246, 0.80)',
          ],
          borderColor: ['#E83E3E', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
          borderWidth: 0,
          borderRadius: 10,
          hoverBackgroundColor: [
            'rgba(232, 62, 62, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(139, 92, 246, 1)',
          ],
        },
      ],
    };
  };

  const prepareSubcategoryChartData = () => {
    if (!dashboardData?.analytics?.subcategory_wise) return null;
    const subcategoryData = dashboardData.analytics.subcategory_wise;
    return {
      labels: subcategoryData.map(sub => sub.name),
      datasets: [
        {
          data: subcategoryData.map(sub => parseInt(sub.item_count)),
          backgroundColor: ['#E83E3E', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'],
          borderWidth: 0,
          hoverOffset: 12,
        },
      ],
    };
  };

  const prepareAvailabilityChartData = () => {
    if (!dashboardData?.analytics) return null;
    const { available_items, unavailable_items } = dashboardData.analytics;
    return {
      labels: ['Available Items', 'Unavailable Items'],
      datasets: [
        {
          data: [parseInt(available_items), parseInt(unavailable_items)],
          backgroundColor: ['#22c55e', '#f43f5e'],
          borderWidth: 0,
          hoverOffset: 12,
        },
      ],
    };
  };

  // Combined stats - static + dynamic
  const stats = [
    { title: "Today's Orders", value: 15, color: "bg-[#E83E3E]", icon: <Package size={20} strokeWidth={2.2} />, trend: "+12%" },
    { title: "Today's Revenue", value: '₹2,500', color: "bg-emerald-500", icon: <IndianRupee size={20} strokeWidth={2.2} />, trend: "+8%" },
    { title: "Monthly Revenue", value: '₹78,400', color: "bg-indigo-500", icon: <TrendingUp size={20} strokeWidth={2.2} />, trend: "+14%" },
    { title: "Pending Orders", value: 3, color: "bg-amber-500", icon: <Clock size={20} strokeWidth={2.2} />, trend: "-5%" },
    { title: "Cancelled Orders", value: 2, color: "bg-rose-600", icon: <Ban size={20} strokeWidth={2.2} />, trend: "-2%" },
  ];

  // Dynamic stats from API
  const dynamicStats = [
    { title: "Total Items", value: dashboardData?.analytics?.total_items || '0', color: "bg-purple-500", icon: <Package size={20} strokeWidth={2.2} /> },
    { title: "Available Items", value: dashboardData?.analytics?.available_items || '0', color: "bg-green-500", icon: <CheckCircle size={20} strokeWidth={2.2} /> },
    { title: "Unavailable Items", value: dashboardData?.analytics?.unavailable_items || '0', color: "bg-red-500", icon: <XCircle size={20} strokeWidth={2.2} /> },
    { title: "Total Categories", value: dashboardData?.analytics?.category_wise?.length || '0', color: "bg-blue-500", icon: <BarChart3 size={20} strokeWidth={2.2} /> },
    { title: "Total Subcategories", value: dashboardData?.analytics?.subcategory_wise?.length || '0', color: "bg-orange-500", icon: <PieChart size={20} strokeWidth={2.2} /> },
  ];

  // Check scroll position and update arrow visibility
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, []);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollPosition, 300);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#E83E3E]/20 border-t-[#E83E3E]"></div>
          <p className="text-sm text-gray-400 font-medium">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const categoryChartData = prepareCategoryChartData();
  const subcategoryChartData = prepareSubcategoryChartData();
  const availabilityChartData = prepareAvailabilityChartData();

  const tooltipDefaults = {
    backgroundColor: 'rgba(15,15,15,0.88)',
    titleFont: { size: 13, weight: 'bold' },
    bodyFont: { size: 12 },
    padding: 12,
    cornerRadius: 10,
    borderColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
  };

  return (
    <div
      className="space-y-8 pb-14"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-gray-400 mt-0.5">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm text-sm text-gray-500 font-medium">
          <Clock size={13} className="text-[#E83E3E]" />
          {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>

      {/* ── Static Stats Cards – Orders & Revenue ── */}
      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Orders & Revenue</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center text-white shadow-sm`}>
                  {stat.icon}
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${stat.trend?.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-extrabold text-gray-800 leading-tight">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1 font-medium">{stat.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Dynamic Stats Cards – Items & Categories ── */}
      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Menu Analytics</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {dynamicStats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center text-white shadow-sm mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-extrabold text-gray-800 leading-tight">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1 font-medium">{stat.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Revenue & Customers Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Weekly Revenue – upgraded to smooth Line chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-800 text-base">Revenue This Week</h3>
              <p className="text-xs text-gray-400 mt-0.5">Mon – Sun performance</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-gray-800">₹92,300</p>
              <p className="text-xs text-emerald-500 font-semibold flex items-center justify-end gap-1 mt-0.5">
                <ArrowUpRight size={12} /> +14% from last week
              </p>
            </div>
          </div>
          <div className="h-64">
            <Line
              data={weeklyRevenueData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    ...tooltipDefaults,
                    callbacks: { label: (ctx) => `Revenue: ₹${ctx.parsed.y.toLocaleString()}` },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { callback: (v) => `₹${(v / 1000).toFixed(0)}k`, color: '#9ca3af', font: { size: 11 } },
                    grid: { color: '#f3f4f6' },
                  },
                  x: {
                    grid: { display: false },
                    ticks: { color: '#9ca3af', font: { size: 11 } },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Customer Breakdown – Doughnut */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="mb-4">
            <h3 className="font-bold text-gray-800 text-base">Customer Breakdown</h3>
            <p className="text-xs text-gray-400 mt-0.5">Repeat vs new customers</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
            <div>
              <p className="text-5xl font-extrabold text-gray-800">1,284</p>
              <p className="text-gray-400 mt-1 text-sm font-medium">Total Customers</p>
              <div className="mt-5 space-y-3">
                {[
                  { label: 'Repeat', pct: 78, color: '#E83E3E', textCls: 'text-rose-500' },
                  { label: 'New', pct: 22, color: '#e5e7eb', textCls: 'text-gray-400' },
                ].map(r => (
                  <div key={r.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-600">{r.label}</span>
                      <span className={`font-bold ${r.textCls}`}>{r.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${r.pct}%`, backgroundColor: r.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-48 h-48 relative shrink-0">
              <Doughnut
                data={customerBreakdownData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  cutout: '70%',
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      ...tooltipDefaults,
                      callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed}% (${Math.round((ctx.parsed / 100) * 1284)} people)` },
                    },
                  },
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-3xl font-extrabold text-[#E83E3E]">78%</p>
                <p className="text-xs text-gray-400 font-medium">Repeat</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Dynamic API Charts – Category / Subcategory / Availability ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Category-wise Items – Bar */}
        {categoryChartData && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="mb-4">
              <h3 className="font-bold text-gray-800 text-base">Category-wise Items</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {dashboardData.analytics.category_wise.length} categories in menu
              </p>
            </div>
            <div className="h-64">
              <Bar
                data={categoryChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: { ...tooltipDefaults, callbacks: { label: (ctx) => `Items: ${ctx.parsed.y}` } },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { stepSize: 1, color: '#9ca3af', font: { size: 11 } },
                      grid: { color: '#f3f4f6' },
                    },
                    x: {
                      grid: { display: false },
                      ticks: { color: '#9ca3af', font: { size: 11 }, maxRotation: 30, minRotation: 0 },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}

        {/* Subcategory Distribution – Doughnut */}
        {subcategoryChartData && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="mb-4">
              <h3 className="font-bold text-gray-800 text-base">Subcategory Distribution</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {dashboardData.analytics.subcategory_wise.length} subcategories
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 relative">
                <Doughnut
                  data={subcategoryChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    cutout: '65%',
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { font: { size: 11 }, padding: 10, usePointStyle: true, pointStyle: 'circle', color: '#6b7280' },
                      },
                      tooltip: { ...tooltipDefaults, callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed} items` } },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Item Availability – Pie */}
        {availabilityChartData && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="mb-4">
              <h3 className="font-bold text-gray-800 text-base">Item Availability</h3>
              <p className="text-xs text-gray-400 mt-0.5">Current menu status</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-44 h-44">
                <Pie
                  data={availabilityChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        ...tooltipDefaults,
                        callbacks: {
                          label: (ctx) => {
                            const total = parseInt(dashboardData.analytics.total_items);
                            const pct = ((ctx.parsed / total) * 100).toFixed(1);
                            return `${ctx.label}: ${ctx.parsed} (${pct}%)`;
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
              <div className="flex items-center gap-3 w-full">
                {[
                  { label: 'Available', val: dashboardData.analytics.available_items, color: '#22c55e', bg: 'bg-emerald-50', text: 'text-emerald-600' },
                  { label: 'Unavailable', val: dashboardData.analytics.unavailable_items, color: '#f43f5e', bg: 'bg-rose-50', text: 'text-rose-500' },
                ].map(item => (
                  <div key={item.label} className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl ${item.bg}`}>
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <div>
                      <p className={`text-lg font-extrabold ${item.text}`}>{item.val}</p>
                      <p className="text-[11px] text-gray-500">{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Categories Section ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <UtensilsCrossed size={18} className="text-[#E83E3E]" />
            Categories
          </h2>
          <span className="text-xs text-gray-400 font-medium">{categories.length} total</span>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex overflow-x-auto gap-4 pb-3 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="group relative shrink-0 w-[130px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#E83E3E]/25 hover:-translate-y-1 transition-all duration-250 cursor-pointer overflow-hidden snap-start"
              >
                <div className="w-full h-24 overflow-hidden bg-gray-50">
                  <img
                    src={cat.categoryImage}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400"
                  />
                </div>
                <div className="px-2.5 py-2.5 text-center">
                  <p className="text-[13px] font-semibold text-gray-700 group-hover:text-[#E83E3E] transition-colors leading-tight truncate">
                    {cat.name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Left Arrow */}
          {showLeftArrow && isHovering && (
            <button
              className="absolute left-0 top-1/2 -translate-y-5 bg-white border border-gray-200 shadow-lg rounded-full p-2.5 hover:scale-110 hover:border-[#E83E3E]/30 transition-all duration-200 z-10"
              onClick={() => handleScroll('left')}
            >
              <ArrowLeftIcon className="h-4 w-4 text-gray-600" />
            </button>
          )}

          {/* Right Arrow */}
          {showRightArrow && isHovering && (
            <button
              className="absolute right-0 top-1/2 -translate-y-5 bg-white border border-gray-200 shadow-lg rounded-full p-2.5 hover:scale-110 hover:border-[#E83E3E]/30 transition-all duration-200 z-10"
              onClick={() => handleScroll('right')}
            >
              <ArrowRightIcon className="h-4 w-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* ── Popular Items Section ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#E83E3E]" />
            Popular Items
          </h2>
          <span className="text-xs text-gray-400 font-medium">{items.length} items</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.isArray(items) && items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-44">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                  {/* Bestseller badge */}
                  {item.is_bestseller && (
                    <span className="absolute top-2.5 left-2.5 bg-[#E83E3E] text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                      <Flame size={10} /> Bestseller
                    </span>
                  )}

                  {/* Veg / Non-Veg */}
                  <span
                    className={`absolute top-2.5 right-2.5 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow
                      ${item.food_type === "VEG" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}
                  >
                    {item.food_type === "VEG" ? <Leaf size={10} /> : <Flame size={10} />}
                    {item.food_type === "VEG" ? "Veg" : "Non-Veg"}
                  </span>

                  {/* Discount badge */}
                  {item.offer_price && (
                    <span className="absolute bottom-2.5 left-2.5 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      {Math.round((1 - item.offer_price / item.price) * 100)}% OFF
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-sm truncate group-hover:text-[#E83E3E] transition-colors">
                    {item.name}
                  </h3>

                  <div className="flex items-center justify-between text-xs mt-1.5">
                    <span className="flex items-center gap-1 text-amber-500 font-semibold">
                      <FaStar className="text-amber-400" />
                      {item.rating || "4.2"}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <Clock size={11} />
                      {item.preparation_time || 0} min
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                    <span className="font-extrabold text-[#E83E3E] text-base">
                      ₹{item.offer_price || item.price}
                    </span>
                    {item.offer_price && (
                      <span className="text-gray-300 line-through text-xs">₹{item.price}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
              <UtensilsCrossed size={40} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">No popular items available</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;