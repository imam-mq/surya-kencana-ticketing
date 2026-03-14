// src/agent/konfirmasipemesanan/KonfirmasiPemesanan.jsx
// Tidak ada import diri sendiri di sini — langsung export default

export default function KonfirmasiPemesanan({
  showConfirmPopup,
  activeTrip,
  passengerData,
  selectedSeatsMap,
  showLoadingPopup,
  setShowConfirmPopup,
  handleConfirmBooking,
}) {
  if (!showConfirmPopup || !activeTrip) return null;

  const jumlahKursi = selectedSeatsMap[activeTrip.id]?.length || 0;
  const harga = Number(activeTrip.harga || 0);
  const total = jumlahKursi * harga;

  const jamBerangkat = new Date(activeTrip.waktu_keberangkatan).toLocaleTimeString(
    "id-ID",
    { hour: "2-digit", minute: "2-digit" }
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 rounded-t-2xl flex-shrink-0">
          <h2 className="text-xl font-extrabold text-white">Konfirmasi Pemesanan</h2>
          <p className="text-green-100 text-sm mt-1">Periksa kembali detail pemesanan</p>
        </div>

        {/* Body scrollable */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4">

          {/* Detail Perjalanan */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 text-base mb-3">Detail Perjalanan</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Bis</p>
                <p className="font-bold text-gray-900 mt-0.5">{activeTrip.bus_name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Jam</p>
                <p className="font-bold text-gray-900 mt-0.5">{jamBerangkat}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Keberangkatan</p>
                <p className="font-bold text-gray-900 mt-0.5">{activeTrip.asal}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Kedatangan</p>
                <p className="font-bold text-gray-900 mt-0.5">{activeTrip.tujuan}</p>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-gray-200" />

          {/* Data Penumpang */}
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 text-base">Data Penumpang</h3>
              <span className="text-xs font-semibold bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">
                {passengerData.length} kursi
              </span>
            </div>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {passengerData.map((p, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-purple-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                  </div>
                  <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full flex-shrink-0">
                    Kursi {selectedSeatsMap[activeTrip.id]?.[index]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Pembayaran */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Pembayaran</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {jumlahKursi} kursi × Rp {harga.toLocaleString("id-ID")}
                </p>
              </div>
              <p className="text-2xl font-extrabold text-green-600 whitespace-nowrap">
                Rp {total.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center italic">
            Klik konfirmasi jika sudah menerima pembayaran
          </p>
        </div>

        {/* Footer fixed */}
        <div className="px-6 pb-5 pt-3 flex gap-3 flex-shrink-0 border-t border-gray-100">
          <button
            onClick={() => setShowConfirmPopup(false)}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleConfirmBooking}
            disabled={showLoadingPopup}
            className={`flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg text-sm ${
              showLoadingPopup ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {showLoadingPopup ? "Memproses..." : "Konfirmasi & Terbitkan Tiket"}
          </button>
        </div>

      </div>
    </div>
  );
}