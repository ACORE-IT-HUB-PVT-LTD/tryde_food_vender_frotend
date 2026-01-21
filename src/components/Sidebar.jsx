// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

// Sahi imports – har icon alag se
import HomeIcon from '@heroicons/react/24/outline/HomeIcon';
import UserIcon from '@heroicons/react/24/outline/UserIcon';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon'; // ← MenuIcon ki jagah yeh use karo (hamburger menu)
import ShoppingBagIcon from '@heroicons/react/24/outline/ShoppingBagIcon';
import MapIcon from '@heroicons/react/24/outline/MapIcon';
import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon';
import StarIcon from '@heroicons/react/24/outline/StarIcon';
import GiftIcon from '@heroicons/react/24/outline/GiftIcon';
import BellIcon from '@heroicons/react/24/outline/BellIcon';
import LifebuoyIcon from '@heroicons/react/24/outline/LifebuoyIcon';

const Sidebar = () => {
  const links = [
    { to: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { to: '/profile', icon: UserIcon, label: 'Profile' },
    { to: '/menu', icon: Bars3Icon, label: 'Menu' }, // ← MenuIcon nahi hai, Bars3Icon (hamburger) use karo
    { to: '/orders', icon: ShoppingBagIcon, label: 'Orders' },
    { to: '/tracking', icon: MapIcon, label: 'Tracking' },
    { to: '/earnings', icon: CurrencyDollarIcon, label: 'Earnings' },
    { to: '/reviews', icon: StarIcon, label: 'Reviews' },
    { to: '/offers', icon: GiftIcon, label: 'Offers' },
    { to: '/notifications', icon: BellIcon, label: 'Notifications' },
    { to: '/support', icon: LifebuoyIcon, label: 'Support' },
  ];

  return (
    <aside className="w-64 bg-white shadow-md p-4 flex flex-col space-y-2 hidden md:flex">
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg transition-colors ${
              isActive ? 'bg-[#FF5252] text-white' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Icon className="h-6 w-6 mr-3" />
          {label}
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;