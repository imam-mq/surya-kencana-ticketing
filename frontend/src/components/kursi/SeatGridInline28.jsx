import React, { useMemo } from "react";

/**
 * SeatGridInline28
 * expects props:
 *  - seats: array [{ id, row, col, available, selected }]
 *  - onToggleSeat(id)
 *
 * Renders rows; each row shows leftCols, spacer, rightCols in same horizontal line.
 */
const SeatGridInline28 = ({ seats = [], onToggleSeat }) => {
  const rows = useMemo(() => {
    // ensure seats is array
    const arr = Array.isArray(seats) ? seats : [];
    return [...new Set(arr.map((s) => s.row))].sort();
  }, [seats]);

  const leftCols = [1, 2];
  const rightCols = [3, 4];

  return (
    <div className="bg-white p-6 rounded-md shadow-sm">
      <div className="flex items-start">
        <div className="pr-4 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full border flex items-center justify-center text-gray-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-300">
              <circle cx="12" cy="12" r="10" stroke="#cbd5e1" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="h-full border-l border-gray-200 ml-3" style={{ height: "240px" }} />
        </div>

        <div className="flex flex-col gap-3">
          {rows.map(r => (
            <div key={r} className="flex items-center gap-4">
              {/* left cols */}
              <div className="flex gap-3">
                {leftCols.map(c => {
                  const seat = seats.find(s => s.row === r && Number(s.col) === c);
                  const base = "w-12 h-12 rounded-sm flex items-center justify-center text-sm border";
                  const cls = seat
                    ? seat.available
                      ? seat.selected
                        ? `${base} bg-gray-300 text-gray-800 shadow-sm cursor-pointer`
                        : `${base} bg-white text-gray-700 hover:bg-blue-50 cursor-pointer`
                      : `${base} bg-gray-200 text-gray-400 cursor-not-allowed`
                    : `${base} bg-transparent`;
                  return (
                    <div
                      key={`${r}${c}`}
                      className={cls}
                      onClick={() => seat && seat.available && onToggleSeat(seat.id)}
                      title={seat ? `${seat.id} — ${seat.available ? "Tersedia" : "Tidak tersedia"}` : ""}
                      aria-disabled={seat ? !seat.available : false}
                    >
                      {seat ? seat.id : ""}
                    </div>
                  );
                })}
              </div>

              {/* aisle */}
              <div className="mx-3">
                <div className="h-8 border-l-2 border-dashed border-gray-200" />
              </div>

              {/* right cols */}
              <div className="flex gap-3">
                {rightCols.map(c => {
                  const seat = seats.find(s => s.row === r && Number(s.col) === c);
                  const base = "w-12 h-12 rounded-sm flex items-center justify-center text-sm border";
                  const cls = seat
                    ? seat.available
                      ? seat.selected
                        ? `${base} bg-gray-300 text-gray-800 shadow-sm cursor-pointer`
                        : `${base} bg-white text-gray-700 hover:bg-blue-50 cursor-pointer`
                      : `${base} bg-gray-200 text-gray-400 cursor-not-allowed`
                    : `${base} bg-transparent`;
                  return (
                    <div
                      key={`${r}${c}`}
                      className={cls}
                      onClick={() => seat && seat.available && onToggleSeat(seat.id)}
                      title={seat ? `${seat.id} — ${seat.available ? "Tersedia" : "Tidak tersedia"}` : ""}
                      aria-disabled={seat ? !seat.available : false}
                    >
                      {seat ? seat.id : ""}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatGridInline28;
