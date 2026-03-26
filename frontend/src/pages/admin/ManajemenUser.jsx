import React, { useEffect, useState } from "react";
import Sidebar from "./layout/Sidebar";
import AdminNavbar from "./layout/AdminNavbar";
import { getAdminUsers } from "../../api/adminApi"; // Import API Luar

const ManajemenUser = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Menggunakan API Luar
    getAdminUsers()
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data && Array.isArray(data.results)) {
          setUsers(data.results);
        } else {
          setUsers([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setUsers([]);
      });
  }, []);

  const filteredUsers = users.filter((u) =>
    (u?.username || "").toLowerCase().includes(search.toLowerCase()) ||
    (u?.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <AdminNavbar />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Data User</h2>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Cari Data User (Nama atau Email)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-3 py-2 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full border-collapse text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border-b px-4 py-3 font-semibold">ID</th>
                  <th className="border-b px-4 py-3 font-semibold">Nama User</th>
                  <th className="border-b px-4 py-3 font-semibold">Email</th>
                  <th className="border-b px-4 py-3 font-semibold">Peran</th>
                  <th className="border-b px-4 py-3 font-semibold">Status</th>
                  <th className="border-b px-4 py-3 font-semibold">Tanggal Daftar</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors border-b">
                      <td className="px-4 py-3 text-gray-500">{user.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{user.username}</td>
                      <td className="px-4 py-3 text-gray-600">{user.email || "-"}</td>
                      <td className="px-4 py-3 capitalize">{user.peran || "User"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${user.status === 'active' || user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {user.status === 'active' || user.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {user.date_joined || user.dibuat_pada ? new Date(user.date_joined || user.dibuat_pada).toLocaleDateString("id-ID") : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Tidak ada data user ditemukan.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManajemenUser;