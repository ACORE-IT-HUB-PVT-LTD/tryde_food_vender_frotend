// import React, { useState } from "react";
// import { NavLink, useLocation, useNavigate } from "react-router-dom";

// // Icons
// import {
//   HomeIcon,
//   UserIcon,
//   Bars3Icon,
//   ShoppingBagIcon,
//   MapIcon,
//   CurrencyDollarIcon,
//   StarIcon,
//   GiftIcon,
//   LifebuoyIcon,
//   ChevronDownIcon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline";
// import { LuLogOut } from "react-icons/lu";

// const Sidebar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(
//     location.pathname.startsWith("/dashboard/menu")
//   );

//   const handleLogout = () => {
//     localStorage.clear();
//     setIsMobileOpen(false);
//     navigate("/login");
//   };

//   const navClass = ({ isActive }) =>
//     `group/item relative flex items-center gap-4 px-4 py-3 mx-2 rounded-xl text-[15px] font-medium transition-all duration-200
//      ${
//        isActive
//          ? "bg-gradient-to-r from-[#FF5252] to-[#FF6B6B] text-white shadow-lg shadow-red-500/30"
//          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//      }`;

//   return (
//     <>
//       {/* Mobile Menu Button */}
//       <button
//         onClick={() => setIsMobileOpen(!isMobileOpen)}
//         className="md:hidden fixed top-5 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-all"
//       >
//         <Bars3Icon className="h-6 w-6 text-gray-700" />
//       </button>

//       {/* Mobile Overlay */}
//       {isMobileOpen && (
//         <div
//           className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
//           onClick={() => setIsMobileOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`
//           fixed left-0
//           z-40
//           bg-white border-r border-gray-200 
//           flex flex-col
//           font-['Poppins']
//           transition-all duration-300 ease-in-out
//           overflow-hidden
          
//           /* Desktop: Collapsed by default, expand on hover - positioned below header with gap */
//           hidden md:flex
//           top-20
//           h-[calc(100vh-5rem)]
//           w-20 hover:w-60
//           group
          
