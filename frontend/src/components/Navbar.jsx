import React, { useEffect, useState } from "react";
import { FiHome, FiUser, FiTruck, FiCalendar, FiEdit, FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest(".navbar-container")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className="relative px-4 py-2 text-white/90 hover:text-white font-medium transition-all duration-300 group"
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-lg transition-all duration-300"></span>
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-yellow-400 group-hover:w-3/4 transition-all duration-300"></span>
    </Link>
  );

  const MobileNavLink = ({ to, label, Icon, index }) => (
    <Link
      to={to}
      onClick={() => setIsOpen(false)}
      className="flex items-center gap-3 px-4 py-3 text-white rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:translate-x-2 group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Icon className="text-xl group-hover:scale-125 transition-transform duration-300" />
      <span className="font-medium">{label}</span>
    </Link>
  );


  return (
    <nav
      className={`navbar-container fixed top-0 left-0 w-full z-50 transition-all duration-500
      ${
        isScrolled ? "bg-blue-900/95 backdrop-blur-sm shadow-md" : "bg-blue-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <span className="text-blue-900 font-extrabold text-xl">SK</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-900 animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-white tracking-tight">Surya Kencana</div>
              <div className="text-xs text-blue-200 -mt-1">Transposport</div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/profil">Profil</NavLink>
            <NavLink to="/layanan">Layanan</NavLink>
            <NavLink to="/infojadwal">Informasi Jadwal</NavLink>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/Register"
              className="px-5 py-2.5 rounded-xl border-2 border-white/30 text-white font-medium hover:bg-white/10 hover:border-white/50 transition-all duration-300 transform hover:scale-105"
            >
             
              Daftar
            </Link>
            <Link
              to="/Login"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Login
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center text-white focus:outline-none group"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`block h-0.5 bg-white transition-all duration-300 ${
                isOpen ? "rotate-45 translate-y-2" : ""
              }`}></span>
              <span className={`block h-0.5 bg-white transition-all duration-300 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}></span>
              <span className={`block h-0.5 bg-white transition-all duration-300 ${
                isOpen ? "-rotate-45 -translate-y-2" : ""
              }`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ${
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-gradient-to-b from-blue-800 to-blue-900 border-t border-white/10 shadow-2xl">
          <div className="px-4 py-6 space-y-1">
            <MobileNavLink to="/" label="Home" Icon={FiHome} index={0} />
            <MobileNavLink to="/profil" label="Profil" Icon={FiUser} index={1} />
            <MobileNavLink to="/layanan" label="Layanan" Icon={FiTruck} index={2} />
            <MobileNavLink to="/infojadwal" label="Informasi Jadwal" Icon={FiCalendar} index={3} />

            {/* Mobile Action Buttons */}
            <div className="pt-4 mt-4 border-t border-white/10 space-y-3">
              <Link
                to="/Register"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl border-2 border-white/30 text-white font-medium hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                 <FiEdit className="text-lg" />
                <span>Daftar Akun</span>
              </Link>
              <Link
                to="/Login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg"
              >
                <FiLock className="text-lg" />
                <span>Login Sekarang</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
