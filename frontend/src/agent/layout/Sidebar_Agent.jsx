import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaBus, FaFileAlt, FaMoneyBillWave } from 'react-icons/fa';

const Sidebar_Agent = () => {
  const menu = [
    { name: "Dashboard",      icon: <FaTachometerAlt size={16} />, path: "/agent/dashboard" },
    { name: "Pesan Tiket",    icon: <FaUsers size={16} />,         path: "/agent/tiketagent" },
    { name: "Tiket Terbit",   icon: <FaBus size={16} />,           path: "/agent/tiketterbit" },
    { name: "Komisi Laporan", icon: <FaFileAlt size={16} />,       path: "/agent/komisilaporan" },
    { name: "Komisi Agent",   icon: <FaMoneyBillWave size={16} />, path: "/agent/komisiagent" },
  ];

  return (
    <div
      className="w-64 text-white sticky top-0 h-screen overflow-y-auto flex flex-col"
      style={{
        backgroundColor: '#1e3a8a',
        backgroundImage: 'linear-gradient(180deg, #1e3a8a 0%, #1a3278 100%)',
        boxShadow: '4px 0 20px rgba(0,0,0,0.25)',
      }}
    >
      {/* Logo  */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black"
            style={{
              background: 'rgba(255,255,255,0.15)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
              flexShrink: 0,
            }}
          >
            SK
          </div>
          <div>
            <span className="block font-bold text-base leading-tight tracking-wide">Surya Kencana</span>
            <span className="block text-xs text-white/50 tracking-widest uppercase">Agent Panel</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col px-3 py-4 gap-0.5 flex-1">
        <p className="text-[10px] uppercase tracking-widest text-white/35 px-3 mb-2 font-semibold">Menu</p>
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 text-sm font-medium transition-all duration-200 px-3 py-2.5 rounded-lg ${
                isActive
                  ? "text-white"
                  : "text-white/60 hover:text-white hover:bg-white/8"
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'rgba(255,255,255,0.12)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 1px 3px rgba(0,0,0,0.2)',
                    borderLeft: '3px solid rgba(255,255,255,0.7)',
                  }
                : {
                    borderLeft: '3px solid transparent',
                  }
            }
          >
            <span className="opacity-80">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/10">
        <p className="text-[10px] text-white/30 text-center">v1.0.0 &copy; Surya Kencana</p>
      </div>
    </div>
  );
};

export default Sidebar_Agent;