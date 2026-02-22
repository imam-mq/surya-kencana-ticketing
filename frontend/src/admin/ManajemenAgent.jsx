import React, { useEffect, useState } from "react";
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "./layout/Sidebar";
import AdminNavbar from "./layout/AdminNavbar";

const API_BASE = "http://127.0.0.1:8000";

// ===============================
// 1. SUB-KOMPONEN: MODAL FORM (Tambah/Edit)
// ===============================
const AgentFormModal = ({ visible, mode = "create", initial = {}, onClose, onSaved }) => {
  const [form, setForm] = useState({
    username: "", 
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    password_confirm: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible) {
      setForm({
        username: initial.username || "",
        first_name: initial.first_name || "",
        last_name: initial.last_name || "",
        email: initial.email || "",
        phone: initial.telepon || initial.phone || "",
        location: initial.alamat || initial.location || "",
        password: "",
        password_confirm: "",
      });
      setError(null);
    }
  }, [initial, visible]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e && e.preventDefault();
    setError(null);

    // Validasi
    if (!form.username || !form.email) {
      setError("Username dan Email wajib diisi.");
      return;
    }
    if (mode === "create") {
      if (!form.password || form.password.length < 8) {
        setError("Password minimal 8 karakter.");
        return;
      }
      if (form.password !== form.password_confirm) {
        setError("Password dan konfirmasi tidak cocok.");
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        username: form.username,
        email: form.email,
        nama_lengkap: `${form.first_name} ${form.last_name}`.trim(),
        telepon: form.phone,
        alamat: form.location,
      };

      if (mode === "create") {
        payload.password = form.password;
      } 

      const url = mode === "create"
        ? `${API_BASE}/api/accounts/agents/add/`
        : `${API_BASE}/api/accounts/agents/${initial.id}/update/`; // Pastikan endpoint update ada jika ingin edit

      const method = mode === "create" ? "POST" : "PUT";

      // 🟡 PERBAIKAN: Gunakan credentials: 'include' agar Cookie terkirim
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // <--- PENTING: Untuk mengirim Session Cookie
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data.detail || data.message || data.error || JSON.stringify(data);
        setError(msg);
        return;
      }

      onSaved && onSaved(data, mode === "create" ? "create" : "edit");
      onClose && onClose();
    } catch (err) {
      console.error("Submit agent error:", err);
      setError("Gagal menyimpan. Periksa koneksi server.");
    } finally {
      setSaving(false);
    }
  };

  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={submit} className="bg-white w-full max-w-2xl rounded-lg shadow p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{mode === "create" ? "Tambah Agent" : "Edit Agent"}</h3>
          <button type="button" onClick={onClose} className="text-gray-600 hover:text-gray-800">Tutup</button>
        </div>

        {error && <div className="mb-3 p-2 bg-red-100 text-sm text-red-600 rounded">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="username" value={form.username} onChange={onChange} placeholder="Username (Login)" className="border rounded px-3 py-2" disabled={mode === 'edit'} />
          <input name="email" value={form.email} onChange={onChange} placeholder="Email" type="email" className="border rounded px-3 py-2" />
          
          <input name="first_name" value={form.first_name} onChange={onChange} placeholder="Nama Depan" className="border rounded px-3 py-2" />
          <input name="last_name" value={form.last_name} onChange={onChange} placeholder="Nama Belakang" className="border rounded px-3 py-2" />
          
          <input name="phone" value={form.phone} onChange={onChange} placeholder="Nomor Telepon" className="border rounded px-3 py-2" />
          <input name="location" value={form.location} onChange={onChange} placeholder="Alamat / Lokasi" className="border rounded px-3 py-2" />
          
          <div className="col-span-1 md:col-span-2 mt-2 border-t pt-2">
            <p className="text-sm text-gray-500 mb-2">{mode === "create" ? "Set Password" : "Ubah Password (Kosongkan jika tidak ingin mengubah)"}</p>
          </div>
          
          <input name="password" value={form.password} onChange={onChange} placeholder="Password" type="password" className="border rounded px-3 py-2" />
          <input name="password_confirm" value={form.password_confirm} onChange={onChange} placeholder="Konfirmasi Password" type="password" className="border rounded px-3 py-2" />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-50">Batal</button>
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{saving ? "Menyimpan..." : "Simpan"}</button>
        </div>
      </form>
    </div>
  );
};

// ===============================
// 2. SUB-KOMPONEN: MODAL DETAIL
// ===============================
const AgentDetailModal = ({ visible, agent, onClose }) => {
  if (!visible || !agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Detail Agent</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">✕</button>
        </div>

        <div className="space-y-3 text-gray-700">
          <p><strong>Username:</strong> {agent.username}</p>
          <p><strong>Nama Lengkap:</strong> {agent.nama_lengkap || `${agent.first_name} ${agent.last_name}`}</p>
          <p><strong>Email:</strong> {agent.email}</p>
          <p><strong>Role:</strong> {agent.peran || agent.role}</p>
          <p><strong>Telepon:</strong> {agent.telepon || agent.phone || "-"}</p>
          <p><strong>Alamat:</strong> {agent.alamat || agent.location || "-"}</p>
          <p><strong>Tanggal Bergabung:</strong> {agent.date_joined || agent.dibuat_pada || "-"}</p>
        </div>

        <div className="flex justify-end mt-5">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Tutup</button>
        </div>
      </div>
    </div>
  );
};

