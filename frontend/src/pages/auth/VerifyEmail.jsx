import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmailApi } from "../../api/authApi";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Sedang memverifikasi akun Anda...");

  useEffect(() => {
    const triggerVerification = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Token tidak ditemukan.");
        return;
      }

      try {
        const data = await verifyEmailApi(token);
        if (data.success) {
          setStatus("success");
          setMessage(data.message || "Email berhasil diverifikasi!");
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (error) {
        setStatus("error");
        const errorMsg = error.response?.data?.error || "Verifikasi gagal.";
        setMessage(errorMsg);
      }
    };

    triggerVerification();
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Verifikasi Akun</h2>

        {status === "loading" && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-medium">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="animate-bounce-in">
            <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              ✓
            </div>
            <p className="text-green-700 font-semibold text-lg">{message}</p>
            <p className="text-gray-500 text-sm mt-2">Mengarahkan Anda ke halaman login...</p>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
              !
            </div>
            <p className="text-red-700 font-semibold">{message}</p>
            <button
              onClick={() => navigate("/register")}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Daftar Ulang
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;