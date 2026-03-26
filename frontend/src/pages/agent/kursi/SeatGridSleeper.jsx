import React, { useEffect } from "react";

/**
 * SeatGridSleeper
 * props:
 *  - seats: { lantaiAtas: [...], lantaiBawah: [...] }
 *  - onToggleSeat(id)
 *
 * Each seat item expected: { id, row, col, available, selected }
 */
const SeatGridSleeper = ({ seats = { lantaiAtas: [], lantaiBawah: [] }, onToggleSeat }) => {
  const { lantaiAtas = [], lantaiBawah = [] } = seats || {};

  useEffect(() => {
    console.log("lantaiAtas:", lantaiAtas);
    console.log("lantaiBawah:", lantaiBawah);  // Debugging untuk melihat apakah data sudah sesuai
}, [lantaiAtas, lantaiBawah]);


  const SeatButton = ({ seat }) => {
    const isSelected = !!seat.selected;
    const isSold = seat.available === false;
    return (
      <button
        onClick={() => !isSold && onToggleSeat(seat.id)}
        disabled={isSold}
        className={`w-12 h-12 flex items-center justify-center rounded border-2 font-semibold text-xs transition-all duration-150
          ${isSelected ? "bg-blue-600 text-white border-blue-600 shadow-md" :
            isSold ? "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed" :
            "bg-white text-gray-700 border-gray-300 hover:border-blue-400 cursor-pointer"}`}
      >
        {seat.id}
      </button>
    );
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg space-y-6">
      {/* Lantai Bawah */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-lg font-bold text-gray-800">Lantai Bawah</h2>
          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">Lebih luas & nyaman</span>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-6">
            {/* Entrance */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border flex items-center justify-center bg-gray-50">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xs text-gray-600 mt-2">PINTU</span>
            </div>

            <div className="border-r-2 border-gray-200 h-24" />

            <div className="flex-1">
              <div className="grid grid-cols-5 gap-3">
                {lantaiBawah.map(seat => <SeatButton key={seat.id} seat={seat} />)}
              </div>
            </div>

            
          </div>
        </div>
      </div>

      {/* Lantai Atas */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-lg font-bold text-gray-800">Lantai Atas</h2>
          <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">Lebih kompak</span>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border flex items-center justify-center bg-gray-50">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xs text-gray-600 mt-2">PINTU</span>
            </div>

            <div className="border-r-2 border-gray-200 h-24" />

            <div className="flex-1">
              <div className="grid grid-cols-6 gap-3">
                {lantaiAtas.map(seat => <SeatButton key={seat.id} seat={seat} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatGridSleeper;
