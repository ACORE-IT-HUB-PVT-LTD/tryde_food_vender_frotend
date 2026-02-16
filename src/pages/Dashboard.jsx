// import React, { useState, useRef, useEffect, useContext } from "react";
// import Card from '../components/Card';
// import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

// import {
//   Package,
//   IndianRupee,
//   Clock,
//   Ban,
//   Users,
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
// import { Bar, Doughnut } from 'react-chartjs-2';
// import useDashboardData from "../hooks/useDashboardData";

// // Register Chart.js components (do this once)
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement
// );

// // Sample data (replace with real data from API later)
// const weeklyRevenueData = {
//   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//   datasets: [
//     {
//       label: 'Revenue ₹',
//       data: [5200, 6800, 9200, 14500, 11800, 19800, 24800],
//       backgroundColor: 'rgba(239, 68, 68, 0.65)', // red-500 with opacity
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
//     const { dashboardData, loading } = useDashboardData();

//   const [showLeftArrow, setShowLeftArrow] = useState(false);
//   const [showRightArrow, setShowRightArrow] = useState(false);
//   const [isHovering, setIsHovering] = useState(false);
//   const scrollContainerRef = useRef(null);

//   const stats = [
//     { title: "Today's Orders", value: 15, color: "bg-[#FF5252]", icon: <Package size={28} strokeWidth={2.2} /> },
//     { title: "Today's Revenue", value: '₹2,500', color: "bg-emerald-500", icon: <IndianRupee size={28} strokeWidth={2.2} /> },
//     { title: "Monthly Revenue", value: '₹78,400', color: "bg-indigo-500", icon: <TrendingUp size={28} strokeWidth={2.2} /> },
//     { title: "Pending Orders", value: 3, color: "bg-amber-500", icon: <Clock size={28} strokeWidth={2.2} /> },
//     { title: "Cancelled Orders", value: 2, color: "bg-rose-600", icon: <Ban size={28} strokeWidth={2.2} /> },
//   ];

//   const categories = [
//     { id: 1, name: 'Starters', icon: <UtensilsCrossed size={32} /> },
//     { id: 2, name: 'Main Course', icon: <Utensils size={32} /> },
//     { id: 3, name: 'Pizza', icon: <Pizza size={32} /> },
//     { id: 4, name: 'Burgers', icon: <Beef size={32} /> },
//     { id: 5, name: 'Drinks', icon: <Coffee size={32} /> },
//     { id: 6, name: 'Desserts', icon: <IceCreamCone size={32} /> },
//     { id: 7, name: 'Chinese', icon: <Soup size={32} /> },
//     { id: 9, name: 'North Indian', icon: <Drumstick size={32} /> },
//     { id: 10, name: 'Snacks', icon: <Popcorn size={32} /> },
//     { id: 11, name: 'Biryani', icon: <ChefHat size={32} /> },
//     { id: 12, name: 'Sandwiches', icon: <Sandwich size={32} /> },
//     { id: 13, name: 'Add New', icon: <Plus size={32} /> },
//   ];


// const items= [
//     { id: 1, name: 'Margherita Pizza', price: '₹249', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
//     { id: 2, name: 'Chicken Biryani', price: '₹299', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400' },
//     { id: 3, name: 'Paneer Butter Masala', price: '₹279', image: 'https://media.istockphoto.com/id/1354042949/photo/curd-paneer-masala.jpg?s=612x612&w=0&k=20&c=Q_93IPlKtX71VgeJQDcwWK8J0ut0gWg3H3akCTZqfPs=' },
//     { id: 4, name: 'Veg Momos', price: '₹149', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400' },
//     { id: 5, name: 'Cold Coffee', price: '₹129', image: 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=400' },
//     { id: 6, name: 'Rassole', price: '₹80', image: 'https://media.istockphoto.com/id/889615242/photo/pakora-bhaji-and-samosa-on-a-wooden-plate-north-indian-food.jpg?s=612x612&w=0&k=20&c=zgAW4FucFPZcoMZsaU8OFqXsm0-JFOsAK0qDNRTLZhY=' },
//     { id: 7, name: 'Butter Naan', price: '₹49', image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=400' },
//     { id: 8, name: 'Tandoori Chicken', price: '₹399', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
//     { id: 9, name: 'Chocolate Shake', price: '₹149', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400' },
//     { id: 10, name: 'Rajma Chawal', price: '₹179', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400' },
//     { id: 11, name: 'Chicken Burger', price: '₹149', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400' },
//     { id: 12, name: 'Grilled Paneer', price: '₹199', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400' },
//   ];


