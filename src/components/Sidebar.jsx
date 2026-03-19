import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../assets/app_icon.png";


import {
  HomeIcon,
  UserIcon,
  Bars3Icon,
  ShoppingBagIcon,
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

  const [isMobileOpen,      setIsMobileOpen]      = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [menuOpen,          setMenuOpen]          = useState(
    location.pathname.startsWith("/dashboard/menu")
  );

  const spanClass = `whitespace-nowrap overflow-hidden transition-opacity duration-300`;

  const navClass = ({ isActive }) =>
    `group/item relative flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl text-[13px] font-bold transition-all duration-200
     ${isActive
       ? "bg-white text-[#E53935] shadow-lg shadow-black/15"
       : "text-white hover:bg-white hover:text-[#E53935] hover:shadow-md hover:shadow-black/10"
     }`;

  const iconBox = (isActive) =>
    `flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 transition-all duration-200
     ${isActive ? "bg-[#E53935]/10" : "bg-white/15 group-hover/item:bg-[#E53935]/10"}`;

  const iconColor = (isActive) =>
    isActive ? "text-[#E53935]" : "text-white group-hover/item:text-[#E53935]";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .sb-scroll::-webkit-scrollbar { display:none; }
        .sb-scroll { scrollbar-width:none; }
        @keyframes modalIn {
          from { opacity:0; transform:translate(-50%,-48%) scale(0.95); }
          to   { opacity:1; transform:translate(-50%,-50%) scale(1); }
        }
      `}</style>

      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-5 left-4 z-50 p-2.5 rounded-xl shadow-lg border border-gray-100 bg-white"
      >
        <Bars3Icon className="h-5 w-5 text-gray-700" />
      </button>

      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)} />
      )}

      {/* ══════════════════════ SIDEBAR ══════════════════════ */}
      <aside
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => onHoverChange?.(false)}
        className={`
          fixed left-0 z-40 flex flex-col
          font-['Plus_Jakarta_Sans']
          transition-all duration-300 ease-in-out
          hidden md:flex
          top-0 h-screen
          w-[80px] hover:w-[260px]
          group
          ${isMobileOpen ? "!flex !w-72 !top-0 !h-full" : ""}
        `}
        style={{
          background: "linear-gradient(180deg, #E53935 0%, #EF5350 45%, #c0392b 100%)",
          overflow: "hidden",
          boxShadow: "4px 0 28px rgba(229,57,53,0.28)",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute pointer-events-none inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle,rgba(255,255,255,0.5),transparent)" }} />
          <div className="absolute bottom-20 -right-8 w-36 h-36 rounded-full opacity-8"
            style={{ background: "radial-gradient(circle,rgba(255,255,255,0.3),transparent)" }} />
        </div>

        {/* ── TOP LOGO AREA (always visible, acts as sidebar header) ── */}
        <div className="flex items-center gap-3 px-4 flex-shrink-0 border-b border-white/10"
          style={{ height: "72px" }}>  {/* matches header height */}
            <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="relative">
                        {/* Red glow behind logo */}
                        <div className="absolute inset-0 rounded-xl blur-md scale-110"
                          style={{ background: "linear-gradient(135deg,#E53935,#FF7043)", opacity: 0.18 }} />
                        <img
                          src={logo}
                          alt="App Logo"
                          className="relative h-9 w-9 md:h-10 md:w-10 object-contain rounded-xl"
                        />
                      </div>
                    </div>
         
        </div>

        {/* Mobile close button */}
        {isMobileOpen && (
          <button onClick={() => setIsMobileOpen(false)}
            className="absolute top-4 right-3 p-1.5 hover:bg-white/15 rounded-lg transition-colors md:hidden">
            <XMarkIcon className="h-5 w-5 text-white/80" />
          </button>
        )}

        {/* NAV */}
        <nav className="flex-1 flex flex-col gap-0.5 py-4 overflow-y-auto overflow-x-hidden sb-scroll">

          <SectionLabel label="Main" isMobileOpen={isMobileOpen} />

          <NavLink to="/dashboard" end className={navClass}>
            {({ isActive }) => (<>
              <div className={iconBox(isActive)}><HomeIcon className={`h-4 w-4 ${iconColor(isActive)}`} /></div>
              <span className={`${spanClass} ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>Dashboard</span>
            </>)}
          </NavLink>

          <NavLink to="/dashboard/profile" className={navClass}>
            {({ isActive }) => (<>
              <div className={iconBox(isActive)}><UserIcon className={`h-4 w-4 ${iconColor(isActive)}`} /></div>
              <span className={`${spanClass} ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>Profile</span>
            </>)}
          </NavLink>

          <NavLink to="/dashboard/venderprofile" className={navClass} onClick={() => setIsMobileOpen(false)}>
            {({ isActive }) => (<>
              <div className={iconBox(isActive)}><MdOutlineAccountCircle className={`h-4 w-4 ${iconColor(isActive)}`} /></div>
              <span className={`${spanClass} ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>My Profile</span>
            </>)}
          </NavLink>

          <Divider />
          <SectionLabel label="Catalogue" isMobileOpen={isMobileOpen} />

          {/* Menu dropdown */}
          <div className="flex-shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`w-[calc(100%-1rem)] mx-2 relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200
                ${location.pathname.startsWith("/dashboard/menu")
                  ? "bg-white text-[#E53935] shadow-lg shadow-black/15"
                  : "text-white hover:bg-white hover:text-[#E53935] hover:shadow-md"}`}
            >
              <div className={`flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 transition-all duration-200
                ${location.pathname.startsWith("/dashboard/menu") ? "bg-[#E53935]/10" : "bg-white/15"}`}>
                <Bars3Icon className={`h-4 w-4 ${location.pathname.startsWith("/dashboard/menu") ? "text-[#E53935]" : "text-white"}`} />
              </div>
              <span className={`flex-1 ${spanClass} ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>Menu</span>
              <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform duration-300
                ${menuOpen ? "rotate-180" : ""}
                ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                ${location.pathname.startsWith("/dashboard/menu") ? "text-[#E53935]" : "text-white"}`} />
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className={`mt-1 flex flex-col gap-0.5 ${isMobileOpen ? "opacity-100 pl-4 pr-2" : "opacity-0 group-hover:opacity-100 pl-10 pr-2"}`}>
                <div className="relative pl-3 border-l-2 border-dashed border-white/25 ml-2">
                  <SubLink to="/dashboard/menu/category"     icon={<BiCategoryAlt   className="w-3.5 h-3.5" />} label="Category"     />
                  <SubLink to="/dashboard/menu/sub-category" icon={<FaUtensils      className="w-3.5 h-3.5" />} label="Sub Category" />
                  <SubLink to="/dashboard/menu/item"         icon={<RiFileList3Line className="w-3.5 h-3.5" />} label="Item"         />
                </div>
              </div>
            </div>
          </div>

          <Divider />
          <SectionLabel label="Business" isMobileOpen={isMobileOpen} />

          {[
            { to: "/dashboard/orders",       Icon: ShoppingBagIcon,    label: "Orders"       },
           // { to: "/dashboard/earnings",      Icon: CurrencyDollarIcon, label: "Earnings"     },
            { to: "/dashboard/reviews",       Icon: StarIcon,           label: "Reviews"      },
            { to: "/dashboard/announcement",  Icon: MegaphoneIcon,      label: "Announcement" },
            { to: "/dashboard/support",       Icon: LifebuoyIcon,       label: "Support"      },
          ].map(({ to, Icon, label }) => (
            <NavLink key={to} to={to} className={navClass}>
              {({ isActive }) => (<>
                <div className={iconBox(isActive)}><Icon className={`h-4 w-4 ${iconColor(isActive)}`} /></div>
                <span className={`${spanClass} ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>{label}</span>
              </>)}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/15 p-2.5 flex-shrink-0">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-[13px] text-white transition-all duration-200 hover:bg-white hover:text-[#E53935] hover:shadow-md group/logout"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 bg-white/15 group-hover/logout:bg-[#E53935]/10 transition-colors">
              <LuLogOut size={14} className="text-white group-hover/logout:text-[#E53935]" />
            </div>
            <span className={`${spanClass} ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>Logout</span>
          </button>
          <div className={`text-[10px] text-white/30 text-center mt-2 transition-opacity duration-300 ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            © 2026 QuickOrders
          </div>
        </div>
      </aside>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" onClick={() => setShowLogoutConfirm(false)} />
          <div className="fixed top-1/2 left-1/2 z-[110] w-[90%] max-w-sm"
            style={{ animation: "modalIn 0.25s cubic-bezier(0.16,1,0.3,1)" }}>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 font-['Plus_Jakarta_Sans']">
              <div className="px-6 pt-8 pb-6 text-center relative overflow-hidden"
                style={{ background: "linear-gradient(135deg,#E53935,#FF7043)" }}>
                <div className="absolute inset-0 pointer-events-none" style={{
                  backgroundImage: "radial-gradient(circle at 15% 85%, rgba(255,255,255,0.12) 0%, transparent 55%), radial-gradient(circle at 85% 15%, rgba(255,255,255,0.12) 0%, transparent 55%)"
                }} />
                <div className="relative w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center ring-4 ring-white/10">
                  <LuLogOut className="text-white w-8 h-8" />
                </div>
                <h3 className="relative text-xl font-bold text-white">Confirm Logout</h3>
                <p className="relative text-white/70 text-sm mt-1">You'll need to sign in again</p>
              </div>
              <div className="p-5">
                <p className="text-gray-500 text-sm text-center mb-5 leading-relaxed">Are you sure you want to logout?</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold rounded-xl transition-all">
                    Cancel
                  </button>
                  <button onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
                    className="flex-1 px-4 py-2.5 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/30 active:scale-95 transition-all"
                    style={{ background: "linear-gradient(135deg,#E53935,#EF5350)" }}>
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

/* ── Helpers ── */
const SectionLabel = ({ label, isMobileOpen }) => (
  <div className={`px-5 pb-1 pt-0.5 flex-shrink-0 transition-opacity duration-200 ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
    <span className="text-[9.5px] font-bold uppercase tracking-widest text-white/40">{label}</span>
  </div>
);

const Divider = () => (
  <div className="mx-4 my-2 border-t border-white/15 flex-shrink-0" />
);

const SubLink = ({ to, icon, label }) => (
  <NavLink to={to}
    className={({ isActive }) =>
      `flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-bold transition-all duration-200
       ${isActive ? "bg-white text-[#E53935] shadow-md shadow-black/10" : "text-white hover:bg-white hover:text-[#E53935]"}`
    }
  >
    {({ isActive }) => (<>
      <span className={isActive ? "text-[#E53935]" : "text-white"}>{icon}</span>
      <span>{label}</span>
    </>)}
  </NavLink>
);

export default Sidebar;