import React, { useState } from "react";
import { FaBus, FaSun } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../../components/ui/SubmitButton";

export default function LoginAdminAgent() {
  const primaryColor = "#314D9C";
  const cardColor = "#D4C8A6";

  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const loginUrl =
      role === "admin"
        ? "http://127.0.0.1:8000/api/accounts/login-admin-api/"
        : "http://127.0.0.1:8000/api/accounts/login-agent/";

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Login gagal, cek kembali akun Anda");
      }

      const serverRole = data.peran;

      if (role !== serverRole) {
        alert(`Akun ini terdaftar sebagai "${serverRole}", Anda mencoba login sebagai "${role}"`);
        return;
      }

      if (serverRole === "agent") {
        navigate("/agent/dashboard");
      } else if (serverRole === "admin") {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      alert(err.message);
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
          style={{ background: `linear-gradient(90deg, ${primaryColor}, #D4C8A6)` }}
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
              style={{ background: "rgba(212,200,166,0.2)", border: "1px solid rgba(212,200,166,0.35)" }}
            >
              <FaBus className="text-xl" style={{ color: cardColor }} />
            </div>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(212,200,166,0.15)", border: "1px solid rgba(212,200,166,0.25)" }}
            >
              <FaSun className="text-base" style={{ color: cardColor }} />
            </div>
          </div>
          <h1 className="text-white font-bold text-xl tracking-wide">Surya Kencana</h1>
          <p className="text-white/50 text-xs tracking-widest uppercase mt-1">Ticketing System</p>
        </div>

        {/* Form area */}
        <div className="px-8 py-8">
          <div className="mb-6">
            <h2 className="text-gray-800 font-bold text-lg">Selamat Datang</h2>
            <p className="text-gray-500 text-sm mt-0.5">Masuk ke panel {role === "admin" ? "Admin" : "Agent"}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selector as toggle */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Login Sebagai
              </label>
              <div
                className="flex rounded-lg p-1 gap-1"
                style={{ background: "#f1f3f9" }}
              >
                {["admin", "agent"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className="flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 capitalize"
                    style={
                      role === r
                        ? {
                            background: primaryColor,
                            color: "#fff",
                            boxShadow: "0 2px 8px rgba(49,77,156,0.4)",
                          }
                        : { color: "#6b7280", background: "transparent" }
                    }
                  >
                    {r === "admin" ? "Admin" : "Agent"}
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Email {role === "admin" ? "Admin" : "Agent"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email terdaftar"
                className="w-full px-4 py-2.5 text-sm rounded-lg border outline-none transition-all duration-200"
                style={{
                  borderColor: "#e5e7eb",
                  background: "#fafafa",
                }}
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
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full px-4 py-2.5 text-sm rounded-lg border outline-none transition-all duration-200"
                style={{
                  borderColor: "#e5e7eb",
                  background: "#fafafa",
                }}
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

            <div className="pt-1">
              <SubmitButton isLoading={isLoading}>
                Masuk
              </SubmitButton>
            </div>
          </form>
        </div>

        {/* Bottom accent */}
        <div
          className="h-1 w-full"
          style={{ background: `linear-gradient(90deg, #D4C8A6, ${primaryColor})` }}
        />
      </div>
    </div>
  );
}