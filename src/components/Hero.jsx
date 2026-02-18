// // src/components/Hero.jsx
// import React, { useState, useEffect } from 'react';
// import { ArrowRight } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';

// export default function Hero({ siteName = "Tryde" }) {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const navigate = useNavigate();

//   const slides = [
//     {
//       title: `Grow with ${siteName}`,
//       highlight: "0% Commission - First 30 Days",
//       subtitle: "Fast onboarding • Instant orders • Weekly payouts",
//     },
//     {
//       title: "Zero Risk Partner Program",
//       highlight: "Join 50,000+ Restaurants",
//       subtitle: "No fees • Dedicated support • Grow easily",
//     },
//   ];

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 6000);

//     return () => clearInterval(timer);
//   }, []);

//   const current = slides[currentSlide];

//   const container = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { duration: 0.8 } },
//   };

//   const item = {
//     hidden: { opacity: 0, x: -40 },
//     visible: { opacity: 1, x: 0, transition: { duration: 0.7 } },
//   };

//   return (
//     <section className="relative min-h-screen flex items-center bg-black overflow-hidden">
//       {/* Background from Unsplash */}
//       <div className="absolute inset-0">
//         <img
//           src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1"
//           alt="Delicious food background"
//           className="w-full h-full object-cover brightness-[0.6] scale-105"
//         />
//         {/* Darker left-side gradient for text readability */}
//         <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-transparent" />
//       </div>

//       {/* Content - Left aligned, simpler & smaller fonts */}
//       <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
//         <motion.div
//           key={currentSlide}
//           variants={container}
//           initial="hidden"
//           animate="visible"
//           className="max-w-lg space-y-5 md:space-y-7"
//         >
//           <motion.h1
//             variants={item}
//             className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white"
//           >
//             {current.title}
//           </motion.h1>

//           <motion.p
//             variants={item}
//             className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent"
//           >
//             {current.highlight}
//           </motion.p>

//           <motion.p
//             variants={item}
//             className="text-base sm:text-lg md:text-xl text-gray-200 font-light"
//           >
//             {current.subtitle}
//           </motion.p>

//           <motion.div variants={item} className="pt-6">
//             <motion.button
//               onClick={() => navigate("/register")}
//               className="
//                 inline-flex items-center gap-2
//                 bg-gradient-to-r from-red-600 to-orange-600
//                 hover:from-red-500 hover:to-orange-500
//                 text-white px-7 py-4 rounded-full text-base sm:text-lg font-semibold
//                 shadow-lg hover:shadow-xl
//                 transition-all duration-300 hover:scale-105 active:scale-95
//               "
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.97 }}
//             >
//               Join Now
//               <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
//             </motion.button>
//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }


// src/components/Hero.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Hero({ siteName = "Tryde" }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const heroRef = useRef(null);

  const slides = [
    {
      title: `Grow with ${siteName}`,
      highlight: "0% Commission",
      highlightSub: "First 30 Days",
      subtitle: "Fast onboarding • Instant orders • Weekly payouts",
      icon: TrendingUp,
      color: "from-[#FF5252] to-[#e03e3e] hover:from-[#e03e3e]"

    },
    {
      title: "Zero Risk Partner Program",
      highlight: "50,000+ Restaurants",
      highlightSub: "Trust Us",
      subtitle: "No fees • Dedicated support • Grow easily",
      icon: Sparkles,
      color: "from-[#FF5252] to-[#e03e3e] hover:from-[#e03e3e]",
    },
  ];

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Mouse move parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    };

    const heroElement = heroRef.current;
    heroElement?.addEventListener('mousemove', handleMouseMove);
    return () => heroElement?.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const current = slides[currentSlide];
  const IconComponent = current.icon;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  const highlightVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center bg-black overflow-hidden font-['Poppins']"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Base Image */}
        <motion.img
          key={currentSlide}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://media.istockphoto.com/id/2117185386/photo/sandwich-one-fresh-big-submarine-sandwich-with-ham-cheese-lettuce-tomatoes-and-microgreens-on.jpg?s=612x612&w=0&k=20&c=TGF0ndDCbSxOoqD7jC8HrsrtX-vNVJPSgGrHw7d8mmk="
          alt="Delicious food background"
          className="w-full h-full object-cover brightness-[0.5]"
          style={{
            transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
          }}
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r ${current.color} rounded-full blur-3xl opacity-20`}
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-[#FF5252] to-[#e03e3e] hover:from-[#e03e3e] rounded-full blur-3xl opacity-15"
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              opacity: 0,
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-3xl space-y-8"
          >
            {/* Icon Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
            >
              <IconComponent className="w-4 h-4 text-[#FF5252]" />
              <span className="text-sm font-medium text-white/90">Partner Program</span>
              <Zap className="w-3 h-3 from-[#FF5252] to-[#e03e3e] hover:from-[#e03e3e]" />
            </motion.div>

            {/* Main Title */}
            <motion.h1
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-3xl lg:text-5xl font-bold leading-[1.1] text-white tracking-tight"
            >
              {current.title}
            </motion.h1>

            {/* Highlight Box */}
            <motion.div
  variants={highlightVariants}
  className="relative inline-block"
>
  <div className="relative px-5 py-3 rounded-xl bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg border border-white/20 overflow-hidden">
    
    {/* Animated Border */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      className={`absolute inset-0 bg-gradient-to-r ${current.color} opacity-20 blur-xl`}
    />

    <div className="relative space-y-0.5">
      <div
        className={`text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r ${current.color} bg-clip-text text-transparent`}
      >
        {current.highlight}
      </div>

      <div className="text-xs sm:text-sm text-white/80 font-semibold">
        {current.highlightSub}
      </div>
    </div>
  </div>
</motion.div>


            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-xl sm:text-2xl md:text-3xl text-gray-300 font-light max-w-2xl leading-relaxed"
            >
              {current.subtitle}
            </motion.p>

            {/* CTA Button */}
            <motion.div 
              variants={itemVariants}
              className="pt-4 flex flex-wrap gap-4 items-center"
            >
              <motion.button
                onClick={() => navigate("/register")}
                className={`
                  group relative inline-flex items-center gap-3
                  bg-gradient-to-r ${current.color}
                  text-white px-8 py-5 rounded-full text-lg font-bold
                  shadow-2xl shadow-orange-500/30
                  overflow-hidden cursor-pointer
                `}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(251, 146, 60, 0.4)" }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Button Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent "
                  animate={{
                    x: ['-200%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                
                <span className="relative z-10">Join Now</span>
                <ArrowRight 
                  size={22} 
                  className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" 
                />
              </motion.button>

              <motion.div
                variants={itemVariants}
                className="flex items-center gap-2 text-white/60 text-sm"
              >
                
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="absolute bottom-10 left-6 sm:left-10 lg:left-16 flex gap-3"
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="group relative"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div
                className={`
                  h-0 rounded-full transition-all duration-500
                  ${index === currentSlide ? 'w-12 bg-gradient-to-r from-[#FF5252] to-[#e03e3e] hover:from-[#e03e3e]' : 'w-8 bg-white/30'}
                `}
              />
              {index === currentSlide && (
                <motion.div
                  layoutId="activeSlide"
                  className="absolute inset-0 bg-white/20 rounded-full blur-md"
                />
              )}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 right-8 sm:right-12 lg:right-16"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-white/50"
        >         
        </motion.div>
      </motion.div>
    </section>
  );
}