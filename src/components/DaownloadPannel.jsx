import React from "react";
import { FaApple, FaGooglePlay, FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";

function DownloadPanel() {
  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };
  const buttonHover = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  };
  const mockupAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  return (
    <section className="relative w-full py-24 bg-white overflow-hidden font-['Poppins']">
      {/* Soft Background Gradient */}
      <div className="absolute inset-0 to-transparent blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* LEFT CONTENT */}
        <motion.div
          className="space-y-6"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-black leading-tight">
            Download Our App &  
            <span className="text-orange-600"> Turn Dreams Into Reality</span>
          </h2>

          <p className="text-gray-700 text-lg max-w-xl">
            A smart vendor platform to manage orders, analytics, and business growth in one place.
          </p>

          {/* Features */}
          <div className="mt-8 space-y-3 text-gray-700">
            <p className="flex items-center gap-3 text-lg">
              <FaCheck className="text-green-500" /> Real-time Order Management
            </p>
            <p className="flex items-center gap-3 text-lg">
              <FaCheck className="text-green-500" /> Live Sales & Earnings Tracking
            </p>
            <p className="flex items-center gap-3 text-lg">
              <FaCheck className="text-green-500" /> Menu & Price Management
            </p>
            <p className="flex items-center gap-3 text-lg">
              <FaCheck className="text-green-500" /> Customer & Order Analytics Dashboard
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-5">
            <motion.a
              href="#"
              className="flex items-center gap-4 bg-black text-white border border-gray-300 px-6 py-4 rounded-xl shadow-lg"
              {...buttonHover}
            >
              <FaGooglePlay className="text-4xl text-green-400" />
              <div>
                <p className="text-xs text-gray-300">GET IT ON</p>
                <h4 className="text-xl font-bold">Google Play</h4>
              </div>
            </motion.a>

            <motion.a
              href="#"
              className="flex items-center gap-4 bg-white text-black border border-gray-300 px-6 py-4 rounded-xl shadow-lg"
              {...buttonHover}
            >
              <FaApple className="text-4xl" />
              <div>
                <p className="text-xs text-gray-600">Download on the</p>
                <h4 className="text-xl font-bold">App Store</h4>
              </div>
            </motion.a>
          </div>

          {/* Stats */}
          <div className="mt-10 flex gap-8 text-black">
            <div>
              <h3 className="text-3xl font-bold text-orange-600">50K+</h3>
              <p className="text-gray-600">Active Vendors</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-orange-600">120K+</h3>
              <p className="text-gray-600">Orders Managed</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT MOBILE MOCKUP */}
        <motion.div
          className="relative flex justify-center mt-12 lg:mt-0"
          variants={mockupAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Phone Glow */}
          <div className="absolute w-96 h-96 bg-orange-300/30 blur-3xl rounded-full"></div>

          {/* Phone Mockup */}
          <div className="relative bg-black rounded-[50px] p-4 shadow-3xl border border-gray-300 w-80 lg:w-96">
            <div className="bg-white rounded-[35px] overflow-hidden">
              {/* App Header */}
              <div className="bg-gradient-to-b from-orange-500 to-red-500 p-6 text-white">
                <h3 className="text-2xl font-bold">Food Vendor Pro</h3>
                <p className="text-sm opacity-90">Manage your business efficiently</p>
              </div>

              {/* App Content */}
              <div className="p-6 space-y-5">
                {/* Orders Progress */}
                <div className="bg-gray-100 p-4 rounded-xl shadow-sm">
                  <p className="font-bold text-black">Daily Orders</p>
                  <p className="text-sm text-gray-500">Completed: 75%</p>
                  <div className="w-full h-2 bg-gray-200 rounded mt-2">
                    <div className="h-full bg-orange-500 w-[75%] rounded"></div>
                  </div>
                </div>

                {/* Revenue */}
                <div className="bg-gray-100 p-4 rounded-xl shadow-sm">
                  <p className="font-bold text-black">Revenue</p>
                  <p className="text-sm text-gray-500">This Month: $12,400</p>
                  <div className="w-full h-2 bg-gray-200 rounded mt-2">
                    <div className="h-full bg-green-500 w-[65%] rounded"></div>
                  </div>
                </div>

                {/* Customer Rating */}
                <div className="bg-gray-100 p-4 rounded-xl shadow-sm">
                  <p className="font-bold text-black">Customer Rating</p>
                  <p className="text-sm text-gray-500">⭐ 4.6 Average</p>
                  <div className="w-full h-2 bg-gray-200 rounded mt-2">
                    <div className="h-full bg-yellow-400 w-[90%] rounded"></div>
                  </div>
                </div>

                {/* New Orders */}
                <div className="bg-gray-100 p-4 rounded-xl shadow-sm">
                  <p className="font-bold text-black">New Orders</p>
                  <p className="text-sm text-gray-500">5 New Orders Today</p>
                  <div className="w-full h-2 bg-gray-200 rounded mt-2">
                    <div className="h-full bg-blue-500 w-[50%] rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default DownloadPanel;
