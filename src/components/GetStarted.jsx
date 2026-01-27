import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

function FoodpandaLanding() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Are you ready to reach more customers?",
      description: "Don't miss out on potential earnings! By joining our platform, you can reach a wider audience, attract new customers, and increase your revenue. Our tools help you showcase your menu, manage orders efficiently, and build a loyal customer base, so you can focus on what you do best — serving great food.",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1200",
    },
    {
      title: "Grow your restaurant faster",
      description: "Experience real growth with more visibility and more orders. Our platform helps you get noticed by hungry customers nearby, streamline your operations, and receive weekly payouts for your convenience. Partnering with us means less hassle, more exposure, and the opportunity to expand your restaurant business faster than ever before.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200",
    },
    {
      title: "Easy & fast onboarding",
      description: "Getting started has never been easier. Submit your restaurant details, get verified quickly, and start receiving orders within days, not weeks. Our simple onboarding process ensures that you can start growing your business immediately, while our support team is always ready to assist you every step of the way.",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1200",
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
    <>
      {/* Poppins font import - ye line index.html ke <head> mein daal dena */}
      {/* <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet"> */}

      <div className="min-h-screen bg-white font-['Poppins']">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 md:py-24">
          {/* Current Slide */}
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-center">
            {/* Text */}
            <div className="space-y-6 md:space-y-8 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight transition-all duration-500">
                {slides[currentSlide].title}
              </h1>

              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {slides[currentSlide].description}
              </p>

              <div className="pt-4 md:pt-6">
                <button className="bg-[#FF5252] hover:bg-[#ff3838] text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95">
                  Let's get started!
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="relative overflow-hidden shadow-2xl w-full lg:w-[140%]">
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-full h-[380px] sm:h-[480px] lg:h-[560px] object-cover transition-opacity duration-700"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-8 mt-10 md:mt-12">
            <button
              onClick={prevSlide}
              className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={28} className="text-gray-700" />
            </button>

            <div className="flex gap-4">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full ${
                    idx === currentSlide ? 'bg-[#FF5252] scale-125' : 'bg-gray-300'
                  } transition-all`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowRight size={28} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default FoodpandaLanding;