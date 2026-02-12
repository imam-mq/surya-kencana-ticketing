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
    { to: "/user/profil", icon: <FaUser />, label: "Profil", key: "profil" },
    { to: "/user/tiket", icon: <FaTicketAlt />, label: "Ticket", key: "tiket" },
    { to: "/user/pesanansaya", icon: <FaCog />, label: "Pesanan Saya", key: "pesanansaya" },
  ];

  return (
    <>
      {/* Mobile Navbar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-4 shadow-md"
        style={{ backgroundColor: primaryColor }}
      >
        <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl hover:bg-white/10 p-2 rounded-lg">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        <h2 className="text-white font-bold">Surya Kencana</h2>
      </div>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden top-16" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <div
        className={`fixed lg:static top-16 lg:top-0 left-0 w-[250px] min-h-screen shadow-xl transition-transform duration-300 z-40 lg:z-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ backgroundColor: primaryColor }}
      >
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center gap-3 p-4 h-16" style={{ backgroundColor: primaryColor }}>
          <div className="bg-yellow-400 p-2 rounded-lg">
            <span className="text-blue-900 font-bold text-xl">SK</span>
          </div>
          <h2 className="text-white font-bold">Surya Kencana</h2>
        </div>

        {/* Menu */}
        <nav className="flex flex-col pt-2">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={`flex items-center text-white py-3 px-6 font-medium transition ${
                activeMenu === item.key ? "bg-white/10 border-l-4 border-white" : "hover:bg-white/10"
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}

          {/* Logout */}
          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="flex items-center text-white py-3 px-6 hover:bg-white/10 font-medium"
          >
            <FaSignOutAlt />
            <span className="ml-3">Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default SidebarUser;
