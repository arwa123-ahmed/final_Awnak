import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("incoming");
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [myMatches, setMyMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [seenIncoming, setSeenIncoming] = useState(false);
  const [seenSent, setSeenSent] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAll();
    // polling كل 30 ثانية
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [incomingRes, myMatchesRes] = await Promise.all([
        user.role === "volunteer"
          ? axios.get("http://localhost:8000/api/volunteer/requests", { headers })
          : axios.get("http://localhost:8000/api/customer/requests", { headers }),
        axios.get("http://localhost:8000/api/my-matches", { headers }),
      ]);

      setIncomingRequests(
        user.role === "volunteer"
          ? incomingRes.data.requests || []
          : incomingRes.data.requests || []
      );
      setMyMatches(myMatchesRes.data.matches || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAction = async (matchId, action) => {
    setActionLoading(matchId + action);
    try {
      const endpoint =
        user.role === "volunteer"
          ? `http://localhost:8000/api/service-matches/${matchId}/update-status-volunteer`
          : `http://localhost:8000/api/service-matches/${matchId}/update-status-Customer`;

      const res = await axios.put(endpoint, { status: action }, { headers });

      // ✅ الخصم بيحصل هنا لما الـ CUSTOMER يعمل accepted
      if (action === "accepted" && user.role === "customer") {
        const newBalance = res.data.new_balance;
        if (newBalance !== undefined) {
          const updatedUser = { ...user, balance: newBalance };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          window.dispatchEvent(new Event("balanceUpdated"));
          alert(`Your remaining balance: ${newBalance} دقيقة`);
        }
      }

      setIncomingRequests((prev) =>
        prev.map((r) => (r.id === matchId ? { ...r, status: action } : r))
      );

    } catch (err) {
      // ✅ أضف ده عشان تشوف الـ error
      console.error("handleAction error:", err.response?.data || err.message);
      alert("❌ Error: " + (err.response?.data?.message || err.response?.status || err.message));
    }
    setActionLoading(null);
  };
  const getOtherUser = (match) => {
    if (user.role === "volunteer") return match.customer;
    return match.volunteer;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending": return "bg-amber-50 text-amber-600";
      case "accepted": return "bg-green-50 text-green-600";
      case "rejected": return "bg-red-50 text-red-500";
      default: return "bg-gray-50 text-gray-500";
    }
  };
  //------------------------

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return "⏳";
      case "accepted": return "✅";
      case "rejected": return "❌";
      default: return "•";
    }
  };

  // Incoming Card - طلبات جاية على خدماتي
  const IncomingCard = ({ request }) => {
    const isPending = request.status === "pending";
    const isAccepted = request.status === "accepted";
    const otherUser = user.role === "volunteer" ? request.customer : request.volunteer;
    const otherId = user.role === "volunteer" ? request.customer_id : request.volunteer_id;

    const avatar = otherUser?.id_image
      ? `http://localhost:8000/storage/${otherUser.id_image}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.name || "U")}&background=bbf7d0&color=15803d&bold=true`;

    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition">

        {/* User info */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/profile/${otherId}`)}>
          <img src={avatar} alt="" className="w-11 h-11 rounded-full object-cover border-2 border-green-100" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800 hover:text-green-600 transition">
              {otherUser?.name || `User #${otherId}`}
            </p>
            <p className="text-xs text-gray-400">
              {request.service?.name || `Service #${request.service_id}`}
            </p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusStyle(request.status)}`}>
            {getStatusIcon(request.status)} {request.status}
          </span>
        </div>

        {/* Buttons */}
        {isPending && (
          <div className="flex gap-2">
            <button
              onClick={() => handleAction(request.id, "accepted")}
              disabled={!!actionLoading}
              className="flex-1 py-2 rounded-xl bg-green-300 hover:bg-green-400 text-white font-bold text-sm transition disabled:opacity-60"
            >
              {actionLoading === request.id + "accepted" ? "..." : "✓ Accept"}
            </button>
            <button
              onClick={() => handleAction(request.id, "rejected")}
              disabled={!!actionLoading}
              className="flex-1 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 font-bold text-sm border border-red-200 transition disabled:opacity-60"
            >
              {actionLoading === request.id + "rejected" ? "..." : "✕ Reject"}
            </button>
          </div>
        )}

        {isAccepted && (
          <button
            onClick={() => navigate(`/profile/${otherId}`)}
            className="w-full py-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 font-bold text-sm border border-green-200 transition"
          >
            💬 Open Chat
          </button>
        )}
      </div>
    );
  };

  // My Requests Card - طلبات أنا بعتها وعايز أعرف ردها
  const MyRequestCard = ({ match }) => {
    const otherUser = user.role === "volunteer" ? match.customer : match.volunteer;
    const otherId = user.role === "volunteer" ? match.customer_id : match.volunteer_id;
    const isMe = user.role === "volunteer"
      ? match.volunteer_id === user.id
      : match.customer_id === user.id;

    // بس اعرض الطلبات اللي أنا بعتها (مش اللي جاية عليا)
    if (!isMe) return null;

    const avatar = otherUser?.id_image
      ? `http://localhost:8000/storage/${otherUser.id_image}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.name || "U")}&background=bbf7d0&color=15803d&bold=true`;

    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition">

        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/profile/${otherId}`)}>
          <img src={avatar} alt="" className="w-11 h-11 rounded-full object-cover border-2 border-green-100" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800 hover:text-green-600 transition">
              {otherUser?.name || `User #${otherId}`}
            </p>
            <p className="text-xs text-gray-400">
              {match.service?.name || `Service #${match.service_id}`}
            </p>
          </div>

          {/* Status - ده اللي بيعرف المستخدم رد إيه */}
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusStyle(match.status)}`}>
            {getStatusIcon(match.status)} {match.status}
          </span>
        </div>

        {/* رسالة حسب الـ status */}
        <div className={`text-xs rounded-xl px-4 py-2.5 font-medium
          ${match.status === "accepted" ? "bg-green-50 text-green-700"
            : match.status === "rejected" ? "bg-red-50 text-red-600"
              : "bg-amber-50 text-amber-600"}`}
        >
          {match.status === "pending" && "⏳ Waiting for response..."}
          {match.status === "accepted" && "🎉 Your request was accepted! You can start chatting."}
          {match.status === "rejected" && "❌ Your request was declined."}
        </div>

        {/* لو accepted - زرار الشات */}
        {match.status === "accepted" && (
          <button
            onClick={() => navigate(`/profile/${otherId}`)}
            className="w-full py-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 font-bold text-sm border border-green-200 transition"
          >
            💬 Open Chat
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        🔔 Notifications
      </h1>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-full p-1 mb-6">
        <button
          onClick={() => {
            setActiveTab("incoming");
            setSeenIncoming(true); // ✅ لما تفتحيه يتعلم إنك شفتيه
          }}
          className={`flex-1 py-2 rounded-full text-sm font-semibold transition
      ${activeTab === "incoming" ? "bg-green-300 text-white shadow" : "text-gray-500 hover:text-gray-700"}`}
        >
          📥 Incoming
          {/* ✅ الرقم يختفي لو seenIncoming */}
          {!seenIncoming && incomingRequests.filter(r => r.status === "pending").length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
              {incomingRequests.filter(r => r.status === "pending").length}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab("sent");
            setSeenSent(true); // ✅ لما تفتحيه يتعلم إنك شفتيه
          }}
          className={`flex-1 py-2 rounded-full text-sm font-semibold transition
      ${activeTab === "sent" ? "bg-green-300 text-white shadow" : "text-gray-500 hover:text-gray-700"}`}
        >
          📤 My Requests
          {/* ✅ الرقم يختفي لو seenSent */}
          {!seenSent && myMatches.filter(m => m.status === "accepted" || m.status === "rejected").length > 0 && (
            <span className="ml-2 bg-green-500 text-white text-xs px-1.5 rounded-full">
              {myMatches.filter(m => m.status === "accepted" || m.status === "rejected").length}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 animate-pulse">Loading...</div>
      ) : activeTab === "incoming" ? (
        incomingRequests.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No incoming requests yet.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {incomingRequests.map((req) => <IncomingCard key={req.id} request={req} />)}
          </div>
        )
      ) : (
        myMatches.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No sent requests yet.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {myMatches.map((match) => <MyRequestCard key={match.id} match={match} />)}
          </div>
        )
      )}
    </div>
  );
};

export default NotificationsPage;