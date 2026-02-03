// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

// Heroicons
import HomeIcon from '@heroicons/react/24/outline/HomeIcon';
import UserIcon from '@heroicons/react/24/outline/UserIcon';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon';
import ShoppingBagIcon from '@heroicons/react/24/outline/ShoppingBagIcon';
import MapIcon from '@heroicons/react/24/outline/MapIcon';
import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon';
import StarIcon from '@heroicons/react/24/outline/StarIcon';
import GiftIcon from '@heroicons/react/24/outline/GiftIcon';
import BellIcon from '@heroicons/react/24/outline/BellIcon';
import LifebuoyIcon from '@heroicons/react/24/outline/LifebuoyIcon';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import { LuLogOut } from "react-icons/lu";
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Automatically open "Menu" dropdown if user is on any menu-related page
  const [menuOpen, setMenuOpen] = useState(
    location.pathname.startsWith('/dashboard/menu')
  );

  // Reusable class for main menu items
  const navClass = ({ isActive }) =>
    `group flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all
    ${isActive
      ? 'bg-[#FF5252] text-white shadow-md shadow-red-500/20'
      : 'text-black hover:bg-gray-50'}`;

  // Logout function
  const handleLogout = () => {
    // Clear localStorage or any auth token
    localStorage.clear();
    // Redirect to login page
    setIsMobileOpen(false);   // sidebar close
    navigate('/login');
  };

  return (
    <div>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
      style={{ scrollbarWidth: "none" }}

        className={`
          w-64 bg-white shadow-xl border-r border-gray-100
          p-5 flex flex-col gap-1.5 overflow-y-auto
          font-['Poppins']
          
          /* Desktop: always visible */
          md:flex
          
          /* Mobile: slide in from left */
          ${isMobileOpen ? 'flex' : 'hidden'}
          fixed md:relative top-0 left-0 h-full z-50
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
      {/* Logo / Brand can go here */}

      <nav className="flex-1 flex flex-col gap-1 font-['Poppins']">
        {/* Dashboard */}
        <NavLink to="/dashboard" end className={navClass}  onClick={() => setIsMobileOpen(false)}>
          <HomeIcon className="h-5 w-5" />
          Dashboard
        </NavLink>

        {/* Profile */}
        <NavLink to="/dashboard/profile" className={navClass}   onClick={() => setIsMobileOpen(false)}>
          <UserIcon className="h-5 w-5" />
          Profile
        </NavLink>

        {/* MENU DROPDOWN BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`
            flex items-center justify-between w-full px-4 py-3 rounded-xl text-[15px] font-medium transition-all
            ${location.pathname.startsWith('/dashboard/menu')
              ? 'bg-[#FF5252] text-white shadow-md shadow-red-500/20'
              : 'text-black hover:bg-gray-50'}
          `}
        >
          <div className="flex items-center gap-3">
            <Bars3Icon className="h-5 w-5" />
            <span>Menu</span>
          </div>
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform duration-300 ${
              menuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Submenu items - Category & Item */}
        {menuOpen && (
          <div className="ml-10 mt-1 flex flex-col gap-1">
            <NavLink
              to="/dashboard/menu/category"
              onClick={()=>setIsMobileOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm transition-colors
                ${isActive
                  ? 'bg-red-50 text-[#FF5252] font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'}`
              }
            >
              • Category
            </NavLink>



            <NavLink
              to="/dashboard/menu/sub-category"
              onClick={()=>setIsMobileOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm transition-colors
                ${isActive
                  ? 'bg-red-50 text-[#FF5252] font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'}`
              }
            >
              • SubCategory
            </NavLink>

            <NavLink
              to="/dashboard/menu/item"
              onClick={()=>setIsMobileOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm transition-colors
                ${isActive
                  ? 'bg-red-50 text-[#FF5252] font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'}`
              }
            >
              • Item
            </NavLink>



            
          </div>
        )}

        {/* Other main menu items */}
        <NavLink to="/dashboard/orders" className={navClass}   onClick={() => setIsMobileOpen(false)}>
          <ShoppingBagIcon className="h-5 w-5" />
          Orders
        </NavLink>

        <NavLink to="/dashboard/tracking" className={navClass}   onClick={() => setIsMobileOpen(false)}>
          <MapIcon className="h-5 w-5" />
          Tracking
        </NavLink>

        <NavLink to="/dashboard/earnings" className={navClass}   onClick={() => setIsMobileOpen(false)}>
          <CurrencyDollarIcon className="h-5 w-5" />
          Earnings
        </NavLink>

        <NavLink to="/dashboard/reviews" className={navClass}   onClick={() => setIsMobileOpen(false)}>
          <StarIcon className="h-5 w-5" />
          Reviews
        </NavLink>

        <NavLink to="/dashboard/offers" className={navClass}   onClick={() => setIsMobileOpen(false)}>
          <GiftIcon className="h-5 w-5" />
          Offers
        </NavLink>

        {/* <NavLink to="/dashboard/notifications" className={navClass}>
          <BellIcon className="h-5 w-5" />
          Notifications
        </NavLink> */}

        <NavLink to="/dashboard/support" className={navClass}  onClick={() => setIsMobileOpen(false)}>
          <LifebuoyIcon className="h-5 w-5" />
          Support
        </NavLink>

        {/* Logout button right below Support */}
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors text-left flex items-center gap-3 px-4"
        >
         <LuLogOut size={20}/> Logout
        </button>
      </nav>

      <div className="pt-4 mt-auto border-t border-gray-100 text-xs text-gray-500">
        © 2026 YourApp
      </div>
    </aside>
    </div>
  );
};

export default Sidebar;
