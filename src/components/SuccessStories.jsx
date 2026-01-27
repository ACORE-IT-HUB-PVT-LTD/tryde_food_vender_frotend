import React from "react";
import { motion } from "framer-motion";

export default function SuccessStories() {
  const testimonials = [
    {
      name: "David Lewis",
      role: "Client",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      text:
        "I thought I’d lost my files forever, but they recovered all my data quickly and safely. Fantastic, trustworthy team.",
    },
    {
      name: "Emily Turner",
      role: "Client",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      text:
        "Their service was amazing! Fast turnaround, great price, and my device works like brand new again.",
    },
    {
      name: "Carlos Gomez",
      role: "Client",
      image: "https://randomuser.me/api/portraits/men/76.jpg",
      text:
        "My game console was overheating and unusable. They fixed it within a day. Works flawlessly now.",
    },
    // Duplicates for seamless loop
    ...[
      {
        name: "David Lewis",
        role: "Client",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        text:
          "I thought I’d lost my files forever, but they recovered all my data quickly and safely. Fantastic, trustworthy team.",
      },
      {
        name: "Emily Turner",
        role: "Client",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        text:
          "Their service was amazing! Fast turnaround, great price, and my device works like brand new again.",
      },
      {
        name: "Carlos Gomez",
        role: "Client",
        image: "https://randomuser.me/api/portraits/men/76.jpg",
        text:
          "My game console was overheating and unusable. They fixed it within a day. Works flawlessly now.",
      },
    ],
  ];

  // Variants for stagger animation (heading section)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,      // delay between children
        delayChildren: 0.2,        // initial delay before first child
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <section className="w-full bg-[#FFF1F1] py-28 overflow-hidden font-['Poppins']">
      <div className="w-full px-6 lg:px-24">
        {/* Animated Heading Section */}
        <motion.div
          className="relative text-center mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }} // triggers when 30% in view
        >
          {/* Floating images - stagger child */}
          <motion.div
            className="flex justify-center gap-16 flex-wrap mb-10"
            variants={childVariants}
          >
            {[
              "https://randomuser.me/api/portraits/women/11.jpg",
              "https://randomuser.me/api/portraits/men/22.jpg",
              "https://randomuser.me/api/portraits/women/33.jpg",
              "https://randomuser.me/api/portraits/men/44.jpg",
              "https://randomuser.me/api/portraits/women/55.jpg",
              "https://randomuser.me/api/portraits/men/66.jpg",
            ].map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-20 h-20 rounded-full border-4 border-[#FF5252] object-cover"
                alt=""
              />
            ))}
          </motion.div>

          {/* Small text */}
          <motion.p
            className="tracking-widest text-sm font-semibold text-[#FF5252] mb-4"
            variants={childVariants}
          >
            ● CLIENT TESTIMONIALS
          </motion.p>

          {/* Main heading */}
          <motion.h2
            className="text-4xl md:text-6xl font-bold text-gray-900 max-w-4xl mx-auto leading-tight"
            variants={childVariants}
          >
            Trusted by Thousands of <br /> Happy Clients
          </motion.h2>
        </motion.div>

        {/* Infinite Scrolling Cards */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-10"
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{
              duration: 25,           // adjust for speed (higher = slower)
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {testimonials.map((item, index) => (
              <motion.div
                key={index}
                className="
                  bg-white
                  rounded-3xl
                  p-10
                  text-gray-800
                  relative
                  shadow-xl
                  border border-red-100
                  flex-shrink-0
                  w-[340px] sm:w-[380px] md:w-[420px]
                "
                whileHover={{
                  y: -10,
                  scale: 1.04,
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.2)",
                  transition: { duration: 0.4 },
                }}
              >
                <div className="text-[#FF5252] text-6xl absolute top-8 left-8 leading-none">
                  “
                </div>

                <p className="text-lg text-gray-600 leading-relaxed mt-12 mb-10">
                  {item.text}
                </p>

                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    className="w-14 h-14 rounded-full border-2 border-[#FF5252] object-cover"
                    alt={item.name}
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}