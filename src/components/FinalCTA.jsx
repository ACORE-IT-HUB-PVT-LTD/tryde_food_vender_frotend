import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section 
      className="relative h-[480px] md:h-[580px] lg:h-[680px] w-full flex items-center justify-center overflow-hidden font-['Poppins']"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1686836715835-65af22ea5cd4?w=1920&auto=format&fit=crop&q=85"
          alt="Modern restaurant interior"
          className="w-full h-full object-cover scale-105 brightness-[0.52] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/88" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 sm:px-10 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="mb-8 md:mb-10">
        
        </div>

        {/* Main Heading - Vendor focused */}
        <h1 className="text-white font-extrabold leading-tight mb-10 md:mb-12">
          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl">
            GROW YOUR RESTAURANT
          </div>
          <div className="mt-3 flex items-center justify-center gap-4 text-4xl sm:text-5xl md:text-6xl lg:text-5xl">
            <span className="text-[#FF5252]">ON TRYDE</span>
          
          </div>
        </h1>

        {/* Sub text - clear value for vendors */}
        <p className="text-white/95 text-lg sm:text-xl md:text-2xl mb-10 md:mb-12 max-w-3xl mx-auto font-medium">
          Zero commission for first 30 days • More customers • Easy orders • Fast payouts
        </p>

        {/* Simple clean button */}
        <button
          onClick={() => navigate("/register")}
          className="inline-flex items-center gap-3 px-10 py-4 md:px-14 md:py-5 
                     text-white text-base md:text-lg font-semibold
                     bg-[#FF5252] hover:bg-red-600 
                     rounded-full transition-colors duration-200 shadow-md"
        >
          Register Your Restaurant Now
          <ArrowRight size={22} />
        </button>
      </div>
    </section>
  );
}