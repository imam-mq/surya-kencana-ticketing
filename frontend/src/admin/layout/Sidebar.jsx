import { NavLink } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { FaTachometerAlt, FaUsers, FaBus, FaCalendarAlt, FaTicketAlt, FaTag, FaDollarSign, FaChartBar } from 'react-icons/fa';

const Sidebar = () => {
  const menu = [
  { name: "Dashboard", icon: <FaTachometerAlt size={18} />, path: "/admin/dashboard" },
  { name: "Managemen User", icon: <FaUsers size={18} />, path: "/admin/manajemenuser" },
  { name: "Managemen Agent", icon: <FaBus size={18} />, path: "/admin/manajemenagent" },
  { name: "Managemen Jadwal & Tiket", icon: <FaCalendarAlt size={18} />, path: "/admin/jadwaltiket" },
  { name: "Managemen Promo", icon: <FaTag size={18} />, path: "/admin/manajemenpromo" },
  { name: "Laporan & Monitoring", icon: <FaChartBar size={18} />, path: "/admin/laporanmonitoring" },
];

const sidebarBgColor = '#1e3a8a';
const activeBgColor = '#2b3951';

  return (
    <div className="w-64 text-white min-h-screen" style={{ backgroundColor: sidebarBgColor }}>
      <div className="p-4 pt-6 pb-2 font-bold text-xl border-b border-white/10 mb-4">
        <span className="block">Surya</span>
        <span className="block">Kencana</span>
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

export default Sidebar;
