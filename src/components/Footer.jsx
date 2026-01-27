import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
} from "lucide-react";

export default function Footer() {
  return (
    <>
      {/* Poppins font import - ye line index.html ke <head> mein daal dena */}
      {/* <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet"> */}

      <footer className="relative bg-gradient-to-b from-[#fff0f0] to-[#ffe6e6] text-gray-800 pt-20 pb-12 px-6 overflow-hidden font-['Poppins']">

        {/* Soft top glow / accent line */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#FF5252]/10 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16 relative z-10">

          {/* BRAND / About */}
          <div>
            <h2 className="text-5xl font-extrabold mb-6 text-[#FF5252] tracking-tight">
              Tryde
            </h2>

            <p className="text-gray-700 leading-relaxed text-lg">
              Tryde helps restaurants grow faster by increasing online orders,
              improving visibility and boosting revenue.  
              Partner with us to reach more customers seamlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div className="group">
            <h3 className="
              text-2xl font-bold mb-6 text-gray-900 
              relative inline-block pb-2
              after:content-[''] after:absolute after:left-0 after:-bottom-2
              after:w-0 after:h-[3px] after:bg-[#FF5252] after:rounded
              after:transition-all after:duration-500 after:ease-out
              group-hover:after:w-full
            ">
              Quick Links
            </h3>

            <ul className="space-y-4 text-lg">
              {["Home", "About Us", "FAQ", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(" ", "")}`}
                    className="group flex items-center gap-2 text-gray-700 hover:text-[#FF5252] transition-colors duration-300"
                  >
                    <span className="text-[#FF5252] font-bold">→</span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="group">
            <h3 className="
              text-2xl font-bold mb-6 text-gray-900 
              relative inline-block pb-2
              after:content-[''] after:absolute after:left-0 after:-bottom-2
              after:w-0 after:h-[3px] after:bg-[#FF5252] after:rounded
              after:transition-all after:duration-500 after:ease-out
              group-hover:after:w-full
            ">
              Services
            </h3>

            <ul className="space-y-4 text-lg">
              {[
                "Pricing",
                "Testimonials",
                "Customer Support",
                "Products & Services",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="group flex items-center gap-2 text-gray-700 hover:text-[#FF5252] transition-colors duration-300"
                  >
                    <span className="text-[#FF5252] text-xl font-bold">›</span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful */}
          <div className="group">
            <h3 className="
              text-2xl font-bold mb-6 text-gray-900 
              relative inline-block pb-2
              after:content-[''] after:absolute after:left-0 after:-bottom-2
              after:w-0 after:h-[3px] after:bg-[#FF5252] after:rounded
              after:transition-all after:duration-500 after:ease-out
              group-hover:after:w-full
            ">
              Useful
            </h3>

            <ul className="space-y-4 text-lg">
              {[
                "Newsletter",
                "Partnerships",
                "Privacy Policy",
                "Terms and Conditions",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="group flex items-center gap-2 text-gray-700 hover:text-[#FF5252] transition-colors duration-300"
                  >
                    <span className="text-[#FF5252] text-xl font-bold">›</span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Social + Newsletter + Copyright */}
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-red-200/50">

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">

            {/* Social icons */}
            <div className="flex gap-5">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="
                    flex items-center justify-center w-11 h-11 rounded-full
                    bg-[#FF5252]
                    text-white
                    hover:bg-[#ff6b6b]
                    hover:scale-110
                    transition-all duration-300 shadow-sm
                  "
                  aria-label={`Follow on ${Icon.name}`}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="flex items-center gap-3 text-gray-700 text-lg">
              <Mail size={22} className="text-[#FF5252]" />
              <span>Subscribe to our newsletter</span>
            </div>

          </div>

          {/* Copyright */}
          <div className="mt-10 text-center text-gray-600 text-base">
            © {new Date().getFullYear()} Tryde. All rights reserved.
          </div>
        </div>

      </footer>
    </>
  );
}