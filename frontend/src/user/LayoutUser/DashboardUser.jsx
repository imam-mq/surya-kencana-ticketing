import React from "react";
import SidebarUser from "./SidebarUser";
import { Outlet } from "react-router-dom";

const DashboardUser = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar — sticky, tidak ikut scroll */}
      <div className="w-[240px] flex-shrink-0 h-screen sticky top-0">
        <SidebarUser />
      </div>

      {/* Konten — yang scroll hanya area ini */}
      <div className="flex-1 bg-gray-100 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardUser;