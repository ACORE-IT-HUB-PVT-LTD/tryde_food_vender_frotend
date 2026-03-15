// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import BellIcon from "@heroicons/react/24/outline/BellIcon";
import logo from "../assets/app_icon.png";
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
  const [notifPulse, setNotifPulse] = useState(true);
  const popupRef = useRef();

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarLetter = (vendor?.name?.[0] || "V").toUpperCase();

  return (
    <>
      <header
        className="sticky top-0 z-30 bg-white"
        style={{ height: "60px", display: "flex", flexDirection: "column", justifyContent: "center", borderBottom: "0.5px solid #e5e7eb", borderLeft: "3px solid #E53935" }}
      >


        <div className="flex items-center justify-between px-4 md:px-6 flex-1 max-w-screen-2xl mx-auto w-full">

          {/* ── LOGO ── */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E53935] to-[#FF7043] rounded-xl opacity-10 blur-sm scale-110" />
              <img
                src={logo}
                alt="App Logo"
                className="relative h-9 w-9 md:h-10 md:w-10 object-contain rounded-xl"
              />
            </div>
            {/* ── FIX: both name + subtitle now always visible on sm+ ── */}
            
          </div>

          {/* ── DESKTOP SEARCH ── */}
          <div className="hidden md:flex items-center flex-grow max-w-lg mx-6">
            <div
              className="w-full flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 gap-2.5
                focus-within:bg-white focus-within:border-[#E53935]/50 focus-within:shadow-[0_0_0_3px_rgba(229,57,53,0.08)] transition-all duration-200"
            >
              <FiSearch className="text-gray-400 text-[15px] flex-shrink-0" />
              <input
                type="text"
                placeholder="Search orders, menu items, customers…"
                className="flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-400 text-[13px]"
              />
              <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-200/70 text-gray-400 text-[10px] font-mono flex-shrink-0">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* ── RIGHT ACTIONS ── */}
          <div className="flex items-center gap-1.5 md:gap-2">

            {/* Mobile search toggle */}
            <button
              onClick={() => setMobileSearch(!mobileSearch)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
            >
              {mobileSearch
                ? <FiX className="text-gray-600 text-[17px]" />
                : <FiSearch className="text-gray-600 text-[17px]" />
              }
            </button>

            {/* Website icon */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              title="Visit Website"
              className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-red-50 hover:text-[#E53935] text-gray-500 transition-all duration-200 group"
            >
              <HiOutlineGlobeAlt className="text-[19px] group-hover:scale-110 transition-transform" />
            </a>

            {/* Notification bell */}
            <button
              onClick={() => setNotifPulse(false)}
              className="relative h-9 w-9 flex items-center justify-center rounded-xl hover:bg-red-50 text-gray-500 hover:text-[#E53935] transition-all duration-200 group"
            >
              <BellIcon className="h-[19px] w-[19px] group-hover:scale-110 transition-transform" />
              {notifPulse && (
                <>
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#E53935]" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#E53935] animate-ping opacity-75" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200 mx-1 hidden md:block" />

            {/* ── PROFILE AVATAR + POPUP ── */}
            <div className="relative" ref={popupRef}>
              <button
                onClick={() => setPopupOpen(!popupOpen)}
                className={`flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full border transition-all duration-200 hover:shadow-sm
                  ${popupOpen
                    ? "border-[#E53935]/40 bg-red-50 shadow-[0_0_0_3px_rgba(229,57,53,0.08)]"
                    : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
              >
                {vendor?.profile_image ? (
                  <img
                    src={vendor.profile_image}
                    alt={vendor.name || "Vendor"}
                    className="h-7 w-7 rounded-full object-cover ring-2 ring-white"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#E53935] to-[#FF7043] text-white flex items-center justify-center font-bold text-[13px] ring-2 ring-white flex-shrink-0">
                    {avatarLetter}
                  </div>
                )}

                <div className="hidden md:flex flex-col items-start leading-none">
                  <span className="text-[12.5px] font-semibold text-gray-800 max-w-[90px] truncate">
                    {vendor?.name || "Vendor"}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium capitalize">
                    {(vendor?.role || "vendor").toLowerCase()}
                  </span>
                </div>

                <svg
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 hidden md:block ${popupOpen ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* ── DROPDOWN POPUP ── */}
              {popupOpen && (
                <div
                  className="absolute right-0 mt-2.5 w-72 bg-white rounded-2xl border border-gray-100 z-50 overflow-hidden"
                  style={{
                    boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(229,57,53,0.08)",
                    animation: "dropIn 0.18s cubic-bezier(0.16,1,0.3,1)"
                  }}
                >
                  {/* Profile header */}
                  <div className="relative px-5 pt-6 pb-5 bg-gradient-to-br from-[#fff5f5] via-white to-white">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#E53935]/8 to-transparent rounded-bl-full" />

                    <div className="flex items-center gap-4">
                      {vendor?.profile_image ? (
                        <img
                          src={vendor.profile_image}
                          alt={vendor.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E53935] to-[#FF7043] text-white flex items-center justify-center font-bold text-2xl shadow-md border-2 border-white flex-shrink-0">
                          {avatarLetter}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-[14px] font-bold text-gray-900 truncate">
                            {vendor?.name || "Vendor"}
                          </h3>
                          {vendor?.status === "APPROVED" && (
                            <MdVerified className="text-[#E53935] text-[15px] flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[11.5px] text-gray-500 truncate mt-0.5">
                          {vendor?.email || "—"}
                        </p>

                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E53935]/10 text-[#E53935] uppercase tracking-wide">
                            {vendor?.role || "VENDOR"}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide
                            ${vendor?.status === "APPROVED" ? "bg-emerald-50 text-emerald-600"
                              : vendor?.status === "PENDING" ? "bg-amber-50 text-amber-600"
                              : "bg-red-50 text-red-600"}`}>
                            {vendor?.status || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 mx-4" />

                  {/* Quick stats */}
                  <div className="grid grid-cols-3 divide-x divide-gray-100 px-2 py-3">
                    {[
                      { label: "Orders", value: "—" },
                      { label: "Rating", value: "—" },
                      { label: "Revenue", value: "—" },
                    ].map((s) => (
                      <div key={s.label} className="flex flex-col items-center py-1">
                        <span className="text-[13px] font-bold text-gray-800">{s.value}</span>
                        <span className="text-[10px] text-gray-400 mt-0.5">{s.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-gray-100 mx-4" />

                  {/* Logout */}
                  <div className="p-3">
                    <button
                      onClick={() => { setPopupOpen(false); setShowLogoutConfirm(true); }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold
                        text-[#E53935] border border-[#E53935]/20 bg-red-50/50
                        hover:bg-gradient-to-r hover:from-[#E53935] hover:to-[#EF5350] hover:text-white hover:border-transparent
                        transition-all duration-200 group"
                    >
                      <LuLogOut size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── MOBILE SEARCH BAR ── */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileSearch ? "max-h-16 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-4 pb-3">
            <div
              className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 gap-2.5
                focus-within:bg-white focus-within:border-[#E53935]/50 focus-within:shadow-[0_0_0_3px_rgba(229,57,53,0.08)] transition-all duration-200"
            >
              <FiSearch className="text-gray-400 text-[15px] flex-shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search orders, menu items…"
                className="flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-400 text-[13px]"
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── LOGOUT CONFIRMATION MODAL ── */}
      {showLogoutConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            style={{ animation: "fadeIn 0.2s ease" }}
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] w-[90%] max-w-sm"
            style={{ animation: "scaleUp 0.25s cubic-bezier(0.16,1,0.3,1)" }}
          >
            <div
              className="bg-white rounded-2xl overflow-hidden border border-gray-100"
              style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.14)" }}
            >
              <div className="bg-gradient-to-br from-[#E53935] to-[#FF7043] px-6 py-6 text-center relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 0%, transparent 50%), radial-gradient(circle at 80% 20%, white 0%, transparent 50%)" }}
                />
                <div className="relative w-14 h-14 mx-auto mb-3 bg-white/20 rounded-2xl flex items-center justify-center">
                  <LuLogOut className="text-white w-6 h-6" />
                </div>
                <h3 className="relative text-lg font-bold text-white">Sign Out</h3>
                <p className="relative text-white/70 text-[12.5px] mt-1">You'll need to sign in again to continue</p>
              </div>

              <div className="p-5">
                <p className="text-gray-600 text-[13.5px] text-center mb-5">
                  Are you sure you want to logout from your vendor account?
                </p>
                <div className="flex gap-2.5">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[13px] font-semibold rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("vendor");
                      window.location.href = "/login";
                    }}
                    className="flex-1 py-2.5 bg-gradient-to-r from-[#E53935] to-[#EF5350] text-white text-[13px] font-semibold rounded-xl
                      hover:shadow-lg hover:shadow-red-500/30 active:scale-95 transition-all duration-200"
                  >
                    Yes, Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.95); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </>
  );
};

export default Header;