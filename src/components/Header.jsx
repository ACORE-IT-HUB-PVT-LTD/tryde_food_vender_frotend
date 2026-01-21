// src/components/Header.jsx
import React from 'react';
import BellIcon from '@heroicons/react/24/outline/BellIcon';
import UserIcon from '@heroicons/react/24/outline/UserIcon';

const Header = () => {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-[#FF5252]">Vendor Dashboard</div>
      <div className="flex items-center space-x-6">
        <BellIcon className="h-7 w-7 text-gray-700 cursor-pointer hover:text-[#FF5252]" />
        <UserIcon className="h-7 w-7 text-gray-700 cursor-pointer hover:text-[#FF5252]" />
      </div>
    </header>
  );
};

export default Header;