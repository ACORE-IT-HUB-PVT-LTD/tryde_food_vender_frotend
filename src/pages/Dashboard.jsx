import React from 'react';
import Card from '../components/Card';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

// Material Icons for categories (import only needed ones)
import {
  SoupKitchen,
  RestaurantMenu,
  LocalPizza,
  LunchDining,
  LocalDrink,
  Icecream,
} from '@mui/icons-material';

const Dashboard = () => {
  // Mock data - Today's stats
  const stats = [
    { title: "Today's Orders", value: 15 },
    { title: "Today's Earnings", value: '₹2500' },
    { title: 'Pending Orders', value: 3 },
  ];

  // Mock categories with icons (no images)
  const categories = [
    { id: 1, name: 'Starters', icon: <SoupKitchen fontSize="large" /> },
    { id: 2, name: 'Main Course', icon: <RestaurantMenu fontSize="large" /> },
    { id: 3, name: 'Pizza', icon: <LocalPizza fontSize="large" /> },
    { id: 4, name: 'Burgers', icon: <LunchDining fontSize="large" /> },
    { id: 5, name: 'Drinks', icon: <LocalDrink fontSize="large" /> },
    { id: 6, name: 'Desserts', icon: <Icecream fontSize="large" /> },
  ];

  // Mock recent/popular items (unchanged)
  const items = [
    { id: 1, name: 'Margherita Pizza', price: '₹249', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
    { id: 2, name: 'Chicken Biryani', price: '₹299', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400' },
    { id: 3, name: 'Paneer Butter Masala', price: '₹279', image: 'https://images.unsplash.com/photo-1630409351340-1f3a02f4e8b0?w=400' },
    { id: 4, name: 'Veg Momos', price: '₹149', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400' },
    { id: 5, name: 'Cold Coffee', price: '₹129', image: 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=400' },
  ];

  return (
    <div className="space-y-10">
      {/* Banner - unchanged */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1555939594-58056f625634?w=1200"
          alt="Delicious Food Banner"
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              Welcome to Your Kitchen
            </h1>
            <p className="text-xl text-white/90 mt-2 drop-shadow-md">
              Manage orders, menu & earnings easily
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards - unchanged */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} title={stat.title}>
            <p className="text-3xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Horizontal Scrollable Category Cards - sirf icon + name */}
      <div>
        <h2 className="text-2xl font-bold text-[#FF5252] mb-4">Categories</h2>
        <div className="relative">
          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="min-w-[160px] snap-start bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col items-center justify-center p-6"
              >
                <div className="text-[#FF5252] mb-3">
                  {cat.icon}
                </div>
                <p className="font-semibold text-gray-800 text-center">{cat.name}</p>
              </div>
            ))}
          </div>

          {/* Left & Right Arrows - unchanged */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg hover:bg-white"
            onClick={() => {
              document.querySelector('.overflow-x-auto').scrollBy({ left: -200, behavior: 'smooth' });
            }}
          >
            <ArrowLeftIcon className="h-6 w-6 text-[#FF5252]" />
          </button>

          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg hover:bg-white"
            onClick={() => {
              document.querySelector('.overflow-x-auto').scrollBy({ left: 200, behavior: 'smooth' });
            }}
          >
            <ArrowRightIcon className="h-6 w-6 text-[#FF5252]" />
          </button>
        </div>
      </div>

      {/* Food Items Grid - unchanged */}
      <div>
        <h2 className="text-2xl font-bold text-[#FF5252] mb-4">Popular Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-[#FF5252] font-bold mt-1">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;