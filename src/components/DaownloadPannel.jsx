// src/components/DownloadPanel.jsx
import React from "react";
import { FaApple, FaGooglePlay, FaCheckCircle, FaStar, FaUtensils } from "react-icons/fa";
import { motion } from "framer-motion";

export default function DownloadPanel() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: "easeOut" } },
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.18 },
    },
  };

  return (
    <section className="relative w-full py-20 md:py-28 lg:py-36 bg-gradient-to-b from-orange-50/60 via-white to-orange-50/30 overflow-hidden">
      {/* Very light warm background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(249,115,22,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_75%,rgba(249,115,22,0.06),transparent_55%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 z-10">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
        >
          {/* LEFT - Content */}
          <motion.div className="space-y-10 lg:space-y-12 text-center lg:text-left" variants={fadeUp}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Grow Your Restaurant
              <br />
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-[#FF5252] bg-clip-text text-transparent">
                With More Orders
              </span>
            </h2>

            <p className="text-lg md:text-xl text-gray-700 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Real-time order tracking • Fast weekly payouts • Easy menu updates • Reach thousands of hungry customers — all from one app.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              {[
                { text: "Live Order Tracking", icon: FaCheckCircle },
                { text: "Daily Earnings & Fast Payouts", icon: FaCheckCircle },
                { text: "Instant Menu & Price Updates", icon: FaCheckCircle },
                { text: "Ratings & Customer Feedback", icon: FaStar },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.25 } }}
                  className="group flex items-start gap-4 bg-white border border-orange-100 hover:border-orange-300 rounded-2xl p-6 shadow-sm hover:shadow transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF5252] group-hover:scale-110 transition-transform">
                    <item.icon className="text-xl" />
                  </div>
                  <p className="font-semibold text-gray-800 text-base leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Download Buttons - modern + real colors */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mt-12">
              {/* Google Play - official green */}
              <motion.a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center gap-4 bg-[#00C853] hover:bg-[#00B140] text-white px-8 py-5 rounded-xl shadow-lg hover:shadow-xl transition-all min-w-[260px]"
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <FaGooglePlay className="text-3xl drop-shadow-md" />
                <div className="text-left">
                  <p className="text-xs font-medium opacity-90">GET IT ON</p>
                  <p className="text-xl font-bold">Google Play</p>
                </div>
              </motion.a>

              {/* App Store - clean black/white */}
              <motion.a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center gap-4 bg-black hover:bg-gray-900 text-white px-8 py-5 rounded-xl shadow-lg hover:shadow-xl transition-all min-w-[260px]"
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <FaApple className="text-3xl" />
                <div className="text-left">
                  <p className="text-xs font-medium opacity-80">Download on the</p>
                  <p className="text-xl font-bold">App Store</p>
                </div>
              </motion.a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-10 md:gap-16 mt-12">
              <div className="text-center">
                <p className="text-5xl font-extrabold text-[#FF5252]">12K+</p>
                <p className="mt-2 text-gray-600 font-medium">Partner Restaurants</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-extrabold text-emerald-600">3.2L+</p>
                <p className="mt-2 text-gray-600 font-medium">Orders This Month</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <p className="text-5xl font-extrabold text-amber-500">4.7</p>
                  <FaStar className="text-amber-400 text-3xl" />
                </div>
                <p className="mt-2 text-gray-600 font-medium">Partner Rating</p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT - Phone mockup */}
          <motion.div
            className="relative flex justify-center mt-12 lg:mt-0"
            variants={fadeUp}
          >
            <motion.div
              className="relative w-[300px] sm:w-[340px] lg:w-[380px]"
              initial={{ opacity: 0, y: 60, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, type: "spring", stiffness: 80 }}
              viewport={{ once: true }}
            >
              {/* Warm orange glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 via-amber-50/30 to-transparent blur-3xl rounded-[3rem] -z-10 opacity-70" />

              <div className="relative bg-white rounded-[3rem] p-4 shadow-2xl border border-orange-100">
                <div className="bg-gray-50 rounded-[2.6rem] overflow-hidden h-[640px] relative border border-gray-200">
                  {/* Notch */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-1 bg-gray-300 rounded-full z-20" />

                  {/* Header - orange theme */}
                  <div className="relative bg-gradient-to-br from-red-400 via-red-500 to-[#FF5252] px-6 pt-12 pb-8 text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <FaUtensils className="text-3xl" />
                      <h3 className="text-3xl font-bold">Partner App</h3>
                    </div>
                    <p className="text-base opacity-90">More Orders • More Revenue</p>
                  </div>

                  {/* Dashboard Cards */}
                  <div className="p-5 space-y-4">
                    {[
                      { title: "Today's Orders", value: "142", progress: 86, color: "from-orange-500 to-orange-600" },
                      { title: "Revenue Today", value: "₹1.68L", progress: 92, color: "from-emerald-500 to-emerald-600" },
                      { title: "Avg. Rating", value: "4.8 ★", progress: 95, color: "from-amber-500 to-amber-600" },
                      { title: "Pending Payout", value: "₹54,200", progress: 78, color: "from-orange-500 to-amber-600" },
                    ].map((card, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-orange-300 transition-all"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <p className="font-medium text-gray-700 text-sm sm:text-base">{card.title}</p>
                          <p className="font-bold text-gray-900 text-sm sm:text-base">{card.value}</p>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full bg-gradient-to-r ${card.color}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${card.progress}%` }}
                            transition={{ duration: 1.6, delay: idx * 0.2, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}