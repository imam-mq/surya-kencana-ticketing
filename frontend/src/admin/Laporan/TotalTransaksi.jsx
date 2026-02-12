import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import AdminNavbar from "../layout/AdminNavbar";
import { FaTicketAlt, FaPercent, FaMoneyBillWave, FaHandHoldingUsd } from "react-icons/fa";

const TotalTransaksi = () => {
 

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <AdminNavbar />
        <div className="p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Laporan Total Transaksi
          </h2>
          <br />

          {/* Card Grid */}
          
        </div>
      </div>
    </div>
  );
};

export default TotalTransaksi;
