// src/components/Hero.jsx
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Hero({ siteName = "Tryde" }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      title: `Grow with ${siteName}`,
      highlight: "0% Commission - First 30 Days",
      subtitle: "Fast onboarding • Instant orders • Weekly payouts",
    },
    {
      title: "Zero Risk Partner Program",
      highlight: "Join 50,000+ Restaurants",
      subtitle: "No fees • Dedicated support • Grow easily",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const current = slides[currentSlide];

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  };

  const item = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7 } },
  };

  return (
    <section className="relative min-h-screen flex items-center bg-black overflow-hidden">
      {/* Background from Unsplash */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1"
          alt="Delicious food background"
          className="w-full h-full object-cover brightness-[0.6] scale-105"
        />
        {/* Darker left-side gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-transparent" />
      </div>

      {/* Content - Left aligned, simpler & smaller fonts */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <motion.div
          key={currentSlide}
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-lg space-y-5 md:space-y-7"
        >
          <motion.h1
            variants={item}
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white"
          >
            {current.title}
          </motion.h1>

          <motion.p
            variants={item}
            className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent"
          >
            {current.highlight}
          </motion.p>

          <motion.p
            variants={item}
            className="text-base sm:text-lg md:text-xl text-gray-200 font-light"
          >
            {current.subtitle}
          </motion.p>

          <motion.div variants={item} className="pt-6">
            <motion.button
              onClick={() => navigate("/register")}
              className="
                inline-flex items-center gap-2
                bg-gradient-to-r from-red-600 to-orange-600
                hover:from-red-500 hover:to-orange-500
                text-white px-7 py-4 rounded-full text-base sm:text-lg font-semibold
                shadow-lg hover:shadow-xl
                transition-all duration-300 hover:scale-105 active:scale-95
              "
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Join Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}