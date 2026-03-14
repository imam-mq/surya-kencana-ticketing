import { FaSearch, FaDownload } from "react-icons/fa";

export default function TabelTiket({
  currentTickets,
  filtered,
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  setCurrentPage,
  indexOfFirstItem,
  indexOfLastItem,
  totalPages,
  downloadingId,
  handleDownload,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">

      {/* Dropdown lihat data */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span>Lihat</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value={7}>7</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>data</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              {[
                "No",
                "Tanggal Transaksi",
                "Nama Penumpang",
                "Tipe Bus",
                "Jam",
                "Jadwal",
                "Keberangkatan",
                "Kedatangan",
                "Status",
                "Download Tiket",
              ].map((col) => (
                <th
                  key={col}
                  className="py-3 px-6 text-left text-sm font-semibold text-gray-900"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentTickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 text-sm text-gray-900">{ticket.no}</td>
                <td className="py-4 px-6 text-sm text-gray-900">{ticket.tanggal_transaksi}</td>
                <td className="py-4 px-6 text-sm text-gray-900">{ticket.penumpang}</td>
                <td className="py-4 px-6 text-sm text-gray-900">{ticket.tipeRis}</td>
                <td className="py-4 px-6 text-sm text-gray-900">{ticket.jam}</td>
                <td className="py-4 px-1">
                  <span className="inline-flex items-center px-1 py-2 rounded text-xs font-bold bg-blue-100 text-blue-700">
                    {ticket.jadwal}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-900">{ticket.asal}</td>
                <td className="py-4 px-6 text-sm text-gray-900">{ticket.tujuan}</td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                    {ticket.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => handleDownload(ticket.id)}
                    disabled={downloadingId === ticket.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-medium transition-all ${
                      downloadingId === ticket.id
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {downloadingId === ticket.id ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12" cy="12" r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Menyiapkan...</span>
                      </>
                    ) : (
                      <>
                        <FaDownload />
                        <span>Download</span>
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {currentTickets.length === 0 && (
        <div className="py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FaSearch className="text-3xl text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium">Tidak ada tiket ditemukan</p>
          <p className="text-gray-400 text-sm mt-1">Coba kata kunci pencarian lain</p>
        </div>
      )}

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Lihat {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filtered.length)} of{" "}
            {filtered.length} data
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &lt;
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}