import React from "react";
import { Outlet } from "react-router-dom";
import { Typography } from "@mui/material";

const MenuManagement = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Typography variant="h4" className="mb-6 font-bold text-[#FF5252]">
        Menu Management
      </Typography>

      {/* 👇 Category & Item pages load here */}
      <Outlet />
    </div>
  );
};

export default MenuManagement;
