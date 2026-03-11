// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import BellIcon from "@heroicons/react/24/outline/BellIcon";
import logo from "../assets/app_icon.png";
import { FiSearch } from "react-icons/fi";
import axiosInstance from "../api/axiosInstance";

const Header = () => {
  const [mobileSearch, setMobileSearch] = useState(false);
  const [vendor, setVendor] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const popupRef = useRef();

  // Fetch vendor profile
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get("/restaurants/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const vendorData = Array.isArray(res.data.vendor)
          ? res.data.vendor[0]
          : res.data.vendor;
        setVendor(vendorData);
      } catch (err) {
        console.error("Failed to fetch vendor profile:", err);
      }
    };
    fetchVendor();
  }, []);

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="bg-white shadow-md px-4 md:px-6 py-3 sticky top-0 z-30 backdrop-blur-sm bg-white/95">
        <div className="flex items-center justify-between max-w-7xl mx-auto">

          {/* LOGO */}
          <div className="flex-shrink-0 cursor-pointer">
            <img src={logo} alt="Restaurant Partner"
              className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 object-contain" />
          </div>

          {/* DESKTOP SEARCH */}
          <div className="hidden md:flex items-center flex-grow max-w-xl mx-6 bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-[#FF5252]/40 focus-within:border-[#FF5252] transition-all">
            <FiSearch className="text-gray-500 text-xl mr-3" />
            <input type="text" placeholder="Search menu, orders, customers..."
              className="flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm" />
          </div>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-3 md:gap-5">

            {/* Mobile search toggle */}
            <button onClick={() => setMobileSearch(!mobileSearch)}
              className="md:hidden p-2.5 rounded-full hover:bg-gray-100 transition-colors">
              <FiSearch className="text-gray-700 text-xl" />
            </button>

            {/* Notification */}
            <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors">
              <BellIcon className="h-6 w-6 text-gray-600 hover:text-[#FF5252] transition-colors" />
            </button>

            {/* Profile Avatar */}
            <div className="relative" ref={popupRef}>
              <button onClick={() => setPopupOpen(!popupOpen)}
                className="flex items-center focus:outline-none rounded-full overflow-hidden">
                {vendor?.profile_image ? (
                  <img src={vendor.profile_image} alt={vendor.name || "Vendor"}
                    className="h-9 w-9 md:h-10 md:w-10 rounded-full object-cover border-2 border-gray-200 shadow-sm" />
                ) : (
                  <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-[#FF5252] to-[#e03e3e] text-white flex items-center justify-center font-semibold text-lg shadow-sm">
                    {(vendor?.name?.[0] || "V").toUpperCase()}
                  </div>
                )}
              </button>

              {/* ── POPUP ── */}
              {popupOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                  style={{ animation: "slideDown 0.2s ease-out" }}
                >
                  {/* Profile Section */}
                  <div className="flex flex-col items-center px-6 py-6 bg-gradient-to-br from-red-50 to-white">

                    {/* Avatar */}
                    {vendor?.profile_image ? (
                      <img
                        src={vendor.profile_image}
                        alt={vendor.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-[#FF5252]/20"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF5252] to-[#e03e3e] text-white flex items-center justify-center font-bold text-3xl shadow-lg border-4 border-white">
                        {(vendor?.name?.[0] || "V").toUpperCase()}
                      </div>
                    )}

                    {/* Name */}
                    <h3 className="mt-3 text-base font-bold text-gray-900 text-center">
                      {vendor?.name || "Vendor"}
                    </h3>

                    {/* Email */}
                    <p className="text-xs text-gray-500 text-center mt-0.5 truncate w-full px-2">
                      {vendor?.email || "—"}
                    </p>

                    {/* Role + Status badges */}
                    <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FF5252]/10 text-[#FF5252] uppercase">
                        {vendor?.role || "VENDOR"}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        vendor?.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : vendor?.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {vendor?.status || "—"}
                      </span>
                    </div>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100">
                    <button
                      onClick={() => { setPopupOpen(false); setShowLogoutConfirm(true); }}
                      className="w-full px-5 py-3.5 flex items-center justify-center gap-2.5 text-[#FF5252] hover:text-white font-semibold text-sm transition-all duration-300 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF5252] to-[#e03e3e] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <svg className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="relative z-10">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        {mobileSearch && (
          <div className="md:hidden mt-3 mx-2 bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-[#FF5252]/40 focus-within:border-[#FF5252] transition-all">
            <div className="flex items-center">
              <FiSearch className="text-gray-500 text-xl mr-3" />
              <input type="text" placeholder="Search menu, orders..."
                className="flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm" />
            </div>
          </div>
        )}
      </header>

      {/* LOGOUT CONFIRMATION */}
      {showLogoutConfirm && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] animate-fadeIn"
            onClick={() => setShowLogoutConfirm(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] w-[90%] max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
              <div className="bg-gradient-to-r from-[#FF5252] to-[#e03e3e] p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Are you sure?</h3>
              </div>
              <div className="p-6 text-center">
                <p className="text-gray-700 text-lg mb-6">Do you want to logout from your account?</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200">
                    Cancel
                  </button>
                  <button onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("vendor");
                    window.location.href = "/login";
                  }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FF5252] to-[#e03e3e] hover:from-[#e03e3e] hover:to-[#c62828] text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-105">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn  { animation: fadeIn  0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      `}</style>
    </>
  );
};

export default Header;