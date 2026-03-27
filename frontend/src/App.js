import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import "./index.css";

// ---  AUTH PAGES ---
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import LoginAdminAgent from './pages/auth/LoginAdminAgent';
import VerifyEmail from './pages/auth/VerifyEmail';

// ---  PUBLIC PAGES ---
import Home from "./pages/public/Home";
import ProfilPerusahaan from "./pages/public/Profil";
import Layanan from "./pages/public/Layanan";
import Dtipe1 from "./pages/public/Dtipe1";
import Dtipe2 from "./pages/public/Dtipe2";
import Dtipe3 from "./pages/public/Dtipe3";
import Informasijadwal from "./pages/public/Infojadwal";

// ---  USER PAGES ---
import DashboardUser from "./pages/user/LayoutUser/DashboardUser";
import ProfilUser from "./pages/user/Profil";
import Tiket from "./pages/user/Tiket";
import PesananSaya from "./pages/user/PesananSaya";
import PaymentSuccess from './pages/user/checkout/PaymentSuccess';

// ---  ADMIN PAGES  ---
import Dashboard from "./pages/admin/Dashboard";
import ManajemenUser from "./pages/admin/ManajemenUser";
import ManajemenAgent from "./pages/admin/ManajemenAgent";
import JadwalTiket from "./pages/admin/JadwalTiket";
import TambahJadwal from "./pages/admin/TambahJadwal";
import EditJadwal from "./pages/admin/EditJadwal";
import DetailJadwal from "./pages/admin/DetailJadwal";
import ManajemenPromo from "./pages/admin/ManajemenPromo";
import TambahPromo from "./pages/admin/TambahPromo";
import DetailPromo from "./pages/admin/DetailPromo";
import EditPromo from "./pages/admin/EditPromo";
import LaporanMonitoring from "./pages/admin/LaporanMonitoring";
import TotalTransaksi from "./pages/admin/Laporan/TotalTransaksi";
import TiketTerjual from "./pages/admin/Laporan/TiketTerjual";
import AgentTransaksi from "./pages/admin/Laporan/AgentTransaksi";
import Dtransaksiagent from "./pages/admin/Laporan/Dtransaksiagent";
import Btransfer from "./pages/admin/Laporan/Btransfer";

// ---  AGENT PAGES  ---
import DashboardAgent from "./pages/agent/DashboardAgent";
import TiketAgent from "./pages/agent/TiketAgent";
import TiketTerbit from "./pages/agent/TiketTerbit";
import KomisiLaporan from "./pages/agent/KomisiLaporan";
import KomisiAgent from "./pages/agent/KomisiAgent";
import DetailPeriodeAgent from './pages/agent/komisi/detailpriodeagent';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Landing Page Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/profil" element={<ProfilPerusahaan />} />
        <Route path="/layanan" element={<Layanan />} />
        <Route path="/dtipe1" element={<Dtipe1 />} />
        <Route path="/dtipe2" element={<Dtipe2 />} />
        <Route path="/dtipe3" element={<Dtipe3 />} />
        <Route path="/infojadwal" element={<Informasijadwal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/loginadminagent" element={<LoginAdminAgent />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/manajemenuser" element={<ManajemenUser />} />
        <Route path="/admin/manajemenagent" element={<ManajemenAgent />} />
        <Route path="/admin/jadwaltiket" element={<JadwalTiket />} />
        <Route path="/admin/tambah-jadwal" element={<TambahJadwal />} />
        <Route path="/admin/edit-jadwal/:id" element={<EditJadwal />} />
        <Route path="/admin/detail-jadwal/:id" element={<DetailJadwal />} />
        <Route path="/admin/manajemenpromo" element={<ManajemenPromo />} />
        <Route path="/admin/TambahPromo" element={<TambahPromo />} />
        <Route path="/admin/DetailPromo/:id" element={<DetailPromo />} />
        <Route path="/admin/EditPromo/:id" element={<EditPromo />} />
        <Route path="/admin/laporanmonitoring" element={<LaporanMonitoring />} />
        <Route path="/admin/Laporan/transaksi" element={<TotalTransaksi />} />
        <Route path="/admin/Laporan/tiketterjual" element={<TiketTerjual />} />
        <Route path="/admin/Laporan/agentransaksi" element={<AgentTransaksi />} />
        <Route path="/admin/Laporan/Dtransaksiagent/:id" element={<Dtransaksiagent />} />
        <Route path="/admin/Laporan/btransfer" element={<Btransfer />} />

        {/* Agent Routes */}
        <Route path="/agent/dashboard" element={<DashboardAgent />} />
        <Route path="/agent/tiketagent" element={<TiketAgent />} />
        <Route path="/agent/tiketterbit" element={<TiketTerbit />} />
        <Route path="/agent/komisilaporan" element={<KomisiLaporan />} />
        <Route path="/agent/komisiagent" element={<KomisiAgent />} />
        <Route path="/agent/komisi/detailpriodeagent/:id" element={<DetailPeriodeAgent />} />

        {/* User Routes (Nested) */}
        <Route path="/user" element={<DashboardUser />}>
          <Route index element={<ProfilUser />} />
          <Route path="profil" element={<ProfilUser />} />
          <Route path="tiket" element={<Tiket />} />
          <Route path="pesanansaya" element={<PesananSaya />} />
          <Route path="payment-success/:orderId" element={<PaymentSuccess />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;