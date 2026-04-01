import { Link } from "react-router-dom";
import { User, LogOut, Menu, Bell, ChevronDown, Settings } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

const API_BASE = "http://127.0.0.1:8000/api/accounts";

const clearClientSession = () => {
  try {
    localStorage.removeItem("agent_selected_seats");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  } catch (err) {
    console.warn("clearClientSession error:", err);
  }
};

const Agent_Navbar = () => {
  const [loggingOut, setLoggingOut] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const res = await fetch(`${API_BASE}/logout_agent/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        console.warn("Logout endpoint returned non-OK:", res.status, txt);
      } else {
        const json = await res.json().catch(() => null);
        console.debug("logout response:", json);
      }
    } catch (err) {
      console.warn("logout request failed:", err);
    } finally {
      clearClientSession();
      window.location.href = "/LoginAdminAgent";
    }
  };

  return (
    <header
      className="sticky top-0 z-50 text-white flex justify-between items-center px-5 py-0"
      style={{
        backgroundColor: '#1e3a8a',
        backgroundImage: 'linear-gradient(90deg, #1e3a8a 0%, #1a3278 100%)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.3)',
        height: '56px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Kiri: burger + judul */}
      <div className="flex items-center gap-3">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150"
          style={{ background: 'rgba(255,255,255,0.08)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          aria-label="Toggle menu"
        >
          <Menu size={16} />
        </button>
        <div className="hidden sm:flex items-center gap-2">
          <span className="font-bold text-base tracking-wide">Ticketing</span>
        </div>
      </div>

      {/* Kanan: info pengguna + logout */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150"
          style={{ background: 'rgba(255,255,255,0.08)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          aria-label="Notifikasi"
        >
          <Bell size={15} />
        </button>

        <div className="w-px h-5 mx-1" style={{ background: 'rgba(255,255,255,0.15)' }} />

        {/* ↓ HANYA BAGIAN INI YANG BERUBAH — dari div biasa jadi dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              <User size={13} />
            </div>
            <span className="text-sm font-medium">Agent</span>
            <ChevronDown
              size={12}
              className="transition-transform duration-200"
              style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-xl overflow-hidden z-50"
              style={{
                background: '#fff',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
              }}
            >
              {/* Header profil */}
              <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: '#1e3a8a', color: '#fff' }}
                >
                  AG
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Agent</p>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: '#eff6ff', color: '#1e3a8a' }}
                  >
                    Agent
                  </span>
                </div>
              </div>

              {/* Menu */}
              <div className="p-1.5">
                <Link
                  to="../agent/profilagent"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={13} className="text-gray-400" />
                  Profil Saya
                </Link>

              </div>
            </div>
          )}
        </div>
        {/* ↑ SELESAI perubahan dropdown profil */}

        {/* Logout button — tidak diubah sama sekali */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 disabled:opacity-60"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)' }}
          onMouseEnter={e => {
            if (!loggingOut) {
              e.currentTarget.style.background = 'rgba(239,68,68,0.25)';
              e.currentTarget.style.color = '#fff';
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
          }}
          title="Logout"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">{loggingOut ? "Keluar..." : "Logout"}</span>
        </button>
      </div>
    </header>
  );
};

export default Agent_Navbar;