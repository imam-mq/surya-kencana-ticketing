// ManajemenAgent.jsx
import React, { useEffect, useState } from "react";
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "./layout/Sidebar";
import AdminNavbar from "./layout/AdminNavbar";

const API_BASE = "http://127.0.0.1:8000";

// ===============================
// Komponen utama
// ===============================
const ManajemenAgent = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formInitial, setFormInitial] = useState({});
  const [showDetail, setShowDetail] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  
  const [showDelete, setShowDelete] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);

  const handleDeleteAgent = async () => {
    if (!agentToDelete) return;

    try {
      const res = await fetch(
        `${API_BASE}/api/accounts/agents/${agentToDelete.id}/delete/`,
        {
          method: "DELETE",
          headers: { ...getAuthHeaders() },
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

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/accounts/agents/`, {
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        });
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.results || [];
        setAgents(items);
      } catch (err) {
        console.error("Gagal ambil agents:", err);
        alert("Gagal memuat data agent. Periksa koneksi API / token.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const AgentFormModal = ({ visible, mode = "create", initial = {}, onClose, onSaved }) => {
  const [form, setForm] = useState({
    first_name: initial.first_name || "",
    last_name: initial.last_name || "",
    email: initial.email || "",
    phone: initial.phone || "",
    commission_percent: initial.commission_percent || "",
    location: initial.location || "",
    password: "",
    password_confirm: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setForm((f) => ({ ...f, ...initial }));
    setError(null);
  }, [initial, visible]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e && e.preventDefault();
    setError(null);

    if (!form.first_name || !form.email) {
      setError("Nama depan dan email wajib diisi.");
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
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        commission_percent: form.commission_percent,
        lokasi: form.location,
      };

      if (mode === "create") {
        payload.password = form.password;
        payload.password_confirm = form.password_confirm;
      } else if (form.password) {
        payload.password = form.password;
        payload.password_confirm = form.password_confirm;
      }

      const url = mode === "create"
        ? `${API_BASE}/api/accounts/agents/add/`
        : `${API_BASE}/api/accounts/agents/${initial.id}/`;

      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data.detail || data.message || JSON.stringify(data);
        setError(msg);
        return;
      }

      onSaved && onSaved(data, mode === "create" ? "create" : "edit");
      onClose && onClose();
    } catch (err) {
      console.error("Submit agent error:", err);
      setError("Gagal menyimpan — periksa koneksi / token. Lihat console untuk detail.");
    } finally {
      setSaving(false);
    }
  };

  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={submit} className="bg-white w-full max-w-2xl rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{mode === "create" ? "Tambah Agent" : "Edit Agent"}</h3>
          <button type="button" onClick={onClose} className="text-gray-600 hover:text-gray-800">Tutup</button>
        </div>

        {error && <div className="mb-3 text-sm text-red-600">{typeof error === "string" ? error : JSON.stringify(error)}</div>}

        <div className="grid grid-cols-2 gap-4">
          <input name="first_name" value={form.first_name} onChange={onChange} placeholder="Nama Depan" className="border rounded px-3 py-2" />
          <input name="last_name" value={form.last_name} onChange={onChange} placeholder="Nama Belakang" className="border rounded px-3 py-2" />
          <input name="email" value={form.email} onChange={onChange} placeholder="Email" type="email" className="border rounded px-3 py-2 col-span-2" />
          <input name="phone" value={form.phone} onChange={onChange} placeholder="Nomor Telepon" className="border rounded px-3 py-2" />
          <input name="commission_percent" value={form.commission_percent} onChange={onChange} placeholder="Komisi (%)" className="border rounded px-3 py-2" />
          <input name="location" value={form.location} onChange={onChange} placeholder="Lokasi" className="border rounded px-3 py-2" />
          <input name="password" value={form.password} onChange={onChange} placeholder={mode === "create" ? "Password (minimal 8)" : "Password (kosongkan bila tidak diubah)"} type="password" className="border rounded px-3 py-2" />
          <input name="password_confirm" value={form.password_confirm} onChange={onChange} placeholder="Konfirmasi Password" type="password" className="border rounded px-3 py-2" />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Batal</button>
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? "Menyimpan..." : "Simpan"}</button>
        </div>
      </form>
    </div>
  );
};

// 🟦 Tambahan: Komponen Detail Agent
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
          <p><strong>Nama:</strong> {agent.first_name} {agent.last_name}</p>
          <p><strong>Email:</strong> {agent.email}</p>
          <p><strong>Role:</strong> {agent.role}</p>
          <p><strong>Telepon:</strong> {agent.phone || "-"}</p>
          <p><strong>Komisi:</strong> {agent.commission_percent ? `${agent.commission_percent}%` : "-"}</p>
          <p><strong>Lokasi:</strong> {agent.lokasi || agent.location || "-"}</p>
          <p><strong>Tanggal Dibuat:</strong> {agent.date_joined || agent.created_at || "-"}</p>
        </div>

        <div className="flex justify-end mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ visible, agent, onConfirm, onCancel }) => {
  if (!visible || !agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-red-600 mb-2 flex justify-center items-center gap-2">
          ⚠️ Hapus Data ?
        </h3>
        <p className="text-gray-700 mb-5">
          Apakah anda yakin ingin menghapus user <br />
          <span className="font-semibold text-red-600">[{agent.first_name} {agent.last_name}]</span> ?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Hapus
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};


  const openCreate = () => {
    setFormMode("create");
    setFormInitial({});
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
    const fullName = ((agent.first_name || agent.username || "") + " " + (agent.last_name || "")).toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
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
              placeholder="Cari Data Agent ...."
              className="border rounded-md pl-10 pr-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm shadow-sm rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border px-4 py-3 text-left">ID</th>
                  <th className="border px-4 py-3 text-left">Nama Lengkap</th>
                  <th className="border px-4 py-3 text-left">Email</th>
                  <th className="border px-4 py-3 text-left">Role</th>
                  <th className="border px-4 py-3 text-left">Tanggal Dibuat</th>
                  <th className="border px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="p-6 text-center">Memuat...</td></tr>
                ) : filteredAgents.length > 0 ? (
                  filteredAgents.map((agent) => (
                    <tr key={agent.id}>
                      <td className="border px-4 py-2">{agent.id}</td>
                      <td className="border px-4 py-2">{agent.first_name || agent.username} {agent.last_name || ""}</td>
                      <td className="border px-4 py-2">{agent.email}</td>
                      <td className="border px-4 py-2">{agent.role}</td>
                      <td className="border px-4 py-2">{agent.date_joined || agent.created_at || "-"}</td>
                      <td className="border px-4 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          {/* 🟦 Tombol Detail */}
                          <button
                            onClick={() => {
                              setSelectedAgent(agent);
                              setShowDetail(true);
                            }}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                          >
                            <FaEye /> Detail
                          </button>
                          <button className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"><FaEdit /> Edit</button>
                          <button
                            onClick={() => {
                              setAgentToDelete(agent);
                              setShowDelete(true);
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                          >
                            <FaTrash /> Hapus
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

      {/* 🟦 Modal Form Tambah/Edit */}
      <AgentFormModal
        visible={showForm}
        mode={formMode}
        initial={formInitial}
        onClose={() => setShowForm(false)}
        onSaved={onSaved}
      />

      {/* 🟦 Modal Detail */}
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
