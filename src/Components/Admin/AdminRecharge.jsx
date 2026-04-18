import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://72.62.186.133/api";

const STATUS_TABS = [
  { key: "all", label: "All Requests" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const statusStyle = {
  approved: { bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
  rejected: { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
  pending:  { bg: "#fef9c3", color: "#854d0e", dot: "#f59e0b" },
};

export default function AdminRecharges() {
  const [recharges, setRecharges]         = useState([]);
  const [preview, setPreview]             = useState(null);
  const [customAmounts, setCustomAmounts] = useState({});
  const [loadingId, setLoadingId]         = useState(null);
  const [activeTab, setActiveTab]         = useState("all");

  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchRecharges = async () => {
    try {
      const res = await axios.get(`${API}/admin/recharges`, { headers });
      setRecharges(res.data);
    } catch (err) {
      console.error("Failed to fetch recharges", err);
    }
  };

  useEffect(() => { fetchRecharges(); }, []);

  const handleApprove = async (id) => {
    const amount = customAmounts[id];
    if (!amount) { 
        alert("Please select an amount before approving."); 
        return; 
    }
    try {
        setLoadingId(id);
        await axios.post(
            `${API}/admin/recharges/${id}/approve`,
            { amount: parseInt(amount) },  // ← parseInt مهم
            { headers }
        );
        fetchRecharges();
    } catch (err) {
        const msg = err.response?.data?.message || "Approval failed.";
        alert(msg);
    } finally { 
        setLoadingId(null); 
    }
};

  const handleReject = async (id) => {
    try {
      setLoadingId(id);
      await axios.post(`${API}/admin/recharges/${id}/reject`, {}, { headers });
      fetchRecharges();
    } catch { alert("Rejection failed."); }
    finally { setLoadingId(null); }
  };

  const counts = {
    all:      recharges.length,
    pending:  recharges.filter(r => r.status === "pending").length,
    approved: recharges.filter(r => r.status === "approved").length,
    rejected: recharges.filter(r => r.status === "rejected").length,
  };

  const filtered = activeTab === "all"
    ? recharges
    : recharges.filter(r => r.status === activeTab);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        .rc-wrap * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .rc-wrap {
          min-height: 100vh;
          background: #f4f6fb;
          padding: 36px 32px;
        }
        .rc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .rc-title { font-size: 26px; font-weight: 700; color: #111827; letter-spacing: -0.5px; }
        .rc-subtitle { font-size: 13px; color: #6b7280; margin-top: 3px; }
        .rc-refresh {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px; background: white;
          border: 1px solid #e5e7eb; border-radius: 8px;
          font-size: 13px; font-weight: 500; color: #374151;
          cursor: pointer; transition: all .15s;
        }
        .rc-refresh:hover { background: #f9fafb; border-color: #d1d5db; }

        /* Stats */
        .rc-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }
        .rc-stat {
          background: white; border-radius: 12px;
          padding: 18px 20px; border: 1px solid #e5e7eb;
          display: flex; align-items: center; gap: 14px;
        }
        .rc-stat-icon {
          width: 44px; height: 44px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
        }
        .rc-stat-num { font-size: 26px; font-weight: 700; color: #111827; line-height: 1; }
        .rc-stat-label { font-size: 12px; color: #6b7280; margin-top: 3px; }

        /* Tabs */
        .rc-tabs {
          display: flex; gap: 4px;
          background: white; border: 1px solid #e5e7eb;
          border-radius: 12px 12px 0 0; padding: 6px 6px 0;
          border-bottom: none;
        }
        .rc-tab {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 8px 8px 0 0;
          font-size: 13px; font-weight: 500; color: #6b7280;
          cursor: pointer; border: none; background: transparent;
          transition: all .15s; position: relative; top: 1px;
        }
        .rc-tab:hover { color: #374151; background: #f9fafb; }
        .rc-tab.active {
          color: #1d4ed8; background: #f4f6fb;
          border: 1px solid #e5e7eb; border-bottom-color: #f4f6fb;
          font-weight: 600;
        }
        .rc-tab-badge {
          padding: 2px 7px; border-radius: 20px;
          font-size: 11px; font-weight: 600;
          background: #e5e7eb; color: #374151;
        }
        .rc-tab.active .rc-tab-badge { background: #dbeafe; color: #1d4ed8; }

        /* Table */
        .rc-table-wrap {
          background: white; border: 1px solid #e5e7eb;
          border-radius: 0 0 14px 14px; overflow: hidden;
          
        }
        .rc-table { width: 100%; border-collapse: collapse; }
        .rc-table thead tr { background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
        .rc-table th {
          padding: 12px 18px; font-size: 11px; font-weight: 600;
          color: #9ca3af; text-transform: uppercase; letter-spacing: .6px;
          white-space: nowrap; text-align: left;
        }
        .rc-table tbody tr { border-bottom: 1px solid #f3f4f6; transition: background .12s; }
        .rc-table tbody tr:last-child { border-bottom: none; }
        .rc-table tbody tr:hover { background: #f9fafb; }
        .rc-table td { padding: 14px 18px; vertical-align: middle; }

        .rc-idx { color: #9ca3af; font-size: 12px; font-family: 'DM Mono', monospace; }
        .rc-user-name { font-weight: 600; font-size: 14px; color: #111827; }
        .rc-user-email { font-size: 12px; color: #9ca3af; margin-top: 2px; }
        .rc-amount { font-family: 'DM Mono', monospace; font-size: 14px; font-weight: 500; color: #059669; }

        .rc-thumb {
          width: 52px; height: 52px; object-fit: cover;
          border-radius: 8px; cursor: pointer;
          border: 2px solid #e5e7eb; transition: all .15s;
        }
        .rc-thumb:hover { border-color: #3b82f6; transform: scale(1.05); }

        .rc-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 20px;
          font-size: 12px; font-weight: 600; white-space: nowrap;
        }
        .rc-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        .rc-balance { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 500; color: #2563eb; }
        .rc-date { font-size: 12px; color: #9ca3af; white-space: nowrap; }

        // .rc-select {
        //   padding: 6px 10px; border: 1px solid #d1d5db;
        //   border-radius: 7px; font-size: 12px;
        //   font-family: 'DM Sans', sans-serif; color: #374151;
        //   background: white; cursor: pointer; outline: none;
        //   transition: border .15s; min-width: 120px;
        // }
        .rc-select {
  padding: 4px 6px;
  font-size: 11px;
  width: fit-content;          /* 🔥 */
  min-width: unset;            /* 🔥 */
}
        .rc-select:focus { border-color: #3b82f6; }

        .rc-btn {
          padding: 6px 14px; border-radius: 7px;
          font-size: 12px; font-weight: 600; border: none;
          cursor: pointer; transition: all .15s;
          font-family: 'DM Sans', sans-serif;
        }
        .rc-btn-approve { background: #d1fae5; color: #065f46; }
        .rc-btn-approve:hover:not(:disabled) { background: #a7f3d0; }
        .rc-btn-reject { background: #fee2e2; color: #991b1b; }
        .rc-btn-reject:hover:not(:disabled) { background: #fecaca; }
        .rc-btn:disabled { opacity: .5; cursor: not-allowed; }
        .rc-done { font-size: 12px; color: #d1d5db; font-style: italic; }

        .rc-empty { text-align: center; padding: 56px 20px; color: #9ca3af; }
        .rc-empty-icon { font-size: 40px; margin-bottom: 10px; }
        .rc-empty-text { font-size: 14px; }

        .rc-modal {
          position: fixed; inset: 0; background: rgba(0,0,0,.75);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999; backdrop-filter: blur(4px);
        }
        .rc-modal img {
          max-width: 90vw; max-height: 88vh;
          border-radius: 14px; box-shadow: 0 25px 60px rgba(0,0,0,.5);
        }
        .rc-modal-hint { position: absolute; bottom: 24px; color: rgba(255,255,255,.6); font-size: 13px; }

        @media (max-width: 900px) {
          .rc-stats { grid-template-columns: repeat(2,1fr); }
          .rc-wrap { padding: 20px 14px; }
        }
      `}</style>

      <div className="rc-wrap">
        {/* Header */}
        <div className="rc-header">
          <div>
            <div className="rc-title">Recharge Requests</div>
            <div className="rc-subtitle">
              {counts.all} total · {counts.pending} awaiting review
            </div>
          </div>
          <button className="rc-refresh" onClick={fetchRecharges}>↻ Refresh</button>
        </div>

        {/* Stats */}
        <div className="rc-stats">
          {[
            { label: "Total",    count: counts.all,      icon: "📋", bg: "#eff6ff", color: "#1d4ed8" },
            { label: "Pending",  count: counts.pending,  icon: "⏳", bg: "#fefce8", color: "#ca8a04" },
            { label: "Approved", count: counts.approved, icon: "✅", bg: "#f0fdf4", color: "#16a34a" },
            { label: "Rejected", count: counts.rejected, icon: "❌", bg: "#fff1f2", color: "#e11d48" },
          ].map(s => (
            <div className="rc-stat" key={s.label}>
              <div className="rc-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
              <div>
                <div className="rc-stat-num" style={{ color: s.color }}>{s.count}</div>
                <div className="rc-stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="rc-tabs">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.key}
              className={`rc-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              <span className="rc-tab-badge">{counts[tab.key]}</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rc-table-wrap">
          <table className="rc-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Requested</th>
                <th>Screenshot</th>
                <th>Status</th>
                <th>Balance</th>
                <th>Date</th>
                <th>Add Minutes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="rc-empty">
                      <div className="rc-empty-icon">🗂️</div>
                      <div className="rc-empty-text">
                        No {activeTab === "all" ? "" : activeTab} requests found.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((r, i) => {
                const st = statusStyle[r.status] ?? statusStyle.pending;
                return (
                  <tr key={r.id}>
                    <td><span className="rc-idx">{String(i + 1).padStart(2, "0")}</span></td>

                    <td>
                      <div className="rc-user-name">{r.user?.name ?? "Unknown"}</div>
                      <div className="rc-user-email">{r.user?.email}</div>
                    </td>

                    <td><span className="rc-amount">{r.amount ?? "—"} Min</span></td>

                    <td>
                      {r.image ? (
                        <img
                          className="rc-thumb"
                          src={`http://72.62.186.133/storage/${r.image}`}
                          alt="receipt"
                          onClick={() => setPreview(`http://72.62.186.133/storage/${r.image}`)}
                        />
                      ) : (
                        <span style={{ fontSize: 12, color: "#d1d5db" }}>No image</span>
                      )}
                    </td>

                    <td>
                      <span className="rc-badge" style={{ background: st.bg, color: st.color }}>
                        <span className="rc-dot" style={{ background: st.dot }} />
                        {r.status}
                      </span>
                    </td>

                    <td><span className="rc-balance">{r.user?.balance ?? 0} Min</span></td>

                    <td>
                      <span className="rc-date">
                        {new Date(r.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit", month: "short", year: "numeric"
                        })}
                      </span>
                    </td>

                    <td>
                      {r.status === "pending" ? (
                        <select
                          className="rc-select"
                          value={customAmounts[r.id] ?? ""}
                          onChange={e => setCustomAmounts(p => ({ ...p, [r.id]: e.target.value }))}
                        >
                          <option value="">Select</option>
                          <option value="400">400 Min</option>
                          <option value="800">800 Min</option>
                          <option value="2000">2000 Min</option>
                        </select>
                      ) : (
                        <span className="rc-done">—</span>
                      )}
                    </td>

                    <td>
                      {r.status === "pending" ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            className="rc-btn rc-btn-approve"
                            onClick={() => handleApprove(r.id)}
                            disabled={loadingId === r.id}
                          >
                            {loadingId === r.id ? "..." : "✓ Approve"}
                          </button>
                          <button
                            className="rc-btn rc-btn-reject"
                            onClick={() => handleReject(r.id)}
                            disabled={loadingId === r.id}
                          >
                            {loadingId === r.id ? "..." : "✕ Reject"}
                          </button>
                        </div>
                      ) : (
                        <span className="rc-done">Done</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {preview && (
        <div className="rc-modal" onClick={() => setPreview(null)}>
          <img src={preview} alt="preview" />
          <p className="rc-modal-hint">Click anywhere to close</p>
        </div>
      )}
    </>
  );
}