import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState(0); // First one open by default

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
  ];

  // Section entrance
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Stagger for left & right columns
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

  // Accordion item variants
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
      className="w-full py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white font-['Poppins'] overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <motion.div
          className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* LEFT IMAGE + OVERLAY */}
          <motion.div
            className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-2xl h-[480px] md:h-[520px]"
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
              <button className="bg-[#FF5252] px-7 py-4 rounded-full font-semibold flex items-center gap-3 hover:bg-[#e04545] transition-colors shadow-lg">
                Start Partnering <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>

          {/* RIGHT FAQ */}
          <div className="lg:col-span-7">
            <motion.h1
              className="text-4xl md:text-5xl font-extrabold mb-5 text-gray-900"
              variants={childVariants}
            >
              Frequently Asked Questions
            </motion.h1>
            <motion.p
              className="text-gray-600 text-lg md:text-xl mb-10 max-w-2xl"
              variants={childVariants}
            >
              Everything you need to know before joining Tryde as a restaurant partner.
            </motion.p>

            <div className="space-y-4">
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
                    className={`rounded-2xl border overflow-hidden transition-all duration-300 shadow-sm
                      ${isOpen ? "bg-[#FF5252] text-white shadow-xl border-[#FF5252]" : "bg-white text-gray-900 border-gray-200 hover:border-gray-300"}
                    `}
                  >
                    {/* Question */}
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none"
                    >
                      <span className={`text-lg md:text-xl font-semibold ${isOpen ? "text-white" : "text-gray-900"}`}>
                        {faq.q}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      >
                        <ChevronDown size={26} className={isOpen ? "text-white" : "text-gray-600"} />
                      </motion.div>
                    </button>

                    {/* Answer - AnimatePresence for smooth mount/unmount */}
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