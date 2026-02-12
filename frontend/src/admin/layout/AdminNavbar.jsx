import { User, LogOut, Menu } from "lucide-react";

const AdminNavbar = () => {
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
        <button className="flex items-center gap-1 text-white font-semibold hover:underline">
          <LogOut size={16} />
          Logout/Admin
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
