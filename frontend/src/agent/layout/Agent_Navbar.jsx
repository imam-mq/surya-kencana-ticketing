import { User, LogOut, Menu } from "lucide-react";
import React from "react";

const API_BASE = "http://127.0.0.1:8000/api/accounts";

const clearClientSession = () => {
  try {
    // hapus data lokal yang relevan
    localStorage.removeItem("agent_selected_seats");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    // jika ada key lain, hapus juga
  } catch (err) {
    console.warn("clearClientSession error:", err);
  }
};

const Agent_Navbar = () => {
  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE}/logout_agent/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({}) // kosong - backend tidak memerlukannya
      });

      if (!res.ok) {
        // coba ambil pesan dari server bila tersedia
        const txt = await res.text().catch(() => null);
        console.warn("Logout endpoint returned non-OK:", res.status, txt);
        // tetap lanjut membersihkan client session agar user "keluar"
      } else {
        const json = await res.json().catch(() => null);
        console.debug("logout response:", json);
      }
    } catch (err) {
      // jaringan atau endpoint tidak tersedia — tetap clear client
      console.warn("logout request failed:", err);
    } finally {
      clearClientSession();
      // redirect ke halaman login agent (ubah jika route beda)
      window.location.href = "/LoginAdminAgent";
    }
  };
  return (
    <header className="sticky top-0 z-50 bg-[#1e3a8a] text-white flex justify-between items-center px-4 py-2 shadow-md">
      <div className="flex items-center gap-2">
        <Menu />
        <h1 className="font-bold text-lg">Ticketing</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <User size={16} />
          <span>Agent</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-white font-semibold hover:underline"
          title="Logout"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Agent_Navbar;