//           /* Mobile: Full sidebar without hover dependency */
//           ${isMobileOpen ? "!flex !w-72 !top-0 !h-full" : ""}
//         `}
//         style={{ scrollbarWidth: "none" }}
//       >
//         {/* Mobile Header */}
//         <div className={`md:hidden flex items-center justify-between p-4 border-b border-gray-200 ${!isMobileOpen && 'hidden'}`}>
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-br from-[#FF5252] to-[#FF6B6B] rounded-xl flex items-center justify-center shadow-lg">
//               <span className="text-white font-bold text-lg">Y</span>
//             </div>
//             <h1 className="text-lg font-bold text-gray-800">YourApp</h1>
//           </div>
//           <button
//             onClick={() => setIsMobileOpen(false)}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <XMarkIcon className="h-5 w-5 text-gray-600" />
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 flex flex-col gap-1.5 py-4 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
//           <NavLink to="/dashboard" end className={navClass}>
//             <HomeIcon className="h-5 w-5 min-w-[20px] flex-shrink-0" />
//             {/* Mobile: Always show text | Desktop: Show on hover */}
//             <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 
//               ${isMobileOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
//               Dashboard
//             </span>
//           </NavLink>

//           <NavLink to="/dashboard/profile" className={navClass}>
//             <UserIcon className="h-5 w-5 min-w-[20px] flex-shrink-0" />
//             <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 
//               ${isMobileOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
//               Profile
//             </span>
//           </NavLink>

//           {/* Menu Dropdown */}
//           {/* Menu Dropdown */}
// <div>
//   <NavLink
//     to="#"
//     onClick={(e) => {
//       e.preventDefault();
//       setMenuOpen(!menuOpen);
//     }}
//     className={`group relative flex items-center gap-4 px-4 py-3 mx-2 rounded-xl text-[15px] font-medium transition-all duration-200
//       ${
//         location.pathname.startsWith("/dashboard/menu")
//           ? "bg-gradient-to-r from-[#FF5252] to-[#FF6B6B] text-white shadow-lg shadow-red-500/30"
//           : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//       }`}
//   >
//     <Bars3Icon className="h-5 w-5 min-w-[20px] flex-shrink-0" />

//     <span
//       className={`flex-1 whitespace-nowrap overflow-hidden transition-opacity duration-300
//         ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
//     >
//       Menu
//     </span>

//     <ChevronDownIcon
//       className={`h-4 w-4 transition-transform duration-300
//         ${menuOpen ? "rotate-180" : ""}
//         ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
//     />
//   </NavLink>

//   {/* Submenu */}
//   <div
//     className={`overflow-hidden transition-all duration-300 ${
//       menuOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
//     }`}
//   >
//     <div
//       className={`ml-8 mr-2 mt-1 flex flex-col gap-1 transition-opacity duration-300
//         ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
//     >
//       <NavLink
//         to="/dashboard/menu/category"
//         className={({ isActive }) =>
//           `px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
//             isActive
//               ? "bg-red-50 text-[#FF5252]"
//               : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//           }`
//         }
//       >
//         Category
//       </NavLink>

//       <NavLink
//         to="/dashboard/menu/sub-category"
//         className={({ isActive }) =>
//           `px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
//             isActive
//               ? "bg-red-50 text-[#FF5252]"
//               : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//           }`
//         }
//       >
//         Sub Category
//       </NavLink>

//       <NavLink
//         to="/dashboard/menu/item"
//         className={({ isActive }) =>
//           `px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
//             isActive
//               ? "bg-red-50 text-[#FF5252]"
//               : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//           }`
//         }
//       >
//         Item
//       </NavLink>
//     </div>
//   </div>
// </div>


//           <NavLink to="/dashboard/orders" className={navClass}>
//             <ShoppingBagIcon className="h-5 w-5 min-w-[20px] flex-shrink-0" />
//             <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 
//               ${isMobileOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
//               Orders
//             </span>
//           </NavLink>

//           <NavLink to="/dashboard/tracking" className={navClass}>
//             <MapIcon className="h-5 w-5 min-w-[20px] flex-shrink-0" />
//             <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 
//               ${isMobileOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
//               Tracking
//             </span>
//           </NavLink>

//           <NavLink to="/dashboard/earnings" className={navClass}>
//             <CurrencyDollarIcon className="h-5 w-5 min-w-[20px] flex-shrink-0" />
//             <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 
//               ${isMobileOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
//               Earnings
//             </span>
//           </NavLink>

//           <NavLink to="/dashboard/reviews" className={navClass}>
//             <StarIcon className="h-5 w-5 min-w-[20px] flex-shrink-0" />
//             <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 
//               ${isMobileOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
//               Reviews
//             </span>
//           </NavLink>

//           <NavLink to="/dashboard/offers" className={navClass}>
//             <GiftIcon className="h-5 w-5 min-w-[20px] flex-shrink-0" />
//             <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 
//               ${isMobileOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
//               Offers
//             </span>
//           </NavLink>

//           <NavLink to="/dashboard/support" className={navClass}>
//             <LifebuoyIcon className="h-5 w-5 min-w-[20px] flex-shrink-0" />
//             <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 
//               ${isMobileOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
//               Support
//             </span>
//           </NavLink>
//         </nav>

//         {/* Logout Button */}
//         <div className="border-t border-gray-200 p-3">
//           <button
//             onClick={handleLogout}
//             className="
//               w-full flex items-center gap-4
//               px-4 py-3 rounded-xl
//               transition-all duration-200
//               text-red-600 hover:bg-red-50
//               font-medium
//             "
//           >
//             <LuLogOut size={20} className="min-w-[20px] flex-shrink-0" />
//             <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 
//               ${isMobileOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
//               Logout
//             </span>
//           </button>

//           {/* Footer */}
//           <div className={`text-xs text-gray-400 text-center mt-3 transition-opacity duration-300
//             ${isMobileOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
//             © 2026 YourApp
//           </div>
//         </div>
//       </aside>

//       {/* Spacer for content (Desktop) */}
//       <div className="hidden md:block w-20" />
//     </>
//   );
// };

// export default Sidebar;


import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

// Icons
import {
  HomeIcon,
  UserIcon,
  Bars3Icon,
  ShoppingBagIcon,
  MapIcon,
  CurrencyDollarIcon,
  StarIcon,
  GiftIcon,
  LifebuoyIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { LuLogOut } from "react-icons/lu";

const Sidebar = ({ onHoverChange }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(
    location.pathname.startsWith("/dashboard/menu")
  );

  const handleLogout = () => {
    localStorage.clear();
    setIsMobileOpen(false);
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `group/item relative flex items-center gap-4 px-4 py-3 mx-2 rounded-xl text-[15px] font-medium transition-all duration-200
     ${
       isActive
         ? "bg-gradient-to-r from-[#FF5252] to-[#FF6B6B] text-white shadow-lg shadow-red-500/30"
         : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
     }`;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-5 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-all"
      >
        <Bars3Icon className="h-6 w-6 text-gray-700" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => onHoverChange?.(false)}
        className={`
          fixed left-0
          z-40
          bg-white border-r border-gray-200 
          flex flex-col
          font-['Poppins']
          transition-all duration-300 ease-in-out
          overflow-hidden
          
          /* Desktop: Collapsed by default, expand on hover - positioned below header with gap */
          hidden md:flex
          top-20
          h-[calc(100vh-5rem)]
          w-20 hover:w-60
          group
          
          /* Mobile: Full sidebar without hover dependency */
          ${isMobileOpen ? "!flex !w-72 !top-0 !h-full" : ""}
        `}
        style={{ scrollbarWidth: "none" }}
      >
        {/* Mobile Header */}
        <div className={`md:hidden flex items-center justify-between p-4 border-b border-gray-200 ${!isMobileOpen && 'hidden'}`}>
          <div className="flex items-center gap-3">
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1.5 py-4 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <NavLink to="/dashboard" end className={navClass}>
            <HomeIcon className="h-5 w-5 min-w-[20px] flex-shrink-0" />
            {/* Mobile: Always show text | Desktop: Show on hover */}
            <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 
              ${isMobileOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              Dashboard
            </span>
          </NavLink>

          <NavLink to="/dashboard/profile" className={navClass}>
            <UserIcon className="h-5 w-5 min-w-[20px] flex-shrink-0" />
            <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 
              ${isMobileOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              Profile
            </span>
          </NavLink>

          {/* Menu Dropdown */}
          <div>
            <NavLink
              to="#"
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen(!menuOpen);
              }}
              className={`group relative flex items-center gap-4 px-4 py-3 mx-2 rounded-xl text-[15px] font-medium transition-all duration-200
                ${
                  location.pathname.startsWith("/dashboard/menu")
                    ? "bg-gradient-to-r from-[#FF5252] to-[#FF6B6B] text-white shadow-lg shadow-red-500/30"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              <Bars3Icon className="h-5 w-5 min-w-[20px] flex-shrink-0" />

              <span
                className={`flex-1 whitespace-nowrap overflow-hidden transition-opacity duration-300
                  ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
              >
                Menu
              </span>

              <ChevronDownIcon
                className={`h-4 w-4 transition-transform duration-300
                  ${menuOpen ? "rotate-180" : ""}
                  ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
              />
            </NavLink>

            {/* Submenu */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                menuOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div
                className={`ml-8 mr-2 mt-1 flex flex-col gap-1 transition-opacity duration-300
                  ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
              >
                <NavLink
                  to="/dashboard/menu/category"
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-red-50 text-[#FF5252]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  Category
                </NavLink>

                <NavLink
                  to="/dashboard/menu/sub-category"
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-red-50 text-[#FF5252]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  Sub Category
                </NavLink>

                <NavLink
                  to="/dashboard/menu/item"
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-red-50 text-[#FF5252]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  Item
                </NavLink>
              </div>
            </div>
          </div>

          <NavLink to="/dashboard/orders" className={navClass}>
            <ShoppingBagIcon className="h-5 w-5 min-w-[20px] flex-shrink-0" />
            <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 
              ${isMobileOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              Orders
            </span>
          </NavLink>

          <NavLink to="/dashboard/tracking" className={navClass}>
            <MapIcon className="h-5 w-5 min-w-[20px] flex-shrink-0" />
            <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 
              ${isMobileOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              Tracking
            </span>
          </NavLink>

          <NavLink to="/dashboard/earnings" className={navClass}>
            <CurrencyDollarIcon className="h-5 w-5 min-w-[20px] flex-shrink-0" />
            <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 
              ${isMobileOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              Earnings
            </span>
          </NavLink>

          <NavLink to="/dashboard/reviews" className={navClass}>
            <StarIcon className="h-5 w-5 min-w-[20px] flex-shrink-0" />
            <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 
              ${isMobileOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              Reviews
            </span>
          </NavLink>

          <NavLink to="/dashboard/offers" className={navClass}>
            <GiftIcon className="h-5 w-5 min-w-[20px] flex-shrink-0" />
            <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 
              ${isMobileOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              Offers
            </span>
          </NavLink>

          <NavLink to="/dashboard/support" className={navClass}>
            <LifebuoyIcon className="h-5 w-5 min-w-[20px] flex-shrink-0" />
            <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 
              ${isMobileOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              Support
            </span>
          </NavLink>
        </nav>

        {/* Logout Button */}
        <div className="border-t border-gray-200 p-3">
          <button
            onClick={handleLogout}
            className="
              w-full flex items-center gap-4
              px-4 py-3 rounded-xl
              transition-all duration-200
              text-red-600 hover:bg-red-50
              font-medium
            "
          >
            <LuLogOut size={20} className="min-w-[20px] flex-shrink-0" />
            <span className={`whitespace-nowrap overflow-hidden transition-opacity duration-300 
              ${isMobileOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              Logout
            </span>
          </button>

          {/* Footer */}
          <div className={`text-xs text-gray-400 text-center mt-3 transition-opacity duration-300
            ${isMobileOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            © 2026 YourApp
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;