// src/components/Header.jsx
import React from 'react';
import BellIcon from '@heroicons/react/24/outline/BellIcon';
import UserIcon from '@heroicons/react/24/outline/UserIcon';
import logo from "../assets/app_icon.png"
import { FiSearch } from "react-icons/fi";

const Header = () => {
  return (
   <header className="bg-white shadow-md p-4 flex justify-between items-center relative z-30 ">
  <div className="text-xl md:text-2xl font-bold text-[#FF5252] ml-12 md:ml-0">
    <img src={logo} alt='logo' className='size-[70px]'/>
  </div>
  
 <div className="flex items-center w-full max-w-2xl bg-white/80 backdrop-blur-md shadow-sm border border-gray-200 rounded-full px-6 py-3 focus-within:ring-2 focus-within:ring-red-500 transition">

  <FiSearch className="text-gray-500 text-2xl mr-3" />

  <input
    type="text"
    placeholder="Search menu, orders, customers..."
    className="flex-grow bg-transparent outline-none text-base px-2 text-gray-800 placeholder-gray-500"
  />

</div>

  
  <div className="flex items-center space-x-4 md:space-x-6">
    <BellIcon className="h-6 w-6 md:h-7 md:w-7 text-gray-700 cursor-pointer hover:text-[#FF5252]" />
    <UserIcon className="h-6 w-6 md:h-7 md:w-7 text-gray-700 cursor-pointer hover:text-[#FF5252]" />
  </div>
</header>
  );
};

export default Header;