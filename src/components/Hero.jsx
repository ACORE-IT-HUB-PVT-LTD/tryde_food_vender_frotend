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
      title: `Partner with ${siteName} Today`,
      subtitle: "Scale Your Restaurant Business Fast",
      highlight: "Reach thousands of hungry customers daily with zero risk — fast onboarding, instant orders, secure weekly payouts.",
      extra: "No setup fees • 24/7 dedicated support • Grow with confidence • Trusted by top restaurants across India",
    },
    {
      title: "Zero Risk – 100% Growth",
      subtitle: "0% Commission for First 30 Days",
      highlight: "Test the platform completely risk-free. Enjoy lightning-fast delivery, real-time analytics, dedicated support — keep every rupee you earn while growing your business.",
      extra: "Join 50,000+ happy partners • Secure & transparent • Boost revenue effortlessly",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8500);

    return () => clearInterval(timer);
  }, []);

  const current = slides[currentSlide];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.25 } },
  };

  const titleAnim = {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  const subtitleAnim = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.9, delay: 0.3 } },
  };

  const highlightAnim = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, delay: 0.5 } },
  };

  const extraAnim = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.7 } },
  };

  const buttonAnim = {
    hidden: { opacity: 0, y: 70 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.9 } },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden pt-16 md:pt-20 font-['Poppins']">
      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover scale-[1.02] transition-transform duration-[18s] ease-in-out"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src="./herovideo.mp4" type="video/mp4" />
          Sorry, your browser doesn't support embedded videos.
        </video>

        {/* Stronger, elegant overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/75 to-black/90" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
        <motion.div
          key={`slide-${currentSlide}`}
          variants={container}
          initial="hidden"
          animate="visible"
          className="space-y-10 md:space-y-14"
        >
          {/* Main Title */}
          <motion.h1
            variants={titleAnim}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-2xl"
          >
            <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent drop-shadow-lg">
              {current.title}
            </span>
            <br className="hidden sm:block" />
            <motion.span
              variants={subtitleAnim}
              className="inline-block mt-6 md:mt-8 px-8 py-5 bg-black/50 backdrop-blur-xl rounded-2xl text-[#FF5252] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold shadow-2xl border border-[#FF5252]/40"
            >
              {current.subtitle}
            </motion.span>
          </motion.h1>

          {/* Highlight */}
          <motion.p
            variants={highlightAnim}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium max-w-5xl mx-auto leading-relaxed drop-shadow-xl opacity-95"
          >
            {current.highlight}
          </motion.p>

          {/* Extra motivational text */}
          <motion.p
            variants={extraAnim}
            className="text-base sm:text-lg md:text-xl font-light max-w-4xl mx-auto opacity-90 leading-relaxed drop-shadow-md"
          >
            {current.extra}
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={buttonAnim} className="pt-10 md:pt-14">
            <motion.button
              onClick={() => navigate("/register")}
              className="
                group relative inline-flex items-center gap-5
                bg-gradient-to-r from-[#FF5252] via-[#f97316] to-[#e11d48]
                text-white px-12 py-6 rounded-full text-xl md:text-2xl font-bold
                shadow-2xl hover:shadow-[0_30px_60px_rgba(255,82,82,0.6)]
                transition-all duration-500 overflow-hidden
                hover:scale-105 active:scale-95
              "
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Join as a Partner Now</span>
              <ArrowRight size={32} className="relative z-10 group-hover:translate-x-4 transition-transform" />

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}