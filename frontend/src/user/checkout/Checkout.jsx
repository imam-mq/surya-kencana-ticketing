import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaTicketAlt, FaUser } from "react-icons/fa";

const Checkout = ({ data, onBack }) => {
  const { trip, seats } = data;
  const hargaPerTiket = Number(trip.harga || 0);
  const totalHargaAwal = seats.length * hargaPerTiket;

  const [penumpang, setPenumpang] = useState(
    seats.map(seat => ({ kursi: seat, nama: "", nik: "", telepon: "", gender: "" }))
  );

  const [promoTerpilih, setPromoTerpilih] = useState(null);
  const [showPromoList, setShowPromoList] = useState(false);
  
  // 🔴 1. State untuk menampung Promo Asli dari Django
  const [promos, setPromos] = useState([]);
  const [loadingProses, setLoadingProses] = useState(false);

  // 🔴 2. Ambil data Promo yang statusnya 'active' saat layar ini dibuka
  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/accounts/user/active-promo/");
        const data = await res.json();
        setPromos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Gagal memuat promo:", error);
      }
    };
    fetchPromos();
  }, []);

  const nominalDiskon = promoTerpilih ? (totalHargaAwal * promoTerpilih.persen_diskon) / 100 : 0;
  const hargaAkhir = totalHargaAwal - nominalDiskon;

  const handlePenumpangChange = (index, field, value) => {
    const newPenumpang = [...penumpang];
    newPenumpang[index][field] = value;
    setPenumpang(newPenumpang);
  };

  const handlePilihPromo = (promo) => {
    setPromoTerpilih(promo);
    setShowPromoList(false);
  };

  // 🔴 3. Fungsi Tembak Data ke API user_create_order
  const handleCheckout = async () => {
    // Validasi: Pastikan form nama dan NIK tidak kosong
    const isPenumpangValid = penumpang.every(p => p.nama.trim() !== "" && p.nik.trim() !== "");
    if (!isPenumpangValid) {
      alert("Mohon lengkapi Nama dan NIK semua penumpang terlebih dahulu!");
      return;
    }

    setLoadingProses(true);

    // Ambil token login User (Sesuaikan dengan cara Abang nyimpen token, biasanya di localStorage)
    const token = localStorage.getItem("token"); 

    const payload = {
      jadwal_id: trip.id,
      penumpang: penumpang, // Array of {kursi, nama, nik}
      promosi_id: promoTerpilih ? promoTerpilih.id : null
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/accounts/user/order/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Wajib ada karena pakai IsAuthenticated
        },
        body: JSON.stringify(payload)
      });
      
      const responseData = await res.json();
      
      if (res.ok) {
        alert("Mantap! Pesanan berhasil dibuat dengan ID: " + responseData.order_id);
        // Nanti di sini kita arahkan ke halaman Midtrans
      } else {
        alert("Gagal: " + (responseData.error || "Terjadi kesalahan sistem"));
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan. Cek koneksi internet Anda.");
    } finally {
      setLoadingProses(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        
        <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-6 transition">
          <FaArrowLeft className="mr-2" /> Kembali ke Pencarian Tiket
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Detail Pemesanan & Pembayaran</h2>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* KOLOM KIRI: Form Penumpang */}
          <div className="flex-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Informasi Keberangkatan</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-gray-500">Rute</p><p className="font-bold text-gray-900">{trip.asal} &rarr; {trip.tujuan}</p></div>
                <div><p className="text-gray-500">Waktu</p><p className="font-bold text-gray-900">{new Date(trip.waktu_keberangkatan).toLocaleString("id-ID")}</p></div>
                <div><p className="text-gray-500">Bus</p><p className="font-bold text-gray-900">{trip.bus_name} ({trip.bus_type})</p></div>
                <div><p className="text-gray-500">Nomor Kursi</p><p className="font-bold text-blue-600">{seats.join(", ")}</p></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Data Penumpang</h3>
              <div className="space-y-6">
                {penumpang.map((p, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2"><FaUser /> Penumpang {index + 1} (Kursi: {p.kursi})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Nama Lengkap Sesuai KTP</label>
                            <input type="text" value={p.nama} onChange={(e) => handlePenumpangChange(index, "nama", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" placeholder="Masukkan nama" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Nomor Induk Kependudukan (NIK)</label>
                            <input type="text" value={p.nik} onChange={(e) => handlePenumpangChange(index, "nik", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" placeholder="Masukkan NIK" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Nomor Induk Kependudukan (NIK)</label>
                            <input type="text" value={p.nik} onChange={(e) => handlePenumpangChange(index, "telepon", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" placeholder="Masukkan Nomor Telpon Anda" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Jenis Kelamin</label>
                            <select value={p.gender} onChange={(e) => handlePenumpangChange(index, "gender", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 bg-white">
                                <option value="" disabled>-- Pilih Jenis Kelamin --</option>
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: Rincian Harga & Promo */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Rincian Harga</h3>
              
              <div className="flex justify-between text-sm text-gray-600 mb-3">
                <span>Tiket ({seats.length}x)</span>
                <span className="font-medium text-gray-900">Rp {totalHargaAwal.toLocaleString('id-ID')}</span>
              </div>

              {/* FITUR VOUCHER KLIK */}
              <div className="my-5">
                {!promoTerpilih ? (
                  <button onClick={() => setShowPromoList(!showPromoList)} className="w-full flex items-center justify-between border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-2.5 px-4 rounded-lg text-sm transition dashed-border">
                    <span className="flex items-center gap-2"><FaTicketAlt /> Makin Hemat Pakai Promo!</span>
                    <span>Pilih &rarr;</span>
                  </button>
                ) : (
                  <div className="border border-green-300 bg-green-50 p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-green-700 flex items-center gap-1"><FaTicketAlt /> {promoTerpilih.nama}</p>
                      <p className="text-xs text-green-600">Diskon {promoTerpilih.persen_diskon}% terpasang</p>
                    </div>
                    <button onClick={() => setPromoTerpilih(null)} className="text-xs text-red-500 hover:text-red-700 font-bold underline">Batal</button>
                  </div>
                )}

                {/* Dropdown List Promo Asli */}
                {showPromoList && (
                  <div className="mt-2 border border-gray-200 rounded-lg shadow-md max-h-48 overflow-y-auto bg-white absolute z-10 w-full left-0 md:static">
                    {promos.length > 0 ? promos.map(promo => (
                      <div key={promo.id} className="p-3 border-b hover:bg-gray-50 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-sm text-gray-800">{promo.nama}</p>
                          <p className="text-xs text-gray-500">{promo.deskripsi}</p>
                        </div>
                        <button onClick={() => handlePilihPromo(promo)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-700">Gunakan</button>
                      </div>
                    )) : (
                      <div className="p-3 text-center text-xs text-gray-500">Belum ada promo aktif hari ini.</div>
                    )}
                  </div>
                )}
              </div>

              {promoTerpilih && (
                <div className="flex justify-between text-sm text-green-600 mb-3 font-semibold">
                  <span>Potongan Promo</span>
                  <span>- Rp {nominalDiskon.toLocaleString('id-ID')}</span>
                </div>
              )}

              <div className="border-t border-dashed border-gray-300 my-4"></div>

              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-gray-800">Total Bayar</span>
                <div className="text-right">
                  {promoTerpilih && <p className="text-xs text-gray-400 line-through">Rp {totalHargaAwal.toLocaleString('id-ID')}</p>}
                  <span className="text-2xl font-black text-blue-600">Rp {hargaAkhir.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout} 
                disabled={loadingProses}
                className={`w-full py-3 rounded-xl font-bold text-sm transition shadow-md ${loadingProses ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                {loadingProses ? 'Memproses...' : 'Lanjut Pembayaran (Midtrans)'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;