//   // Check scroll position and update arrow visibility
//   const checkScrollPosition = () => {
//     if (scrollContainerRef.current) {
//       const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

//       // Show left arrow if scrolled right
//       setShowLeftArrow(scrollLeft > 10);

//       // Show right arrow if not at the end
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

//       // Update arrow visibility after scroll
//       setTimeout(checkScrollPosition, 300);
//     }
//   };

//   return (
//     <div className="space-y-8 md:space-y-10 font-['Poppins'] pb-12">

//       {/* Stats Cards */}
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

//       {/* Interactive Charts */}
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
//               {/* Center overlay text */}
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

//       {/* Categories */}
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
//             {categories.map((cat) =>(
//               <div
//                 key={cat.id}
//                 className="min-w-[140px] md:min-w-[160px] snap-start bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center p-5 md:p-6 hover:scale-105 cursor-pointer border-2 border-transparent "
//               >
//                 <div className="text-[#FF5252] mb-3 transition-transform duration-300 hover:rotate-12">
//                   {cat.icon}
//                 </div>
//                 <p className="font-semibold text-gray-800 text-center text-sm md:text-base">
//                   {cat.name}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* Left Arrow - Only show when needed and on hover */}
//           {showLeftArrow && isHovering && (
//             <button
//               className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/95 p-3 rounded-full shadow-xl hover:bg-white transition-all duration-200 hover:scale-110 z-10"
//               onClick={() => handleScroll('left')}
//             >
//               <ArrowLeftIcon className="h-6 w-6 text-[#FF5252]" />
//             </button>
//           )}

//           {/* Right Arrow - Only show when needed and on hover */}
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

//       {/* Popular Items */}
//       <div>
//         <h2 className="text-xl md:text-2xl font-bold text-[#FF5252] mb-4 flex items-center gap-2">
//           <TrendingUp size={28} className="text-[#FF5252]" />
//           Popular Items
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
//           {items.map((item) =>(
//             <div
//               key={item.id}
//               className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
//             >
//               <div className="relative overflow-hidden">
//                 <img
//                   src={item.image}
//                   alt={item.name}
//                   className="w-full h-44 md:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
//                 />
//                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
//               </div>
//               <div className="p-4">
//                 <h3 className="font-semibold text-base md:text-lg truncate text-gray-800 group-hover:text-[#FF5252] transition-colors">
//                   {item.name}
//                 </h3>
//                 <div className="flex items-center justify-between mt-2">
//                   <p className="text-[#FF5252] font-bold text-lg">{item.price}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;































//here start 






// import React, { useState, useRef, useEffect } from "react";
// import Card from '../components/Card';
// import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

// import {
//   Package,
//   CheckCircle,
//   XCircle,
//   BarChart3,
//   PieChart,
//   TrendingUp,
//   UtensilsCrossed,
//   Utensils,
//   Pizza,
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

// const Dashboard = () => {
//   const { dashboardData, loading } = useDashboardData();

//   const [showLeftArrow, setShowLeftArrow] = useState(false);
//   const [showRightArrow, setShowRightArrow] = useState(false);
//   const [isHovering, setIsHovering] = useState(false);
//   const scrollContainerRef = useRef(null);

//   const categories = [
//     { id: 1, name: 'Starters', icon: <UtensilsCrossed size={32} /> },
//     { id: 2, name: 'Main Course', icon: <Utensils size={32} /> },
//     { id: 3, name: 'Pizza', icon: <Pizza size={32} /> },
//     { id: 5, name: 'Drinks', icon: <Coffee size={32} /> },
//     { id: 6, name: 'Desserts', icon: <IceCreamCone size={32} /> },
//     { id: 7, name: 'Chinese', icon: <Soup size={32} /> },
//     { id: 9, name: 'North Indian', icon: <Drumstick size={32} /> },
//     { id: 10, name: 'Snacks', icon: <Popcorn size={32} /> },
//     { id: 11, name: 'Biryani', icon: <ChefHat size={32} /> },
//     { id: 12, name: 'Sandwiches', icon: <Sandwich size={32} /> },
//     { id: 13, name: 'Add New', icon: <Plus size={32} /> },
//   ];

