import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PartnerHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      title: "Are you ready to reach more customers?",
      description:
        "Don't miss out on potential earnings! By joining our platform, you can reach a wider audience, attract new customers, and increase your revenue. Our tools help you showcase your menu, manage orders efficiently, and build a loyal customer base, so you can focus on what you do best — serving great food.",
      image:
        "https://media.istockphoto.com/id/1576619032/photo/exquisite-indian-cuisine-flavorful-curries-to-colorful-thali-platters.jpg?s=612x612&w=0&k=20&c=Eb4l6RzZz3HG5haT18kP4VOl5h81WWNUwzTpGk5dixQ=",
    },
    {
      title: "Grow your restaurant faster",
      description:
        "Experience real growth with more visibility and more orders. Our platform helps you get noticed by hungry customers nearby, streamline your operations, and receive weekly payouts for your convenience. Partnering with us means less hassle, more exposure, and the opportunity to expand your restaurant business faster than ever before.",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200",
    },
    {
      title: "Easy & fast onboarding",
      description:
        "Getting started has never been easier. Submit your restaurant details, get verified quickly, and start receiving orders within days, not weeks. Our simple onboarding process ensures that you can start growing your business immediately, while our support team is always ready to assist you every step of the way.",
      image:
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1200",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative min-h-screen bg-white font-['Poppins'] overflow-hidden">
      {/* ─── Decorative rings ──────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-0 w-64 h-64 md:w-96 md:h-96 rounded-full border-8 md:border-[10px] border-[#FF5252]/10 -translate-x-1/3 translate-y-1/4" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 md:w-96 md:h-96 rounded-full border-8 md:border-[10px] border-[#FF5252]/10 translate-x-1/3 -translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-[#FF5252]/5 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Main content */}
      <div className="relative max-w-[1920px] mx-auto px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-20 py-12 sm:py-16 md:py-20 lg:py-24 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 xl:gap-16 items-center">
          {/* Left – Text */}
          <div className="w-full space-y-5 sm:space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="h-full flex flex-col justify-center">
              <h1
                className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-[64px] font-bold text-gray-900 leading-tight transition-all duration-700 ease-in-out"
                key={currentSlide} // helps React animate / re-render smoothly
              >
                {slides[currentSlide].title}
              </h1>

              <div className="mt-5 sm:mt-6 md:mt-8">
                <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {slides[currentSlide].description}
                </p>
              </div>

              <div className="pt-5 sm:pt-6 md:pt-8 lg:pt-10">
                <button
                  onClick={() => navigate("/register")}
                  className="bg-[#FF5252] hover:bg-[#ff3838] text-white font-bold text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 w-full sm:w-auto"
                >
                  Let's get started!
                </button>
              </div>
            </div>
          </div>

          {/* Right – Image */}
          <div className="w-full flex items-center justify-center lg:justify-end">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[40px] shadow-2xl w-full max-w-[600px] lg:max-w-none lg:w-full">
              <img
                key={currentSlide} // forces re-mount → better fade transition
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-full h-[300px] xs:h-[340px] sm:h-[420px] md:h-[500px] lg:h-[560px] xl:h-[600px] object-cover transition-opacity duration-1000 ease-in-out opacity-0 animate-fadeIn"
              />
            </div>
          </div>
        </div>

        {/* Carousel dots + arrows */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 mt-8 sm:mt-10 md:mt-12 lg:mt-14">
          <button
            onClick={prevSlide}
            className="p-3 sm:p-4 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200 shadow-md hover:shadow-lg"
            aria-label="Previous slide"
          >
            <ArrowLeft className="text-gray-700 w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          <div className="flex gap-3 sm:gap-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className="focus:outline-none"
                aria-label={`Go to slide ${idx + 1}`}
              >
                <div
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide
                      ? 'bg-[#FF5252] scale-125 shadow-md'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="p-3 sm:p-4 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200 shadow-md hover:shadow-lg"
            aria-label="Next slide"
          >
            <ArrowRight className="text-gray-700 w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        </div>
      </div>

      {/* Fade-in animation for images */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 1s forwards;
        }
      `}</style>
    </section>
  );
}