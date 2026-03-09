import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/app_icon.png";

export default function Navbar({ siteName, primaryColor = "#FF5252" }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    ["Home", "home"],
    ["Why Partner", "why"],
    // ["Success Stories", "stories"],
    ["Get Started", "getstarted"],
    ["CTA", "cta"],
    ["About us", "/about-us"],
    ["Contact us", "/contact-us"],
  ];

  // Header scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // IntersectionObserver for sections (only on home page)
  useEffect(() => {
    if (location.pathname !== "/") return;

    const sections = navLinks
      .filter(([, id]) => !id.startsWith("/"))
      .map(([, id]) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [location.pathname]);

  const handleNavClick = (id) => {
    setMobileMenuOpen(false);

    if (id.startsWith("/")) {
      navigate(id);
      return;
    }

    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setActiveSection(id);
      }, 100);
    }
  };

  const isActive = (id) => {
    if (id.startsWith("/")) return location.pathname === id;
    return location.pathname === "/" && activeSection === id;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${scrolled
          ? "backdrop-blur-xl bg-black/80 shadow-2xl border-b border-red-900/30"
          : "bg-black/40 backdrop-blur-sm"}
        font-['Poppins']`}
    >
      <div className="w-full px-6 lg:px-10 py-4 flex items-center justify-between">

        {/* ── LEFT: Logo (always pinned left) ── */}
        <div
          className="flex items-center gap-3 cursor-pointer shrink-0"
          onClick={() => navigate("/")}
        >
          <div className="w-11 h-11 rounded-full overflow-hidden shadow-lg shadow-red-900/40 shrink-0">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-[#FF5252] text-2xl font-extrabold tracking-wide whitespace-nowrap">
            {siteName}
          </span>
        </div>

        {/* ── CENTER: Nav Links (desktop only) ── */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-base lg:text-lg font-semibold">
          {navLinks.map(([label, id]) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className={`relative pb-1 transition-all duration-300 whitespace-nowrap
                ${isActive(id)
                  ? "text-[#FF5252]"
                  : "text-gray-300 hover:text-[#FF5252]"}
                after:content-[''] after:absolute after:left-0 after:-bottom-0.5
                after:h-[2px] after:bg-[#FF5252] after:rounded
                after:transition-all after:duration-300
                ${isActive(id) ? "after:w-full" : "after:w-0 hover:after:w-full"}`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* ── RIGHT: Action Buttons (desktop only) ── */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate("/login")}
            className="border-2 border-[#FF5252] text-[#FF5252] px-5 py-2 rounded-full font-bold text-base
              hover:bg-[#FF5252]/10 transition-all duration-300
              hover:shadow-lg hover:shadow-red-600/30
              hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="bg-[#FF5252] text-white px-5 py-2 rounded-full font-bold text-base
              hover:bg-[#e63939] transition-all duration-300
              hover:shadow-xl hover:shadow-red-600/40
              hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            Register Now
          </button>
        </div>

        {/* ── Mobile Menu Toggle ── */}
        <button
          className="md:hidden text-[#FF5252] p-1 shrink-0"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          {mobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 backdrop-blur-xl bg-black/95 border-t border-red-900/30">
          <nav className="flex flex-col px-6 py-6 gap-6 text-xl font-bold">
            {navLinks.map(([label, id]) => (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                className={`relative text-left pb-1 transition-all duration-300
                  ${isActive(id) ? "text-[#FF5252]" : "text-gray-300 hover:text-[#FF5252]"}
                  after:content-[''] after:absolute after:left-0 after:-bottom-0.5
                  after:h-[2px] after:bg-[#FF5252] after:rounded
                  after:transition-all after:duration-300
                  ${isActive(id) ? "after:w-full" : "after:w-0"}`}
              >
                {label}
              </button>
            ))}

            {/* Mobile Buttons */}
            <div className="flex flex-col gap-3 pt-2 border-t border-red-900/20">
              <button
                onClick={() => { setMobileMenuOpen(false); navigate("/login"); }}
                className="border-2 border-[#FF5252] text-[#FF5252] px-6 py-3 rounded-full font-bold text-lg
                  hover:bg-[#FF5252]/10 transition-all duration-300 text-center cursor-pointer"
              >
                Login
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); navigate("/register"); }}
                className="bg-[#FF5252] text-black px-6 py-3 rounded-full font-bold text-lg
                  hover:bg-[#ff3838] transition-all duration-300
                  hover:shadow-lg hover:shadow-red-600/40 text-center cursor-pointer"
              >
                Register Now
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}