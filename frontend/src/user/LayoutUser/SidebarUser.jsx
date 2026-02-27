import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaTicketAlt, FaCog, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

const SidebarUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const primaryColor = "#314D9C";
  const activeMenu = location.pathname.split("/")[2] || "";

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const handleLogout = async () => {
    try {
      const csrfToken = getCookie("csrftoken");
      const response = await fetch("http://127.0.0.1:8000/api/accounts/logout-user/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken || "",
        },
      });
      const data = await response.json();
      if (data.success) {
        localStorage.removeItem("user");
        alert("Logout berhasil!");
        navigate("/login");
      } else alert(data.message || "Gagal logout");
    } catch {
      alert("Terjadi kesalahan koneksi ke server");
    }
  };

  const menuItems = [
    { to: "/user/profil",       icon: <FaUser size={15} />,       label: "Profil",       key: "profil" },
    { to: "/user/tiket",        icon: <FaTicketAlt size={15} />,  label: "Ticket",       key: "tiket" },
    { to: "/user/pesanansaya",  icon: <FaCog size={15} />,        label: "Pesanan Saya", key: "pesanansaya" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* ── Logo / Brand ── */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="bg-yellow-400 w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
          <span className="text-blue-900 font-extrabold text-sm tracking-tight">SK</span>
        </div>
        <span className="text-white font-bold text-base tracking-wide">Surya Kencana</span>
      </div>

      {/* ── Menu Items ── */}
      <nav className="flex flex-col gap-1 px-3 pt-4 flex-1">
        {menuItems.map((item) => {
          const isActive = activeMenu === item.key;
          return (
            <Link
              key={item.key}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-white text-blue-900 shadow-sm font-semibold"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className={isActive ? "text-blue-700" : "text-white/60"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ── Logout ── */}
      <div className="px-3 pb-5 pt-2 border-t border-white/10 mt-4">
        <button
          onClick={() => { setIsOpen(false); handleLogout(); }}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:bg-red-500/20 hover:text-red-300 transition-all duration-150"
        >
          <FaSignOutAlt size={15} className="text-white/60" />
          Logout
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* ── Mobile Topbar ── */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 shadow-md"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center gap-2.5">
          <div className="bg-yellow-400 w-7 h-7 rounded-md flex items-center justify-center">
            <span className="text-blue-900 font-extrabold text-xs">SK</span>
          </div>
          <span className="text-white font-bold text-sm">Surya Kencana</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:bg-white/10 p-2 rounded-lg transition"
        >
          {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </div>

      {/* ── Overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden top-14"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <div
        className={`fixed lg:static top-14 lg:top-0 left-0 w-[240px] h-full lg:h-full shadow-xl transition-transform duration-300 z-40 lg:z-0 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ backgroundColor: primaryColor }}
      >
        <SidebarContent />
      </div>
    </>
  );
};

export default SidebarUser;