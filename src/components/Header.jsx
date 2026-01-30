// src/components/Header.jsx
import React, { useState } from "react";
import BellIcon from "@heroicons/react/24/outline/BellIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import logo from "../assets/app_icon.png";
import { FiSearch } from "react-icons/fi";

const Header = () => {
  const [mobileSearch, setMobileSearch] = useState(false);

  return (
    <header className="bg-white shadow-md px-3 md:px-6 py-2 md:py-3 sticky top-0 z-30">
      <div className="flex items-center justify-between max-w-7xl mx-auto">

        {/* LOGO */}
        <div className="flex-shrink-0">
          <img
            src={logo}
            alt="logo"
            className="h-10 w-10 md:h-14 md:w-14 lg:h-[70px] lg:w-[70px] object-contain"
          />
        </div>

        {/* DESKTOP SEARCH BAR */}
        <div className="hidden md:flex items-center flex-grow max-w-xl mx-4 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-red-500 transition">
          <FiSearch className="text-gray-500 text-lg mr-2" />
          <input
            type="text"
            placeholder="Search menu, orders, customers..."
            className="flex-grow bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
          />
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-2 md:gap-4">

          {/* MOBILE SEARCH BUTTON */}
          <button
            onClick={() => setMobileSearch(!mobileSearch)}
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition"
          >
            <FiSearch className="text-gray-700 text-xl" />
          </button>

          {/* NOTIFICATION */}
          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            <BellIcon className="h-5 w-5 md:h-6 md:w-6 text-gray-700 hover:text-[#FF5252]" />
          </button>

          {/* USER */}
          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            <UserIcon className="h-5 w-5 md:h-6 md:w-6 text-gray-700 hover:text-[#FF5252]" />
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH BAR (TOGGLE) */}
      {mobileSearch && (
        <div className="md:hidden mt-3 flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-red-500 transition">
          <FiSearch className="text-gray-500 text-lg mr-2" />
          <input
            type="text"
            placeholder="Search menu, orders..."
            className="flex-grow bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
          />
        </div>
      )}
    </header>
  );
};

export default Header;
