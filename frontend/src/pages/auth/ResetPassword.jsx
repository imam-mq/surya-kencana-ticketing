import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { FaBus, FaLock } from "react-icons/fa";
import SubmitButton from "../../components/ui/SubmitButton";
import { processResetPassword } from "../../services/authService";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // mengambil token dari URL (?token=...)
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const primaryColor = "#314D9C";
  const cardColor = "#D4C8A6";

  useEffect(() => {
    if (!token) {
      alert("Link tidak valid atau token hilang.");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      // memanggil service untuk validasi kecocokan pass
      const response = await processResetPassword(token, newPassword, confirmPassword);
      
      setMessage(response.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center font-poppins relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #A8B4D4 0%, #314D9C 100%)" }}
    >
      {/* Decorative blobs (Sama dengan Login) */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-20" style={{ background: "#D4C8A6", filter: "blur(60px)" }} />
      <div className="absolute bottom-[-100px] right-[-60px] w-96 h-96 rounded-full opacity-15" style={{ background: "#1e3a8a", filter: "blur(80px)" }} />

      <div
        className="relative bg-white rounded-2xl w-full max-w-sm mx-4 overflow-hidden"
        style={{ boxShadow: "0 25px 60px rgba(49,77,156,0.35), 0 8px 20px rgba(0,0,0,0.15)" }}
      >
        <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${cardColor})` }} />

        {/* Header */}
        <div className="px-8 py-7 flex flex-col items-center" style={{ background: `linear-gradient(135deg, ${primaryColor}f5 0%, #1e3a8a 100%)` }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(212,200,166,0.2)", border: "1px solid rgba(212,200,166,0.35)" }}>
            <FaLock className="text-xl" style={{ color: cardColor }} />
          </div>
          <h1 className="text-white font-bold text-xl tracking-wide">Update Password</h1>
        </div>

        <div className="px-8 py-8">
          <div className="mb-6">
            <h2 className="text-gray-800 font-bold text-lg">Buat Password Baru</h2>
            <p className="text-gray-500 text-sm mt-1 text-pretty">
              Gunakan kombinasi yang kuat agar akun Anda tetap aman.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password Baru */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Password Baru</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="w-full px-4 py-2.5 text-sm rounded-lg border outline-none transition-all duration-200"
                style={{ borderColor: "#e5e7eb", background: "#fafafa" }}
                onFocus={(e) => { e.target.style.borderColor = primaryColor; e.target.style.boxShadow = `0 0 0 3px rgba(49,77,156,0.12)`; e.target.style.background = "#fff"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; e.target.style.background = "#fafafa"; }}
                required
              />
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Konfirmasi Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
                className="w-full px-4 py-2.5 text-sm rounded-lg border outline-none transition-all duration-200"
                style={{ borderColor: "#e5e7eb", background: "#fafafa" }}
                onFocus={(e) => { e.target.style.borderColor = primaryColor; e.target.style.boxShadow = `0 0 0 3px rgba(49,77,156,0.12)`; e.target.style.background = "#fff"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; e.target.style.background = "#fafafa"; }}
                required
              />
            </div>

            {/* Notifikasi */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#dc2626" }}>
                <span>⚠️ {error}</span>
              </div>
            )}

            {message && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: "#16a34a" }}>
                <span>✅ {message}</span>
              </div>
            )}

            <div className="pt-2">
              <SubmitButton isLoading={isLoading}>Simpan Password</SubmitButton>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm font-semibold hover:underline" style={{ color: primaryColor }}>
              Batal & Kembali
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}