
// import React, { useMemo } from "react";

// const SeatGridInline22 = ({ seats, onToggleSeat }) => {
//   const rows = useMemo(() => [...new Set(seats.map((s) => s.row))].sort(), [seats]);
//   const leftCols = [1, 2];
//   const rightCols = [3, 4];

//   return (
//     <div className="bg-white p-6 rounded-md shadow-sm">
//       <div className="flex items-start">
//         <div className="pr-4 flex flex-col items-center">
//           <div className="w-8 h-8 rounded-full border flex items-center justify-center text-gray-400">
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-300">
//               <circle cx="12" cy="12" r="10" stroke="#cbd5e1" strokeWidth="1.5" />
//             </svg>
//           </div>
//           <div className="h-full border-l border-gray-200 ml-3" style={{ height: "240px" }} />
//         </div>

//         <div className="flex gap-6">
//           <div>
//             {rows.map((r) => (
//               <div key={`L-${r}`} className="flex gap-3 mb-3">
//                 {leftCols.map((c) => {
//                   const seat = seats.find((s) => s.row === r && s.col === c);
//                   const base = "w-12 h-12 rounded-sm flex items-center justify-center text-sm border";
//                   const cls = seat
//                     ? seat.available
//                       ? seat.selected
//                         ? `${base} bg-gray-300 text-gray-800 shadow-sm cursor-pointer`
//                         : `${base} bg-white text-gray-700 hover:bg-blue-50 cursor-pointer`
//                       : `${base} bg-gray-200 text-gray-400 cursor-not-allowed`
//                     : `${base} bg-transparent`;

//                   return (
//                     <div
//                       key={`${r}${c}`}
//                       className={cls}
//                       onClick={() => seat && seat.available && onToggleSeat(seat.id)}
//                       title={seat ? `${seat.id} — ${seat.available ? "Tersedia" : "Tidak tersedia"}` : ""}
//                       aria-disabled={seat ? !seat.available : false}
//                     >
//                       {seat ? seat.id : ""}
//                     </div>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>

//           <div className="flex items-center">
//             <div className="h-full border-l-2 border-dashed border-gray-200 mx-4" style={{ height: "240px" }} />
//           </div>

//           <div>
//             {rows.map((r) => (
//               <div key={`R-${r}`} className="flex gap-3 mb-3">
//                 {rightCols.map((c) => {
//                   const seat = seats.find((s) => s.row === r && s.col === c);
//                   const base = "w-12 h-12 rounded-sm flex items-center justify-center text-sm border";
//                   const cls = seat
//                     ? seat.available
//                       ? seat.selected
//                         ? `${base} bg-gray-300 text-gray-800 shadow-sm cursor-pointer`
//                         : `${base} bg-white text-gray-700 hover:bg-blue-50 cursor-pointer`
//                       : `${base} bg-gray-200 text-gray-400 cursor-not-allowed`
//                     : `${base} bg-transparent`;

//                   return (
//                     <div
//                       key={`${r}${c}`}
//                       className={cls}
//                       onClick={() => seat && seat.available && onToggleSeat(seat.id)}
//                       title={seat ? `${seat.id} — ${seat.available ? "Tersedia" : "Tidak tersedia"}` : ""}
//                       aria-disabled={seat ? !seat.available : false}
//                     >
//                       {seat ? seat.id : ""}
//                     </div>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SeatGridInline22;
