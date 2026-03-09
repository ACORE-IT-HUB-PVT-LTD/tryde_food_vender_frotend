import React from 'react';

function FinalCTA() {
  const bgImage = "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1920&auto=format&fit=crop&q=85";

  return (
    <section
      className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: '#fff1f1',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>

      {/* Main wrapper */}
      <div className="relative z-10 w-full max-w-6xl px-5 sm:px-8 md:px-10 lg:px-12 py-16">
        <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between gap-10 lg:gap-16">

          {/* LEFT — Two big lines */}
          <div className="flex flex-col justify-center md:w-5/12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
              Premium Flavors
            </h1>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg mt-1">
               <span className="text-[#FF5252]"> Join Tryde Plate</span>
            </h1>
          </div>

          {/* Vertical divider (desktop only) */}
          <div className="hidden md:block w-px bg-white/20 self-stretch"></div>

          {/* RIGHT — Subheading, content, button */}
          <div className="flex flex-col justify-center md:w-5/12 text-center md:text-left">
            <p className="text-lg sm:text-xl font-semibold text-white mb-3 drop-shadow-md">
              Grow Your Business, On Your Terms
            </p>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-7 drop-shadow-md">
              A vendor platform that values both taste and growth.
              Join today — reach thousands of customers, get fast payouts,
              update your menu with ease, and manage real-time orders,
              all in one place.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-4">
              <a
                href="#"
                className="group inline-flex items-center justify-center gap-2 bg-[#FF5252] hover:bg-[#e63939] text-white font-semibold text-sm md:text-base px-7 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[180px]"
              >
                List Now
                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </a>

              <a
                href="#"
                className="group inline-flex items-center justify-center gap-2 bg-[#FF5252] hover:bg-[#e63939] text-white font-semibold text-sm md:text-base px-7 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[180px]"
              >
                Learn More
                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default FinalCTA;