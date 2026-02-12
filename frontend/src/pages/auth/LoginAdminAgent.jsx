import React, { useState } from "react";
import { FaBus, FaSun } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../../components/ui/SubmitButton";

export default function LoginAdminAgent() {
  const primaryColor = "#314D9C";
  const cardColor = "#D4C8A6";

  const [role, setRole] = useState("admin");
  const [username, setUsername] = useState("");
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
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        alert(data.message || "Login gagal");
        return;
      }

      const serverRole = data.role;

      if (role !== serverRole) {
        alert(`Akun ini bertipe "${serverRole}", bukan "${role}"`);
        return;
      }

      if (serverRole === "agent") {
        navigate("/agent/dashboard");
      }

      if (serverRole === "admin") {
        navigate("/admin/dashboard");
      }

    } catch (err) {
      alert("Gagal terhubung ke server");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center font-poppins"
      style={{
        background: "linear-gradient(135deg, #A8B4D4 0%, #314D9C 100%)",
      }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm m-4 border-t-8 border-b-8"
        style={{ borderColor: cardColor }}
      >
        <div
          className="p-4 rounded-t-lg mb-6 flex items-center justify-center"
          style={{ backgroundColor: cardColor }}
        >
          <FaBus className="text-3xl mr-2" style={{ color: primaryColor }} />
          <FaSun className="text-xl" style={{ color: primaryColor }} />
          <span
            className="text-xl font-bold ml-1"
            style={{ color: primaryColor }}
          >
            Surya Kencana
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Login Sebagai
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="admin">Admin</option>
              <option value="agent">Agent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={`Masukkan username ${role}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* HANYA GUNAKAN SATU TOMBOL INI */}
          <SubmitButton isLoading={isLoading}>
            Masuk
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}