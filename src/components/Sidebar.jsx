import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import {
  HomeIcon,
  UserIcon,
  Bars3Icon,
  ShoppingBagIcon,
  MapIcon,
  CurrencyDollarIcon,
  StarIcon,
  LifebuoyIcon,
  ChevronDownIcon,
  XMarkIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";
import { LuLogOut } from "react-icons/lu";
import { BiCategoryAlt } from "react-icons/bi";
import { FaUtensils } from "react-icons/fa";
import { RiFileList3Line } from "react-icons/ri";
import { MdOutlineAccountCircle } from "react-icons/md";

const Sidebar = ({ onHoverChange }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(
    location.pathname.startsWith("/dashboard/menu")
  );

  const navClass = ({ isActive }) =>
    `group/item relative flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg text-[13.5px] font-medium transition-all duration-200
     ${isActive
      ? "bg-gradient-to-r from-[#E53935] to-[#EF5350] text-white shadow-md shadow-red-500/25"
      : "text-gray-500 hover:bg-red-50 hover:text-[#E53935]"
    }`;

  const spanClass = `whitespace-nowrap overflow-hidden transition-opacity duration-300`;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-5 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-all"
      >
        <Bars3Icon className="h-5 w-5 text-gray-700" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => onHoverChange?.(false)}
        className={`
          fixed left-0 z-40
          flex flex-col
          font-['Poppins']
          transition-all duration-300 ease-in-out
          hidden md:flex
          top-[60px]
          h-[calc(100vh-60px)]
          w-[62px] hover:w-[220px]
          group
          ${isMobileOpen ? "!flex !w-72 !top-0 !h-full" : ""}
        `}
        style={{
          scrollbarWidth: "none",
          background: "#fff",
          borderRight: "0.5px solid #e5e7eb",
          borderLeft: "3px solid #E53935",
          overflow: "hidden",
        }}
      >


        {/* Mobile Header */}
        <div className={`md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0 ${!isMobileOpen && "hidden"}`}>
          <span className="text-sm font-semibold text-gray-700">Menu</span>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* ── Navigation (scrollable) ── */}
        <nav
          className="flex-1 flex flex-col gap-0.5 py-3 overflow-y-auto overflow-x-hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >

          {/* ── MAIN section ── */}
          <div className={`px-5 pb-1 transition-opacity duration-200 flex-shrink-0 ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Main</span>
          </div>

          {/* Dashboard */}
          <NavLink to="/dashboard" end className={navClass}>
            {({ isActive }) => (
              <>
                <div className={`flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0 transition-all duration-200 ${isActive ? "bg-white/20" : "bg-red-50 group-hover/item:bg-red-100"}`}>
                  <HomeIcon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#E53935]"}`} />
                </div>
                <span className={`${spanClass} ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                  Dashboard
                </span>
              </>
            )}
          </NavLink>

          {/* Profile */}
          <NavLink to="/dashboard/profile" className={navClass}>
            {({ isActive }) => (
              <>
                <div className={`flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0 transition-all duration-200 ${isActive ? "bg-white/20" : "bg-red-50 group-hover/item:bg-red-100"}`}>
                  <UserIcon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#E53935]"}`} />
                </div>
                <span className={`${spanClass} ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                  Profile
                </span>
              </>
            )}
          </NavLink>

          {/* My Profile */}
          <NavLink
            to="/dashboard/venderprofile"
            className={navClass}
            onClick={() => setIsMobileOpen(false)}
          >
            {({ isActive }) => (
              <>
                <div className={`flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0 transition-all duration-200 ${isActive ? "bg-white/20" : "bg-red-50 group-hover/item:bg-red-100"}`}>
                  <MdOutlineAccountCircle className={`h-4 w-4 ${isActive ? "text-white" : "text-[#E53935]"}`} />
                </div>
                <span className={`${spanClass} ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                  My Profile
                </span>
              </>
            )}
          </NavLink>

          {/* Divider */}
          <div className="mx-4 my-1.5 border-t border-dashed border-gray-200 flex-shrink-0" />

          {/* ── CATALOGUE section ── */}
          <div className={`px-5 pb-1 transition-opacity duration-200 flex-shrink-0 ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Catalogue</span>
          </div>

          {/* Menu Dropdown */}
          <div className="flex-shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`w-[calc(100%-1rem)] mx-2 group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all duration-200
                ${location.pathname.startsWith("/dashboard/menu")
                  ? "bg-gradient-to-r from-[#E53935] to-[#EF5350] text-white shadow-md shadow-red-500/25"
                  : "text-gray-500 hover:bg-red-50 hover:text-[#E53935]"
                }`}
            >
              <div className={`flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0 transition-all duration-200
                ${location.pathname.startsWith("/dashboard/menu") ? "bg-white/20" : "bg-red-50 group-hover:bg-red-100"}`}>
                <Bars3Icon className={`h-4 w-4 ${location.pathname.startsWith("/dashboard/menu") ? "text-white" : "text-[#E53935]"}`} />
              </div>
              <span className={`flex-1 ${spanClass} ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                Menu
              </span>
              <ChevronDownIcon
                className={`h-3.5 w-3.5 transition-transform duration-300
                  ${menuOpen ? "rotate-180" : ""}
                  ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
              />
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className={`mt-0.5 flex flex-col gap-0.5 ${isMobileOpen ? "opacity-100 pl-4 pr-2" : "opacity-0 group-hover:opacity-100 pl-10 pr-2"}`}>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#E53935] to-transparent opacity-30 ml-2" />
                  <NavLink to="/dashboard/menu/category"
                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-[12.5px] font-medium transition-all duration-200 pl-5
                      ${isActive ? "bg-red-50 text-[#E53935] font-semibold" : "text-gray-500 hover:bg-red-50 hover:text-[#E53935]"}`}>
                    <BiCategoryAlt className="h-3.5 w-3.5 flex-shrink-0" /><span>Category</span>
                  </NavLink>
                  <NavLink to="/dashboard/menu/sub-category"
                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-[12.5px] font-medium transition-all duration-200 pl-5
                      ${isActive ? "bg-red-50 text-[#E53935] font-semibold" : "text-gray-500 hover:bg-red-50 hover:text-[#E53935]"}`}>
                    <FaUtensils className="h-3.5 w-3.5 flex-shrink-0" /><span>Sub Category</span>
                  </NavLink>
                  <NavLink to="/dashboard/menu/item"
                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-[12.5px] font-medium transition-all duration-200 pl-5
                      ${isActive ? "bg-red-50 text-[#E53935] font-semibold" : "text-gray-500 hover:bg-red-50 hover:text-[#E53935]"}`}>
                    <RiFileList3Line className="h-3.5 w-3.5 flex-shrink-0" /><span>Item</span>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-4 my-1.5 border-t border-dashed border-gray-200 flex-shrink-0" />

          {/* ── BUSINESS section ── */}
          <div className={`px-5 pb-1 transition-opacity duration-200 flex-shrink-0 ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Business</span>
          </div>

          {/* Orders */}
          <NavLink to="/dashboard/orders" className={navClass}>
            {({ isActive }) => (
              <>
                <div className={`flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0 transition-all duration-200 ${isActive ? "bg-white/20" : "bg-red-50 group-hover/item:bg-red-100"}`}>
                  <ShoppingBagIcon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#E53935]"}`} />
                </div>
                <span className={`${spanClass} ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>Orders</span>
              </>
            )}
          </NavLink>

          {/* Earnings */}
          <NavLink to="/dashboard/earnings" className={navClass}>
            {({ isActive }) => (
              <>
                <div className={`flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0 transition-all duration-200 ${isActive ? "bg-white/20" : "bg-red-50 group-hover/item:bg-red-100"}`}>
                  <CurrencyDollarIcon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#E53935]"}`} />
                </div>
                <span className={`${spanClass} ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>Earnings</span>
              </>
            )}
          </NavLink>

          {/* Reviews */}
          <NavLink to="/dashboard/reviews" className={navClass}>
            {({ isActive }) => (
              <>
                <div className={`flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0 transition-all duration-200 ${isActive ? "bg-white/20" : "bg-red-50 group-hover/item:bg-red-100"}`}>
                  <StarIcon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#E53935]"}`} />
                </div>
                <span className={`${spanClass} ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>Reviews</span>
              </>
            )}
          </NavLink>

          {/* Announcement */}
          <NavLink to="/dashboard/announcement" className={navClass}>
            {({ isActive }) => (
              <>
                <div className={`flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0 transition-all duration-200 ${isActive ? "bg-white/20" : "bg-red-50 group-hover/item:bg-red-100"}`}>
                  <MegaphoneIcon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#E53935]"}`} />
                </div>
                <span className={`${spanClass} ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>Announcement</span>
              </>
            )}
          </NavLink>

          {/* Support */}
          <NavLink to="/dashboard/support" className={navClass}>
            {({ isActive }) => (
              <>
                <div className={`flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0 transition-all duration-200 ${isActive ? "bg-white/20" : "bg-red-50 group-hover/item:bg-red-100"}`}>
                  <LifebuoyIcon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#E53935]"}`} />
                </div>
                <span className={`${spanClass} ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>Support</span>
              </>
            )}
          </NavLink>

        </nav>

        {/* ── Bottom: Logout ── */}
        <div className="border-t border-gray-100 p-2.5 flex-shrink-0">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-gray-400 hover:bg-red-50 hover:text-[#E53935] font-medium cursor-pointer group/logout"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0 bg-gray-100 group-hover/logout:bg-red-100 transition-colors">
              <LuLogOut size={14} className="text-gray-400 group-hover/logout:text-[#E53935]" />
            </div>
            <span className={`text-[13.5px] ${spanClass} ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
              Logout
            </span>
          </button>

          <div className={`text-[10px] text-gray-300 text-center mt-2 transition-opacity duration-300 ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            © 2026 QuickOrders
          </div>
        </div>
      </aside>

      {/* ── Logout Confirm Modal ── */}
      {showLogoutConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] w-[90%] max-w-sm">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-br from-[#E53935] to-[#FF7043] p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                  <LuLogOut className="text-white w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-white">Confirm Logout</h3>
                <p className="text-white/70 text-sm mt-1">You'll need to sign in again</p>
              </div>
              <div className="p-5">
                <p className="text-gray-600 text-sm text-center mb-5">
                  Are you sure you want to logout of your account?
                </p>
                <div className="flex gap-2.5">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      window.location.href = "/login";
                    }}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#E53935] to-[#EF5350] text-white text-sm font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-red-500/30 active:scale-95"
                  >
                    Yes, Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;