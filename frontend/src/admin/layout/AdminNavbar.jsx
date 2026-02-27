import React from "react";
import { User, LogOut, Menu } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000/api/accounts";


const clearClientSession = () => {
  try {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    
  } catch (err) {
    console.warn("clearClientSession error:", err);
  }
};

const AdminNavbar = () => {
  const handleLogout = async () => {
    try {
      // Tembak ke endpoint logout-admin yang baru dibuat di urls.py
      const res = await fetch(`${API_BASE}/logout-admin/`, {
        method: "POST",
        credentials: "include", // Sangat penting untuk mengirim cookie sesi
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });

      if (!res.ok) {
        console.warn("Logout admin gagal di sisi server:", res.status);
      } else {
        console.debug("Admin berhasil logout dari server");
      }
    } catch (err) {
      console.warn("Jaringan bermasalah saat logout:", err);
    } finally {
      // Apapun yang terjadi di server, bersihkan sesi lokal dan tendang ke halaman login
      clearClientSession();
      window.location.href = "/LoginAdminAgent"; 
    }
  };

  return (
    <header className="bg-[#1e3a8a] text-white flex justify-between items-center px-4 py-2">
      <div className="flex items-center gap-2">
        <Menu />
        <h1 className="font-bold text-lg">Ticketing</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <User size={16} />
          <span>Admin</span>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-1 text-white font-semibold hover:underline"
          title="Logout"
        >
          <LogOut size={16} />
          Logout/Admin
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
