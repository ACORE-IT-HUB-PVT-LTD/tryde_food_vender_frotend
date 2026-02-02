// src/components/FAQ.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState(0);
  const navigate = useNavigate();

  const faqs = [
    {
      q: "How do I register my restaurant on Tryde?",
      a: "Click Register Now, fill restaurant details and upload documents. Verification usually takes 24–72 hours.",
    },
    {
      q: "What documents are required?",
      a: "FSSAI license, GST (if applicable), PAN card, bank details and restaurant photos.",
    },
    {
      q: "How soon can I start receiving orders?",
      a: "Restaurants usually go live within 3–7 days.",
    },
    {
      q: "Is there any registration fee?",
      a: "No, joining Tryde is completely free.",
    },
    {
      q: "When will I receive my payments?",
      a: "Weekly payouts every Monday directly to your bank account.",
    },
    {
      q: "Can I update menu and prices?",
      a: "Yes, updates are instant through the partner dashboard.",
    },
    {
      q: "What is the commission structure on Tryde?",
      a: "Tryde charges a transparent commission of 20-25% on each order (depending on your restaurant category, order value, and location). There are no hidden fees. You keep 75-80% of the order amount after commission. Commission rates are clearly mentioned in your partner agreement before onboarding.",
    },
  ];

  // Heading variant (same as How It Works)
  const headingItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.5,
        type: "spring",
        stiffness: 120,
        damping: 14,
      },
    }),
  };

  return (
    <motion.section
      className="relative w-full py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white font-['Poppins'] overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Background rings */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 md:w-96 md:h-96 rounded-full border-8 md:border-[10px] border-[#FF5252]/10 -translate-x-1/3 translate-y-1/4" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 md:w-96 md:h-96 rounded-full border-8 md:border-[10px] border-[#FF5252]/10 translate-x-1/3 -translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-[#FF5252]/5 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 z-10">
        <motion.div
          className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* LEFT IMAGE */}
          <motion.div
            className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-2xl h-[480px] md:h-[520px] lg:h-auto"
            variants={childVariants}
          >
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=900&auto=format&fit=crop&q=80"
              className="w-full h-full object-cover"
              alt="Restaurant partner with Tryde"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
                Grow faster with Tryde
              </h2>
              <p className="mb-6 text-lg opacity-90">
                Increase online orders and boost revenue.
              </p>
              <button
                className="bg-[#FF5252] px-7 py-4 rounded-full font-semibold flex items-center gap-3 hover:bg-[#e04545] transition-colors shadow-lg"
                onClick={() => navigate("/register")}
              >
                Start Partnering <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>

          {/* RIGHT FAQ */}
          <div className="lg:col-span-7">
            {/* Heading bilkul "How It Works" jaisa - full form */}
            <motion.span
              variants={headingItem}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex items-center gap-2 text-[#FF5252] font-semibold mb-4 uppercase tracking-wide text-sm md:text-base"
            >
              Frequently Asked Questions
            </motion.span>

            {/* Description (agar nahi chahiye toh hata sakte ho) */}
            <motion.p
              className="text-gray-600 text-lg md:text-xl mb-8 max-w-2xl"
              variants={childVariants}
            >
              Everything you need to know before joining Tryde as a restaurant partner.
            </motion.p>

            {/* Accordion - bilkul heading ke niche se shuru (gap zero) */}
            <div className="space-y-4 mt-0 pt-0">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className={`group rounded-2xl border overflow-hidden transition-all duration-300 ease-in-out
                      ${isOpen 
                        ? "bg-[#FF5252] text-white shadow-2xl border-[#FF5252]" 
                        : "bg-white text-gray-900 border-gray-200 hover:border-[#FF5252]/70 hover:bg-[#FF5252]/5 hover:shadow-2xl hover:scale-[1.015]"
                      }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none cursor-pointer transition-all duration-300"
                    >
                      <span 
                        className={`text-lg md:text-xl font-semibold transition-colors duration-300
                          ${isOpen ? "text-white" : "text-gray-900 group-hover:text-[#FF5252]"}`}
                      >
                        {faq.q}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      >
                        <ChevronDown 
                          size={26} 
                          className={`transition-colors duration-300 ${
                            isOpen ? "text-white" : "text-gray-600 group-hover:text-[#FF5252]"
                          }`} 
                        />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6">
                            <p className="text-white/95 text-base md:text-lg leading-relaxed">
                              {faq.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}