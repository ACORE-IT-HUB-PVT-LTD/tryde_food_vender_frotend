import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";

export default function Navbar({
  siteName = "Techify",
  primaryColor = "#FF5252",
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleRegister = () => {
    setMobileMenuOpen(false);
    navigate("/register");
  };

  const navLinks = [
    ["Home", "/"],
    ["Why Partner", "#why"],
    ["Success Stories", "#stories"],
    ["How It Works", "#how"],
    ["FAQ", "#faq"],
  ];

  return (
    <>
      {/* Poppins font import - ye line index.html ke <head> mein daal dena */}
      {/* <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet"> */}

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${
          scrolled
            ? "backdrop-blur-xl bg-black/50 shadow-2xl"
            : "bg-transparent"
        } font-['Poppins']`}
      >
        <div className="max-w-7xl mx-auto px-6 py-6 md:py-7 lg:py-8 flex items-center justify-between">

          {/* Logo */}
          <Link to="/home" className="flex items-center gap-4 group">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center
              text-white font-extrabold text-xl shadow-xl
              transition-transform duration-300 group-hover:scale-110"
              style={{ background: primaryColor }}
            >
              {siteName[0]}
            </div>

            <span className="text-white text-3xl font-extrabold tracking-wide">
              {siteName}
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-10 lg:gap-14 text-white text-xl font-bold pl-16 lg:pl-24">
            {navLinks.map(([label, link]) => (
              <a
                key={label}
                href={link}
                className="
                  relative text-white transition-all duration-300
                  hover:text-[#FF5252]
                  after:content-[''] after:absolute after:left-0 after:-bottom-2
                  after:w-0 after:h-[3px] after:bg-[#FF5252] after:rounded
                  after:transition-all after:duration-500 after:ease-out
                  hover:after:w-full
                "
              >
                {label}
              </a>
            ))}
          </nav>

          {/* CTA - Register button */}
          <button
            onClick={handleRegister}
            className="hidden md:flex items-center gap-3
            px-9 py-3 rounded-full text-lg font-extrabold
            text-white shadow-xl transition-all
            hover:scale-105 active:scale-95"
            style={{ background: primaryColor }}
          >
            Register Now <ArrowRight size={20} />
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <X size={34} /> : <Menu size={34} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 backdrop-blur-xl bg-black/80 border-t border-white/20">
            <nav className="flex flex-col px-6 py-8 gap-8 text-white text-2xl font-bold">
              {navLinks.map(([label, link]) => (
                <a
                  key={label}
                  href={link}
                  onClick={() => setMobileMenuOpen(false)}
                  className="
                    relative inline-block
                    hover:text-[#FF5252] transition-colors duration-300
                    after:content-[''] after:absolute after:left-0 after:-bottom-2
                    after:w-0 after:h-[3px] after:bg-[#FF5252] after:rounded
                    after:transition-all after:duration-500 after:ease-out
                    hover:after:w-full
                  "
                >
                  {label}
                </a>
              ))}

              <button
                onClick={handleRegister}
                className="mt-6 py-4 rounded-full text-xl font-extrabold text-white shadow-xl"
                style={{ background: primaryColor }}
              >
                Register Now
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}