import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero({ siteName = "Tryde" }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate()
  const slides = [
    {
      title: `Partner with ${siteName}`,
      subtitle: "Scale Your Food Business Fast",
      highlight: "Connect with thousands of hungry customers every day",
    },
    {
      title: "Zero Risk Trial",
      subtitle: "0% Commission • First 30 Days",
      highlight: "Lightning-fast delivery • Secure weekly payouts • No setup cost",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7200); // ~7.2s per slide — good balance

    return () => clearInterval(timer);
  }, []);

  const current = slides[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden pt-16 md:pt-20 font-['Poppins']">
      {/* Background Video Layer */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover scale-[1.02] transition-transform duration-[18s] ease-in-out"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        // Optional: poster="/assets/poster.jpg"  ← add your poster image here if you have one
        >
          <source src="./herovideo.mp4" type="video/mp4" />
          Sorry, your browser doesn't support embedded videos.
        </video>

        {/* Overlay – stronger in center for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
        <div className="space-y-6 md:space-y-12">

          <h1
            key={`title-${currentSlide}`}
            className="text-2xl sm:text-5xl md:text-4xl lg:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-2xl animate-fade-up"
            style={{ animationDelay: '0.4s' }}
          >
            {current.title}
            <br className="hidden sm:block" />
            <span className="inline-block mt-4 md:mt-6 px-6 py-3 bg-black/40 backdrop-blur-sm rounded-xl text-[#FF5252] text-xl sm:text-2xl md:text-3xl">
              {current.subtitle}
            </span>
          </h1>

          <p
            key={`highlight-${currentSlide}`}
            className="text-lg sm:text-xl md:text-2xl font-medium max-w-4xl mx-auto leading-relaxed drop-shadow-xl opacity-95 animate-fade-up"
            style={{ animationDelay: '0.7s' }}
          >
            {current.highlight}
          </p>

          <div
            key={`btn-${currentSlide}`}
            className="pt-6 md:pt-10 animate-fade-up"
            style={{ animationDelay: '1.1s' }}
          >
            <button
              className="
    group inline-flex items-center gap-4
    bg-white hover:bg-[#FF5252] hover:text-white text-[#FF3366]
    px-8 py-4
    rounded-full text-sm font-bold
    shadow-lg hover:shadow-xl hover:shadow-red-500/30
    transition-all duration-300
    hover:scale-105 active:scale-95
    relative overflow-hidden cursor-pointer
  "
            >
              <span className="relative z-10" onClick={() => navigate("/register")}>Join as a Partner Now</span>
              <ArrowRight
                size={30}
                className="relative z-10 group-hover:translate-x-2 transition-transform"
              />

              {/* Subtle shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>

        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(75px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-up {
          animation: fade-up 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          opacity: 0;
        }

        video {
          will-change: transform;
        }
      `}</style>
    </section>
  );
}