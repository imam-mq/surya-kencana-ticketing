import React from "react";
import SidebarUser from "./SidebarUser";
import { Outlet } from "react-router-dom";

const DashboardUser = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarUser />

      <div className="flex-1 bg-gray-100 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardUser;