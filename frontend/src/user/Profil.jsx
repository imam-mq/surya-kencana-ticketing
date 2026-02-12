// src/pages/user/Profil.jsx

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
            nama: data.nama || "",
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
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submit update profil
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi password jika ingin ubah
    if (
      userData.password &&
      userData.password !== userData.konfirmasiPassword
    ) {
      setMessage("Konfirmasi password tidak cocok!");
      return;
    }

    fetch(`http://localhost:8000/api/accounts/user/${userId}/update/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
    <div className="w-full md:w-1/2 px-3 mb-6">
      <label className="block tracking-wide text-gray-700 text-sm font-semibold mb-1">
        {label}
      </label>
      <input
        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 transition duration-150"
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
    return <div className="text-center mt-10 text-gray-600">Memuat data...</div>;
  }

  return (
    <div className="p-0 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">
          Profile Saya
        </h1>

        {message && (
          <div className="mb-4 text-center text-sm font-semibold text-blue-600">
            {message}
          </div>
        )}

        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700">Username</p>
          <p className="text-lg font-medium text-gray-900">{userData.email}</p>
        </div>

        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-3">
            <InputField
              label="Email"
              name="email"
              value={userData.email}
              type="email"
              disabled
            />
            <InputField
              label="Nomor Identitas Ktp"
              name="noKtp"
              value={userData.noKtp}
              required
            />
          </div>

          <div className="flex flex-wrap -mx-3">
            <InputField
              label="Nama"
              name="nama"
              value={userData.nama}
              required
            />

            <div className="w-full md:w-1/2 px-3 mb-6">
              <label className="block tracking-wide text-gray-700 text-sm font-semibold mb-1">
                Jenis Kelamin
              </label>
              <div className="relative">
                <select
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 transition duration-150"
                  name="jenisKelamin"
                  value={userData.jenisKelamin}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Pilih Jenis Kelamin
                  </option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap -mx-3">
            <div className="w-full px-3 mb-6">
              <label className="block tracking-wide text-gray-700 text-sm font-semibold mb-1">
                Alamat
              </label>
              <textarea
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 transition duration-150"
                name="alamat"
                value={userData.alamat}
                onChange={handleChange}
                rows="4"
                required
              ></textarea>
            </div>
          </div>

          <div className="flex flex-wrap -mx-3">
            <InputField
              label="Kota/Kab"
              name="kotaKab"
              value={userData.kotaKab}
              required
            />
            <InputField
              label="Nomor HP"
              name="noHp"
              value={userData.noHp}
              required
            />
          </div>

          <div className="flex flex-wrap -mx-3">
            <InputField
              label="Password"
              name="password"
              value={userData.password}
              type="password"
            />
            <InputField
              label="Konfirmasi Password"
              name="konfirmasiPassword"
              value={userData.konfirmasiPassword}
              type="password"
            />
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="w-full max-w-lg text-white font-bold py-3 px-4 rounded transition duration-200 flex items-center justify-center hover:bg-blue-700"
              style={{ backgroundColor: primaryColor }}
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profil;