// ===============================
// 3. SUB-KOMPONEN: MODAL HAPUS
// ===============================
const DeleteConfirmModal = ({ visible, agent, onConfirm, onCancel }) => {
  if (!visible || !agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-red-600 mb-2 flex justify-center items-center gap-2">
          ⚠️ Hapus Data?
        </h3>
        <p className="text-gray-700 mb-5">
          Apakah anda yakin ingin menghapus agent <br />
          <span className="font-semibold text-red-600">[{agent.username}] {agent.nama_lengkap}</span>?
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Hapus</button>
          <button onClick={onCancel} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Batal</button>
        </div>
      </div>
    </div>
  );
};

// ===============================
// 4. KOMPONEN UTAMA
// ===============================
const ManajemenAgent = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State Modals
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formInitial, setFormInitial] = useState({});
  const [showDetail, setShowDetail] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        // 🟡 PERBAIKAN: Gunakan credentials: 'include' dan HAPUS Auth Headers
        const res = await fetch(`${API_BASE}/api/accounts/agents/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // <--- INI KUNCINYA
        });
        
        // Cek jika status 403, berarti session habis/belum login
        if (res.status === 403) {
            console.error("Akses Ditolak. Pastikan sudah Login Admin.");
        }

        const data = await res.json();
        
        if (res.ok) {
           const items = Array.isArray(data) ? data : data.results || [];
           setAgents(items);
        } else {
           console.error("Gagal load data:", data);
        }
      } catch (err) {
        console.error("Gagal ambil agents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  // --- DELETE DATA ---
  const handleDeleteAgent = async () => {
    if (!agentToDelete) return;

    try {
      const res = await fetch(
        `${API_BASE}/api/accounts/agents/${agentToDelete.id}/delete/`,
        {
          method: "DELETE",
          // 🟡 PERBAIKAN: Gunakan credentials: 'include'
          credentials: "include", 
        }
      );
      const data = await res.json();

      if (res.ok) {
        setAgents((prev) => prev.filter((a) => a.id !== agentToDelete.id));
        setShowDelete(false);
        setAgentToDelete(null);
        alert("Agent berhasil dihapus.");
      } else {
        alert(data.error || "Gagal menghapus agent.");
      }
    } catch (err) {
      console.error("Error delete agent:", err);
      alert("Terjadi kesalahan saat menghapus agent.");
    }
  };

  const openCreate = () => {
    setFormMode("create");
    setFormInitial({});
    setShowForm(true);
  };

  const openEdit = (agent) => {
    setFormMode("edit");
    let first = "", last = "";
    if (agent.nama_lengkap) {
        const parts = agent.nama_lengkap.split(" ");
        first = parts[0];
        last = parts.slice(1).join(" ");
    }
    setFormInitial({
        ...agent,
        first_name: first,
        last_name: last
    });
    setShowForm(true);
  };

  const onSaved = (savedData, action) => {
    if (!savedData) return;
    if (action === "create") {
      setAgents((prev) => [savedData, ...prev]);
      alert("Agent berhasil ditambahkan.");
    } else if (action === "edit") {
      setAgents((prev) => prev.map((a) => (a.id === savedData.id ? savedData : a)));
      alert("Agent berhasil diupdate.");
    }
  };

  const safeAgents = Array.isArray(agents) ? agents : [];
  const filteredAgents = safeAgents.filter((agent) => {
    const name = agent.nama_lengkap || (agent.first_name + " " + agent.last_name);
    const searchStr = `${agent.username} ${name} ${agent.email}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <AdminNavbar />
        <div className="px-8">
          <div className="flex justify-between items-center mb-4 pt-6">
            <h2 className="text-xl font-semibold text-gray-800">Data Agent</h2>
            <button onClick={openCreate} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow">
              <FaPlus /> Tambah Agent
            </button>
          </div>

          <div className="mb-4 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Cari Username / Nama / Email..."
              className="border rounded-md pl-10 pr-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border-b px-4 py-3 text-left">ID</th>
                  <th className="border-b px-4 py-3 text-left">Username</th>
                  <th className="border-b px-4 py-3 text-left">Nama Lengkap</th>
                  <th className="border-b px-4 py-3 text-left">Email</th>
                  <th className="border-b px-4 py-3 text-left">Telepon</th>
                  <th className="border-b px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="p-6 text-center text-gray-500">Memuat data...</td></tr>
                ) : filteredAgents.length > 0 ? (
                  filteredAgents.map((agent) => (
                    <tr key={agent.id} className="hover:bg-gray-50">
                      <td className="border-b px-4 py-2">{agent.id}</td>
                      <td className="border-b px-4 py-2 font-medium">{agent.username}</td>
                      <td className="border-b px-4 py-2">{agent.nama_lengkap || `${agent.first_name || ""} ${agent.last_name || ""}`}</td>
                      <td className="border-b px-4 py-2">{agent.email}</td>
                      <td className="border-b px-4 py-2">{agent.telepon || agent.phone || "-"}</td>
                      <td className="border-b px-4 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedAgent(agent);
                              setShowDetail(true);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                            title="Detail"
                          >
                            <FaEye />
                          </button>
                          
                          <button 
                            onClick={() => openEdit(agent)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          
                          <button
                            onClick={() => {
                              setAgentToDelete(agent);
                              setShowDelete(true);
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                            title="Hapus"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-500 p-4 italic">Tidak ada data agent</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AgentFormModal
        visible={showForm}
        mode={formMode}
        initial={formInitial}
        onClose={() => setShowForm(false)}
        onSaved={onSaved}
      />

      <AgentDetailModal
        visible={showDetail}
        agent={selectedAgent}
        onClose={() => setShowDetail(false)}
      />

      <DeleteConfirmModal
        visible={showDelete}
        agent={agentToDelete}
        onConfirm={handleDeleteAgent}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
};

export default ManajemenAgent;