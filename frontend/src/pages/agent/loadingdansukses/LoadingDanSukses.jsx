// src/agent/loadingdansukses/LoadingDanSukses.jsx
// Menggabungkan POPUP 3 (Loading) dan POPUP 4 (Success) dalam satu file
// Tidak perlu import diri sendiri — langsung export default

export default function LoadingDanSukses({
  showLoadingPopup,
  showSuccessPopup,
  activeTrip,
  selectedSeatsMap,
  setShowSuccessPopup,
  setPassengerData,
  setOpenTripId,
  setSelectedSeatsMap,
}) {
  // Tidak render apapun jika kedua popup tidak aktif
  if (!showLoadingPopup && !showSuccessPopup) return null;

  const jumlahTiket = activeTrip
    ? (selectedSeatsMap[activeTrip.id] || []).length
    : 0;

  const handlePesananBaru = () => {
    setShowSuccessPopup(false);
    setPassengerData([]);
    setOpenTripId(null);
    setSelectedSeatsMap({});
  };

  const handleLihatTiket = () => {
    setShowSuccessPopup(false);
    // Uncomment jika sudah ada halaman tiket terbit:
    // navigate("/agent/tiket-terbit");
  };

  return (
    <>
      {/* ===== POPUP 3: LOADING ===== */}
      {showLoadingPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center w-full max-w-sm">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Memproses Pemesanan...
            </h3>
            <p className="text-gray-600 text-sm">
              Mohon tunggu sebentar, sedang menghitung komisi
            </p>
          </div>
        </div>
      )}

      {/* ===== POPUP 4: SUCCESS ===== */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="pt-8 pb-4 text-center">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                <svg
                  className="w-14 h-14 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <div className="px-8 pb-8 text-center">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-3">
                Pemesanan Tiket Berhasil!
              </h3>
              <p className="text-gray-600 mb-6">
                Tiket telah diterbitkan dan komisi telah dicatat ke akun Anda.
              </p>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <span className="font-bold text-blue-600">{jumlahTiket}</span>{" "}
                  tiket telah diterbitkan
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleLihatTiket}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                >
                  Lihat Tiket Terbit
                </button>
                <button
                  onClick={handlePesananBaru}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Buat Pemesanan Baru
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}