import React, { useEffect, useState } from "react";

const Profil = () => {
  const [userData, setUserData] = useState({
    nama: "",
    email: "",
    noKtp: "",
    jenisKelamin: "",
    alamat: "",
    kotaKab: "",
    noHp: "",
    password: "",
    konfirmasiPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const primaryColor = "#3B5998";

  // Ambil user_id dari localStorage (saat login)
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  // Ambil data user saat halaman dibuka
  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:8000/api/accounts/user/${userId}/profile/`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Data profil diterima:", data);
        setUserData({
          email: data.email || "",
          noKtp: data.noKtp || "",
          jenisKelamin: data.jenisKelamin || "",
          alamat: data.alamat || "",
          kotaKab: data.kotaKab || "",
          noHp: data.noHp || "",
          password: "",
          konfirmasiPassword: "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat profil:", err);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Handle input perubahan
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle submit update profil
  const handleSubmit = (e) => {
    e.preventDefault();

    if (userData.password && userData.password !== userData.konfirmasiPassword) {
      setMessage("Konfirmasi password tidak cocok!");
      return;
    }

    fetch(`http://localhost:8000/api/accounts/user/${userId}/update/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage("Profil berhasil diperbarui!");
        } else {
          setMessage(data.error || "Gagal memperbarui profil");
        }
      })
      .catch(() => setMessage("Terjadi kesalahan saat update data."));
  };

  const InputField = ({
    label,
    name,
    value = "",
    type = "text",
    disabled = false,
    required = false,
  }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-600">
        {label}
      </label>
      <input
        className="w-full bg-gray-100 text-gray-700 border border-gray-200 rounded-lg py-2.5 px-4 text-sm leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition duration-150 disabled:cursor-not-allowed disabled:text-gray-400"
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        required={required}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Memuat data profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="w-full space-y-5">

        {/* === HEADER PROFIL === */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          {/* Banner */}
          <div
            className="h-24"
            style={{ background: `linear-gradient(to right, #1e3a8a, ${primaryColor})` }}
          />
          {/* Avatar + info */}
          <div className="px-6 pb-5 flex items-end gap-4 -mt-9">
            <div
              className="w-16 h-16 rounded-full border-4 border-white shadow-md flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              {(userData.nama || userData.email || "U").charAt(0).toUpperCase()}
            </div>
            <div className="pb-1">
              
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm text-gray-500">{userData.email}</span>
                <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                  Aktif
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* === FORM CARD === */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

          <h1 className="text-xl font-bold text-gray-800 mb-1">Profile Saya</h1>
          <p className="text-sm text-gray-400 mb-6">Perbarui informasi akun Anda di bawah ini</p>

          {/* Alert message */}
          {message && (
            <div className="mb-6 px-4 py-3 rounded-lg text-sm font-medium bg-blue-50 border border-blue-200 text-blue-700">
              {message}
            </div>
          )}

          <form className="w-full" onSubmit={handleSubmit}>

            {/* ── Informasi Akun ── */}
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4">
                Informasi Akun
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField label="Email" name="email" value={userData.email} type="email" disabled />
                <InputField label="Nomor Identitas KTP" name="noKtp" value={userData.noKtp} required />
              </div>
            </div>

            <hr className="border-gray-100 mb-7" />

            {/* ── Data Diri ── */}
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4">
                Data Diri
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField label="Nama Lengkap" name="nama" value={userData.nama} required />

                {/* Jenis Kelamin */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-600">Jenis Kelamin</label>
                  <div className="relative">
                    <select
                      className="appearance-none w-full bg-gray-100 text-gray-700 border border-gray-200 rounded-lg py-2.5 px-4 pr-9 text-sm leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition duration-150"
                      name="jenisKelamin"
                      value={userData.jenisKelamin}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>Pilih Jenis Kelamin</option>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <InputField label="Kota/Kab" name="kotaKab" value={userData.kotaKab} required />
                <InputField label="Nomor HP" name="noHp" value={userData.noHp} required />
              </div>

              {/* Alamat — full width */}
              <div className="flex flex-col gap-1.5 mt-5">
                <label className="text-sm font-semibold text-gray-600">Alamat</label>
                <textarea
                  className="w-full bg-gray-100 text-gray-700 border border-gray-200 rounded-lg py-2.5 px-4 text-sm leading-relaxed focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition duration-150 resize-none"
                  name="alamat"
                  value={userData.alamat}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>
            </div>

            <hr className="border-gray-100 mb-7" />

            {/* ── Ubah Password ── */}
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">
                Ubah Password
              </p>
              <p className="text-xs text-gray-400 mb-4">Kosongkan jika tidak ingin mengubah password</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField label="Password" name="password" value={userData.password} type="password" />
                <InputField label="Konfirmasi Password" name="konfirmasiPassword" value={userData.konfirmasiPassword} type="password" />
              </div>
            </div>

            {/* Tombol Submit */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="text-white font-semibold py-2.5 px-8 rounded-lg transition duration-200 hover:opacity-90 hover:-translate-y-0.5 shadow-md text-sm"
                style={{ backgroundColor: primaryColor }}
              >
                Update Profile
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Profil;