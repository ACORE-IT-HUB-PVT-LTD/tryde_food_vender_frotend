import React from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  ShieldCheck,
  Rocket,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: UserPlus,
      title: "Sign Up Your Restaurant",
      desc: "Fill in basic details and submit your restaurant documents to join Tryde quickly.",
    },
    {
      step: "02",
      icon: ShieldCheck,
      title: "Verification & Approval",
      desc: "Our team verifies your restaurant and menu to ensure quality and authenticity.",
    },
    {
      step: "03",
      icon: Rocket,
      title: "Go Live Instantly",
      desc: "Upload your menu, set prices, and start receiving online orders right away.",
    },
    {
      step: "04",
      icon: TrendingUp,
      title: "Grow Your Business",
      desc: "Track sales, manage orders, and receive weekly payouts with analytics support.",
    },
  ];

  // Variants for heading section stagger
  const headingContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.2,
      },
    },
  };

  const headingItem = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Variants for steps cards (staggered entrance)
  const stepsContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,   // beautiful delay between cards
        delayChildren: 0.4,      // slight pause after heading
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.92 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 14,
        duration: 0.9,
      },
    },
  };
  const navigate=useNavigate()
  return (
    <section className="py-28 bg-white w-full overflow-hidden font-['Poppins']">
      {/* ================= TOP CONTENT ================= */}
      <motion.div
        className="w-full grid lg:grid-cols-2 gap-16 px-6 lg:px-24 mb-20 items-center"
        variants={headingContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
      >
        {/* LEFT */}
        <div>
          <motion.span
            className="flex items-center gap-2 text-[#FF5252] font-semibold mb-5 uppercase tracking-wide"
            variants={headingItem}
          >
            How It Works
          </motion.span>

          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight"
            variants={headingItem}
          >
            Add Your Restaurant <br /> and Start Receiving Orders Online
          </motion.h2>
        </div>

        {/* RIGHT */}
        <motion.div variants={headingItem}>
          <p className="text-gray-600 text-lg sm:text-xl max-w-xl mb-8 leading-relaxed">
            Tryde makes it easy for restaurants to go online. Register your restaurant, upload your menu, and start accepting online food orders in just a few steps. Increase your reach and grow your business today.
          </p>

          <button className="group flex items-center gap-3 bg-[#FF5252] text-white px-6 py-2 rounded-full hover:scale-80 transition duration-300 shadow-lg hover:shadow-2xl"  onClick={()=>navigate("/register")}>
            Start Now

            <span className="w-12 h-12 rounded-full bg-white flex items-center justify-center transition-transform duration-300 group-hover:rotate-[-12deg]">
              <ArrowRight size={26} className="text-[#FF5252]" />
            </span>
          </button>
        </motion.div>
      </motion.div>

      {/* ================= BIG STEPS CARD ================= */}
      <div className="w-full px-4 lg:px-16">
        <div
          className="
            w-full
            rounded-[50px]
            px-10 sm:px-14
            py-12 sm:py-16
            bg-gradient-to-br
            from-[#FF5252]/15
            via-[#FF5252]/5
            to-[#FF5252]/15
            backdrop-blur-xl
            border border-white/30 shadow-2xl
          "
        >
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16"
            variants={stepsContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {steps.map((item, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                whileHover={{
                  y: -12,
                  scale: 1.04,
                  transition: { duration: 0.4, ease: "easeOut" },
                }}
                className="
                  relative group
                  bg-white/60 backdrop-blur-sm
                  rounded-3xl p-8 sm:p-10
                  border border-gray-100/80
                  shadow-lg hover:shadow-2xl
                  transition-all duration-400
                "
              >
                {/* STEP NUMBER - floating style */}
                <span className="absolute -top-5 right-6 text-4xl font-black text-[#FF5252]/30 group-hover:text-[#FF5252]/50 transition-colors">
                  {item.step}
                </span>

                {/* ICON */}
                <motion.div
                  className="
                    w-20 h-20 sm:w-24 sm:h-24
                    rounded-3xl bg-[#FF5252]
                    flex items-center justify-center
                    mb-6 sm:mb-8
                    shadow-xl
                  "
                  whileHover={{ scale: 1.12, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <item.icon size={40} className="text-white" />
                </motion.div>

                {/* CONTENT */}
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  {item.title}
                </h3>

                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}