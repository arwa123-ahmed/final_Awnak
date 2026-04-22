import React, { useEffect, useState, useMemo, useCallback } from "react";

const ITEMS_PER_PAGE = 15;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("all");
  const [previewImage, setPreviewImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [newNationalId, setNewNationalId] = useState("");
  const [page, setPage] = useState(1);
  const [loadingAction, setLoadingAction] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchUsers = useCallback(async () => {
    setFetchLoading(true);
    try {
      const res = await fetch("http://72.62.186.133/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
    setFetchLoading(false);
  }, [token]);

  useEffect(() => { fetchUsers(); }, []);

  // Reset page on filter/search change
  useEffect(() => { setPage(1); }, [searchTerm, filterMode]);

  const stats = useMemo(() => ({
    total: users.length,
    suspended: users.filter((u) => u.is_suspended).length,
    deactivated: users.filter((u) => !u.activation).length,
    active: users.filter((u) => !u.is_suspended && u.activation).length,
  }), [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = !q ||
        user.name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        user.national_id?.includes(q);

      let matchesFilter = true;
      if (filterMode === "suspended") matchesFilter = !!user.is_suspended;
      if (filterMode === "deactivated") matchesFilter = !user.activation;
      if (filterMode === "active") matchesFilter = !user.is_suspended && !!user.activation;

      return matchesSearch && matchesFilter;
    });
  }, [users, searchTerm, filterMode]);

  const paginatedUsers = useMemo(() =>
    filteredUsers.slice(0, page * ITEMS_PER_PAGE),
    [filteredUsers, page]
  );

  const hasMore = paginatedUsers.length < filteredUsers.length;

  const withLoading = async (id, fn) => {
    setLoadingAction(id);
    try { await fn(); await fetchUsers(); }
    catch (err) { console.error(err); }
    setLoadingAction(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    withLoading(`delete-${id}`, () =>
      fetch(`http://72.62.186.133/api/admin/users/${id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      })
    );
  };

  const handleSuspend = (id) => withLoading(`suspend-${id}`, () =>
    fetch(`http://72.62.186.133/api/admin/users/${id}/suspend`, {
      method: "POST", headers: { Authorization: `Bearer ${token}` },
    })
  );

  const handleUnsuspend = (id) => withLoading(`unsuspend-${id}`, () =>
    fetch(`http://72.62.186.133/api/admin/users/${id}/unsuspend`, {
      method: "POST", headers: { Authorization: `Bearer ${token}` },
    })
  );

  const handleToggleActivation = (id) => withLoading(`activation-${id}`, () =>
    fetch(`http://72.62.186.133/api/admin/users/${id}/activation`, {
      method: "POST", headers: { Authorization: `Bearer ${token}` },
    })
  );

  const handleUpdateNationalId = (id) => withLoading(`natid-${id}`, async () => {
    await fetch(`http://72.62.186.133/api/admin/users/${id}/update-national-id`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ national_id: newNationalId }),
    });
    setEditId(null);
    setNewNationalId("");
  });

  const StatCard = ({ label, value, color, filter, activeFilter }) => (
    <div
      onClick={() => setFilterMode(filter)}
      className={`p-4 rounded-2xl border-l-4 cursor-pointer transition-all ${activeFilter === filter
          ? `bg-${color}-50 border-${color}-500 shadow-md scale-[1.02]`
          : `bg-white border-${color}-300 hover:bg-${color}-50`
        }`}
    >
      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{label}</p>
      <p className={`text-2xl font-black text-${color}-600`}>{value}</p>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight italic">
          USERS MANAGEMENT
        </h2>
        <button onClick={fetchUsers} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
          ↻ Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div onClick={() => setFilterMode("all")}
          className={`p-4 rounded-2xl border-l-4 cursor-pointer transition ${filterMode === "all" ? "bg-blue-50 border-blue-500 shadow-md" : "bg-white border-blue-300"}`}>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total</p>
          <p className="text-2xl font-black text-blue-600">{stats.total}</p>
        </div>
        <div onClick={() => setFilterMode("active")}
          className={`p-4 rounded-2xl border-l-4 cursor-pointer transition ${filterMode === "active" ? "bg-green-50 border-green-500 shadow-md" : "bg-white border-green-300"}`}>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Active</p>
          <p className="text-2xl font-black text-green-600">{stats.active}</p>
        </div>
        <div onClick={() => setFilterMode("suspended")}
          className={`p-4 rounded-2xl border-l-4 cursor-pointer transition ${filterMode === "suspended" ? "bg-red-50 border-red-500 shadow-md" : "bg-white border-red-300"}`}>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Suspended</p>
          <p className="text-2xl font-black text-red-600">{stats.suspended}</p>
        </div>
        <div onClick={() => setFilterMode("deactivated")}
          className={`p-4 rounded-2xl border-l-4 cursor-pointer transition ${filterMode === "deactivated" ? "bg-gray-100 border-gray-500 shadow-md" : "bg-white border-gray-300"}`}>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Deactivated</p>
          <p className="text-2xl font-black text-gray-600">{stats.deactivated}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by name, email or National ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none bg-white"
          />
          <span className="absolute left-3 top-3.5 text-gray-300">🔍</span>
          {searchTerm && (
            <button onClick={() => setSearchTerm("")}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-lg">×</button>
          )}
        </div>
        <span className="text-sm text-gray-400">
          {filteredUsers.length} / {users.length} users
        </span>
      </div>

      {/* Loading */}
      {fetchLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Table */}
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
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-gray-400">
                      <p className="text-3xl mb-2">🔍</p>
                      <p>No users found for "{searchTerm}"</p>
                    </td>
                  </tr>
                ) : paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/20 transition-all group">
                    <td className="px-6 py-4 font-bold text-gray-400">#{user.id}</td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{user.name}</div>
                      <div className="text-[10px] text-gray-400">{user.email}</div>
                    </td>

                    {/* Images - lazy loading */}
                    {/* <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {user.id_image ? (
                          <img
                            src={`http://72.62.186.133/storage/${user.id_image}`}
                            loading="lazy"
                            className="w-10 h-10 object-cover rounded-lg cursor-pointer border hover:scale-110 transition shadow-sm"
                            onClick={() => setPreviewImage(`http://72.62.186.133/storage/${user.id_image}`)}
                            alt="User"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">No img</div>}

                        {user.national_id_image ? (
                          <img
                            src={`http://72.62.186.133/storage/${user.national_id_image}`}
                            loading="lazy"
                            className="w-10 h-10 object-cover rounded-lg cursor-pointer border hover:scale-110 transition shadow-sm"
                            onClick={() => setPreviewImage(`http://72.62.186.133/storage/${user.national_id_image}`)}
                            alt="ID"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">No ID</div>}
                      </div>
                    </td> */}
                    {/* Images */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {user.id_image && user.id_image !== "ids/user.png" ? (
                          <img
                            src={`http://72.62.186.133/storage/${user.id_image}`}
                            loading="lazy"
                            className="w-10 h-10 object-cover rounded-lg cursor-pointer border hover:scale-110 transition shadow-sm"
                            onClick={() => setPreviewImage(`http://72.62.186.133/storage/${user.id_image}`)}
                            alt="User"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-lg">
                            👤
                          </div>
                        )}

                        {user.national_id_image ? (
                          <img
                            src={`http://72.62.186.133/storage/${user.national_id_image}`}
                            loading="lazy"
                            className="w-10 h-10 object-cover rounded-lg cursor-pointer border hover:scale-110 transition shadow-sm"
                            onClick={() => setPreviewImage(`http://72.62.186.133/storage/${user.national_id_image}`)}
                            alt="ID"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-lg">
                            🪪
                          </div>
                        )}
                      </div>
                    </td>
                    {/* National ID */}
                    <td className="px-6 py-4">
                      {editId === user.id ? (
                        <div className="flex gap-1">
                          <input type="text" value={newNationalId}
                            onChange={(e) => setNewNationalId(e.target.value)}
                            className="border px-2 py-1 rounded-lg w-24 text-xs" />
                          <button onClick={() => handleUpdateNationalId(user.id)}
                            disabled={loadingAction === `natid-${user.id}`}
                            className="bg-green-500 text-white px-2 py-1 rounded-lg text-[10px] font-black disabled:opacity-60">
                            {loadingAction === `natid-${user.id}` ? "..." : "SAVE"}
                          </button>
                          <button onClick={() => setEditId(null)}
                            className="bg-gray-200 text-gray-600 px-2 py-1 rounded-lg text-[10px] font-black">✕</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group/id">
                          <span className="font-mono text-xs">{user.national_id || "N/A"}</span>
                          <button onClick={() => { setEditId(user.id); setNewNationalId(user.national_id || ""); }}
                            className="hidden group-hover/id:block text-blue-500 text-[10px] font-black uppercase">
                            Edit
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Reports */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-xl font-black text-xs ${user.reports_received_count > 0 ? "bg-red-50 text-red-600 animate-pulse" : "bg-gray-50 text-gray-300"}`}>
                        {user.reports_received_count || 0}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-xs">
                      <span className={`px-3 py-1 rounded-full font-black uppercase ${user.is_suspended ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                        {user.is_suspended ? "Banned" : "Active"}
                      </span>
                    </td>

                    {/* Activation */}
                    <td className="px-6 py-4 text-xs">
                      <span className={`px-3 py-1 rounded-full font-black uppercase ${user.activation ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
                        {user.activation ? "Verified" : "Pending"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => handleDelete(user.id)}
                          disabled={!!loadingAction}
                          className="bg-red-500 text-white p-2 rounded-xl shadow-md shadow-red-100 disabled:opacity-60 hover:bg-red-600 transition"
                          title="Delete">
                          {loadingAction === `delete-${user.id}` ? "⏳" : "🗑️"}
                        </button>

                        {!user.is_suspended ? (
                          <button onClick={() => handleSuspend(user.id)}
                            disabled={!!loadingAction}
                            className="bg-amber-500 text-white p-2 rounded-xl shadow-md shadow-amber-100 disabled:opacity-60 hover:bg-amber-600 transition"
                            title="Suspend">
                            {loadingAction === `suspend-${user.id}` ? "⏳" : "🚫"}
                          </button>
                        ) : (
                          <button onClick={() => handleUnsuspend(user.id)}
                            disabled={!!loadingAction}
                            className="bg-green-500 text-white p-2 rounded-xl shadow-md shadow-green-100 disabled:opacity-60 hover:bg-green-600 transition"
                            title="Unsuspend">
                            {loadingAction === `unsuspend-${user.id}` ? "⏳" : "✅"}
                          </button>
                        )}

                        <button onClick={() => handleToggleActivation(user.id)}
                          disabled={!!loadingAction}
                          className={`p-2 rounded-xl text-white shadow-md disabled:opacity-60 hover:opacity-80 transition ${user.activation ? "bg-gray-400 shadow-gray-100" : "bg-blue-500 shadow-blue-100"}`}
                          title="Toggle Activation">
                          {loadingAction === `activation-${user.id}` ? "⏳" : user.activation ? "🛡️" : "✅"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex flex-col items-center mt-6 gap-2">
              <p className="text-sm text-gray-400">
                Showing {paginatedUsers.length} of {filteredUsers.length} users
              </p>
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold text-sm transition shadow-md shadow-blue-100"
              >
                Load More ({filteredUsers.length - paginatedUsers.length} remaining)
              </button>
            </div>
          )}
        </>
      )}

      {/* Image Preview */}
      {previewImage && (
        <div onClick={() => setPreviewImage(null)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <img src={previewImage}
            className="max-w-[90%] max-h-[90%] rounded-[2rem] shadow-2xl border-4 border-white"
            alt="Preview" />
          <button className="absolute top-4 right-4 text-white text-2xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
            onClick={() => setPreviewImage(null)}>×</button>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;