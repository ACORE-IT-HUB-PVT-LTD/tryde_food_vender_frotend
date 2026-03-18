import React, { useState, useRef, useEffect, useContext } from "react";
import Card from '../components/Card';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

import {
  Package, IndianRupee, Clock, Ban, CheckCircle, XCircle,
  BarChart3, PieChart, TrendingUp, UtensilsCrossed, ArrowUpRight,
  Flame, Leaf, ShoppingBag, Users, Star, Activity, Grid3X3,
  Layers, AlertCircle, ChevronRight, CalendarDays, Sparkles,
} from 'lucide-react';

import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler,
} from 'chart.js';
import { Bar, Doughnut, Pie, Line } from 'react-chartjs-2';

import useDashboardData from "../hooks/useDashboardData";
import useAnalytics from "../hooks/Analyticscontext";
import { CategoriesContext } from "../context/GetAllCategories";
import axiosInstance from "../api/axiosInstance";
import { RestaurantContext } from "../context/getRestaurant";
import { FaStar } from "react-icons/fa6";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  ArcElement, PointElement, LineElement, Filler,
);

const RED  = '#E53935';
const RED2 = '#FF7043';

const weeklyRevenueData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    label: 'Revenue ₹',
    data: [5200, 6800, 9200, 14500, 11800, 19800, 24800],
    fill: true,
    backgroundColor: 'rgba(229,57,53,0.08)',
    borderColor: RED,
    borderWidth: 2.5,
    tension: 0.45,
    pointBackgroundColor: RED,
    pointBorderColor: '#fff',
    pointBorderWidth: 2.5,
    pointRadius: 5,
    pointHoverRadius: 8,
  }],
};

const customerBreakdownData = {
  labels: ['Repeat Customers', 'New Customers'],
  datasets: [{
    data: [78, 22],
    backgroundColor: [RED, '#f1f5f9'],
    borderWidth: 0,
    hoverOffset: 10,
  }],
};

const tooltipDefaults = {
  backgroundColor: 'rgba(10,10,10,0.90)',
  titleFont: { size: 13, weight: 'bold', family: "'Plus Jakarta Sans', sans-serif" },
  bodyFont: { size: 12, family: "'Plus Jakarta Sans', sans-serif" },
  padding: 14,
  cornerRadius: 12,
  borderColor: 'rgba(255,255,255,0.06)',
  borderWidth: 1,
};

