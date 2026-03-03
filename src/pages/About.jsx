// src/pages/AboutUs.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaRocket, FaHandshake, FaHeart } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutUs() {
  const siteName = "Tryde";
  const primaryColor = "#FF5252";

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="font-['Poppins'] bg-gray-50 min-h-screen">
      {/* Navbar */}
      <Navbar siteName={siteName} primaryColor={primaryColor} />

      {/* ===================== Hero Section ===================== */}
      <section className="relative min-h-[70vh] sm:min-h-[85vh] flex items-center bg-gradient-to-br from-red-50 via-white to-red-50 text-gray-900 overflow-hidden pt-20 sm:pt-24 lg:pt-28">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-20 -left-20 sm:-top-40 sm:-left-40 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-[#FF5252]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -right-16 sm:-bottom-60 sm:-right-60 w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] bg-[#FF5252]/5 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
              Welcome to <span className="text-[#FF5252]">Tryde</span>
            </h1>
            <p className="mt-5 sm:mt-6 text-lg sm:text-xl md:text-2xl max-w-xl mx-auto lg:mx-0 text-gray-700">
              The modern platform helping restaurants, cloud kitchens & food vendors grow faster — direct orders, zero high commissions, happier customers.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
              <a
                href="/download"
                className="bg-[#FF5252] text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:bg-red-600 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Download App
              </a>
              <a
                href="/register"
                className="border-2 border-[#FF5252] text-[#FF5252] px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg hover:bg-[#FF5252] hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Partner with Us
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.4 }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Delicious restaurant food spread"
                className="rounded-3xl shadow-2xl border-8 border-white/40 object-cover h-[480px] lg:h-[520px] w-full"
              />
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute -bottom-6 -right-6 bg-white/95 backdrop-blur-sm p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-100"
              >
                <p className="text-[#FF5252] font-extrabold text-3xl sm:text-4xl">15K+</p>
                <p className="text-gray-800 font-medium">Orders Delivered</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== Our Story ===================== */}
      <section className="py-16 sm:py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-extrabold text-gray-900">
              Our Story
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-5 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Founded in 2023, Tryde was born to fight high commissions, slow payouts, and lack of control for food businesses.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-lg sm:text-xl text-gray-700 leading-relaxed space-y-6"
            >
              <p>
                Small restaurants, cloud kitchens, and home chefs were losing huge margins to aggregator platforms. Customers wanted faster delivery and better prices — but real choices were missing.
              </p>
              <p>
                <strong className="text-[#FF5252]">Tryde changes the game:</strong>{" "}
                <span className="text-[#FF5252] font-medium">direct connections</span>,{" "}
                <span className="text-[#FF5252] font-medium">fair earnings</span>, full control over menu & pricing, and stronger customer relationships.
              </p>
              <p className="italic text-gray-600 border-l-4 border-[#FF5252] pl-5 py-1">
                We built Tryde so every food business can thrive — not just survive.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden shadow-2xl relative group"
            >
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Chef preparing fresh food"
                className="w-full h-64 sm:h-80 lg:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================== About Tryde Section ===================== */}
     <section className="py-20 lg:py-28 bg-gray-50 overflow-hidden">
  <div className="max-w-7xl mx-auto px-6 lg:px-10">
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center lg:min-h-[720px]">
      {/* LEFT: Image Block */}
      <motion.div
        className="relative flex items-center justify-center lg:justify-start order-2 lg:order-1"
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="relative w-full max-w-[520px] lg:max-w-[560px]">
          {/* Main image – softer, more beautiful egg/organic shape */}
          <motion.div
            className="relative overflow-hidden shadow-2xl border-[12px] border-white/80 rounded-[48%_52%_50%_50%/52%_48%_50%_50%] bg-gradient-to-br from-red-50 to-white"
            whileHover={{ scale: 1.03, transition: { duration: 0.4 } }}
          >
            <img
              src="https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&auto=format&fit=crop&q=80"
              alt="Restaurant kitchen vendor using Tryde"
              className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
            />
            {/* Subtle overlay gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700" />
          </motion.div>

          {/* Small overlapping chef circle – top-left */}
          <motion.div
            className="absolute -top-6 -left-4 sm:-top-8 sm:-left-6 w-28 h-28 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl z-20"
            initial={{ scale: 0.7, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.12, rotate: 5 }}
          >
            <img
              src="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=800&auto=format&fit=crop&q=80"
              alt="Chef"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Years badge – bottom center, animated */}
          <motion.div
            className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 shadow-2xl rounded-2xl px-8 py-6 text-center z-20 min-w-[190px]"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.08, y: -5 }}
          >
            <p className="text-5xl font-extrabold text-[#FF5252]">20+</p>
            <p className="text-base text-gray-700 mt-1 font-medium">Years Combined Experience</p>
          </motion.div>
        </div>
      </motion.div>

      {/* RIGHT: Content Block */}
      <motion.div
        className="flex flex-col justify-between gap-8 order-1 lg:order-2 pt-4 pb-12 lg:pb-0"
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* Pill badge */}
        <motion.div
          className="inline-flex items-center gap-3 bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 text-[#FF5252] font-semibold px-5 py-2.5 rounded-full text-base shadow-sm w-fit mx-auto lg:mx-0"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-lg">✨</span> About Tryde
        </motion.div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight text-center lg:text-left">
          Dedicated to Bringing You
          <span className="block text-[#FF5252] mt-3">Unforgettable Growth</span>
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-700 leading-relaxed mx-auto lg:mx-0 text-center lg:text-left max-w-2xl">
          Tryde empowers every restaurant, cloud kitchen, and food vendor — take direct orders, skip high commissions, and grow faster with loyal customers.
        </p>

        {/* Checklist */}
        <ul className="space-y-4 text-base lg:text-lg text-gray-800">
          {[
            "Super easy registration for any restaurant or vendor",
            "Zero commission — keep almost 100% of every order",
            "Direct customer orders — no aggregator middleman",
            "Full control over your menu, prices & branding",
            "Fast daily payouts + powerful business insights",
          ].map((text, i) => (
            <motion.li
              key={i}
              className="flex items-center gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#FF5252] flex items-center justify-center shadow-md">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>{text}</span>
            </motion.li>
          ))}
        </ul>

        {/* Mission + Vision cards */}
        <div className="grid sm:grid-cols-2 gap-6 mt-4">
          {[
            {
              title: "Our Mission",
              text: "Help food businesses grow with direct orders, higher earnings, and strong customer relationships.",
            },
            {
              title: "Our Vision",
              text: "India's most trusted, fair, and fastest-growing restaurant platform with complete freedom and maximum profit.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.2, duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h4 className="font-bold text-xl text-gray-900 mb-3 text-center lg:text-left">
                {item.title}
              </h4>
              <p className="text-gray-600 text-base leading-relaxed text-center lg:text-left">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Row */}
        <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start mt-8">
          <motion.a
            href="/register"
            className="bg-[#FF5252] hover:bg-red-600 text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-red-300 transition-all duration-300 flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Register Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>

          <motion.div
            className="flex items-center gap-4 text-gray-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-[#FF5252] shadow-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Call us anytime</p>
              <p className="font-bold text-xl text-[#FF5252]">+91 98765 43210</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </div>
</section>

      {/* ===================== Mission & Values ===================== */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {[
              { icon: FaRocket, title: "Our Mission", text: "Empower food businesses with fair tools, zero high commissions & direct customer access." },
              { icon: FaHandshake, title: "Transparency", text: "No hidden charges. Clear earnings. You control menu, prices & customer data." },
              { icon: FaUsers, title: "Community First", text: "Helping local restaurants, home chefs & cloud kitchens grow together." },
              { icon: FaHeart, title: "Innovation", text: "Smart orders, real-time insights, QR menus, loyalty — food tech done right." },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-gray-50 p-6 sm:p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group text-center border border-gray-100"
              >
                <item.icon className="text-[#FF5252] text-5xl sm:text-6xl mx-auto mb-5 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-base sm:text-lg">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================== Stats ===================== */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-red-50 to-pink-50 text-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#FF5252_0%,transparent_50%)]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12 text-center"
          >
            {[
              { number: "25K+", label: "Happy Customers" },
              { number: "3K+", label: "Active Vendors" },
              { number: "4.7/5", label: "App Rating" },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="p-6">
                <p className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#FF5252] drop-shadow-md">{stat.number}</p>
                <p className="text-xl sm:text-2xl mt-4 font-medium text-gray-700">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================== Final CTA ===================== */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900"
          >
            Join the Tryde Food Family Today
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-5 sm:mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Whether you're a restaurant owner, cloud kitchen, home chef, or simply love good food — Tryde makes everything simpler, fairer, and more delicious.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-5 sm:gap-8 justify-center"
          >
            <a
              href="/download"
              className="bg-[#FF5252] text-white px-10 sm:px-12 py-5 sm:py-6 rounded-2xl text-lg sm:text-xl font-bold shadow-xl hover:bg-red-600 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Get the App Now
            </a>
            <a
              href="/register"
              className="border-2 border-[#FF5252] text-[#FF5252] px-10 sm:px-12 py-5 sm:py-6 rounded-2xl text-lg sm:text-xl font-bold hover:bg-[#FF5252] hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Become a Vendor
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer siteName={siteName} />
    </div>
  );
}