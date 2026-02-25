import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBus, FaSun } from "react-icons/fa";
import SubmitButton from "../../components/ui/SubmitButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const primaryColor = "#314D9C";
  const cardColor = "#D4C8A6";

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/accounts/get-csrf/", {
      credentials: "include",
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/accounts/login-user/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Login berhasil!");
        const userData = {
          id: data.id,
          email: data.email,
          peran: data.peran,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/user/profil");
      } else {
        setError(data.message || "Email atau Password salah");
      }
    } catch (error) {
      setError("Terjadi kesalahan koneksi ke server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center font-poppins relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #A8B4D4 0%, #314D9C 100%)" }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-20"
        style={{ background: "#D4C8A6", filter: "blur(60px)" }}
      />
      <div
        className="absolute bottom-[-100px] right-[-60px] w-96 h-96 rounded-full opacity-15"
        style={{ background: "#1e3a8a", filter: "blur(80px)" }}
      />
      <div
        className="absolute top-1/2 right-[-120px] w-64 h-64 rounded-full opacity-10"
        style={{ background: cardColor, filter: "blur(70px)" }}
      />

      {/* Card */}
      <div
        className="relative bg-white rounded-2xl w-full max-w-sm mx-4 overflow-hidden"
        style={{
          boxShadow: "0 25px 60px rgba(49,77,156,0.35), 0 8px 20px rgba(0,0,0,0.15)",
        }}
      >
        {/* Top accent bar */}
        <div
          className="h-1.5 w-full"
          style={{ background: `linear-gradient(90deg, ${primaryColor}, ${cardColor})` }}
        />

        {/* Header */}
        <div
          className="px-8 py-7 flex flex-col items-center"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}f5 0%, #1e3a8a 100%)`,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(212,200,166,0.2)",
                border: "1px solid rgba(212,200,166,0.35)",
              }}
            >
              <FaBus className="text-xl" style={{ color: cardColor }} />
            </div>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(212,200,166,0.15)",
                border: "1px solid rgba(212,200,166,0.25)",
              }}
            >
              <FaSun className="text-base" style={{ color: cardColor }} />
            </div>
          </div>
          <h1 className="text-white font-bold text-xl tracking-wide">Surya Kencana</h1>
          <p className="text-white/50 text-xs tracking-widest uppercase mt-1">
            Portal Penumpang
          </p>
        </div>

        {/* Form area */}
        <div className="px-8 py-8">
          <div className="mb-6">
            <h2 className="text-gray-800 font-bold text-lg">Selamat Datang</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              Masuk untuk memesan tiket perjalanan Anda
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email Anda"
                className="w-full px-4 py-2.5 text-sm rounded-lg border outline-none transition-all duration-200"
                style={{ borderColor: "#e5e7eb", background: "#fafafa" }}
                onFocus={(e) => {
                  e.target.style.borderColor = primaryColor;
                  e.target.style.boxShadow = `0 0 0 3px rgba(49,77,156,0.12)`;
                  e.target.style.background = "#fff";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                  e.target.style.background = "#fafafa";
                }}
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="#"
                  className="text-xs font-medium hover:underline"
                  style={{ color: primaryColor }}
                >
                  Lupa Password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full px-4 py-2.5 text-sm rounded-lg border outline-none transition-all duration-200"
                style={{ borderColor: "#e5e7eb", background: "#fafafa" }}
                onFocus={(e) => {
                  e.target.style.borderColor = primaryColor;
                  e.target.style.boxShadow = `0 0 0 3px rgba(49,77,156,0.12)`;
                  e.target.style.background = "#fff";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                  e.target.style.background = "#fafafa";
                }}
                required
              />
            </div>

            {/* Error message */}
            {error && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#dc2626",
                }}
              >
                <span className="text-base">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="pt-1">
              <SubmitButton isLoading={isLoading}>Masuk</SubmitButton>
            </div>
          </form>

          {/* Register link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="font-semibold hover:underline"
                style={{ color: primaryColor }}
              >
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom accent */}
        <div
          className="h-1 w-full"
          style={{ background: `linear-gradient(90deg, ${cardColor}, ${primaryColor})` }}
        />
      </div>
    </div>
  );
}