import { NavLink } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { FaTachometerAlt, FaUsers, FaBus } from 'react-icons/fa';

const Sidebar_Agent = () => {
  const menu = [
  { name: "Dashboard", icon: <FaTachometerAlt size={18} />, path: "/agent/dashboard" },
  { name: "Pesan Tiket", icon: <FaUsers size={18} />, path: "/agent/tiketagent" },
  { name: "Tiket Terbit", icon: <FaBus size={18} />, path: "/agent/tiketterbit" },
  { name: "Komisi Laporan", icon: <FaBus size={18} />, path: "/agent/komisilaporan" },
  { name: "Komisi Agent", icon: <FaBus size={18} />, path: "/agent/komisiagent" },
];

const sidebarBgColor = '#1e3a8a';
const activeBgColor = '#2b3951';

  return (
    <div className="w-64 text-white min-h-screen" style={{ backgroundColor: sidebarBgColor }}>
      <div className="p-4 pt-6 pb-2 font-bold text-xl border-b border-white/10 mb-4">
        <span className="block">Surya Kencana</span>
        
      </div>

      <nav className="flex flex-col px-4">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center text-sm font-medium transition duration-200 px-4 py-3 my-1 rounded-md ${
                isActive 
                ? "bg-[${activeBgColor}] shadow-inner border-l-4 border-white" 
                : "hover:bg-[${activeBgColor}]"
              }`
            }
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar_Agent;
