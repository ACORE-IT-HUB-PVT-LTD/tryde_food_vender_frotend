// import React from "react";
// import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";
// import { Outlet } from "react-router-dom";

// const VendorLayout = () => {
//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       <Header />
//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar />
//         <main className="flex-1 p-3 md:p-6 overflow-y-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default VendorLayout;


import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const VendorLayout = () => {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onHoverChange={setIsSidebarHovered} />
        
        {/* Main Content - shifts right when sidebar is hovered */}
        <main 
          className={`
            flex-1 p-3 md:p-6 overflow-y-auto
            transition-all duration-300 ease-in-out
            md:ml-20
            ${isSidebarHovered ? 'md:ml-60' : ''}
          `}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;