import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FinalCTA({ siteName = "YourBrand", primaryColor = "#FF5252" }) {
  return (
    <>
      {/* Poppins font import - ye line index.html ke <head> mein daal dena */}
      {/* <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet"> */}

      <section className="relative py-16 md:py-20 px-5 sm:px-8 overflow-hidden font-['Poppins']">
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80"
            alt="Food background"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100/60 via-red-100/70 to-pink-100/60 backdrop-blur-[2px]"></div>
        </div>

        {/* Animated Glow Effects */}
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-300/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-300/40 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full border-2 border-red-300 shadow-lg">
              <Sparkles size={18} className="text-red-500" />
              <span className="text-xs font-bold text-red-600 tracking-wide">LIMITED TIME OFFER</span>
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
            <span className="text-gray-900">Ready to </span>
            <span className="bg-gradient-to-r from-red-500 via-red-600 to-orange-500 bg-clip-text text-transparent">
              grow your restaurant
            </span>
            <span className="text-gray-900">?</span>
          </h2>

          {/* Subheading */}
          <p className="text-lg sm:text-xl md:text-2xl mb-8 font-semibold text-gray-800">
            <span className="inline-block bg-red-500 text-white px-4 py-1.5 rounded-lg shadow-lg transform -rotate-1">
              Zero commission
            </span>
            <span className="ml-2">for 30 days!</span>
          </p>

          {/* CTA Button */}
          <div className="flex justify-center mb-6">
            <button className="group relative bg-gradient-to-r from-red-500 to-red-600 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-base sm:text-lg md:text-xl font-bold shadow-xl hover:shadow-red-400/60 transform hover:scale-105 transition-all duration-300 flex items-center gap-3 overflow-hidden border-2 border-red-400">
              {/* Button Shine Effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              
              <span className="relative z-10">Register Now</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>

          {/* Bottom Text */}
          <p className="text-sm sm:text-base text-gray-700 font-medium">
            Our team responds within <span className="font-bold text-red-500 text-base sm:text-lg">24 hours</span>
          </p>

        </div>
      </section>
    </>
  );
}