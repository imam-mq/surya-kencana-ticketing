import React, { useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  IdCard,
  Lock,
  Save,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";
import Sidebar_Agent from './layout/Sidebar_Agent';
import Agent_Navbar from './layout/Agent_Navbar';
import { getMyProfile, updateMyProfile } from '../../api/agentApi';

// ─── Input Field ──────────────────────────────────────────────────────────────
const InputField = ({ label, icon: Icon, type = "text", value, onChange, placeholder }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon size={13} className="text-gray-400" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 bg-white text-gray-900 text-sm outline-none transition-all focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
        style={{ padding: Icon ? "8px 12px 8px 34px" : "8px 12px" }}
      />
    </div>
  </div>
);

// ─── Password Field ───────────────────────────────────────────────────────────
const PasswordField = ({ label, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Lock size={13} className="text-gray-400" />
        </div>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-200 bg-white text-gray-900 text-sm outline-none transition-all focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
          style={{ padding: "8px 40px 8px 34px" }}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {show ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
      </div>
    </div>
  );
};

// ─── Section Card ─────────────────────────────────────────────────────────────
const SectionCard = ({ icon: Icon, title, subtitle, accentColor = "#1e3a8a", children }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${accentColor}14` }}
      >
        <Icon size={15} style={{ color: accentColor }} />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
    <div className="px-5 py-4">{children}</div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const ProfilAgent = () => {

  const [loading, setLoading] = useState(false); // Tambahkan state loading
  const [status, setStatus] = useState({ type: '', msg: '' });
  
  // Kosongkan data awal, karena akan diisi oleh Database
  const [form, setForm] = useState({
    nama_lengkap: '',
    username: '',
    email: '',
    telepon: '',
    alamat: '',
    no_ktp: '',
    password: '',
    password_confirm: '',
  });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // ─── AMBIL DATA DARI DATABASE SAAT HALAMAN DIBUKA ───
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        if (res.success || res.data) {
          // Timpa form kosong dengan data asli dari database
          setForm((prev) => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        setStatus({ type: 'error', msg: 'Gagal memuat data profil.' });
      }
    };
    fetchProfile();
  }, []);

  // ── Password strength ──
  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  
  const strengthMeta = [
    null,
    { label: 'Lemah', color: '#ef4444' },
    { label: 'Cukup', color: '#f59e0b' },
    { label: 'Kuat', color: '#22c55e' },
    { label: 'Sangat Kuat', color: '#16a34a' },
  ];

  // ─── FUNGSI SIMPAN DATA DIRI ───
  const handleSimpanProfil = async () => {
    setLoading(true);
    setStatus({ type: '', msg: '' });
    try {
      // Buat paket khusus profil (tanpa mengikutsertakan password)
      const payload = {
        nama_lengkap: form.nama_lengkap,
        username: form.username,
        telepon: form.telepon,
        alamat: form.alamat,
        no_ktp: form.no_ktp,
        // email tidak dikirim jika diasumsikan tidak boleh diubah, 
        // tapi kalau boleh, tambahkan: email: form.email
      };
      
      const res = await updateMyProfile(payload);
      setStatus({ type: 'success', msg: 'Profil berhasil diperbarui!' });
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Gagal memperbarui profil.';
      setStatus({ type: 'error', msg: errorMsg });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus({ type: '', msg: '' }), 3500);
    }
  };

  // ─── FUNGSI SIMPAN PASSWORD ───
  const handleSimpanPassword = async () => {
    if (!form.password) return setStatus({ type: 'error', msg: 'Password baru tidak boleh kosong.' });
    if (form.password !== form.password_confirm) return setStatus({ type: 'error', msg: 'Konfirmasi password tidak cocok!' });

    setLoading(true);
    setStatus({ type: '', msg: '' });
    try {
      // Buat paket khusus password saja
      const payload = { password: form.password };
      
      const res = await updateMyProfile(payload);
      setStatus({ type: 'success', msg: 'Password berhasil diperbarui!' });
      
      // Kosongkan kolom password setelah sukses
      setForm((prev) => ({ ...prev, password: '', password_confirm: '' }));
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Gagal memperbarui password.';
      setStatus({ type: 'error', msg: errorMsg });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus({ type: '', msg: '' }), 3500);
    }
  };

  const inisial = (form.nama_lengkap || form.username || 'AG').slice(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar_Agent />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Agent_Navbar />

        <main className="p-5 flex-1 overflow-y-auto">

          {/* ── Header ── */}
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-800">Pengaturan Profil</h1>
            <p className="text-sm text-gray-500">Kelola Informasi dan Keamanan Akun Anda</p>
          </div>

          {/* ── Alert Status ── */}
          {status.msg && (
            <div
              className={`mb-4 px-4 py-3 rounded-lg flex items-center gap-2.5 text-sm font-medium border ${
                status.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              {status.type === 'success'
                ? <CheckCircle size={15} className="flex-shrink-0" />
                : <AlertCircle size={15} className="flex-shrink-0" />}
              {status.msg}
            </div>
          )}

          <div className="flex flex-col gap-4">

            {/* ── Avatar Card ── */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                  boxShadow: '0 0 0 3px #fff, 0 0 0 5px #dbeafe',
                }}
              >
                {inisial}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{form.nama_lengkap || '-'}</p>
                <p className="text-xs text-gray-400">{form.email || '-'}</p>
                <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-900">
                  <Shield size={9} /> Agent
                </span>
              </div>
            </div>

            {/* ── Data Diri ── */}
            <SectionCard
              icon={User}
              title="Data Diri"
              subtitle="Informasi personal akun Anda"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField
                  label="Nama Lengkap"
                  icon={User}
                  value={form.nama_lengkap}
                  onChange={set('nama_lengkap')}
                  placeholder="Masukkan nama lengkap"
                />
                <InputField
                  label="Username"
                  icon={User}
                  value={form.username}
                  onChange={set('username')}
                  placeholder="Masukkan username"
                />
                <InputField
                  label="Email"
                  icon={Mail}
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="email@contoh.com"
                />
                <InputField
                  label="No. Telepon"
                  icon={Phone}
                  value={form.telepon}
                  onChange={set('telepon')}
                  placeholder="08xxxxxxxxxx"
                />
                <InputField
                  label="No. KTP"
                  icon={IdCard}
                  value={form.no_ktp}
                  onChange={set('no_ktp')}
                  placeholder="16 digit NIK"
                />
                <InputField
                  label="Alamat"
                  icon={MapPin}
                  value={form.alamat}
                  onChange={set('alamat')}
                  placeholder="Alamat lengkap"
                />
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSimpanProfil}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold transition-colors"
                >
                  <Save size={13} />
                  Simpan Data Diri
                </button>
              </div>
            </SectionCard>

            {/* ── Ubah Password ── */}
            <SectionCard
              icon={Lock}
              title="Ubah Password"
              subtitle="Gunakan kombinasi huruf, angka, dan simbol"
              accentColor="#4f46e5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <PasswordField
                    label="Password Baru"
                    value={form.password}
                    onChange={set('password')}
                    placeholder="Minimal 8 karakter"
                  />

                  {/* Strength bar */}
                  {form.password.length > 0 && (
                    <div className="-mt-1">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="flex-1 h-1 rounded-full transition-all duration-300"
                            style={{
                              background: i <= strength ? strengthMeta[strength]?.color : '#e5e7eb',
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-xs font-semibold" style={{ color: strengthMeta[strength]?.color }}>
                        {strengthMeta[strength]?.label}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <PasswordField
                    label="Konfirmasi Password Baru"
                    value={form.password_confirm}
                    onChange={set('password_confirm')}
                    placeholder="Ulangi password baru"
                  />

                  {/* Match indicator */}
                  {form.password_confirm.length > 0 && (
                    <div
                      className="flex items-center gap-1.5 text-xs font-semibold -mt-1"
                      style={{
                        color: form.password === form.password_confirm ? '#16a34a' : '#dc2626',
                      }}
                    >
                      {form.password === form.password_confirm
                        ? <><CheckCircle size={11} /> Password cocok</>
                        : <><AlertCircle size={11} /> Password tidak cocok</>}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSimpanPassword}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-colors"
                  style={{ background: '#4f46e5' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#4338ca'}
                  onMouseLeave={e => e.currentTarget.style.background = '#4f46e5'}
                >
                  <Save size={13} />
                  Perbarui Password
                </button>
              </div>
            </SectionCard>

          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilAgent;