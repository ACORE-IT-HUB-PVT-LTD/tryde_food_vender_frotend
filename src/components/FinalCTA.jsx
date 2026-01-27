import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FinalCTA({ siteName = "Techify", primaryColor = "#FF5252" }) {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-20 md:py-28 px-5 sm:px-8 overflow-hidden font-['Poppins']">
      
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&auto=format&fit=crop&q=90"
          alt="Restaurant table with food"
          className="w-full h-full object-cover scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/60"></div>
      </div>

      {/* Subtle Glow Effects */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        
        {/* Badge - Updated Design */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-lg px-6 py-3 rounded-full border border-white/30">
            <Sparkles size={18} className="text-yellow-300" />
            <span className="text-sm font-bold text-white tracking-widest">LIMITED TIME OFFER</span>
            <Sparkles size={18} className="text-yellow-300" />
          </div>
        </div>

        {/* Main Heading - Improved Contrast */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
          Ready to 
          <span className="block mt-2 bg-gradient-to-r from-red-400 via-red-500 to-orange-400 bg-clip-text text-transparent">
            Grow Your Restaurant?
          </span>
        </h2>

        {/* Subheading - Better Readability */}
        <p className="text-xl sm:text-2xl mb-10 font-semibold text-white/90">
          <span className="inline-block bg-red-600 text-white px-5 py-2 rounded-xl shadow-lg transform -rotate-1">
            Zero Commission
          </span>
          <span className="ml-3">for 30 Days!</span>
        </p>

        {/* CTA Button - Enhanced */}
        <div className="flex justify-center mb-8">
          <button 
            onClick={() => navigate("/register")}
            className="group relative bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white px-12 py-4 rounded-xl text-lg md:text-xl font-bold shadow-2xl hover:shadow-red-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-3 overflow-hidden border-2 border-white/20"
          >
            {/* Shine Effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            
            <span className="relative z-10">Register Now</span>
            <ArrowRight size={22} className="relative z-10 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        {/* Bottom Text */}
        <p className="text-base text-white/80 font-medium">
          Our team responds within <span className="font-bold text-yellow-300 text-lg">24 hours</span>
        </p>

        {/* Additional Trust Indicators */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/70 text-sm">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            No setup fees
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Cancel anytime
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            500+ restaurants onboarded
          </span>
        </div>
      </div>

      {/* Floating Elements for Visual Interest */}
      <div className="absolute top-10 left-10 w-6 h-6 bg-red-500/20 rounded-full blur-sm animate-bounce"></div>
      <div className="absolute bottom-10 right-10 w-8 h-8 bg-orange-500/20 rounded-full blur-sm animate-bounce delay-500"></div>
    </section>
  );
}