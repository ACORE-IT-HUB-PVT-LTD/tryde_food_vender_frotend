// src/components/DownloadPanel.jsx
import React from "react";
import { FaApple, FaGooglePlay, FaCheckCircle, FaStar, FaUtensils, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import phoneImg from "../assets/phoneomg.png";

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
      {/* Background accents */}
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
          {/* ── LEFT: Content ── */}
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
                { text: "Live Order Tracking",           icon: FaCheckCircle },
                { text: "Daily Earnings & Fast Payouts", icon: FaCheckCircle },
                { text: "Instant Menu & Price Updates",  icon: FaCheckCircle },
                { text: "Ratings & Customer Feedback",   icon: FaStar },
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

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mt-12">
              <motion.a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center gap-4 bg-[#00C853] hover:bg-[#00B140] text-white px-8 py-5 rounded-xl shadow-lg hover:shadow-xl transition-all min-w-[220px]"
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.97 }}
              >
                <FaGooglePlay className="text-3xl drop-shadow-md" />
                <div className="text-left">
                  <p className="text-xs font-medium opacity-90">GET IT ON</p>
                  <p className="text-xl font-bold">Google Play</p>
                </div>
              </motion.a>

              <motion.a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center gap-4 bg-black hover:bg-gray-900 text-white px-8 py-5 rounded-xl shadow-lg hover:shadow-xl transition-all min-w-[220px]"
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.97 }}
              >
                <FaApple className="text-3xl" />
                <div className="text-left">
                  <p className="text-xs font-medium opacity-80">Download on the</p>
                  <p className="text-xl font-bold">App Store</p>
                </div>
              </motion.a>
            </div>
          </motion.div>

          {/* ── RIGHT: Phone Image ── */}
          <motion.div
            className="relative flex justify-center items-center mt-12 lg:mt-0"
            variants={fadeUp}
          >
            {/* Glow blob */}
            <div className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-orange-300/40 to-red-300/30 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            {/* Phone image */}
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, y: 60, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, type: "spring", stiffness: 75 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.4 } }}
            >
              <img
                src={phoneImg}
                alt="Tryde Partner App"
                className="w-[280px] sm:w-[320px] lg:w-[380px] xl:w-[420px] object-contain drop-shadow-2xl"
              />

              {/* Floating badge — New Order */}
              <motion.div
                className="absolute top-10 -right-6 sm:-right-10 bg-white rounded-2xl px-3 py-2 shadow-xl border border-orange-100 flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.7, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5, type: "spring" }}
                viewport={{ once: true }}
              >
                <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-green-500 text-xs" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-800">New Order!</p>
                  <p className="text-[9px] text-gray-500">₹340 • 2 items</p>
                </div>
              </motion.div>

              {/* Floating badge — Rating */}
              <motion.div
                className="absolute bottom-16 -left-6 sm:-left-10 bg-white rounded-2xl px-3 py-2 shadow-xl border border-yellow-100 flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.7, y: -10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
                viewport={{ once: true }}
              >
                <div className="w-7 h-7 bg-yellow-100 rounded-full flex items-center justify-center">
                  <FaStar className="text-yellow-500 text-xs" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-800">4.9 Rating</p>
                  <p className="text-[9px] text-gray-500">Top Restaurant 🏆</p>
                </div>
              </motion.div>

              {/* Floating badge — Revenue */}
              <motion.div
                className="absolute top-1/2 -right-8 sm:-right-14 bg-white rounded-2xl px-3 py-2 shadow-xl border border-green-100 flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.7, x: 10 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.5, type: "spring" }}
                viewport={{ once: true }}
              >
                <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center">
                  <FaUtensils className="text-emerald-500 text-xs" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-800">₹1.68L Today</p>
                  <p className="text-[9px] text-gray-500">142 orders</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}