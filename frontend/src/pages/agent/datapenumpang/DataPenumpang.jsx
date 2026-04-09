import { isValidNIK, isValidPhone, hasDuplicateValues } from '../../../utils/validators';
export default function DataPenumpang({
  showPassengerPopup,
  activeTrip,
  passengerData,
  selectedSeatsMap,
  setShowPassengerPopup,
  setShowConfirmPopup,
  handlePassengerChange,
}) {
  // Tidak render apapun jika popup tidak aktif atau data trip belum ada
  if (!showPassengerPopup || !activeTrip) return null;
 
  const handleLanjut = () => {
   if (
      passengerData.length !== (selectedSeatsMap[activeTrip.id]?.length || 0) ||
      passengerData.some((p) => !p?.name || !p?.no_ktp || !p?.gender || !p?.phone)
    ) {
      alert("Mohon lengkapi semua data penumpang");
      return;
    }
    // Cek NIK dan no per penumpang
    for (let i = 0; i < passengerData.length; i++) {
      const p = passengerData[i];

      if (!isValidNIK(p.no_ktp)) {
        alert(`NIK Penumpang ${i + 1} salah!\nHarus berupa 16 digit angka tanpa spasi.`);
        return;
      }

      if (!isValidPhone(p.phone)) {
        alert(`No. HP Penumpang ${i + 1} tidak valid!\nHarus diawali '08' (10-13 digit).`);
        return;
      }
    }

    // cek duplicate NIK 
    const semuaNIK = passengerData.map((p) => p.no_ktp);
    if (hasDuplicateValues(semuaNIK)) {
      alert("Terdeteksi NIK Ganda!\nSetiap penumpang dalam rombongan ini harus memiliki NIK yang berbeda.");
      return;
    }

    // jika sudah di cek maka lolo
    setShowPassengerPopup(false);
    setShowConfirmPopup(true);
  };
 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
 
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 rounded-t-2xl flex-shrink-0">
          <h2 className="text-2xl font-extrabold text-white">Data Penumpang</h2>
          <p className="text-blue-100 text-sm mt-1">Lengkapi informasi penumpang sesuai kursi</p>
        </div>
 
        {/* Body scrollable */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {selectedSeatsMap[activeTrip.id]?.map((seat, index) => (
            <div key={index} className="border rounded-xl p-4 space-y-3">
              <h4 className="font-semibold text-gray-700">
                Penumpang {index + 1} (Kursi {seat})
              </h4>
              <input
                type="text"
                name="name"
                placeholder="Nama Lengkap"
                className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
                value={passengerData[index]?.name || ""}
                onChange={(e) => handlePassengerChange(index, e)}
              />
              <input
                type="text"
                name="no_ktp"
                placeholder="No. KTP"
                className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
                value={passengerData[index]?.no_ktp || ""}
                onChange={(e) => handlePassengerChange(index, e)}
              />
              <select
                name="gender"
                className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
                value={passengerData[index]?.gender || ""}
                onChange={(e) => handlePassengerChange(index, e)}
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
              <input
                type="tel"
                name="phone"
                placeholder="No. HP"
                className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
                value={passengerData[index]?.phone || ""}
                onChange={(e) => handlePassengerChange(index, e)}
              />
            </div>
          ))}
        </div>
 
        {/* Footer fixed */}
        <div className="px-6 pb-6 pt-3 flex gap-3 flex-shrink-0 border-t border-gray-100">
          <button
            onClick={() => setShowPassengerPopup(false)}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleLanjut}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all text-sm"
          >
            Simpan dan Lanjut
          </button>
        </div>
 
      </div>
    </div>
  );
}