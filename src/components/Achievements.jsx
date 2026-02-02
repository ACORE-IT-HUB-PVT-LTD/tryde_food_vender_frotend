// src/components/Achievements.jsx
import React from "react";
import { motion } from "framer-motion";
import { Handshake, Briefcase, Users, Trophy, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Variants
const headingItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15 + 0.3, duration: 0.8, ease: "easeOut" },
  }),
};

export default function Achievements() {
  const navigate = useNavigate();

  const stats = [
    {
      number: "3,860",
      label: "Satisfied Clients",
      icon: <Handshake size={40} />,
    },
    {
      number: "8,550",
      label: "Projects Completed",
      icon: <Briefcase size={40} />,
    },
    {
      number: "90+",
      label: "Team Members",
      icon: <Users size={40} />,
    },
    {
      number: "180+",
      label: "Awards Win",
      icon: <Trophy size={40} />,
    },
  ];

  return (
    <motion.section
      className="relative w-full py-20 md:py-28 bg-white overflow-hidden font-['Poppins']"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Decorative elements - matching the screenshot arcs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-0 w-64 h-64 md:w-96 md:h-96 rounded-full border-[10px] border-[#FF5252]/10 -translate-x-1/3 translate-y-1/3" />
        <div className="absolute bottom-10 right-0 w-64 h-64 md:w-96 md:h-96 rounded-full border-[10px] border-[#FF5252]/10 translate-x-1/3 -translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 rounded-full border-4 border-[#FF5252]/10 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">
          {/* LEFT SIDE - Text content */}
          <motion.div
            className="lg:w-1/2 text-center lg:text-left"
            variants={itemVariants}
            custom={0}
          >
            <motion.span
              variants={headingItem}
              className="inline-block text-[#FF5252] font-semibold uppercase tracking-wider text-sm md:text-base mb-4"
            >
              ACHIEVEMENTS
            </motion.span>

            <motion.h2
              variants={itemVariants}
              custom={1}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight"
            >
              SOME NUMBER OF OUR
              <br className="hidden sm:block" />
              ACHIEVEMENTS
            </motion.h2>

            <motion.p
              variants={itemVariants}
              custom={2}
              className="text-gray-600 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8"
            >
              Grursus mal suada faci lisis lorem ipsum dolarorit more
              ion consectet elit vesti at bulum nec odio aea the au
              ipsumsm recusandae that dolocons.
            </motion.p>

            <motion.button
              variants={itemVariants}
              custom={3}
              onClick={() => navigate("/get-started")}
              className="inline-flex items-center gap-3 bg-[#FF5252] hover:bg-[#e63939] text-white px-10 py-5 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Get Started
              <ArrowRight size={24} />
            </motion.button>
          </motion.div>

          {/* RIGHT SIDE - Stats */}
          <motion.div
            className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-14 relative z-10"
            variants={itemVariants}
            custom={4}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                custom={index + 5}
                variants={itemVariants}
                className="text-center group"
              >
                {/* Outer ring – light by default, dark red on hover */}
                <div className="relative mx-auto w-44 h-44 md:w-52 md:h-52 mb-6">
                  <div className="absolute inset-0 rounded-full bg-[#FF5252]/10 group-hover:bg-[#c62828] transition-colors duration-500" />

                  {/* Inner white circle with icon */}
                  <div className="absolute inset-0 rounded-full flex items-center justify-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <div className="text-[#FF5252]">{stat.icon}</div>
                    </div>
                  </div>
                </div>

                <div className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-xl md:text-2xl font-bold text-gray-700">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}