//   // Prepare chart data from API response
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

//   // Stats cards data from API
//   const stats = [
//     { 
//       title: "Total Items", 
//       value: dashboardData?.analytics?.total_items || '0', 
//       color: "bg-[#FF5252]", 
//       icon: <Package size={28} strokeWidth={2.2} /> 
//     },
//     { 
//       title: "Available Items", 
//       value: dashboardData?.analytics?.available_items || '0', 
//       color: "bg-emerald-500", 
//       icon: <CheckCircle size={28} strokeWidth={2.2} /> 
//     },
//     { 
//       title: "Unavailable Items", 
//       value: dashboardData?.analytics?.unavailable_items || '0', 
//       color: "bg-rose-600", 
//       icon: <XCircle size={28} strokeWidth={2.2} /> 
//     },
//     { 
//       title: "Total Categories", 
//       value: dashboardData?.analytics?.category_wise?.length || '0', 
//       color: "bg-indigo-500", 
//       icon: <BarChart3 size={28} strokeWidth={2.2} /> 
//     },
//     { 
//       title: "Total Subcategories", 
//       value: dashboardData?.analytics?.subcategory_wise?.length || '0', 
//       color: "bg-amber-500", 
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

//       {/* Stats Cards */}
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

//       {/* Interactive Charts */}
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

//       {/* Category-wise Breakdown Table */}
//       {dashboardData?.analytics?.category_wise && (
//         <Card title="Category Details">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b-2 border-gray-200">
//                   <th className="text-left py-3 px-4 font-semibold text-gray-700">Category Name</th>
//                   <th className="text-right py-3 px-4 font-semibold text-gray-700">Items Count</th>
//                   <th className="text-right py-3 px-4 font-semibold text-gray-700">Percentage</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {dashboardData.analytics.category_wise.map((category, idx) => {
//                   const percentage = ((parseInt(category.item_count) / parseInt(dashboardData.analytics.total_items)) * 100).toFixed(1);
//                   return (
//                     <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                       <td className="py-3 px-4 font-medium text-gray-800">{category.name}</td>
//                       <td className="py-3 px-4 text-right">
//                         <span className="bg-[#FF5252] text-white px-3 py-1 rounded-full text-sm font-semibold">
//                           {category.item_count}
//                         </span>
//                       </td>
//                       <td className="py-3 px-4 text-right text-gray-600 font-medium">
//                         {percentage}%
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       )}

//       {/* Subcategory-wise Breakdown */}
//       {dashboardData?.analytics?.subcategory_wise && (
//         <div>
//           <h2 className="text-xl md:text-2xl font-bold text-[#FF5252] mb-4 flex items-center gap-2">
//             <TrendingUp size={28} className="text-[#FF5252]" />
//             Subcategory Breakdown
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
//             {dashboardData.analytics.subcategory_wise.map((subcategory) => (
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
//           </div>
//         </div>
//       )}

//       {/* Categories Scroll Section */}
//       <div>
//         <h2 className="text-xl md:text-2xl font-bold text-[#FF5252] mb-4 flex items-center gap-2">
//           <UtensilsCrossed size={28} className="text-[#FF5252]" />
//           Browse Categories
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
//                 className="min-w-[140px] md:min-w-[160px] snap-start bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center p-5 md:p-6 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-[#FF5252]"
//               >
//                 <div className="text-[#FF5252] mb-3 transition-transform duration-300 hover:rotate-12">
//                   {cat.icon}
//                 </div>
//                 <p className="font-semibold text-gray-800 text-center text-sm md:text-base">
//                   {cat.name}
//                 </p>
//               </div>
//             ))}
//           </div>

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
} from 'chart.js';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
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
  ArcElement
);

// Static data for revenue and customers
const weeklyRevenueData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Revenue ₹',
      data: [5200, 6800, 9200, 14500, 11800, 19800, 24800],
      backgroundColor: 'rgba(239, 68, 68, 0.65)',
      borderColor: '#FF5252',
      borderWidth: 2,
      borderRadius: 8,
      hoverBackgroundColor: 'rgba(239, 68, 68, 0.85)',
    },
  ],
};

const customerBreakdownData = {
  labels: ['Repeat Customers', 'New Customers'],
  datasets: [
    {
      data: [78, 22],
      backgroundColor: ['#FF5252', '#e5e7eb'],
      borderWidth: 0,
      hoverOffset: 12,
    },
  ],
};

const Dashboard = () => {
  const { dashboardData, loading } = useDashboardData();
  const { categories, loading: contextLoading, fetchCategories } = useContext(CategoriesContext);
  const { restaurant, getCurrentRestaurant } = useContext(RestaurantContext)
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [items, setItems] = useState([])
  const scrollContainerRef = useRef(null);



  // dyanamic data popular items
  const AllMenuItems = async () => {
    try {
      const result = await axiosInstance.get(`/menuitems/${restaurant.id}/menu-items`, { withCredentials: true })
      setItems(result.data.data);
      //  console.log("All menu=>",result.data);
    } catch (error) {
      console.log(error)
    }
  }


  const AllSubCategory = async () => {
    try {
      const result = await axiosInstance.get()
    } catch (error) {

    }
  }

  useEffect(() => {
    if (restaurant?.id) {
      AllMenuItems();
    }
  }, [restaurant?.id]);

  // Prepare dynamic chart data from API
  const prepareCategoryChartData = () => {
    if (!dashboardData?.analytics?.category_wise) {
      return null;
    }

    const categoryData = dashboardData.analytics.category_wise;

    return {
      labels: categoryData.map(cat => cat.name),
      datasets: [
        {
          label: 'Items Count',
          data: categoryData.map(cat => parseInt(cat.item_count)),
          backgroundColor: [
            'rgba(239, 68, 68, 0.75)',
            'rgba(59, 130, 246, 0.75)',
            'rgba(16, 185, 129, 0.75)',
            'rgba(245, 158, 11, 0.75)',
            'rgba(139, 92, 246, 0.75)',
          ],
          borderColor: [
            '#FF5252',
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#8b5cf6',
          ],
          borderWidth: 2,
          borderRadius: 8,
          hoverBackgroundColor: [
            'rgba(239, 68, 68, 0.9)',
            'rgba(59, 130, 246, 0.9)',
            'rgba(16, 185, 129, 0.9)',
            'rgba(245, 158, 11, 0.9)',
            'rgba(139, 92, 246, 0.9)',
          ],
        },
      ],
    };
  };

  const prepareSubcategoryChartData = () => {
    if (!dashboardData?.analytics?.subcategory_wise) {
      return null;
    }

    const subcategoryData = dashboardData.analytics.subcategory_wise;

    return {
      labels: subcategoryData.map(sub => sub.name),
      datasets: [
        {
          data: subcategoryData.map(sub => parseInt(sub.item_count)),
          backgroundColor: [
            '#FF5252',
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#8b5cf6',
            '#ec4899',
            '#06b6d4',
          ],
          borderWidth: 0,
          hoverOffset: 12,
        },
      ],
    };
  };

  const prepareAvailabilityChartData = () => {
    if (!dashboardData?.analytics) {
      return null;
    }

    const { available_items, unavailable_items } = dashboardData.analytics;

    return {
      labels: ['Available Items', 'Unavailable Items'],
      datasets: [
        {
          data: [parseInt(available_items), parseInt(unavailable_items)],
          backgroundColor: ['#10b981', '#ef4444'],
          borderWidth: 0,
          hoverOffset: 12,
        },
      ],
    };
  };

  // Combined stats - static + dynamic
  const stats = [
    { title: "Today's Orders", value: 15, color: "bg-[#FF5252]", icon: <Package size={28} strokeWidth={2.2} /> },
    { title: "Today's Revenue", value: '₹2,500', color: "bg-emerald-500", icon: <IndianRupee size={28} strokeWidth={2.2} /> },
    { title: "Monthly Revenue", value: '₹78,400', color: "bg-indigo-500", icon: <TrendingUp size={28} strokeWidth={2.2} /> },
    { title: "Pending Orders", value: 3, color: "bg-amber-500", icon: <Clock size={28} strokeWidth={2.2} /> },
    { title: "Cancelled Orders", value: 2, color: "bg-rose-600", icon: <Ban size={28} strokeWidth={2.2} /> },
  ];

  // Dynamic stats from API
  const dynamicStats = [
    {
      title: "Total Items",
      value: dashboardData?.analytics?.total_items || '0',
      color: "bg-purple-500",
      icon: <Package size={28} strokeWidth={2.2} />
    },
    {
      title: "Available Items",
      value: dashboardData?.analytics?.available_items || '0',
      color: "bg-green-500",
      icon: <CheckCircle size={28} strokeWidth={2.2} />
    },
    {
      title: "Unavailable Items",
      value: dashboardData?.analytics?.unavailable_items || '0',
      color: "bg-red-500",
      icon: <XCircle size={28} strokeWidth={2.2} />
    },
    {
      title: "Total Categories",
      value: dashboardData?.analytics?.category_wise?.length || '0',
      color: "bg-blue-500",
      icon: <BarChart3 size={28} strokeWidth={2.2} />
    },
    {
      title: "Total Subcategories",
      value: dashboardData?.analytics?.subcategory_wise?.length || '0',
      color: "bg-orange-500",
      icon: <PieChart size={28} strokeWidth={2.2} />
    },
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
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollPosition, 300);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF5252]"></div>
      </div>
    );
  }

  const categoryChartData = prepareCategoryChartData();
  const subcategoryChartData = prepareSubcategoryChartData();
  const availabilityChartData = prepareAvailabilityChartData();

  return (
    <div className="space-y-8 md:space-y-10 font-['Poppins'] pb-12">

      {/* Static Stats Cards - Orders & Revenue */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} title={stat.title}>
            <div className="flex flex-col items-center justify-center py-5 md:py-6">
              <div className={`w-16 h-16 md:w-18 md:h-18 rounded-full ${stat.color} flex items-center justify-center text-white shadow-lg mb-3 md:mb-4 transition-transform duration-300 hover:scale-110`}>
                {stat.icon}
              </div>
              <p className="text-3xl md:text-4xl font-extrabold text-gray-800">
                {stat.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Dynamic Stats Cards - Items & Categories from API */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {dynamicStats.map((stat, idx) => (
          <Card key={idx} title={stat.title}>
            <div className="flex flex-col items-center justify-center py-5 md:py-6">
              <div className={`w-16 h-16 md:w-18 md:h-18 rounded-full ${stat.color} flex items-center justify-center text-white shadow-lg mb-3 md:mb-4 transition-transform duration-300 hover:scale-110`}>
                {stat.icon}
              </div>
              <p className="text-3xl md:text-4xl font-extrabold text-gray-800">
                {stat.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Static Charts - Revenue & Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Revenue - Bar Chart */}
        <Card title="Revenue This Week">
          <div className="pt-4 pb-6 px-2 md:px-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-emerald-600">₹92,300</p>
                <p className="text-gray-500 text-sm">+14% from last week</p>
              </div>
              <div className="text-right text-sm text-gray-600">
                Highest: <span className="font-semibold text-[#FF5252]">₹24,800</span> (Sat)
              </div>
            </div>

            <div className="h-64 md:h-72">
              <Bar
                data={weeklyRevenueData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: 'rgba(30, 30, 30, 0.92)',
                      titleFont: { size: 14, weight: 'bold' },
                      bodyFont: { size: 13 },
                      padding: 12,
                      callbacks: {
                        label: (ctx) => `Revenue: ₹${ctx.parsed.y.toLocaleString()}`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `₹${(value / 1000).toFixed(0)}k`,
                        color: '#6b7280',
                      },
                      grid: { color: '#e5e7eb' },
                    },
                    x: {
                      grid: { display: false },
                      ticks: { color: '#6b7280' },
                    },
                  },
                }}
              />
            </div>
          </div>
        </Card>

        {/* Customers Breakdown - Doughnut Chart */}
        <Card title="Customer Breakdown">
          <div className="flex flex-col md:flex-row items-center justify-between py-6 px-4 gap-6">
            <div className="text-center md:text-left">
              <p className="text-5xl md:text-6xl font-extrabold text-[#FF5252]">1,284</p>
              <p className="text-gray-500 mt-1 text-lg">Total Customers</p>
            </div>

            <div className="w-52 h-52 md:w-64 md:h-64 relative">
              <Doughnut
                data={customerBreakdownData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  cutout: '68%',
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        font: { size: 14 },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: (ctx) => `${ctx.label}: ${ctx.parsed}% (${Math.round((ctx.parsed / 100) * 1284)} people)`,
                      },
                    },
                  },
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#FF5252]">78%</p>
                  <p className="text-sm text-gray-600">Repeat</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Dynamic Charts from API - Category, Subcategory & Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category-wise Items - Bar Chart */}
        {categoryChartData && (
          <Card title="Category-wise Items">
            <div className="pt-4 pb-6 px-2 md:px-4">
              <div className="mb-4">
                <p className="text-2xl md:text-3xl font-bold text-[#FF5252]">
                  {dashboardData.analytics.category_wise.length} Categories
                </p>
                <p className="text-gray-500 text-sm">Distribution across menu</p>
              </div>

              <div className="h-64 md:h-72">
                <Bar
                  data={categoryChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: 'rgba(30, 30, 30, 0.92)',
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 13 },
                        padding: 12,
                        callbacks: {
                          label: (ctx) => `Items: ${ctx.parsed.y}`,
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                          color: '#6b7280',
                        },
                        grid: { color: '#e5e7eb' },
                      },
                      x: {
                        grid: { display: false },
                        ticks: {
                          color: '#6b7280',
                          maxRotation: 45,
                          minRotation: 45,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Subcategory-wise Items - Doughnut Chart */}
        {subcategoryChartData && (
          <Card title="Subcategory Distribution">
            <div className="flex flex-col items-center justify-center py-6 px-4">
              <div className="text-center mb-4">
                <p className="text-4xl md:text-5xl font-extrabold text-[#FF5252]">
                  {dashboardData.analytics.subcategory_wise.length}
                </p>
                <p className="text-gray-500 mt-1 text-base">Total Subcategories</p>
              </div>

              <div className="w-52 h-52 md:w-64 md:h-64 relative">
                <Doughnut
                  data={subcategoryChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    cutout: '65%',
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          font: { size: 12 },
                          padding: 12,
                          usePointStyle: true,
                          pointStyle: 'circle',
                        },
                      },
                      tooltip: {
                        callbacks: {
                          label: (ctx) => `${ctx.label}: ${ctx.parsed} items`,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Item Availability - Pie Chart */}
        {availabilityChartData && (
          <Card title="Item Availability Status">
            <div className="flex flex-col items-center justify-center py-6 px-4">
              <div className="text-center mb-4">
                <p className="text-4xl md:text-5xl font-extrabold text-emerald-600">
                  {dashboardData.analytics.available_items}
                </p>
                <p className="text-gray-500 mt-1 text-base">Items Available</p>
              </div>

              <div className="w-52 h-52 md:w-56 md:h-56">
                <Pie
                  data={availabilityChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          font: { size: 13 },
                          padding: 16,
                          usePointStyle: true,
                          pointStyle: 'circle',
                        },
                      },
                      tooltip: {
                        callbacks: {
                          label: (ctx) => {
                            const total = parseInt(dashboardData.analytics.total_items);
                            const percentage = ((ctx.parsed / total) * 100).toFixed(1);
                            return `${ctx.label}: ${ctx.parsed} (${percentage}%)`;
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </Card>
        )}
      </div>




      {/* Static Categories Section */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-[#FF5252] mb-4 flex items-center gap-2">
          <UtensilsCrossed size={28} className="text-[#FF5252]" />
          Categories
        </h2>
        <div
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex overflow-x-auto gap-5 md:gap-6 pb-4 scrollbar-hide snap-x snap-mandatory"
          >
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`
      group relative
      min-w-[120px] xs:min-w-[130px] sm:min-w-[140px] md:min-w-[155px] lg:min-w-[170px]
      flex flex-col items-center justify-between
      bg-white
      rounded-2xl
      border border-gray-200 hover:border-[#ef4f5f]/40   /* Zomato-ish red border on hover */
      overflow-hidden
      shadow-[0_1px_3px_rgba(0,0,0,0.06)]
      hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]
      transition-all duration-250 ease-out
      hover:scale-[1.02] active:scale-[0.98]
      cursor-pointer
      p-3.5 sm:p-4
      snap-start
    `}
              >
                {/* Square image – Zomato uses square thumbs for categories/dishes */}
                <div className="
      w-20 h-20 xs:w-22 xs:h-22 sm:w-24 sm:h-24 md:w-26 md:h-26 
      rounded-xl overflow-hidden 
      bg-gradient-to-b from-gray-50 to-gray-100/70
      mb-3
    ">
                  <img
                    src={cat.categoryImage}
                    alt={cat.name}
                    className={`
          w-full h-full 
          object-cover 
          transition-transform duration-400 
          group-hover:scale-105 group-active:scale-100
        `}
                  />
                </div>

                {/* Name – centered, semi-bold, red on hover like Zomato interactions */}
                <p className={`
      font-medium text-gray-900 
      text-center 
      text-[13px] xs:text-[13.5px] sm:text-sm md:text-[15px]
      leading-tight tracking-[-0.01em]
      group-hover:text-[#ef4f5f] group-active:text-[#ef4f5f]   /* Zomato primary red approx #ef4f5f */
      transition-colors duration-200 font-semibold
    `}>
                  {cat.name}
                </p>

                {/* Optional count badge – very common in Zomato partner menu categories */}
                {/* {cat.count && (
      <span className="
        absolute top-2 right-2 
        bg-[#ef4f5f]/90 text-white 
        text-[10px] font-semibold 
        px-1.5 py-0.5 rounded-full 
        shadow-sm
      ">
        {cat.count}
      </span>
    )} */}
              </div>
            ))}

          </div>


          {/* Subcategory-wise Breakdown from API */}
          {/* {dashboardData?.analytics?.subcategory_wise && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[#FF5252] mb-4 flex items-center gap-2">
                <TrendingUp size={28} className="text-[#FF5252]" />
                Subcategories
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {dashboardData.analytics.subcategory_wise.map((subcategory) => (
              <div
                key={subcategory.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-l-4 border-[#FF5252]"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base md:text-lg text-gray-800 mb-2">
                        {subcategory.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Package size={18} className="text-[#FF5252]" />
                        <p className="text-gray-600 text-sm">
                          <span className="font-bold text-[#FF5252] text-xl">{subcategory.item_count}</span> items
                        </p>
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-full p-3">
                      <Utensils size={24} className="text-[#FF5252]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
              </div>
            </div>
          )} */}



          {/* Left Arrow */}
          {showLeftArrow && isHovering && (
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/95 p-3 rounded-full shadow-xl hover:bg-white transition-all duration-200 hover:scale-110 z-10"
              onClick={() => handleScroll('left')}
            >
              <ArrowLeftIcon className="h-6 w-6 text-[#FF5252]" />
            </button>
          )}

          {/* Right Arrow */}
          {showRightArrow && isHovering && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/95 p-3 rounded-full shadow-xl hover:bg-white transition-all duration-200 hover:scale-110 z-10"
              onClick={() => handleScroll('right')}
            >
              <ArrowRightIcon className="h-6 w-6 text-[#FF5252]" />
            </button>
          )}
        </div>
      </div>

      {/* dynamic Popular Items Section */}
      
      <div className="mt-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#FF5252] mb-6 flex items-center gap-3">
          <TrendingUp size={30} className="text-[#FF5252]" />
          Popular Items
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.isArray(items) && items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                  {/* Bestseller */}
                  {item.is_bestseller && (
                    <span className="absolute top-3 left-3 bg-[#FF5252] text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
                      Bestseller
                    </span>
                  )}

                  {/* Veg / Non-Veg */}
                  <span
                    className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-semibold shadow
                ${item.food_type === "VEG"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      }`}
                  >
                    {item.food_type}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 truncate group-hover:text-[#FF5252] transition-colors">
                    {item.name}
                  </h3>

                  {/* Rating + Time */}
                  {/* <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                    <span>⭐ {item.rating || "4.2"}</span>
                    <span>{item.preparation_time || 0} min</span>
                  </div> */}


                  <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1 text-yellow-500 font-medium">
                      <FaStar className="text-yellow-500" />
                      {item.rating || "4.2"}
                    </span>

                    <span>{item.preparation_time || 0} min</span>
                  </div>


                  {/* Price */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[#FF5252] font-bold text-xl">
                      ₹{item.offer_price || item.price}
                    </span>

                    {item.offer_price && (
                      <span className="text-gray-400 line-through text-sm">
                        ₹{item.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No popular items available
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;