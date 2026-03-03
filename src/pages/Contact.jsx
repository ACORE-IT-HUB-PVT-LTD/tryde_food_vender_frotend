// src/pages/ContactUs.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ContactUs() {
  const siteName = "Tryde";
  const primaryColor = "#FF5252";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., integrate with backend API for vendor inquiries)
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <div className="font-['Poppins'] bg-gray-50 min-h-screen">
      {/* Navbar */}
      <Navbar siteName={siteName} primaryColor={primaryColor} />

      {/* Hero Section – light theme like About Us */}
      <section className="relative min-h-[70vh] sm:min-h-[85vh] flex items-center bg-gradient-to-br from-red-50 via-white to-red-50 text-gray-900 overflow-hidden pt-20 sm:pt-24 lg:pt-28">
        {/* Decorative Blobs – soft red tint */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-20 -left-20 sm:-top-40 sm:-left-40 w-[300px] xs:w-[400px] sm:w-[500px] md:w-[600px] lg:w-[800px] h-[300px] xs:h-[400px] sm:h-[500px] md:h-[600px] lg:h-[800px] bg-[#FF5252]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -right-16 sm:-bottom-60 sm:-right-60 w-[400px] xs:w-[500px] sm:w-[600px] md:w-[700px] lg:w-[900px] h-[400px] xs:h-[500px] sm:h-[600px] md:h-[700px] lg:h-[900px] bg-[#FF5252]/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 xs:px-5 sm:px-8 lg:px-12 py-12 xs:py-14 sm:py-16 md:py-20 grid lg:grid-cols-2 gap-8 xs:gap-10 lg:gap-16 items-center z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center lg:text-left"
          >
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
              Get in <span className="text-[#FF5252]">Touch</span>
            </h1>
            <p className="mt-4 xs:mt-5 sm:mt-6 text-base xs:text-lg sm:text-xl md:text-2xl max-w-xl mx-auto lg:mx-0 text-gray-700">
              Have questions about joining Tryde? Want to add your restaurant or become a vendor? We'd love to hear from you. Our team is ready to help you start delivering food online and grow your business.
            </p>

            <div className="mt-6 xs:mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 xs:gap-4 sm:gap-6 justify-center lg:justify-start">
              <a
                href="#contact-form"
                className="bg-[#FF5252] text-white px-6 xs:px-8 sm:px-10 py-3 xs:py-4 sm:py-5 rounded-2xl font-bold text-sm xs:text-base sm:text-lg shadow-xl hover:bg-red-600 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Send Message
              </a>
              <a
                href="tel:+918889990000"
                className="border-2 border-[#FF5252] text-[#FF5252] px-6 xs:px-8 sm:px-10 py-3 xs:py-4 sm:py-5 rounded-2xl font-bold text-sm xs:text-base sm:text-lg hover:bg-[#FF5252] hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Call Us Now
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
                src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Contact us - Vendor support team at Tryde"
                className="rounded-3xl shadow-2xl border-8 border-white/40 object-cover h-[400px] md:h-[480px] lg:h-[520px] w-full"
              />
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute -bottom-6 -right-6 bg-white/95 backdrop-blur-sm p-4 xs:p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-100"
              >
                <p className="text-[#FF5252] font-extrabold text-2xl xs:text-3xl sm:text-4xl">24/7</p>
                <p className="text-gray-800 font-medium text-sm xs:text-base">Vendor Support Available</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 xs:py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 xs:px-5 sm:px-8 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-5 xs:gap-6 sm:gap-8"
          >
            {[
              { 
                icon: FaPhone, 
                title: "Call Us", 
                info: "+91 888 999 0000",
                subInfo: "Mon-Sat, 9AM-7PM",
                link: "tel:+918889990000"
              },
              { 
                icon: FaEnvelope, 
                title: "Email Us", 
                info: "support@tryde.com",
                subInfo: "24/7 Response",
                link: "mailto:support@tryde.com"
              },
              { 
                icon: FaMapMarkerAlt, 
                title: "Visit Us", 
                info: "123 Food Street",
                subInfo: "Mumbai, India 400001",
                link: "#"
              },
              { 
                icon: FaClock, 
                title: "Working Hours", 
                info: "Mon - Sat",
                subInfo: "9:00 AM - 7:00 PM",
                link: "#"
              },
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.link}
                variants={fadeInUp}
                className="bg-gray-50 p-5 xs:p-6 sm:p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100 text-center"
              >
                <item.icon className="text-[#FF5252] text-4xl xs:text-5xl sm:text-6xl mx-auto mb-4 xs:mb-5 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-2 xs:mb-3">{item.title}</h3>
                <p className="text-gray-800 text-sm xs:text-base sm:text-lg font-semibold">{item.info}</p>
                <p className="text-gray-600 text-xs xs:text-sm sm:text-base mt-1 xs:mt-2">{item.subInfo}</p>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-12 xs:py-16 sm:py-20 md:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 xs:px-5 sm:px-8 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-10 xs:mb-12 sm:mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl xs:text-4xl sm:text-5xl font-extrabold text-gray-900">
              Send Us a Message
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 xs:mt-5 text-base xs:text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Fill out the form below to inquire about adding your restaurant, becoming a vendor, or any other questions. Our team will get back to you within 24 hours.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 xs:gap-10 lg:gap-16 items-start">
            {/* Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white p-6 xs:p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100"
            >
              {submitted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-10 xs:py-12"
                >
                  <div className="w-16 xs:w-20 h-16 xs:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-5 xs:mb-6">
                    <svg className="w-8 xs:w-10 h-8 xs:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-2 xs:mb-3">Message Sent!</h3>
                  <p className="text-base xs:text-lg text-gray-600">We'll get back to you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 xs:space-y-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 xs:mb-2 text-sm xs:text-base sm:text-lg">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 xs:px-5 py-3 xs:py-4 border-2 border-gray-200 rounded-xl focus:border-[#FF5252] focus:outline-none transition-all text-sm xs:text-base sm:text-lg"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 xs:mb-2 text-sm xs:text-base sm:text-lg">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 xs:px-5 py-3 xs:py-4 border-2 border-gray-200 rounded-xl focus:border-[#FF5252] focus:outline-none transition-all text-sm xs:text-base sm:text-lg"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 xs:mb-2 text-sm xs:text-base sm:text-lg">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 xs:px-5 py-3 xs:py-4 border-2 border-gray-200 rounded-xl focus:border-[#FF5252] focus:outline-none transition-all text-sm xs:text-base sm:text-lg"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 xs:mb-2 text-sm xs:text-base sm:text-lg">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 xs:px-5 py-3 xs:py-4 border-2 border-gray-200 rounded-xl focus:border-[#FF5252] focus:outline-none transition-all text-sm xs:text-base sm:text-lg"
                      placeholder="How can we help with your restaurant?"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 xs:mb-2 text-sm xs:text-base sm:text-lg">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 xs:px-5 py-3 xs:py-4 border-2 border-gray-200 rounded-xl focus:border-[#FF5252] focus:outline-none transition-all resize-none text-sm xs:text-base sm:text-lg"
                      placeholder="Tell us more about your restaurant or vendor inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#FF5252] text-white px-6 xs:px-8 py-4 xs:py-5 rounded-xl text-base xs:text-lg sm:text-xl font-bold shadow-xl hover:bg-red-600 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </motion.div>

            {/* Map & Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="space-y-6 xs:space-y-8"
            >
              {/* Google Maps */}
              <div className="rounded-3xl overflow-hidden shadow-2xl h-56 xs:h-64 sm:h-80 lg:h-[320px] border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.8936555937196!2d72.87765431490193!3d19.01441978712079!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cee2e0c7e1a9%3A0x5e3e3e3e3e3e3e3e!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Tryde Office Location"
                />
              </div>

              {/* FAQ Quick Links */}
              <div className="bg-white p-6 xs:p-8 rounded-3xl shadow-xl border border-gray-100">
                <h3 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-5 xs:mb-6">Quick Links</h3>
                <ul className="space-y-3 xs:space-y-4">
                  {[
                    "How to become a vendor?",
                    "Pricing & Commissions",
                    "Technical Support",
                    "Partnership Opportunities",
                  ].map((link, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-base xs:text-lg text-gray-700 hover:text-[#FF5252] transition-colors flex items-center gap-2 xs:gap-3 group"
                      >
                        <span className="w-1.5 xs:w-2 h-1.5 xs:h-2 bg-[#FF5252] rounded-full group-hover:scale-150 transition-transform" />
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 xs:p-8 rounded-3xl shadow-xl border border-red-100">
                <h3 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-5 xs:mb-6">Follow Us</h3>
                <div className="flex gap-4 xs:gap-5">
                  {[
                    { icon: FaFacebookF, link: "#" },
                    { icon: FaTwitter, link: "#" },
                    { icon: FaInstagram, link: "#" },
                    { icon: FaLinkedinIn, link: "#" },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.link}
                      className="w-12 xs:w-14 h-12 xs:h-14 bg-white rounded-full flex items-center justify-center text-[#FF5252] hover:bg-[#FF5252] hover:text-white transition-all duration-300 hover:scale-110 shadow-sm"
                    >
                      <social.icon className="text-xl xs:text-2xl" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 xs:py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 xs:px-5 sm:px-8 lg:px-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900"
          >
            Ready to Transform Your Food Business?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-4 xs:mt-5 sm:mt-6 text-base xs:text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Join thousands of restaurants, cloud kitchens, and food vendors already growing with Tryde. Add your restaurant, start delivering online with zero commission and full control.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-8 xs:mt-10 sm:mt-12"
          >
            <a
              href="/register"
              className="inline-block bg-[#FF5252] text-white px-8 xs:px-10 sm:px-12 py-4 xs:py-5 sm:py-6 rounded-2xl text-base xs:text-lg sm:text-xl font-bold shadow-xl hover:bg-red-600 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Start Your Journey Today
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer siteName={siteName} />
    </div>
  );
}