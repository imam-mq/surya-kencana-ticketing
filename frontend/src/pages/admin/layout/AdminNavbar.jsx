import React, { useState } from "react";
import { User, LogOut, Menu, Bell } from "lucide-react";
import { logoutAdminAccount } from "../../../api/authApi"; 

const clearClientSession = () => {
  try {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  } catch (err) {
    console.warn("clearClientSession error:", err);
  }
};

const AdminNavbar = () => {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutAdminAccount({});
      console.debug("Admin berhasil logout dari server");
    } catch (err) {
      console.warn("Logout admin gagal di sisi server / jaringan bermasalah:", err);
    } finally {
      clearClientSession();
      window.location.href = "/LoginAdminAgent";
    }
  };

  return (
    <header
      className="sticky top-0 z-50 text-white flex justify-end items-center px-4"
      style={{
        backgroundColor: "#1e3a8a",
        backgroundImage: "linear-gradient(90deg, #1e3a8a 0%, #1a3278 100%)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.3)",
        height: "56px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg">
          <Bell size={15} />
        </button>

        <div className="w-px h-5 mx-1 bg-white/20" />

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10">
          <User size={13} />
          <span className="text-sm font-medium">Admin</span>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <LogOut size={14} />
          <span>{loggingOut ? "Keluar..." : "Logout"}</span>
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;