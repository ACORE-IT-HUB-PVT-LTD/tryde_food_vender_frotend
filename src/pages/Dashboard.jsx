import React from "react";
import Card from '../components/Card';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

import {
  Package,
  IndianRupee,
  Clock,
  Ban,
  Users,
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
import { Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components (do this once)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Sample data (replace with real data from API later)
const weeklyRevenueData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Revenue ₹',
      data: [5200, 6800, 9200, 14500, 11800, 19800, 24800],
      backgroundColor: 'rgba(239, 68, 68, 0.65)', // red-500 with opacity
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
  const stats = [
    { title: "Today's Orders", value: 15, color: "bg-[#FF5252]", icon: <Package size={28} strokeWidth={2.2} /> },
    { title: "Today's Revenue", value: '₹2,500', color: "bg-emerald-500", icon: <IndianRupee size={28} strokeWidth={2.2} /> },
    { title: "Monthly Revenue", value: '₹78,400', color: "bg-indigo-500", icon: <TrendingUp size={28} strokeWidth={2.2} /> },
    { title: "Pending Orders", value: 3, color: "bg-amber-500", icon: <Clock size={28} strokeWidth={2.2} /> },
    { title: "Cancelled Orders", value: 2, color: "bg-rose-600", icon: <Ban size={28} strokeWidth={2.2} /> },
  ];

  const categories = [
    { id: 1, name: 'Starters', icon: <UtensilsCrossed size={32} /> },
    { id: 2, name: 'Main Course', icon: <Utensils size={32} /> },
    { id: 3, name: 'Pizza', icon: <Pizza size={32} /> },
    { id: 4, name: 'Burgers', icon: <Beef size={32} /> },
    { id: 5, name: 'Drinks', icon: <Coffee size={32} /> },
    { id: 6, name: 'Desserts', icon: <IceCreamCone size={32} /> },
    { id: 7, name: 'Chinese', icon: <Soup size={32} /> },
    { id: 9, name: 'North Indian', icon: <Drumstick size={32} /> },
    { id: 10, name: 'Snacks', icon: <Popcorn size={32} /> },
    { id: 11, name: 'Biryani', icon: <ChefHat size={32} /> },
    { id: 12, name: 'Sandwiches', icon: <Sandwich size={32} /> },
      { id: 13, name: 'Add', icon: <Plus size={32} /> },






  ];

  const items = [
    { id: 1, name: 'Margherita Pizza', price: '₹249', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
    { id: 2, name: 'Chicken Biryani', price: '₹299', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400' },
    { id: 3, name: 'Paneer Butter Masala', price: '₹279', image: 'https://images.unsplash.com/photo-1630409351340-1f3a02f4e8b0?w=400' },
    { id: 4, name: 'Veg Momos', price: '₹149', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400' },
    { id: 5, name: 'Cold Coffee', price: '₹129', image: 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=400' },
  ];

  return (
    <div className="space-y-8 md:space-y-10 font-['Poppins'] pb-12">

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} title={stat.title}>
            <div className="flex flex-col items-center justify-center py-5 md:py-6">
              <div className={`w-16 h-16 md:w-18 md:h-18 rounded-full ${stat.color} flex items-center justify-center text-white shadow-md mb-3 md:mb-4`}>
                {stat.icon}
              </div>
              <p className="text-3xl md:text-4xl font-extrabold text-gray-800">
                {stat.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Interactive Charts */}
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
              {/* Center overlay text */}
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

      {/* Categories */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-[#FF5252] mb-4">Categories</h2>
        <div className="relative">
          <div className="flex overflow-x-auto gap-5 md:gap-6 pb-4 scrollbar-hide snap-x snap-mandatory">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="min-w-[140px] md:min-w-[160px] snap-start bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 flex flex-col items-center justify-center p-5 md:p-6 hover:scale-105"
              >
                <div className="text-[#FF5252] mb-3">{cat.icon}</div>
                <p className="font-semibold text-gray-800 text-center text-sm md:text-base">
                  {cat.name}
                </p>
              </div>
            ))}
          </div>

          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition-colors"
            onClick={() => document.querySelector('.overflow-x-auto')?.scrollBy({ left: -180, behavior: 'smooth' })}
          >
            <ArrowLeftIcon className="h-6 w-6 text-[#FF5252]" />
          </button>

          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition-colors"
            onClick={() => document.querySelector('.overflow-x-auto')?.scrollBy({ left: 180, behavior: 'smooth' })}
          >
            <ArrowRightIcon className="h-6 w-6 text-[#FF5252]" />
          </button>
        </div>
      </div>

      {/* Popular Items */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-[#FF5252] mb-4">Popular Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-44 md:h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-base md:text-lg truncate">{item.name}</h3>
                <p className="text-[#FF5252] font-bold mt-1 text-lg">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;