const Dashboard = () => {
  const { dashboardData, loading: dashLoading } = useDashboardData();

  // ── NEW: pull live analytics ──
  const { menuAnalytics, orderAnalytics, availabilityAnalytics, loading: analyticsLoading } = useAnalytics();

  const { categories } = useContext(CategoriesContext);
  const { restaurant }  = useContext(RestaurantContext);

  const [showLeftArrow,  setShowLeftArrow]  = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isHovering,     setIsHovering]     = useState(false);
  const [items,          setItems]          = useState([]);
  const scrollContainerRef = useRef(null);

  const AllMenuItems = async () => {
    try {
      const result = await axiosInstance.get(
        `/menuitems/${restaurant.id}/menu-items`,
        { withCredentials: true }
      );
      setItems(result.data.data);
    } catch (error) { console.log(error); }
  };

  useEffect(() => {
    if (restaurant?.id) AllMenuItems();
  }, [restaurant?.id]);

  // ── Chart helpers (use menuAnalytics from context) ──
  const prepareCategoryChartData = () => {
    if (!dashboardData?.analytics?.category_wise) return null;
    const d = dashboardData.analytics.category_wise;
    return {
      labels: d.map(c => c.name),
      datasets: [{
        label: 'Items',
        data: d.map(c => parseInt(c.item_count)),
        backgroundColor: [
          'rgba(229,57,53,0.82)', 'rgba(59,130,246,0.82)',
          'rgba(16,185,129,0.82)', 'rgba(245,158,11,0.82)', 'rgba(139,92,246,0.82)',
        ],
        borderColor: ['transparent'],
        borderWidth: 0,
        borderRadius: 10,
        hoverBackgroundColor: [RED, '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
      }],
    };
  };

  const prepareSubcategoryChartData = () => {
    if (!dashboardData?.analytics?.subcategory_wise) return null;
    const d = dashboardData.analytics.subcategory_wise;
    return {
      labels: d.map(s => s.name),
      datasets: [{
        data: d.map(s => parseInt(s.item_count)),
        backgroundColor: [RED, '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'],
        borderWidth: 0,
        hoverOffset: 12,
      }],
    };
  };
const prepareAvailabilityChartData = () => {
  if (!availabilityAnalytics) return null;  // ← availabilityAnalytics use karo
  return {
    labels: ['Available', 'Unavailable'],
    datasets: [{
      data: [
        parseInt(availabilityAnalytics.available_items),
        parseInt(availabilityAnalytics.unavailable_items),
      ],
      backgroundColor: ['#22c55e', '#f43f5e'],
      borderWidth: 0,
      hoverOffset: 12,
    }],
  };
};

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

  const handleScroll = (dir) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: dir === 'left' ? -220 : 220, behavior: 'smooth' });
      setTimeout(checkScrollPosition, 300);
    }
  };

  const loading = dashLoading || analyticsLoading;

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-red-100 animate-spin border-t-[#E53935]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles size={20} className="text-[#E53935] animate-pulse" />
          </div>
        </div>
        <p className="text-sm text-gray-400 font-medium tracking-wide">Loading dashboard…</p>
      </div>
    </div>
  );

  const categoryChartData    = prepareCategoryChartData();
  const subcategoryChartData = prepareSubcategoryChartData();
  const availabilityChartData = prepareAvailabilityChartData();

  // ── Stat cards — Orders & Revenue ──
  // total_orders comes from orderAnalytics (2nd API)
  const stats = [
    {
      title: "Total Orders",
      value: orderAnalytics?.total_orders ?? '—',
      trend: "+12%", trendUp: true,
      icon: <ShoppingBag size={20} strokeWidth={2} />,
      gradient: "from-[#E53935] to-[#FF7043]",
    },
    {
      title: "Today's Revenue",  value: '₹2,500',   trend: "+8%",  trendUp: true,
      icon: <IndianRupee size={20} strokeWidth={2} />,
      gradient: "from-emerald-500 to-teal-400",
    },
    {
      title: "Monthly Revenue",  value: '₹78,400',  trend: "+14%", trendUp: true,
      icon: <TrendingUp size={20} strokeWidth={2} />,
      gradient: "from-indigo-500 to-blue-400",
    },
    {
      title: "Pending Orders",   value: 3,           trend: "-5%",  trendUp: false,
      icon: <Clock size={20} strokeWidth={2} />,
      gradient: "from-amber-500 to-yellow-400",
    },
    {
      title: "Cancelled Orders", value: 2,           trend: "-2%",  trendUp: false,
      icon: <Ban size={20} strokeWidth={2} />,
      gradient: "from-rose-500 to-pink-400",
    },
  ];

  // ── Dynamic stat cards — Menu Analytics (1st API) ──
  const dynamicStats = [
    {
      title: "Total Items",
      value: menuAnalytics?.total_menu_items ?? dashboardData?.analytics?.total_items ?? '0',
      icon: <Package size={20} strokeWidth={2} />,
      gradient: "from-violet-500 to-purple-400",
    },
    {
      title: "Available Items",
      value: menuAnalytics?.available_items ?? dashboardData?.analytics?.available_items ?? '0',
      icon: <CheckCircle size={20} strokeWidth={2} />,
      gradient: "from-green-500 to-emerald-400",
    },
    {
      title: "Unavailable",
      value: menuAnalytics?.unavailable_items ?? dashboardData?.analytics?.unavailable_items ?? '0',
      icon: <AlertCircle size={20} strokeWidth={2} />,
      gradient: "from-red-500 to-rose-400",
    },
    {
      title: "Categories",
      value: menuAnalytics?.total_categories ?? dashboardData?.analytics?.category_wise?.length ?? '0',
      icon: <Grid3X3 size={20} strokeWidth={2} />,
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      title: "Subcategories",
      value: menuAnalytics?.total_sub_categories ?? dashboardData?.analytics?.subcategory_wise?.length ?? '0',
      icon: <Layers size={20} strokeWidth={2} />,
      gradient: "from-orange-500 to-amber-400",
    },
  ];

  return (
    <div className="space-y-8 pb-14" style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>

      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#E53935] to-[#FF7043]" />
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          </div>
          <p className="text-[13px] text-gray-400 ml-3">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-2xl px-4 py-2.5 shadow-sm">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E53935] to-[#FF7043] flex items-center justify-center">
            <CalendarDays size={14} className="text-white" strokeWidth={2} />
          </div>
          <span className="text-[12.5px] text-gray-600 font-semibold">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* ── Orders & Revenue ── */}
      <section>
        <SectionLabel icon={<Activity size={13} />} label="Orders & Revenue" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((s, i) => <StatCard key={i} {...s} />)}
        </div>
      </section>

      {/* ── Menu Analytics ── */}
      <section>
        <SectionLabel icon={<BarChart3 size={13} />} label="Menu Analytics" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {dynamicStats.map((s, i) => <DynamicStatCard key={i} {...s} />)}
        </div>
      </section>

      {/* ── Charts Row 1 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard
          title="Revenue This Week"
          subtitle="Mon – Sun performance"
          headerRight={
            <div className="text-right">
              <p className="text-[22px] font-extrabold text-gray-900 leading-tight">₹92,300</p>
              <p className="text-[11.5px] text-emerald-500 font-bold flex items-center justify-end gap-1 mt-0.5">
                <ArrowUpRight size={12} /> +14% from last week
              </p>
            </div>
          }
        >
          <div className="h-60">
            <Line data={weeklyRevenueData} options={{
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false }, tooltip: { ...tooltipDefaults, callbacks: { label: (c) => `₹${c.parsed.y.toLocaleString()}` } } },
              scales: {
                y: { beginAtZero: true, ticks: { callback: (v) => `₹${(v / 1000).toFixed(0)}k`, color: '#9ca3af', font: { size: 11 } }, grid: { color: '#f9fafb' } },
                x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 11 } } },
              },
            }} />
          </div>
        </ChartCard>

        <ChartCard title="Customer Breakdown" subtitle="Repeat vs new customers">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
            <div className="flex-1">
              <p className="text-[40px] font-extrabold text-gray-900 leading-tight">1,284</p>
              <p className="text-gray-400 mt-0.5 text-[13px] font-medium">Total Customers</p>
              <div className="mt-5 space-y-3.5">
                {[
                  { label: 'Repeat', pct: 78, color: RED, textCls: 'text-[#E53935]' },
                  { label: 'New',    pct: 22, color: '#e5e7eb', textCls: 'text-gray-400' },
                ].map(r => (
                  <div key={r.label}>
                    <div className="flex justify-between text-[12px] mb-1.5">
                      <span className="font-semibold text-gray-600">{r.label}</span>
                      <span className={`font-bold ${r.textCls}`}>{r.pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${r.pct}%`, background: r.color === RED ? `linear-gradient(90deg, ${RED}, ${RED2})` : r.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-44 h-44 relative shrink-0">
              <Doughnut data={customerBreakdownData} options={{
                responsive: true, maintainAspectRatio: true, cutout: '72%',
                plugins: {
                  legend: { display: false },
                  tooltip: { ...tooltipDefaults, callbacks: { label: (c) => `${c.label}: ${c.parsed}%` } },
                },
              }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-3xl font-extrabold text-[#E53935]">78%</p>
                <p className="text-[11px] text-gray-400 font-medium">Repeat</p>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* ── Charts Row 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {categoryChartData && (
          <ChartCard title="Category-wise Items" subtitle={`${dashboardData.analytics.category_wise.length} categories`}>
            <div className="h-60">
              <Bar data={categoryChartData} options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { ...tooltipDefaults, callbacks: { label: (c) => `Items: ${c.parsed.y}` } } },
                scales: {
                  y: { beginAtZero: true, ticks: { stepSize: 1, color: '#9ca3af', font: { size: 11 } }, grid: { color: '#f9fafb' } },
                  x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 11 }, maxRotation: 30 } },
                },
              }} />
            </div>
          </ChartCard>
        )}

        {subcategoryChartData && (
          <ChartCard title="Subcategory Split" subtitle={`${dashboardData.analytics.subcategory_wise.length} subcategories`}>
            <div className="flex flex-col items-center pt-1">
              <div className="w-44 h-44 relative">
                <Doughnut data={subcategoryChartData} options={{
                  responsive: true, maintainAspectRatio: true, cutout: '62%',
                  plugins: {
                    legend: { position: 'bottom', labels: { font: { size: 10, family: "'Plus Jakarta Sans', sans-serif" }, padding: 10, usePointStyle: true, pointStyle: 'circle', color: '#6b7280' } },
                    tooltip: { ...tooltipDefaults, callbacks: { label: (c) => `${c.label}: ${c.parsed} items` } },
                  },
                }} />
              </div>
            </div>
          </ChartCard>
        )}

        {availabilityChartData && (
          <ChartCard title="Item Availability" subtitle="Current menu status">
            <div className="flex flex-col items-center gap-4 pt-1">
              <div className="w-40 h-40">
                <Pie data={availabilityChartData} options={{
                  responsive: true, maintainAspectRatio: true,
                  plugins: { legend: { display: false }, tooltip: { ...tooltipDefaults } },
                }} />
              </div>
          <div className="flex items-center gap-3 w-full">
  {[
    {
      label: 'Available',
      val: availabilityAnalytics?.available_items,
      bg: 'bg-emerald-50',
      bar: 'from-emerald-400 to-green-500',
      text: 'text-emerald-600'
    },
    {
      label: 'Unavailable',
      val: availabilityAnalytics?.unavailable_items,
      bg: 'bg-rose-50',
      bar: 'from-rose-400 to-red-500',
      text: 'text-rose-600'
    },
  ].map(item => (
    <div key={item.label} className={`flex-1 flex items-center gap-2.5 px-3 py-3 rounded-2xl ${item.bg}`}>
      <div className={`w-2 h-8 rounded-full bg-gradient-to-b ${item.bar} flex-shrink-0`} />
      <div>
        <p className={`text-xl font-extrabold ${item.text}`}>{item.val}</p>
        <p className="text-[11px] text-gray-500 font-medium">{item.label}</p>
      </div>
    </div>
  ))}
</div>
            </div>
          </ChartCard>
        )}
      </div>

      {/* ── Categories ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E53935] to-[#FF7043] flex items-center justify-center shadow-sm shadow-red-500/25">
              <UtensilsCrossed size={16} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900 leading-tight">Categories</h2>
              <p className="text-[11px] text-gray-400">{categories.length} total</p>
            </div>
          </div>
          <button className="flex items-center gap-1 text-[12px] font-semibold text-[#E53935] hover:gap-2 transition-all duration-200">
            View all <ChevronRight size={14} />
          </button>
        </div>

        <div className="relative"
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
              <div key={cat.id}
                className="group relative shrink-0 w-[130px] bg-white rounded-2xl border border-gray-100 shadow-sm
                  hover:shadow-lg hover:border-[#E53935]/20 hover:-translate-y-1.5
                  transition-all duration-300 cursor-pointer overflow-hidden snap-start"
              >
                <div className="w-full h-24 overflow-hidden bg-gray-50 relative">
                  <img src={cat.categoryImage} alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="px-2.5 py-2.5 text-center">
                  <p className="text-[12.5px] font-semibold text-gray-700 group-hover:text-[#E53935] transition-colors leading-tight truncate">
                    {cat.name}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E53935] to-[#FF7043] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
            ))}
          </div>

          {showLeftArrow && isHovering && (
            <button className="absolute left-0 top-[44px] bg-white border border-gray-200 shadow-xl rounded-full p-2.5
              hover:scale-110 hover:border-[#E53935]/30 transition-all duration-200 z-10"
              onClick={() => handleScroll('left')}>
              <ArrowLeftIcon className="h-4 w-4 text-gray-600" />
            </button>
          )}
          {showRightArrow && isHovering && (
            <button className="absolute right-0 top-[44px] bg-white border border-gray-200 shadow-xl rounded-full p-2.5
              hover:scale-110 hover:border-[#E53935]/30 transition-all duration-200 z-10"
              onClick={() => handleScroll('right')}>
              <ArrowRightIcon className="h-4 w-4 text-gray-600" />
            </button>
          )}
        </div>
      </section>

      {/* ── Popular Items ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E53935] to-[#FF7043] flex items-center justify-center shadow-sm shadow-red-500/25">
              <TrendingUp size={16} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900 leading-tight">Popular Items</h2>
              <p className="text-[11px] text-gray-400">{items.length} items on menu</p>
            </div>
          </div>
          <button className="flex items-center gap-1 text-[12px] font-semibold text-[#E53935] hover:gap-2 transition-all duration-200">
            View all <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.isArray(items) && items.length > 0 ? (
         items.slice(0, 4).map((item) => (
              <div key={item.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5
                  transition-all duration-350 overflow-hidden group cursor-pointer"
              >
                <div className="relative overflow-hidden h-44">
                  <img src={item.image || "/placeholder.png"} alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

                  {item.is_bestseller && (
                    <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-[#E53935] to-[#FF7043]
                      text-white text-[10.5px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <Flame size={10} strokeWidth={2.5} /> Bestseller
                    </span>
                  )}

                  <span className={`absolute top-2.5 right-2.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full
                    flex items-center gap-1 shadow-md backdrop-blur-sm
                    ${item.food_type === "VEG" ? "bg-emerald-500/90 text-white" : "bg-red-500/90 text-white"}`}>
                    {item.food_type === "VEG" ? <Leaf size={10} strokeWidth={2.5} /> : <Flame size={10} strokeWidth={2.5} />}
                    {item.food_type === "VEG" ? "Veg" : "Non-Veg"}
                  </span>

                  {item.offer_price && (
                    <span className="absolute bottom-2.5 left-2.5 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      {Math.round((1 - item.offer_price / item.price) * 100)}% OFF
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-[13.5px] truncate group-hover:text-[#E53935] transition-colors leading-tight">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="flex items-center gap-1 text-amber-500 text-[12px] font-bold">
                      <FaStar className="text-amber-400 text-[11px]" />
                      {item.rating || "4.2"}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400 text-[11.5px]">
                      <Clock size={11} strokeWidth={2} />
                      {item.preparation_time || 0} min
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[#E53935] text-[15px]">
                        ₹{item.offer_price || item.price}
                      </span>
                      {item.offer_price && (
                        <span className="text-gray-300 line-through text-[12px]">₹{item.price}</span>
                      )}
                    </div>
                    <span className={`w-2 h-2 rounded-full ${item.is_available ? 'bg-emerald-400' : 'bg-gray-300'}`}
                      title={item.is_available ? 'Available' : 'Unavailable'} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-300">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                <UtensilsCrossed size={28} className="opacity-40" />
              </div>
              <p className="text-sm font-semibold text-gray-400">No items available</p>
              <p className="text-xs text-gray-300 mt-1">Add items to your menu to see them here</p>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>
    </div>
  );
};

/* ── Sub-components ── */

const SectionLabel = ({ icon, label }) => (
  <div className="flex items-center gap-2 mb-3">
    <span className="text-[#E53935]">{icon}</span>
    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
  </div>
);

const StatCard = ({ title, value, trend, trendUp, icon, gradient }) => (
  <div className="relative bg-white rounded-2xl p-4 border border-gray-100 shadow-sm
    hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group">
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 rounded-2xl`} />
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-sm`}>
        {icon}
      </div>
      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
        {trend}
      </span>
    </div>
    <p className="text-[26px] font-extrabold text-gray-900 leading-tight">{value}</p>
    <p className="text-[11.5px] text-gray-400 mt-1 font-medium">{title}</p>
  </div>
);

const DynamicStatCard = ({ title, value, icon, gradient }) => (
  <div className="relative bg-white rounded-2xl p-4 border border-gray-100 shadow-sm
    hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group">
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 rounded-2xl`} />
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-sm mb-3`}>
      {icon}
    </div>
    <p className="text-[26px] font-extrabold text-gray-900 leading-tight">{value}</p>
    <p className="text-[11.5px] text-gray-400 mt-1 font-medium">{title}</p>
  </div>
);

const ChartCard = ({ title, subtitle, children, headerRight }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-start justify-between mb-5">
      <div>
        <h3 className="font-bold text-gray-900 text-[14.5px] leading-tight">{title}</h3>
        {subtitle && <p className="text-[11.5px] text-gray-400 mt-0.5 font-medium">{subtitle}</p>}
      </div>
      {headerRight && <div className="ml-3 flex-shrink-0">{headerRight}</div>}
    </div>
    {children}
  </div>
);

export default Dashboard;