// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { FiSearch, FiX } from "react-icons/fi";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { LuLogOut } from "react-icons/lu";
import { MdVerified } from "react-icons/md";
import axiosInstance from "../api/axiosInstance";

const Header = () => {
  const [mobileSearch, setMobileSearch] = useState(false);
  const [vendor, setVendor] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [hasNewNotif] = useState(true); // you can make dynamic later

  const popupRef = useRef();

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axiosInstance.get("/restaurants/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data?.vendor;
        setVendor(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        console.error("Profile fetch failed:", err);
      }
    };
    fetchVendor();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const firstLetter = (vendor?.name?.[0] || "V").toUpperCase();
  const displayName = vendor?.name || "My Restaurant";

  return (
    <>
      <style jsx global>{`
        .vendor-header {
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        }

        .gradient-red {
          background: linear-gradient(135deg, #e11d48 0%, #f97316 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .btn-icon {
          @apply h-10 w-10 flex items-center justify-center rounded-xl text-gray-700 transition-all duration-200;
        }

        .btn-icon:hover {
          @apply bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md -translate-y-0.5;
        }
      `}</style>

      <header
        className="vendor-header sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm"
        style={{ height: "74px" }}
      >
        <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between max-w-screen-2xl mx-auto md:pl-[260px] transition-all duration-300">
          {/* Left - can be empty or logo */}
          <div className="flex-1 min-w-0" />

          {/* Center - Desktop Search */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders, menu, customers..."
                className="w-full pl-11 pr-20 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition"
              />
              <div className="absolute inset-y-0 right-4 flex items-center hidden lg:flex">
                <kbd className="px-2.5 py-1 text-xs font-mono bg-gray-200/70 rounded text-gray-500">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile search button */}
            <button
              onClick={() => setMobileSearch(!mobileSearch)}
              className="btn-icon md:hidden"
              aria-label="Search"
            >
              {mobileSearch ? <FiX size={20} /> : <FiSearch size={20} />}
            </button>

            {/* Website link */}
            <button className="btn-icon hidden sm:flex" title="View Store">
              <HiOutlineGlobeAlt size={20} />
            </button>

            {/* Notifications */}
            <button className="btn-icon relative" title="Notifications">
              <BellIcon className="h-5 w-5" />
              {hasNewNotif && (
                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            {/* Profile trigger */}
            <div className="relative" ref={popupRef}>
              <button
                onClick={() => setPopupOpen(!popupOpen)}
                className={`flex items-center gap-2.5 sm:gap-3 pl-2 pr-3 sm:pr-5 py-2 rounded-full transition-all duration-200 border ${
                  popupOpen
                    ? "border-rose-400 bg-rose-50/50 shadow-sm"
                    : "border-transparent hover:bg-gray-50"
                }`}
                title={displayName}
              >
                {/* Avatar */}
                {vendor?.profile_image ? (
                  <img
                    src={vendor.profile_image}
                    alt={displayName}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {firstLetter}
                  </div>
                )}

                {/* Name - always visible on desktop, tooltip on mobile */}
                <div className="flex flex-col items-start leading-tight hidden sm:flex">
                  <span className="text-sm font-semibold gradient-red max-w-[160px] truncate">
                    {displayName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {vendor?.status || "Vendor"}
                  </span>
                </div>

                <svg
                  className={`w-4 h-4 text-rose-500 transition-transform hidden sm:block ${
                    popupOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {popupOpen && (
                <div
                  className="absolute right-0 mt-3 w-80 bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden z-50"
                  style={{ animation: "dropdown 0.18s ease-out" }}
                >
                  <div className="p-5 bg-gradient-to-b from-rose-50/70 to-white">
                    <div className="flex items-center gap-4">
                      {vendor?.profile_image ? (
                        <img
                          src={vendor.profile_image}
                          alt=""
                          className="w-14 h-14 rounded-xl object-cover ring-4 ring-white shadow"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white shadow">
                          {firstLetter}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{displayName}</h3>
                        <p className="text-sm text-gray-600 mt-0.5">{vendor?.email || "—"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 border-t">
                    <button
                      onClick={() => {
                        setPopupOpen(false);
                        setShowLogoutConfirm(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <LuLogOut size={18} />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            mobileSearch ? "max-h-20 py-3" : "max-h-0"
          }`}
        >
          <div className="px-4">
            <div className="flex items-center bg-gray-50 border rounded-xl px-4 py-3 gap-3">
              <FiSearch className="text-rose-500 text-xl" />
              <input
                autoFocus
                placeholder="Search..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Logout modal - same as before or simplify */}
      {showLogoutConfirm && (
        // ... your existing modal code ...
        // or use a simple confirm if you want lighter version
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold">Logout?</h3>
            <p className="text-gray-600 mt-2">Are you sure?</p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 bg-gray-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="flex-1 py-3 bg-rose-600 text-white rounded-lg font-medium"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;