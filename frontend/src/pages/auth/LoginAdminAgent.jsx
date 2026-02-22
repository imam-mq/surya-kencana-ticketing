import React, { useState } from "react";
import { FaBus, FaSun } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../../components/ui/SubmitButton";

export default function LoginAdminAgent() {
  const primaryColor = "#314D9C";
  const cardColor = "#D4C8A6";

  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState(""); // Ubah dari username ke email
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Endpoint sudah benar sesuai urls.py terbaru
    const loginUrl =
      role === "admin"
        ? "http://127.0.0.1:8000/api/accounts/login-admin-api/"
        : "http://127.0.0.1:8000/api/accounts/login-agent/";

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        // PENTING: Backend sekarang mencari 'email', bukan 'username'
        body: JSON.stringify({ email, password }), 
      });

      const data = await response.json();

      if (!response.ok) {
        // Jika 401, biasanya email atau password salah
        throw new Error(data.error || data.message || "Login gagal, cek kembali akun Anda");
      }

      // Validasi peran (peran dikembalikan oleh auth.py)
      const serverRole = data.peran; 

      if (role !== serverRole) {
        alert(`Akun ini terdaftar sebagai "${serverRole}", Anda mencoba login sebagai "${role}"`);
        return;
      }

      // Navigasi & Simpan Session (Opsional: simpan info user ke localStorage jika perlu)
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
              Email {role === "admin" ? "Admin" : "Agent"}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email terdaftar"
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

          <SubmitButton isLoading={isLoading}>
            Masuk
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}