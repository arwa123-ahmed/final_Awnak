import React, { useEffect, useState } from "react";
import {
  UserX,
  ShieldAlert,
  Send,
  Clock,
  User as UserIcon,
  CheckCircle,
} from "lucide-react";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchReports = async () => {
    try {
      const res = await fetch("http://72.62.186.133/api/admin/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // دالة الحظر المباشر
  const toggleSuspend = async (userId) => {
    try {
      const res = await fetch(
        `http://72.62.186.133/api/admin/users/${userId}/action`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.ok) {
        fetchReports(); // تحديث البيانات فوراً
      }
    } catch (err) {
      alert("Failed to perform action");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center font-black text-gray-400 animate-pulse">
        LOADING...
      </div>
    );

  return (
    <div
      className="p-8 bg-[#f8f9fa] min-h-screen font-sans text-left"
      dir="ltr"
    >
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <ShieldAlert size={36} className="text-red-600" /> REPORTS CENTER
          </h2>
        </header>

        <div className="space-y-4">
          {reports.map((report) => {
            const target = report.reported_user || report.reportedUser;
            return (
              <div
                key={report.id}
                className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-2xl">
                    <UserIcon size={20} className="text-blue-600" />
                    <div>
                      <p className="text-[10px] font-black text-blue-400 uppercase">
                        Reporter
                      </p>
                      <p className="font-bold text-gray-800">
                        {report.reporter?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-red-50 p-3 rounded-2xl">
                    <UserX size={20} className="text-red-600" />
                    <div>
                      <p className="text-[10px] font-black text-red-400 uppercase">
                        Target
                      </p>
                      <p className="font-bold text-gray-800">{target?.name}</p>
                    </div>
                  </div>

                  <div className="max-w-xs ml-4">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">
                      Reason
                    </p>
                    <p className="text-sm text-gray-600 italic">
                      "{report.reason}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleSuspend(target?.id)}
                    className={`px-6 py-3 rounded-2xl font-black text-xs transition-all active:scale-95 shadow-lg ${
                      target?.is_suspended
                        ? "bg-green-500 text-white shadow-green-100"
                        : "bg-red-600 text-white shadow-red-100"
                    }`}
                  >
                    {target?.is_suspended ? "✅ UNSUSPEND" : "🚫 SUSPEND NOW"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
