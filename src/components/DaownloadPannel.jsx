// src/components/DownloadPanel.jsx
import React from "react";
import { FaApple, FaGooglePlay, FaCheck, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

export default function DownloadPanel() {
  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
  };

  const buttonHover = {
    whileHover: { 
      scale: 1.08, 
      boxShadow: "0 25px 50px -12px rgba(255, 82, 82, 0.4)",
      y: -6 
    },
    whileTap: { scale: 0.96, y: 0 },
  };

  const mockupFloat = {
    hidden: { opacity: 0, y: 100, scale: 0.88 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { duration: 1.4, ease: "easeOut", type: "spring", stiffness: 70 } 
    },
  };

  const glowPulse = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 0.9, 0.5],
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <section className="relative w-full py-24 md:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden font-['Poppins']">
      {/* Background decorative rings */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 md:w-96 md:h-96 rounded-full border-8 md:border-[10px] border-[#FF5252]/10 -translate-x-1/3 translate-y-1/4" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 md:w-96 md:h-96 rounded-full border-8 md:border-[10px] border-[#FF5252]/10 translate-x-1/3 -translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-[#FF5252]/5 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-[#FF5252]/15 via-transparent to-transparent pointer-events-none"
        {...glowPulse}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* LEFT - Content */}
          <motion.div className="space-y-10 text-center lg:text-left" variants={fadeUp}>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Download Our App
              <br />
              <span className="bg-gradient-to-r from-[#FF5252] via-[#f97316] to-[#e11d48] bg-clip-text text-transparent">
                Turn Dreams Into Reality
              </span>
            </h2>

            <p className="text-gray-700 text-xl md:text-2xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Manage orders, track earnings, update your menu & grow your restaurant — all in one powerful app.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
              {[
                "Real-time Order Tracking",
                "Live Earnings Dashboard",
                "Instant Menu & Price Updates",
                "Smart Analytics & Insights",
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-5 bg-white/70 backdrop-blur-xl border border-white/30 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF5252]/20 to-[#f97316]/20 flex items-center justify-center text-[#FF5252] text-2xl shadow-inner">
                    <FaCheck />
                  </div>
                  <p className="text-gray-800 font-medium text-lg">{feature}</p>
                </motion.div>
              ))}
            </div>

            {/* Download Buttons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-14">
              <motion.a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-5 bg-gradient-to-r from-black to-gray-950 text-white px-10 py-6 rounded-3xl shadow-2xl overflow-hidden border border-gray-800/50"
                {...buttonHover}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF5252]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <FaGooglePlay className="text-5xl text-green-400 drop-shadow-lg" />
                <div>
                  <p className="text-sm opacity-80">GET IT ON</p>
                  <h4 className="text-2xl font-extrabold">Google Play</h4>
                </div>
              </motion.a>

              <motion.a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-5 bg-gradient-to-r from-gray-50 via-white to-gray-50 text-black px-10 py-6 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
                {...buttonHover}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF5252]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <FaApple className="text-5xl drop-shadow-lg" />
                <div>
                  <p className="text-sm opacity-80">Download on the</p>
                  <h4 className="text-2xl font-extrabold">App Store</h4>
                </div>
              </motion.a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-16 md:gap-24 mt-16">
              {[
                { num: "50K+", label: "Active Vendors", color: "#FF5252" },
                { num: "120K+", label: "Orders Managed", color: "#10b981" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.3 }}
                  viewport={{ once: true }}
                  className="relative text-center"
                >
                  <div className="relative w-40 h-40 mx-auto">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF5252]/30 to-transparent blur-xl animate-pulse-slow"
                    />
                    <div className="absolute inset-0 rounded-full bg-white shadow-2xl flex items-center justify-center border border-gray-100/80">
                      <h3 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#FF5252] to-[#e11d48] bg-clip-text text-transparent">
                        {stat.num}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-6 text-gray-700 font-medium text-xl">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT - Phone Mockup */}
          <motion.div
            className="relative flex justify-center mt-16 lg:mt-0 perspective-1000"
            variants={mockupFloat}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Glow */}
            <motion.div
              className="absolute w-96 h-96 bg-gradient-to-br from-[#FF5252]/40 via-[#f97316]/30 to-transparent blur-3xl rounded-full -z-10"
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Phone Frame */}
            <motion.div
              className="relative bg-gradient-to-br from-black via-gray-900 to-black rounded-[4.5rem] p-6 shadow-[0_80px_160px_rgba(0,0,0,0.7)] border border-gray-800 w-[360px] md:w-[420px] lg:w-[480px] transform hover:scale-105 hover:rotate-[2deg] transition-all duration-700"
              whileHover={{ rotateX: 5, rotateY: -5, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="bg-gradient-to-b from-gray-950 to-black rounded-[3.8rem] overflow-hidden h-[740px] relative shadow-inner">
                {/* Notch */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-44 h-1.5 bg-gray-700 rounded-full z-20" />

                {/* Header */}
                <div className="relative bg-gradient-to-br from-[#FF5252] via-[#f97316] to-[#e11d48] p-10 pt-16 text-white overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                  <h3 className="text-4xl font-bold drop-shadow-lg">Tryde Vendor</h3>
                  <p className="text-xl opacity-90 mt-4 drop-shadow">Power in Your Pocket</p>
                </div>

                {/* Dashboard */}
                <div className="p-6 space-y-6">
                  {[
                    { title: "Today's Orders", value: "168", progress: 82, color: "#FF5252" },
                    { title: "Monthly Revenue", value: "₹2,24,800", progress: 94, color: "#10b981" },
                    { title: "Avg Rating", value: "4.9 ★", progress: 98, color: "#facc15" },
                    { title: "Pending Payout", value: "₹68,400", progress: 71, color: "#8b5cf6" },
                  ].map((card, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:bg-white/20 transition-all duration-300"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <p className="font-semibold text-white text-xl">{card.title}</p>
                        <p className="text-white font-bold text-xl">{card.value}</p>
                      </div>
                      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(to right, ${card.color}, ${card.color}dd)` }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${card.progress}%` }}
                          transition={{ duration: 1.8, delay: idx * 0.3, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}