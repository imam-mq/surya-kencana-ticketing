import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBus, FaSun } from "react-icons/fa";
import SubmitButton from "../../components/ui/SubmitButton";

export default function Register() {
  const primaryColor = "#314D9C";
  const cardColor = "#D4C8A6";
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    noKtp: "",
    nama: "",
    jenisKelamin: "",
    alamat: "",
    kotaKab: "",
    noHp: "",
    password: "",
    konfirmasiPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.konfirmasiPassword) {
      setError("Password dan konfirmasi tidak sama");
      return;
    }

    setIsLoading(true);

    fetch("http://127.0.0.1:8000/api/accounts/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          alert("Registrasi berhasil!");
          navigate("/login");
        }
      })
      .catch(() => setError("Terjadi kesalahan server."))
      .finally(() => setIsLoading(false));
  };

  const inputBase = {
    borderColor: "#e5e7eb",
    background: "#fafafa",
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = primaryColor;
    e.target.style.boxShadow = "0 0 0 3px rgba(49,77,156,0.12)";
    e.target.style.background = "#fff";
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = "#e5e7eb";
    e.target.style.boxShadow = "none";
    e.target.style.background = "#fafafa";
  };

  const inputClass =
    "w-full px-4 py-2.5 text-sm rounded-lg border outline-none transition-all duration-200";

  const InputField = ({ label, type = "text", name, placeholder = "" }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={inputClass}
        style={inputBase}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required
      />
    </div>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center font-poppins py-10 relative overflow-hidden"
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
        className="relative bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden"
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
          className="px-8 py-6 flex flex-col items-center"
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
            Daftar Akun Penumpang
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <div className="mb-6">
            <h2 className="text-gray-800 font-bold text-lg">Buat Akun Baru</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              Lengkapi data diri Anda untuk mulai memesan tiket
            </p>
          </div>

          {error && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm mb-5"
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

          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* Section: Akun */}
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-3 pb-1 border-b"
                style={{ color: primaryColor, borderColor: "#e5e7eb" }}
              >
                Informasi Akun
              </p>
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Email" name="email" type="email" placeholder="nama@email.com" />
                <InputField label="No KTP" name="noKtp" type="number" placeholder="16 digit NIK" />
              </div>
            </div>

            {/* Section: Data Diri */}
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-3 pb-1 border-b"
                style={{ color: primaryColor, borderColor: "#e5e7eb" }}
              >
                Data Diri
              </p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <InputField label="Nama Lengkap" name="nama" placeholder="Nama sesuai KTP" />
                {/* Jenis Kelamin */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Jenis Kelamin
                  </label>
                  <select
                    name="jenisKelamin"
                    value={form.jenisKelamin}
                    onChange={handleChange}
                    className={inputClass}
                    style={inputBase}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">Pilih...</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <InputField label="Alamat" name="alamat" placeholder="Jl. Nama Jalan No. X" />
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Kota / Kabupaten" name="kotaKab" placeholder="Kota Anda" />
                  <InputField label="No HP" name="noHp" type="tel" placeholder="08xxxxxxxxxx" />
                </div>
              </div>
            </div>

            {/* Section: Password */}
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-3 pb-1 border-b"
                style={{ color: primaryColor, borderColor: "#e5e7eb" }}
              >
                Keamanan
              </p>
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Password" name="password" type="password" placeholder="Min. 8 karakter" />
                <InputField label="Konfirmasi Password" name="konfirmasiPassword" type="password" placeholder="Ulangi password" />
              </div>
            </div>

            <div className="pt-2">
              <SubmitButton isLoading={isLoading}>Daftar</SubmitButton>
            </div>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="font-semibold hover:underline"
                style={{ color: primaryColor }}
              >
                Masuk di Sini
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