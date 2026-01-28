import React, { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/app_icon.png"
export default function Navbar({ siteName, primaryColor }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
   const navigate = useNavigate();

  const navLinks = [
    ["Home", "home"],
    ["Why Partner", "why"],
    ["Success Stories", "stories"],
    ["How It Works", "how"],
    ["FAQ", "faq"],
    ["Get Started", "getstarted"],
    ["CTA", "cta"],
    // ["Download", "doawnload"],
  ];

  // Header scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // IntersectionObserver for sections
  useEffect(() => {
    const sections = navLinks.map(([, id]) => document.getElementById(id));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px" } // triggers when section is in middle
    );

    sections.forEach((section) => section && observer.observe(section));

    return () => {
      sections.forEach((section) => section && observer.unobserve(section));
    };
  }, []);

  // Scroll to section on click
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth" });
      navigate(`#${id}`, { replace: true }); 

    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${scrolled ? "backdrop-blur-xl bg-black/50 shadow-2xl" : "bg-transparent"}
        font-['Poppins']`}
    >
      <div className="max-w-7xl mx-auto px-6 py-6 md:py-7 lg:py-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4 group" onClick={()=>navigate("/")}>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-extrabold text-xl shadow-xl"
            // style={{ background: primaryColor }}
          >
            {/* {siteName[0]} */}
            <img src={logo} alt=""/>
          </div>
          <span className="text-white text-3xl font-extrabold tracking-wide">{siteName}</span>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-10 lg:gap-14 text-xl font-bold pl-16 lg:pl-24">
          {navLinks.map(([label, id]) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`relative transition-all duration-300 ${
                activeSection === id ? "text-[#FF5252]" : "text-white"
              } after:content-[''] after:absolute after:left-0 after:-bottom-2 after:h-[3px] after:bg-[#FF5252] after:rounded after:transition-all ${
                activeSection === id ? "after:w-full" : "after:w-0"
              } hover:text-[#FF5252] hover:after:w-full`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Mobile Menu */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          {mobileMenuOpen ? <X size={34} /> : <Menu size={34} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 backdrop-blur-xl bg-black/80 border-t border-white/20">
          <nav className="flex flex-col px-6 py-8 gap-8 text-2xl font-bold">
            {navLinks.map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`relative transition-all duration-300 ${
                  activeSection === id ? "text-[#FF5252]" : "text-white"
                } after:content-[''] after:absolute after:left-0 after:-bottom-2 after:h-[3px] after:bg-[#FF5252] after:rounded after:transition-all ${
                  activeSection === id ? "after:w-full" : "after:w-0"
                } hover:text-[#FF5252] hover:after:w-full`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
