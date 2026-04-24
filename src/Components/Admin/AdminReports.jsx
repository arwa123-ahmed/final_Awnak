import React, { useEffect, useState } from "react";
import {
  ShieldAlert, MessageSquare, X, AlertCircle, ChevronRight,
  CheckCircle, UserMinus, UserCheck, Loader2,
} from "lucide-react";

const API = "http://72.62.186.133/api";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [actionConfig, setActionConfig] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchReports = async () => {
    try {
      const res = await fetch(`${API}/admin/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleToggleAction = async () => {
    if (!actionConfig) return;
    const { userId, type } = actionConfig;

    setProcessingId(userId);
    setActionConfig(null);

    try {
      const endpoint = type === "suspend"
        ? `${API}/admin/users/${userId}/suspend`
        : `${API}/admin/users/${userId}/unsuspend`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (res.ok) await fetchReports();
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#fafafa]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Synchronizing...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fafafa] p-6 lg:p-10 font-sans" dir="ltr">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <header className="mb-10 flex items-end justify-between border-b border-gray-100 pb-8">
          <div>
            <div className="mb-2 flex items-center gap-2 text-red-600">
              <ShieldAlert size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Security Protocol</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Active Reports</h1>
          </div>
          <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Total Flagged</p>
              <p className="text-xl font-black text-gray-900 leading-none">{reports.length}</p>
            </div>
            <div className="h-8 w-[1px] bg-gray-100"></div>
            <CheckCircle className="text-green-500" size={20} />
          </div>
        </header>

        {/* Reports List */}
        <div className="grid gap-6">
          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[3rem] bg-white p-20 border border-dashed border-gray-200">
              <div className="bg-gray-50 p-6 rounded-full mb-4">
                <CheckCircle size={40} className="text-gray-200" />
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Database is clean</p>
            </div>
          ) : (
            reports.map((report) => {
              const targetUser = report.reportedUser || report.reported_user;
              const chatMessages = report.full_chat_history || [];
              const isBusy = processingId === targetUser?.id;

              return (
                <div key={report.id}
                  className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">

                    {/* Involved */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-black shadow-lg shadow-blue-100">
                          {report.reporter?.name?.charAt(0) || "?"}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg border border-blue-50">
                          <p className="text-[7px] font-black text-blue-600 uppercase">REP</p>
                        </div>
                      </div>

                      <ChevronRight size={16} className="text-gray-200" />

                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 font-black border border-red-100">
                          {targetUser?.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900">{targetUser?.name || "Unknown"}</p>
                          <div className="flex items-center gap-2">
                            <span className={`h-1.5 w-1.5 rounded-full ${targetUser?.is_suspended ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
                            <p className="text-[10px] font-bold text-gray-400 uppercase">
                              {targetUser?.is_suspended ? "Suspended" : "Active"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedChat({ messages: chatMessages, reporter: report.reporter, target: targetUser })}
                        className="group/btn flex items-center gap-2 rounded-2xl bg-gray-50 px-5 py-3 text-[11px] font-black uppercase tracking-wider text-gray-600 hover:bg-gray-900 hover:text-white transition-all duration-300"
                      >
                        <MessageSquare size={14} className="group-hover/btn:rotate-12 transition-transform" />
                        Evidence ({chatMessages.length})
                      </button>

                      <button
                        disabled={isBusy}
                        onClick={() => setActionConfig({
                          userId: targetUser?.id,
                          name: targetUser?.name,
                          type: targetUser?.is_suspended ? "unsuspend" : "suspend",
                        })}
                        className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-[11px] font-black uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50 ${
                          targetUser?.is_suspended
                            ? "bg-emerald-500 text-white shadow-emerald-100"
                            : "bg-red-600 text-white shadow-red-100"
                        }`}
                      >
                        {isBusy ? <Loader2 className="h-3 w-3 animate-spin" />
                          : targetUser?.is_suspended ? <UserCheck size={14} /> : <UserMinus size={14} />}
                        {targetUser?.is_suspended ? "Unsuspend" : "Suspend"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 flex items-start gap-3 bg-[#fafafa] p-4 rounded-2xl border border-gray-50">
                    <AlertCircle size={14} className="mt-0.5 text-red-400" />
                    <p className="text-[12px] leading-relaxed text-gray-500 font-medium italic">"{report.reason}"</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      {actionConfig && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm overflow-hidden rounded-[2.5rem] bg-white shadow-2xl">
            <div className={`p-8 text-center ${actionConfig.type === "suspend" ? "bg-red-50" : "bg-emerald-50"}`}>
              <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl ${actionConfig.type === "suspend" ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                {actionConfig.type === "suspend" ? <UserMinus size={32} /> : <UserCheck size={32} />}
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Confirm Action</h3>
              <p className="mt-2 text-sm text-gray-500 font-medium leading-relaxed">
                Are you sure you want to{" "}
                <span className="font-bold text-gray-900">{actionConfig.type}</span>{" "}
                user <span className="font-black">"{actionConfig.name}"</span>?
              </p>
            </div>
            <div className="flex gap-3 p-6 bg-white">
              <button onClick={() => setActionConfig(null)}
                className="flex-1 rounded-2xl border border-gray-100 py-4 text-xs font-black uppercase text-gray-400 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleToggleAction}
                className={`flex-1 rounded-2xl py-4 text-xs font-black uppercase text-white shadow-lg transition-all ${actionConfig.type === "suspend" ? "bg-red-600 hover:bg-red-700 shadow-red-100" : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100"}`}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evidence Modal */}
      {selectedChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div className="flex w-full max-w-md flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-2xl h-[75vh]">
            <header className="flex items-center justify-between border-b border-gray-50 p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gray-900 flex items-center justify-center text-white">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.1em] text-gray-900">Evidence Logs</h3>
                  <p className="text-[10px] font-bold text-gray-400">
                    {selectedChat.reporter?.name} / {selectedChat.target?.name}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedChat(null)}
                className="rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all">
                <X size={20} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto bg-[#fafafa] p-6 space-y-4">
              {selectedChat.messages.length > 0 ? (
                selectedChat.messages.map((msg) => {
                  const isReporter = String(msg.sender_id) === String(selectedChat.reporter?.id);
                  return (
                    <div key={msg.id} className={`flex ${isReporter ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[85%] rounded-[1.5rem] px-4 py-3 text-[13px] shadow-sm ${
                        isReporter
                          ? "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                          : "bg-gray-900 text-white rounded-tr-none"
                      }`}>
                        <div className="mb-1.5 flex items-center justify-between gap-6">
                          <span className={`text-[8px] font-black uppercase ${isReporter ? "text-blue-500" : "text-gray-500"}`}>
                            {isReporter ? "Reporter" : "Flagged User"}
                          </span>
                          <span className="text-[8px] opacity-30 font-bold">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="leading-relaxed font-medium">{msg.message}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-gray-300">
                  <AlertCircle size={32} className="mb-2 opacity-20" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]">No Interaction Logs</p>
                </div>
              )}
            </div>

            <footer className="p-6 bg-white text-center">
              <button onClick={() => setSelectedChat(null)}
                className="w-full rounded-2xl bg-gray-50 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all">
                Finish Audit
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;