import React, { useEffect, useState, useMemo } from "react";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("all"); // الفلاتر: all, offers, requests, pending
  const [reason, setReason] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchServices = async () => {
    try {
      const res = await fetch("http://72.62.186.133/api/admin/services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 📊 حساب الإحصائيات للبطاقات العلوية
  const stats = useMemo(() => {
    return {
      total: services.length,
      offers: services.filter((s) => s.type === "offer").length,
      requests: services.filter((s) => s.type === "request").length,
      pending: services.filter((s) => s.status === "pending").length,
    };
  }, [services]);

  // 🔍 منطق البحث والفلترة
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.user?.name.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesFilter = true;
      if (filterMode === "offers") matchesFilter = s.type === "offer";
      if (filterMode === "requests") matchesFilter = s.type === "request";
      if (filterMode === "pending") matchesFilter = s.status === "pending";

      return matchesSearch && matchesFilter;
    });
  }, [services, searchTerm, filterMode]);

  const handleDelete = async () => {
    if (!reason.trim()) return alert("Please enter a reason for deletion.");

    await fetch(`http://72.62.186.133/api/admin/services/${selectedId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });

    setReason("");
    setSelectedId(null);
    fetchServices();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">
          Services <span className="text-emerald-600 italic">Management</span>
        </h2>
      </div>

      {/* 📊 Stats Cards / Quick Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div
          onClick={() => setFilterMode("all")}
          className={`p-5 rounded-[2rem] border-l-4 cursor-pointer transition-all duration-300 ${filterMode === "all" ? "bg-white border-blue-500 shadow-xl scale-105" : "bg-white border-blue-200 opacity-70 hover:opacity-100 shadow-sm"}`}
        >
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">
            Total Assets
          </p>
          <p className="text-3xl font-black text-slate-800">{stats.total}</p>
        </div>

        <div
          onClick={() => setFilterMode("offers")}
          className={`p-5 rounded-[2rem] border-l-4 cursor-pointer transition-all duration-300 ${filterMode === "offers" ? "bg-white border-emerald-500 shadow-xl scale-105" : "bg-white border-emerald-200 opacity-70 hover:opacity-100 shadow-sm"}`}
        >
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">
            Active Offers
          </p>
          <p className="text-3xl font-black text-emerald-600">{stats.offers}</p>
        </div>

        <div
          onClick={() => setFilterMode("requests")}
          className={`p-5 rounded-[2rem] border-l-4 cursor-pointer transition-all duration-300 ${filterMode === "requests" ? "bg-white border-amber-500 shadow-xl scale-105" : "bg-white border-amber-200 opacity-70 hover:opacity-100 shadow-sm"}`}
        >
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">
            Service Requests
          </p>
          <p className="text-3xl font-black text-amber-600">{stats.requests}</p>
        </div>

        <div
          onClick={() => setFilterMode("pending")}
          className={`p-5 rounded-[2rem] border-l-4 cursor-pointer transition-all duration-300 ${filterMode === "pending" ? "bg-white border-rose-500 shadow-xl scale-105" : "bg-white border-rose-200 opacity-70 hover:opacity-100 shadow-sm"}`}
        >
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">
            Pending Approval
          </p>
          <p className="text-3xl font-black text-rose-600">{stats.pending}</p>
        </div>
      </div>

      {/* 🔍 Search bar */}
      <div className="mb-6 flex gap-4 items-center">
        <div className="relative flex-1 max-w-xl">
          <input
            type="text"
            placeholder="Search by service name, provider, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-12 py-4 rounded-[1.5rem] border-none shadow-md focus:ring-2 focus:ring-emerald-400 outline-none text-sm transition-all"
          />
          <span className="absolute left-5 top-4.5 text-gray-300 font-black italic">
            SEARCH
          </span>
        </div>
      </div>

      {/* 🛠 Table Section */}
      <div className="overflow-x-auto bg-white shadow-2xl rounded-[2.5rem] border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-widest">
            <tr>
              <th className="px-8 py-6">ID</th>
              <th className="px-8 py-6">Service Detail</th>
              <th className="px-8 py-6">Provider</th>
              <th className="px-8 py-6">Category ID</th>
              <th className="px-8 py-6">Reward</th>
              <th className="px-8 py-6">Type</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredServices.map((s) => (
              <tr
                key={s.id}
                className="hover:bg-emerald-50/30 transition-all group"
              >
                <td className="px-8 py-5 font-mono text-gray-400 font-bold">
                  #{s.id}
                </td>
                <td className="px-8 py-5">
                  <div className="font-black text-slate-800 text-base">
                    {s.name}
                  </div>
                  <div className="text-xs text-gray-400 line-clamp-1 max-w-[200px]">
                    {s.description}
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-[10px] uppercase">
                      {s.user?.name.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-700">
                      {s.user?.name}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5 font-bold text-blue-500">
                  SEC-{s.category_id}
                </td>
                <td className="px-8 py-5">
                  <span className="bg-slate-100 px-3 py-1 rounded-lg font-black text-slate-700 text-xs">
                    {s.timesalary} MIN
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span
                    className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${s.type === "offer" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {s.type}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-2 h-2 rounded-full ${s.status === "pending" ? "bg-rose-500 animate-pulse" : "bg-emerald-500"}`}
                    ></div>
                    <span className="font-bold text-slate-600 capitalize text-xs">
                      {s.status}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <button
                    onClick={() => setSelectedId(s.id)}
                    className="bg-rose-500 hover:bg-rose-600 text-white p-3 rounded-2xl shadow-lg shadow-rose-100 transition-all active:scale-90"
                    title="Terminate Service"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🚩 Custom Deletion Modal */}
      {selectedId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
              ⚠️
            </div>
            <h3 className="text-2xl font-black text-slate-800 text-center mb-2">
              Terminate Service
            </h3>
            <p className="text-slate-400 text-sm text-center mb-6">
              Please provide a formal reason for removing this service from the
              platform.
            </p>

            <textarea
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all resize-none"
              placeholder="e.g. Violation of platform policies, inappropriate content..."
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="flex flex-col gap-3 mt-8">
              <button
                onClick={handleDelete}
                className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-rose-100"
              >
                Confirm Termination
              </button>
              <button
                onClick={() => setSelectedId(null)}
                className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
