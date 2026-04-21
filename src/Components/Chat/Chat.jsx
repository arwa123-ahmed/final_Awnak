import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://72.62.186.133/api";

// ===================== Rating Modal =====================
const RatingModal = ({ matchId, volunteerName, onClose, onSubmit }) => {
  const [view, setView] = useState("rating");
  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const handleRatingSubmit = async () => {
    if (!stars) return;
    setSubmitting(true);
    try {
      await axios.post(
        `${API}/ratings/${matchId}`,
        { stars, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setView("success");
      onSubmit(stars);
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    }
    setSubmitting(false);
  };

  const handleReportSubmit = async () => {
    if (!reason.trim()) return;
    setSubmitting(true);
    try {
      await axios.post(
        `${API}/report/${matchId}`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setView("success");
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting report.");
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm flex flex-col items-center gap-6 text-center">

        {/* ── Rating View ── */}
        {view === "rating" && (
          <>
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-4xl">🎉</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Service Completed!</h3>
              <p className="text-sm text-gray-500 mt-1">
                How was your experience with{" "}
                <span className="font-semibold text-gray-700">{volunteerName}</span>?
              </p>
            </div>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setStars(star)}
                  className="text-4xl transition-transform hover:scale-110 active:scale-90"
                >
                  <span className={star <= (hovered || stars) ? "text-yellow-400" : "text-gray-200"}>★</span>
                </button>
              ))}
            </div>

            {stars > 0 && (
              <p className="text-sm font-medium text-gray-600">
                {["", "Poor", "Fair", "Good", "Very Good", "Excellent!"][stars]}
              </p>
            )}

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave a comment (optional)..."
              rows={3}
              className="w-full border border-gray-100 bg-gray-50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 resize-none"
            />

            <div className="flex flex-col gap-3 w-full">
              <div className="flex gap-3 w-full">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-100 text-gray-500 font-semibold text-sm hover:bg-gray-50 transition"
                >
                  Skip
                </button>
                <button
                  onClick={handleRatingSubmit}
                  disabled={!stars || submitting}
                  className="flex-1 py-3 rounded-xl bg-green-300 hover:bg-green-400 text-white font-bold text-sm disabled:opacity-50 transition"
                >
                  {submitting ? "Saving..." : "Submit"}
                </button>
              </div>
              <button
                onClick={() => setView("report")}
                className="text-xs text-red-400 hover:text-red-500 underline transition"
              >
                Report a problem with this user
              </button>
            </div>
          </>
        )}

        {/* ── Report View ── */}
        {view === "report" && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-3xl">⚠️</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Report User</h3>
              <p className="text-sm text-gray-500 mt-1">
                Tell us what went wrong with{" "}
                <span className="font-semibold text-red-600">{volunteerName}</span>
              </p>
            </div>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please describe the issue in detail..."
              rows={4}
              className="w-full border border-red-50 bg-red-50/30 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 resize-none"
            />

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setView("rating")}
                className="flex-1 py-3 rounded-xl border-2 border-gray-100 text-gray-500 font-semibold text-sm hover:bg-gray-50 transition"
              >
                Back
              </button>
              <button
                onClick={handleReportSubmit}
                disabled={!reason.trim() || submitting}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm disabled:opacity-50 transition"
              >
                {submitting ? "Sending..." : "Submit Report"}
              </button>
            </div>
          </>
        )}

        {/* ── Success View ── */}
        {view === "success" && (
          <div className="py-4 flex flex-col items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-5xl">🛡️</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Thank You!</h3>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                Your feedback has been submitted. Our team will review the details regarding{" "}
                <span className="font-semibold text-gray-700">{volunteerName}</span> and take appropriate action.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full mt-2 py-3.5 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-sm transition"
            >
              Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

// ===================== Main Chat Component =====================
export default function ChatPage({ matchId: propMatchId, onClose, inlineMode }) {
  const { matchId: paramMatchId } = useParams();
  const navigate = useNavigate();

  // ✅ Fix: always use a clean integer string for the URL
  const matchId = propMatchId ?? paramMatchId;
const matchIdInt = matchId ? parseInt(matchId, 10) : null;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [matchInfo, setMatchInfo] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [remaining, setRemaining] = useState(null);
  const [limitReached, setLimitReached] = useState(false);
  const [showDoneConfirm, setShowDoneConfirm] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [markingDone, setMarkingDone] = useState(false);
  const [ratingDone, setRatingDone] = useState(false);

  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);
  const lastMessageIdRef = useRef(null);
  const ratingDoneRef = useRef(false); // ✅ ref to avoid stale closure in polling

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // ✅ Derive from matchInfo safely
  // const isVolunteer = matchInfo?.volunteer_id === user.id;
  // const isCustomer = matchInfo?.customer_id === user.id;
    // ✅ احسبهم بعد ما matchInfo يجي
// const isVolunteer = matchInfo ? matchInfo.volunteer_id === user.id : false;
// const isCustomer  = matchInfo ? matchInfo.customer_id  === user.id : false;
const isVolunteer = matchInfo ? matchInfo.volunteer_id === Number(user.id) : false;
const isCustomer  = matchInfo ? matchInfo.customer_id  === Number(user.id) : false;
  const otherUser = isVolunteer ? matchInfo?.customer : matchInfo?.volunteer;


// أو أضف loading state للـ matchInfo
const [matchInfoLoaded, setMatchInfoLoaded] = useState(false);

const fetchMatchInfo = useCallback(async () => {
  try {
    const res = await axios.get(`${API}/my-matches`, { headers });
    const match = res.data.matches?.find((m) => m.id === matchIdInt);
    if (match) {
      setMatchInfo(match);
      setMatchInfoLoaded(true); // ✅ علامة إن الداتا وصلت
      return match;
    }
  } catch (err) {
    console.error(err);
  }
  return null;
}, [matchIdInt]);

  // ── Fetch match info first ──
  // const fetchMatchInfo = useCallback(async () => {
  //   try {
      
  //     const res = await axios.get(`${API}/my-matches`, { headers });
  //     const matches = res.data.matches || [];
  //     const match = matches.find((m) => m.id === matchIdInt);
  //     if (match) {
  //       setMatchInfo(match);
  //       return match;
  //     }
  //   } catch (err) {
  //     console.error("fetchMatchInfo error:", err);
  //   }
  //   return null;
  // }, [matchIdInt]);

  // ── Fetch messages ──
  // ✅ Fix: removed isCustomer from deps to avoid re-subscription loop
  const fetchMessages = useCallback(
    async (silent = false) => {
      if (!matchIdInt || isNaN(matchIdInt)) return; // guard against bad id
      try {
        const res = await axios.get(`${API}/chat/${matchIdInt}/messages`, { headers });
        const data = res.data;

        const newLastId = data.messages?.[data.messages.length - 1]?.id;
        if (!silent || newLastId !== lastMessageIdRef.current) {
          setMessages(data.messages || []);
          lastMessageIdRef.current = newLastId;
        }

        setIsAccepted(data.is_accepted);
        setRemaining(data.remaining_messages);
        // setLimitReached(data.remaining_messages === 0 && !data.is_accepted);
        // const status = data.match_status || matchInfo?.status;
        // setLimitReached(
        //   (status === "completed" && data.remaining_messages === 0) ||
        //   (status !== "accepted" && status !== "completed" && data.remaining_messages === 0)
        // );
        const status = data.match_status || matchInfo?.status;
        setLimitReached(status !== "accepted" && data.remaining_messages === 0);

        // ✅ use ref so polling closure doesn't go stale
        // if (data.match_status === "completed" && !ratingDoneRef.current) {
        //   // check if current user is customer via matchInfo stored in ref
        //   setShowRatingModal((prev) => {
        //     if (!prev && !ratingDoneRef.current) return true;
        //     return prev;
        //   });
        // }
        if (data.match_status === "completed" && !ratingDoneRef.current) {
  // جيب الـ matchInfo من الـ ref عشان تعرف إيه role اليوزر
  const currentMatch = await fetchMatchInfo();
  const customerIdFromMatch = currentMatch?.customer_id;
  if (customerIdFromMatch === Number(user.id)) {
    setShowRatingModal((prev) => {
      if (!prev && !ratingDoneRef.current) return true;
      return prev;
    });
  }
}

        if (!silent) setLoading(false);
      } catch (err) {
        console.error("fetchMessages error:", err.response?.status, err.response?.data);
        if (!silent) setLoading(false);
      }
    },
    [matchIdInt] // ✅ stable dependency only
  );

  useEffect(() => {
    ratingDoneRef.current = ratingDone;
  }, [ratingDone]);

  useEffect(() => {
    if (!matchIdInt || isNaN(matchIdInt)) return;

    fetchMatchInfo();
    fetchMessages(false);

    // ✅ polling every 3s
    pollingRef.current = setInterval(() => {
      fetchMessages(true);
    }, 3000);

    return () => clearInterval(pollingRef.current);
  }, [matchIdInt]); // ✅ only re-run when matchId changes

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send message ──
  const handleSend = async () => {
    if (!input.trim() || sending || limitReached) return;
    setSending(true);

    const tempMsg = {
      id: `temp-${Date.now()}`,
      sender_id: user.id,
      message: input.trim(),
      created_at: new Date().toISOString(),
      sender: { name: user.name, id_image: user.id_image },
      temp: true,
    };
    setMessages((prev) => [...prev, tempMsg]);
    const sentText = input.trim();
    setInput("");

    try {
      await axios.post(
        `${API}/chat/${matchIdInt}/messages`,
        { message: sentText },
        { headers }
      );
      await fetchMessages(true);
    } catch (err) {
      if (err.response?.data?.limit_reached) {
        setLimitReached(true);
      }
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
      setInput(sentText);
      console.error(err);
    }
    setSending(false);
  };

  // ── Mark Done ──
  // const handleDone = async () => {
  //   setMarkingDone(true);
  //   try {
  //     await axios.put(`${API}/chat/${matchIdInt}/done`, {}, { headers });
  //     setShowDoneConfirm(false);
  //     await fetchMatchInfo();
  //     await fetchMessages(false);
  //   } catch (err) {
  //     console.error(err);
  //   }
  //   setMarkingDone(false);
  // };
  


const handleDone = async () => {
  if (!matchIdInt || isNaN(matchIdInt)) {
    alert("❌ خطأ: Match ID غير صحيح");
    return;
  }

  setMarkingDone(true);
  try {
    const res = await axios.post(
      `${API}/service-matches/${matchIdInt}/done`,
      {},
      { headers }
    );

    // ✅ حدّث earnedBalance في localStorage
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const updatedUser = {
      ...currentUser,
      earnedBalance: res.data.new_volunteering_balance,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // ✅ حدّث الـ Navbar فوراً
    window.dispatchEvent(new Event("balanceUpdated"));
    window.dispatchEvent(new Event("userUpdated"));

    alert(`تمت الخدمة ✅ تم إضافة ${res.data.earned_balance} دقيقة`);
    setShowDoneConfirm(false);
    await fetchMatchInfo();
    await fetchMessages(false);

  } catch (err) {
    console.error("❌ handleDone error:", err.response?.data || err.message);
    alert("❌ Error: " + (err.response?.data?.message || err.response?.status || err.message));
  }
  setMarkingDone(false);
};
//   const handleDone = async () => {
//   setMarkingDone(true);
//   try {
//     const res = await axios.post(`${API}/service-matches/${matchIdInt}/done`, {}, { headers }
//     );

//     alert(`تمت الخدمة ✅ تم إضافة ${res.data.earned_balance} دقيقة`);

//     setShowDoneConfirm(false);
//     await fetchMatchInfo();
//     await fetchMessages(false);

//   } catch (err) {
//     console.error(err);
//   }
//   setMarkingDone(false);
// };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAvatar = (sender) => {
    if (sender?.id_image)
      return `http://72.62.186.133/storage/${sender.id_image}`;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      sender?.name || "U"
    )}&background=bbf7d0&color=15803d&bold=true`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-pulse text-gray-400">Loading chat...</div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col bg-white dark:!bg-slate-700 rounded-2xl shadow-lg overflow-hidden border border-gray-100 ${inlineMode ? "h-[80vh]" : "min-h-screen"
        }`}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-white dark:!bg-slate-800">
        <button
          onClick={onClose ? onClose : () => navigate(-1)}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          ←
        </button>

        {otherUser && (
          <img
            src={getAvatar(otherUser)}
            alt=""
            className="w-10 h-10 rounded-full object-cover border-2 border-green-100"
          />
        )}

        <div className="flex-1">
          {/* <p className="font-semibold text-gray-800 text-sm">
            {otherUser?.name || "Chat"}
          </p>
          <p className="text-xs text-gray-400">
            {isAccepted
              ? `⏳ Limited • ${remaining ?? "?"} messages left`
              : "✅ Active"}
          </p> */}
          {/* ── Header status text ── */}
          <p className="text-xs text-gray-400">
            {matchInfo?.status === "accepted"
              ? "✅ Active • Unlimited messages"
              : matchInfo?.status === "completed"
                ? `🔒 Completed • ${remaining ?? 0} msgs left`
                : matchInfo?.status === "inquiry"
                  ? `💬 Inquiry • ${remaining ?? 30} msgs left`
                  : `⏳ Pending • ${remaining ?? 30} msgs left`}
          </p>
        </div>

        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold ${matchInfo?.status === "completed"
            ? "bg-green-50 text-green-600"
            : matchInfo?.status === "accepted"
              ? "bg-blue-50 text-blue-600"
              : "bg-amber-50 text-amber-600"
            }`}
        >
          {matchInfo?.status || "pending"}
        </span>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-10">
            No messages yet. Say hi! 👋
            {!isAccepted && remaining !== null && (
              <p className="mt-2 text-amber-500 text-xs">
                ⚠️ You have {remaining} messages before acceptance
              </p>
            )}
          </div>
        )}

        {messages.map((msg) => {
          const isMine = msg.sender_id === user.id;
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}
            >
              {!isMine && (
                <img
                  src={getAvatar(msg.sender)}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div
                className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMine
                  ? "bg-green-300 text-white rounded-br-sm"
                  : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm"
                  } ${msg.temp ? "opacity-70" : ""}`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                <p
                  className={`text-xs mt-1 ${isMine ? "text-green-100" : "text-gray-400"
                    }`}
                >
                  {formatTime(msg.created_at)}
                  {msg.temp && " • sending..."}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Limit Warning ── */}
      {/* {limitReached && (
        <div className="px-4 py-2.5 bg-amber-50 border-t border-amber-100 text-center">
          <p className="text-xs text-amber-600 font-medium">
            ⏳ Message limit reached. Waiting for the service owner to accept your request.
          </p>
        </div>
      )} */}
      {/* ── Limit Warning ── */}
      {limitReached && (
  <div className="px-4 py-2.5 bg-amber-50 border-t border-amber-100 text-center">
    <p className="text-xs text-amber-600 font-medium">
      {matchInfo?.status === "completed"
        ? "🔒 Post-service message limit reached."
        : matchInfo?.status === "inquiry"
        ? "💬 Inquiry limit reached. Place an order to continue."  // ✅ جديد
        : "⏳ Message limit reached. Waiting for acceptance."}
    </p>
  </div>
)}

      {/* ── Done Button (volunteer only, after accepted) ── */}
      {isVolunteer && matchInfo?.status === "accepted" && (
        <div className="px-4 py-2 bg-green-50 border-t border-green-100">
          <button
            onClick={() => setShowDoneConfirm(true)}
            className="w-full py-2 rounded-xl bg-green-300 hover:bg-green-400 text-white font-bold text-sm transition"
          >
            ✓ Mark as Done
          </button>
        </div>
      )}

      {/* ── Input ── */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white dark:!bg-slate-800 flex gap-2 items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            matchInfo?.status === "completed" && !limitReached
              ? "Type a message..."
              : limitReached
                ? "Message limit reached..."
                : "Type a message..."
          }
          // disabled={limitReached || matchInfo?.status === "completed"}
          disabled={limitReached}
          className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-green-300 disabled:bg-gray-50 disabled:text-gray-400"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending || limitReached}
          className="w-10 h-10 rounded-full bg-green-300 hover:bg-green-400 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {sending ? (
            <span className="text-xs">...</span>
          ) : (
            <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Done Confirm Modal ── */}
      {showDoneConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-7 w-[90%] max-w-sm flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-3xl">
              ✅
            </div>
            <h3 className="text-lg font-bold text-gray-800">Mark as Done?</h3>
            <p className="text-sm text-gray-500">
              This will complete the service and notify the customer to rate you.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowDoneConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDone}
                disabled={markingDone}
                className="flex-1 py-2.5 rounded-xl bg-green-300 hover:bg-green-400 text-white font-bold text-sm disabled:opacity-60"
              >
                {markingDone ? "..." : "Yes, Done!"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Rating Modal (customer) ── */}
      {showRatingModal && matchInfo && matchInfo.customer_id === Number(user.id) && (
        <RatingModal
          matchId={matchIdInt}
          volunteerName={matchInfo?.volunteer?.name || "Volunteer"}
          onClose={() => {
            setShowRatingModal(false);
            setRatingDone(true);
            ratingDoneRef.current = true;
          }}
          onSubmit={() => {
            setShowRatingModal(false);
            setRatingDone(true);
            ratingDoneRef.current = true;
          }}
        />
      )}
    </div>
  );
}