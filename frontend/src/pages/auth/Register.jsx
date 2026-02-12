import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { FaBus, FaSun } from 'react-icons/fa';
import SubmitButton from "../../components/ui/SubmitButton";

export default function Register() {
  const primaryColor = '#314D9C';
  const cardColor = '#D4C8A6';
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
      .finally(() => {
         // 3. Matikan Loading
         setIsLoading(false);
      });
  };

  const InputField = ({ label, type = "text", name, half = false }) => (
    <div className={half ? "w-1/2" : "w-full"}>
      <label className="block text-xs font-semibold mb-1 text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        required
      />
    </div>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center font-poppins"
      style={{
        background: 'linear-gradient(135deg, #A8B4D4 0%, #314D9C 100%)'
      }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-8 m-4 max-w-md border-t-8 border-b-8"
        style={{ borderColor: cardColor }}
      >
        <div
          className="p-4 rounded-t-lg mb-6 flex items-center justify-center"
          style={{ backgroundColor: cardColor }}
        >
          <FaBus className="text-3xl mr-2" style={{ color: primaryColor }} />
          <FaSun className="text-xl" style={{ color: primaryColor }} />
          <span className="text-xl font-bold ml-1" style={{ color: primaryColor }}>
            Surya Kencana
          </span>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <h3 className="text-center text-sm font-semibold mb-3 text-gray-700">
            Silahkan Registrasi Di Bawah Ini
          </h3>

          {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

          <div className="flex space-x-3">
            <InputField label="Email" name="email" half />
            <InputField label="No KTP" name="noKtp" type="number" half />
          </div>

          <div className="flex space-x-3">
            <InputField label="Nama" name="nama" half />
            <div className="w-1/2">
              <label className="block text-xs font-semibold mb-1 text-gray-700">Jenis Kelamin</label>
              <select
                name="jenisKelamin"
                value={form.jenisKelamin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Pilih...</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
          </div>

          <InputField label="Alamat" name="alamat" />
          <InputField label="Kota/Kab" name="kotaKab" />
          <InputField label="No HP" name="noHp" type="tel" />

          <div className="flex space-x-3">
            <InputField label="Password" name="password" type="password" half />
            <InputField label="Konfirmasi Password" name="konfirmasiPassword" type="password" half />
          </div>
          <SubmitButton isLoading={isLoading} mt={4}>
            Daftar
          </SubmitButton>
        </form>

        <div className="text-sm mt-4 text-center">
          <Link to="/login" className="text-gray-600 hover:underline">
            Sudah Punya Akun? Masuk di Sini
          </Link>
        </div>
      </div>
    </div>
  );
}
