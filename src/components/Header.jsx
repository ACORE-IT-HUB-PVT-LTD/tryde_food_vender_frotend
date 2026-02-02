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
        setVendor(res.data.vendor);
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

        {/* LOGO - triggers popup */}
        <div 
          className="flex-shrink-0 cursor-pointer" 
          onClick={() => setPopupOpen(!popupOpen)}
        >
          <img
            src={logo}
            alt="Restaurant Partner"
            className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 object-contain"
          />
        </div>

        {/* DESKTOP SEARCH */}
        <div className="hidden md:flex items-center flex-grow max-w-xl mx-6 bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-[#FF5252]/40 focus-within:border-[#FF5252] transition-all">
          <FiSearch className="text-gray-500 text-xl mr-3" />
          <input
            type="text"
            placeholder="Search menu, orders, customers..."
            className="flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm"
          />
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-3 md:gap-5">

          {/* Mobile search toggle */}
          <button
            onClick={() => setMobileSearch(!mobileSearch)}
            className="md:hidden p-2.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiSearch className="text-gray-700 text-xl" />
          </button>

          {/* Notification */}
          <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors">
            <BellIcon className="h-6 w-6 text-gray-600 hover:text-[#FF5252] transition-colors" />
          </button>

          {/* Profile Avatar */}
          <div className="relative" ref={popupRef}>
            <button
              onClick={() => setPopupOpen(!popupOpen)}
              className="flex items-center focus:outline-none rounded-full overflow-hidden"
            >
              {vendor?.profile_image ? (
                <img
                  src={vendor.profile_image}
                  alt={vendor.name || "Vendor"}
                  className="h-9 w-9 md:h-10 md:w-10 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                />
              ) : (
                <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-[#FF5252] to-[#e03e3e] text-white flex items-center justify-center font-semibold text-lg shadow-sm">
                  {(vendor?.name?.[0] || "V").toUpperCase()}
                </div>
              )}
            </button>

            {/* ENHANCED ZOMATO-STYLE POPUP */}
            {popupOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200/80 overflow-hidden z-50 animate-fadeIn"
                style={{
                  animation: 'slideDown 0.2s ease-out'
                }}
              >
                {/* Profile Section with Gradient Background */}
                <div className="relative p-5 bg-gradient-to-br from-red-50 via-white to-white border-b border-gray-100">
                  {/* Subtle decorative element */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5252]/5 rounded-full -mr-12 -mt-12"></div>
                  
                  <div className="relative flex items-center gap-4">
                    {vendor?.profile_image ? (
                      <div className="relative group">
                        <img
                          src={vendor.profile_image}
                          alt={vendor.name}
                          className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-lg ring-2 ring-[#FF5252]/20 transition-transform group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="relative group">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF5252] to-[#e03e3e] text-white flex items-center justify-center font-bold text-xl shadow-lg transition-transform group-hover:scale-105">
                          {(vendor?.name?.[0] || "V").toUpperCase()}
                        </div>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate mb-0.5">
                        {vendor?.name || "Vendor"}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {vendor?.email || "No email"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="px-5 py-4 space-y-3.5">
                  {/* Phone */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF5252] to-[#e03e3e] flex items-center justify-center shadow-sm">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Phone Number</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {vendor?.phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
                        vendor?.is_active 
                          ? "bg-gradient-to-br from-green-400 to-green-500" 
                          : "bg-gradient-to-br from-gray-400 to-gray-500"
                      }`}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Account Status</p>
                        <p className={`text-sm font-semibold ${
                          vendor?.is_active ? "text-green-600" : "text-gray-600"
                        }`}>
                          {vendor?.is_active ? "Active" : "Inactive"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="border-t border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
                  <button 
                    onClick={() => {
                      setShowLogoutConfirm(true);
                    }}
                    className="w-full px-5 py-3.5 flex items-center justify-center gap-2.5 text-[#FF5252] hover:text-white font-semibold text-sm transition-all duration-300 hover:bg-gradient-to-r hover:from-[#FF5252] hover:to-[#e03e3e] group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF5252] to-[#e03e3e] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <svg className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <input
              type="text"
              placeholder="Search menu, orders..."
              className="flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm"
            />
          </div>
        </div>
      )}
    </header>

    {/* LOGOUT CONFIRMATION POPUP - Outside header for full screen backdrop */}
    {showLogoutConfirm && (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] animate-fadeIn"
          onClick={() => setShowLogoutConfirm(false)}
        ></div>

        {/* Confirmation Modal */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] w-[90%] max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
            {/* Header with Red Gradient */}
            <div className="bg-gradient-to-r from-[#FF5252] to-[#e03e3e] p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Are you sure?</h3>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <p className="text-gray-700 text-lg mb-6">
                Do you want to logout from your account?
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {/* Cancel Button */}
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 hover:shadow-md"
                >
                  Cancel
                </button>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("vendor");
                    window.location.href = "/login";
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FF5252] to-[#e03e3e] hover:from-[#e03e3e] hover:to-[#c62828] text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )}

    <style jsx>{`
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      
      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      .animate-fadeIn {
        animation: fadeIn 0.2s ease-out;
      }
      
      .animate-scaleIn {
        animation: scaleIn 0.3s ease-out;
      }
    `}</style>
  </>
  );
};

export default Header;