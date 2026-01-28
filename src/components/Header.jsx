// src/components/Header.jsx
import React from 'react';
import BellIcon from '@heroicons/react/24/outline/BellIcon';
import UserIcon from '@heroicons/react/24/outline/UserIcon';
import logo from "../assets/app_icon.png"
import { IoSearch } from "react-icons/io5";

const Header = () => {
  return (
   <header className="bg-white shadow-md p-4 flex justify-between items-center relative z-30">
  <div className="text-xl md:text-2xl font-bold text-[#FF5252] ml-12 md:ml-0">
    <img src={logo} alt='' className='size-[70px]'/>
  </div>
  
  {/* <div className="relative flex items-center w-1/3 max-w-md">
    <div className="absolute left-3 text-gray-400">
      <IoSearch className="h-5 w-5" />
    </div>
    <input 
      type='text' 
      placeholder='Search...'
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF5252] focus:border-transparent"
    />
  </div> */}
  
  <div className="flex items-center space-x-4 md:space-x-6">
    <BellIcon className="h-6 w-6 md:h-7 md:w-7 text-gray-700 cursor-pointer hover:text-[#FF5252]" />
    <UserIcon className="h-6 w-6 md:h-7 md:w-7 text-gray-700 cursor-pointer hover:text-[#FF5252]" />
  </div>
</header>
  );
};

export default Header;