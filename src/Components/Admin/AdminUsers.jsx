import React, { useEffect, useState, useMemo } from "react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("all"); // الفلتر: all, active, suspended, deactivated
  const [previewImage, setPreviewImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [newNationalId, setNewNationalId] = useState("");

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://72.62.186.133/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // حساب الإحصائيات للبطاقات
  const stats = useMemo(() => {
    return {
      total: users.length,
      suspended: users.filter((u) => u.is_suspended).length,
      deactivated: users.filter((u) => !u.activation).length,
      active: users.filter((u) => !u.is_suspended && u.activation).length,
    };
  }, [users]);

  // منطق البحث والفلترة
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.national_id && user.national_id.includes(searchTerm));

      let matchesFilter = true;
      if (filterMode === "suspended") matchesFilter = user.is_suspended;
      if (filterMode === "deactivated") matchesFilter = !user.activation;
      if (filterMode === "active")
        matchesFilter = !user.is_suspended && user.activation;

      return matchesSearch && matchesFilter;
    });
  }, [users, searchTerm, filterMode]);

  // Actions
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await fetch(`http://72.62.186.133/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    }
  };

  const handleSuspend = async (id) => {
    await fetch(`http://72.62.186.133/api/admin/users/${id}/suspend`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  const handleUnsuspend = async (id) => {
    await fetch(`http://72.62.186.133/api/admin/users/${id}/unsuspend`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  const handleToggleActivation = async (id) => {
    await fetch(`http://72.62.186.133/api/admin/users/${id}/activation`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  const handleUpdateNationalId = async (id) => {
    await fetch(
      `http://72.62.186.133/api/admin/users/${id}/update-national-id`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ national_id: newNationalId }),
      },
    );
    setEditId(null);
    setNewNationalId("");
    fetchUsers();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight italic">
          USERS MANAGEMENT
        </h2>
      </div>

      {/* 📊 Stats Cards as Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div
          onClick={() => setFilterMode("all")}
          className={`p-4 rounded-2xl border-l-4 cursor-pointer transition ${filterMode === "all" ? "bg-blue-50 border-blue-500 shadow-md" : "bg-white border-blue-300"}`}
        >
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Total
          </p>
          <p className="text-2xl font-black">{stats.total}</p>
        </div>
        <div
          onClick={() => setFilterMode("active")}
          className={`p-4 rounded-2xl border-l-4 cursor-pointer transition ${filterMode === "active" ? "bg-green-50 border-green-500 shadow-md" : "bg-white border-green-300"}`}
        >
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Active
          </p>
          <p className="text-2xl font-black text-green-600">{stats.active}</p>
        </div>
        <div
          onClick={() => setFilterMode("suspended")}
          className={`p-4 rounded-2xl border-l-4 cursor-pointer transition ${filterMode === "suspended" ? "bg-red-50 border-red-500 shadow-md" : "bg-white border-red-300"}`}
        >
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Suspended
          </p>
          <p className="text-2xl font-black text-red-600">{stats.suspended}</p>
        </div>
        <div
          onClick={() => setFilterMode("deactivated")}
          className={`p-4 rounded-2xl border-l-4 cursor-pointer transition ${filterMode === "deactivated" ? "bg-gray-100 border-gray-500 shadow-md" : "bg-white border-gray-300"}`}
        >
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Deactivated
          </p>
          <p className="text-2xl font-black text-gray-600">
            {stats.deactivated}
          </p>
        </div>
      </div>

      {/* 🔍 Search Bar */}
      <div className="mb-6 flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder={`Search by name, email or National ID...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-10 py-3 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <span className="absolute left-3 top-3.5 italic text-gray-300">
            Search
          </span>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white shadow-sm rounded-[2rem] border border-gray-100">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-black tracking-widest border-b">
            <tr>
              <th className="px-6 py-5">ID</th>
              <th className="px-6 py-5">User Profile</th>
              <th className="px-6 py-5">Images</th>
              <th className="px-6 py-5">National ID</th>
              <th className="px-6 py-5 text-center">Reports</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Activation</th>
              <th className="px-6 py-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-blue-50/20 transition-all group"
              >
                <td className="px-6 py-4 font-bold text-gray-400">
                  #{user.id}
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-800">{user.name}</div>
                  <div className="text-[10px] text-gray-400 font-medium">
                    {user.email}
                  </div>
                </td>
                {/* Images */}
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <img
                      src={`http://72.62.186.133/storage/${user.id_image}`}
                      className="w-10 h-10 object-cover rounded-lg cursor-pointer border hover:scale-110 transition shadow-sm"
                      onClick={() =>
                        setPreviewImage(
                          `http://72.62.186.133/storage/${user.id_image}`,
                        )
                      }
                      alt="User"
                    />
                    <img
                      src={`http://72.62.186.133/storage/${user.national_id_image}`}
                      className="w-10 h-10 object-cover rounded-lg cursor-pointer border hover:scale-110 transition shadow-sm"
                      onClick={() =>
                        setPreviewImage(
                          `http://72.62.186.133/storage/${user.national_id_image}`,
                        )
                      }
                      alt="ID"
                    />
                  </div>
                </td>
                {/* National ID with Edit */}
                <td className="px-6 py-4">
                  {editId === user.id ? (
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={newNationalId}
                        onChange={(e) => setNewNationalId(e.target.value)}
                        className="border px-2 py-1 rounded-lg w-24 text-xs"
                      />
                      <button
                        onClick={() => handleUpdateNationalId(user.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded-lg text-[10px] font-black"
                      >
                        SAVE
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group/id">
                      <span className="font-mono text-xs">
                        {user.national_id || "N/A"}
                      </span>
                      <button
                        onClick={() => {
                          setEditId(user.id);
                          setNewNationalId(user.national_id || "");
                        }}
                        className="hidden group-hover/id:block text-blue-500 text-[10px] font-black uppercase"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </td>
                {/* 🚩 Reports Count */}
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-xl font-black text-xs ${user.reports_received_count > 0 ? "bg-red-50 text-red-600 animate-pulse" : "bg-gray-50 text-gray-300"}`}
                  >
                    {user.reports_received_count || 0}
                  </span>
                </td>
                {/* Status */}
                <td className="px-6 py-4 text-xs">
                  <span
                    className={`px-3 py-1 rounded-full font-black uppercase tracking-tighter ${user.is_suspended ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
                  >
                    {user.is_suspended ? "Banned" : "Active"}
                  </span>
                </td>
                {/* Activation */}
                <td className="px-6 py-4 text-xs">
                  <span
                    className={`px-3 py-1 rounded-full font-black uppercase tracking-tighter ${user.activation ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-400"}`}
                  >
                    {user.activation ? "Verified" : "Pending"}
                  </span>
                </td>
                {/* Actions */}
                <td className="px-6 py-4 flex gap-2 justify-center">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white p-2 rounded-xl shadow-md shadow-red-100"
                    title="Delete"
                  >
                    🗑️
                  </button>
                  {!user.is_suspended ? (
                    <button
                      onClick={() => handleSuspend(user.id)}
                      className="bg-amber-500 text-white p-2 rounded-xl shadow-md shadow-amber-100"
                      title="Suspend"
                    >
                      🚫
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnsuspend(user.id)}
                      className="bg-green-500 text-white p-2 rounded-xl shadow-md shadow-green-100"
                      title="Unsuspend"
                    >
                      ✅
                    </button>
                  )}
                  <button
                    onClick={() => handleToggleActivation(user.id)}
                    className={`p-2 rounded-xl text-white shadow-md ${user.activation ? "bg-gray-400 shadow-gray-100" : "bg-blue-500 shadow-blue-100"}`}
                    title="Toggle Activation"
                  >
                    {user.activation ? "🛡️" : "✅"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔥 Image Pop-up (Exact same as your request) */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-in fade-in"
        >
          <img
            src={previewImage}
            className="max-w-[90%] max-h-[90%] rounded-[2rem] shadow-2xl border-4 border-white animate-in zoom-in duration-300"
            alt="Preview"
          />
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
