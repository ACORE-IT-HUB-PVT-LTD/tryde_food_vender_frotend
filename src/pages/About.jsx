// src/pages/AboutUs.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaRocket, FaHandshake, FaHeart } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutUs() {
  const siteName = "Tryde";
  const primaryColor = "#FF5252";

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const scaleUp = {
    hidden: { scale: 0.92, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.9 } },
  };

  return (
    <div className="font-['Poppins'] bg-gray-50 min-h-screen">
      {/* Navbar */}
      <Navbar siteName={siteName} primaryColor={primaryColor} />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] sm:min-h-[85vh] flex items-center bg-gradient-to-br from-[#FF5252] via-[#ff4d4d] to-[#d32f2f] text-white overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-20 -left-20 sm:-top-40 sm:-left-40 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-white/40 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-32 -right-16 sm:-bottom-60 sm:-right-60 w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] bg-white/30 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
              Welcome to <span className="text-black">Tryde</span>
            </h1>
            <p className="mt-5 sm:mt-6 text-lg sm:text-xl md:text-2xl max-w-xl mx-auto lg:mx-0 opacity-95">
              The modern platform helping restaurants, cloud kitchens & food vendors grow faster — direct orders, zero high commissions, happier customers.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
              <a
                href="/download"
                className="bg-black text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg shadow-2xl hover:bg-gray-900 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Download App
              </a>
              <a
                href="/register"
                className="border-2 border-white text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg hover:bg-white hover:text-[#FF5252] transition-all duration-300 hover:scale-105 active:scale-95"
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
                className="rounded-3xl shadow-2xl border-8 border-white/25 object-cover h-[480px] lg:h-[520px] w-full"
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

      {/* Our Story */}
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
                <strong>Tryde changes the game:</strong> direct connections, fair earnings, full control over menu & pricing, and stronger customer relationships.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Chef preparing fresh food"
                className="w-full h-64 sm:h-80 lg:h-[420px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-white">
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
                className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <item.icon className="text-[#FF5252] text-5xl sm:text-6xl mx-auto mb-5 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-base sm:text-lg">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[#FF5252] to-[#e63946] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,white_0%,transparent_50%)]" />
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
                <p className="text-5xl sm:text-6xl md:text-7xl font-extrabold drop-shadow-lg">{stat.number}</p>
                <p className="text-xl sm:text-2xl mt-4 font-medium opacity-90">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 bg-white">
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
              className="bg-[#FF5252] text-white px-10 sm:px-12 py-5 sm:py-6 rounded-2xl text-lg sm:text-xl font-bold shadow-xl hover:bg-[#e63946] transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse-slow"
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