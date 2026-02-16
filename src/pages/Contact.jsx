// src/pages/ContactUs.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
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
    // Handle form submission logic here
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
              Get in <span className="text-black">Touch</span>
            </h1>
            <p className="mt-5 sm:mt-6 text-lg sm:text-xl md:text-2xl max-w-xl mx-auto lg:mx-0 opacity-95">
              Have questions? Want to partner with us? We'd love to hear from you. Our team is ready to help you grow your food business.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
              <a
                href="#contact-form"
                className="bg-black text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg shadow-2xl hover:bg-gray-900 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Send Message
              </a>
              <a
                href="tel:+918889990000"
                className="border-2 border-white text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg hover:bg-white hover:text-[#FF5252] transition-all duration-300 hover:scale-105 active:scale-95"
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
                alt="Contact us - Customer support team"
                className="rounded-3xl shadow-2xl border-8 border-white/25 object-cover h-[480px] lg:h-[520px] w-full"
              />
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute -bottom-6 -right-6 bg-white/95 backdrop-blur-sm p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-100"
              >
                <p className="text-[#FF5252] font-extrabold text-3xl sm:text-4xl">24/7</p>
                <p className="text-gray-800 font-medium">Support Available</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
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
                className="bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100"
              >
                <item.icon className="text-[#FF5252] text-5xl sm:text-6xl mx-auto mb-5 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 text-center">{item.title}</h3>
                <p className="text-gray-800 text-base sm:text-lg font-semibold text-center">{item.info}</p>
                <p className="text-gray-600 text-sm sm:text-base text-center mt-2">{item.subInfo}</p>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-16 sm:py-20 md:py-28 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-extrabold text-gray-900">
              Send Us a Message
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-5 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Fill out the form below and our team will get back to you within 24 hours.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100"
            >
              {submitted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Message Sent!</h3>
                  <p className="text-lg text-gray-600">We'll get back to you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-base sm:text-lg">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-[#FF5252] focus:outline-none transition-all text-base sm:text-lg"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-base sm:text-lg">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-[#FF5252] focus:outline-none transition-all text-base sm:text-lg"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-base sm:text-lg">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-[#FF5252] focus:outline-none transition-all text-base sm:text-lg"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-base sm:text-lg">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-[#FF5252] focus:outline-none transition-all text-base sm:text-lg"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-base sm:text-lg">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-[#FF5252] focus:outline-none transition-all resize-none text-base sm:text-lg"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#FF5252] text-white px-8 py-5 rounded-xl text-lg sm:text-xl font-bold shadow-xl hover:bg-[#e63946] transition-all duration-300 hover:scale-105 active:scale-95"
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
              className="space-y-8"
            >
              {/* Google Maps */}
              <div className="rounded-3xl overflow-hidden shadow-2xl h-64 sm:h-80 lg:h-[320px]">
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
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Quick Links</h3>
                <ul className="space-y-4">
                  {[
                    "How to become a vendor?",
                    "Pricing & Commissions",
                    "Technical Support",
                    "Partnership Opportunities",
                  ].map((link, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-lg text-gray-700 hover:text-[#FF5252] transition-colors flex items-center gap-3 group"
                      >
                        <span className="w-2 h-2 bg-[#FF5252] rounded-full group-hover:scale-150 transition-transform" />
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-br from-[#FF5252] to-[#e63946] p-8 rounded-3xl shadow-xl text-white">
                <h3 className="text-2xl sm:text-3xl font-bold mb-6">Follow Us</h3>
                <div className="flex gap-5">
                  {[
                    { icon: FaFacebookF, link: "#" },
                    { icon: FaTwitter, link: "#" },
                    { icon: FaInstagram, link: "#" },
                    { icon: FaLinkedinIn, link: "#" },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.link}
                      className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:text-[#FF5252] transition-all duration-300 hover:scale-110 group"
                    >
                      <social.icon className="text-2xl" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Business Hours & Support */}
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
              { title: "Phone Support", info: "Mon-Sat, 9AM-7PM", icon: "📞" },
              { title: "Email Response", info: "Within 24 Hours", icon: "✉️" },
              { title: "Live Chat", info: "24/7 Available", icon: "💬" },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="p-6">
                <div className="text-6xl mb-4">{item.icon}</div>
                <p className="text-2xl sm:text-3xl font-extrabold mb-2">{item.title}</p>
                <p className="text-lg sm:text-xl opacity-90">{item.info}</p>
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
            Ready to Transform Your Food Business?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-5 sm:mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Join thousands of restaurants, cloud kitchens, and food vendors already growing with Tryde. Zero commission, full control.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-10 sm:mt-12"
          >
            <a
              href="/register"
              className="inline-block bg-[#FF5252] text-white px-10 sm:px-12 py-5 sm:py-6 rounded-2xl text-lg sm:text-xl font-bold shadow-xl hover:bg-[#e63946] transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse-slow"
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