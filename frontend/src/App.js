import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profil from "./pages/Profil";
import Layanan from "./pages/Layanan";
import Dtipe1 from "./pages/Dtipe1";
import Dtipe2 from "./pages/Dtipe2";
import Dtipe3 from "./pages/Dtipe3";
import Informasijadwal from "./pages/Infojadwal";
import "./index.css";

// --- auth login & register (AUTH) ---
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import LoginAdminAgent from './pages/auth/LoginAdminAgent';


// Admin Pages
import Dashboard from "./admin/Dashboard";
import ManajemenUser from "./admin/ManajemenUser";
import ManajemenAgent from "./admin/ManajemenAgent";
import JadwalTiket from "./admin/JadwalTiket";
import TambahJadwal from "./admin/TambahJadwal";
import EditJadwal from "./admin/EditJadwal";
import DetailJadwal from "./admin/DetailJadwal";
import ManajemenPromo from "./admin/ManajemenPromo";
import TambahPromo from "./admin/TambahPromo";
import DetailPromo from "./admin/DetailPromo";
import EditPromo from "./admin/EditPromo";
import LaporanMonitoring from "./admin/LaporanMonitoring";
import TotalTransaksi from "./admin/Laporan/TotalTransaksi";
import TiketTerjual from "./admin/Laporan/TiketTerjual";
import AgentTransaksi from "./admin/Laporan/AgentTransaksi";
import Dtransaksiagent from "./admin/Laporan/Dtransaksiagent";
import Btransfer from "./admin/Laporan/Btransfer";



// User Pages
import ProfilUser from "./user/Profil";
import DashboardUser from "./user/LayoutUser/DashboardUser";
import Tiket from "./user/Tiket";

// Agent Pages
import DashboardAgent from "./agent/DashboardAgent";
import TiketAgent from "./agent/TiketAgent";
import TiketTerbit from "./agent/TiketTerbit";
import KomisiLaporan from "./agent/KomisiLaporan";
import KomisiAgent from "./agent/KomisiAgent";
import DetailPeriodeAgent from './agent/komisi/detailpriodeagent';

function App() {
  return (
    <Routes>
      {/* Landing Page Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/profil" element={<Profil />} />
      <Route path="/layanan" element={<Layanan />} />
      <Route path="/dtipe1" element={<Dtipe1 />} />
      <Route path="/dtipe2" element={<Dtipe2 />} />
      <Route path="/dtipe3" element={<Dtipe3 />} />
      <Route path="/infojadwal" element={<Informasijadwal />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
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

      {/* User */}
      <Route path="/user" element={<DashboardUser />}>
        <Route index element={<ProfilUser />} />
        <Route path="profil" element={<ProfilUser />} />
        <Route path="tiket" element={<Tiket />} />
      </Route>
    </Routes>
  );
}

export default App;
