import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ChatPage from "../Chat/Chat";

const API = "http://72.62.186.133/api";

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [matchId, setMatchId] = useState(null);
  const [inquiryLoading, setInquiryLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const isOwnProfile = currentUser.id === parseInt(id);

  // ── Fetch profile ──
  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/profile/${id}`, { headers });
      setProfileUser(res.data.user);
    } catch (err) {
      try {
        const matchRes = await axios.get(`${API}/my-matches`, { headers });
        const matches = matchRes.data.matches || [];
        let foundUser = null;
        for (const m of matches) {
          if (m.volunteer?.id === parseInt(id)) {
            foundUser = m.volunteer;
            break;
          }
          if (m.customer?.id === parseInt(id)) {
            foundUser = m.customer;
            break;
          }
        }
        if (foundUser) setProfileUser(foundUser);
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, [id]);

  // ── Find match between current user and this profile ──
  const findMatch = useCallback(async () => {
  try {
    const res = await axios.get(`${API}/my-matches`, { headers });
    const matches = res.data.matches || [];
    const activeMatch = matches.find(
      (m) =>
        (m.volunteer_id === parseInt(id) || m.customer_id === parseInt(id)) &&
        ["inquiry", "pending", "accepted", "completed"].includes(m.status)  // ✅
    );
    if (activeMatch) setMatchId(activeMatch.id);
  } catch (err) {
    console.error(err);
  }
}, [id]);

  useEffect(() => {
    fetchProfile();
    findMatch();
  }, [id]);

  const getAvatar = (u) => {
    if (u?.id_image) return `http://72.62.186.133/storage/${u.id_image}`;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      u?.name || "U",
    )}&background=bbf7d0&color=15803d&bold=true&size=200`;
  };

  const renderStars = (rating) => {
    const r = parseFloat(rating || 0);
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg
            key={s}
            className={`w-5 h-5 ${s <= Math.round(r) ? "text-yellow-400" : "text-gray-200"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-green-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="text-4xl mb-3">👤</p>
          <p>User not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-green-500 underline text-sm"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-50 py-12 px-4">
      <div
        className={`max-w-5xl mx-auto flex flex-col ${
          showChat && matchId ? "lg:flex-row" : ""
        } gap-6 items-start justify-center`}
      >
        {/* ── Profile Card ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden w-full max-w-md">
          {/* Top banner */}
          <div className="h-24 bg-gradient-to-r from-green-200 to-emerald-100 relative">
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm text-gray-500 hover:text-gray-700 transition text-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm"
            >
              ← Back
            </button>
          </div>

          <div className="px-8 pb-8 flex flex-col items-center text-center -mt-12 gap-4">
            {/* Avatar */}
            <div className="relative">
              <img
                src={getAvatar(profileUser)}
                alt={profileUser.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
              <span className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
            </div>

            {/* Name & email */}
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {profileUser.name}
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {profileUser.email}
              </p>
            </div>

            {/* Role badge */}
            {profileUser.role && profileUser.role !== "none" && (
              <span
                className={`px-4 py-1 rounded-full text-xs font-semibold ${
                  profileUser.role === "volunteer"
                    ? "bg-green-50 text-green-600 border border-green-100"
                    : "bg-blue-50 text-blue-600 border border-blue-100"
                }`}
              >
                {profileUser.role === "volunteer"
                  ? "🙋 Volunteer"
                  : "🛒 Customer"}
              </span>
            )}

            {/* Divider */}
            <div className="w-full h-px bg-gray-100" />

            {/* Stats - Reviews & Rating only (no balance) */}
            <div className="flex gap-8 w-full justify-center">
              <div className="flex flex-col items-center gap-0.5">
                <p className="text-2xl font-bold text-gray-800">
                  {profileUser.ratings_count || 0}
                </p>
                <p className="text-xs text-gray-400">Reviews</p>
              </div>
              <div className="w-px bg-gray-100" />
              <div className="flex flex-col items-center gap-0.5">
                <p className="text-2xl font-bold text-gray-800">
                  {parseFloat(profileUser.average_rating || 0).toFixed(1)}
                </p>
                <p className="text-xs text-gray-400">Avg Rating</p>
              </div>
            </div>

            {/* Stars */}
            <div className="flex flex-col items-center gap-1.5">
              {renderStars(profileUser.average_rating)}
              <p className="text-xs text-gray-400">
                {profileUser.ratings_count
                  ? `Based on ${profileUser.ratings_count} review${profileUser.ratings_count > 1 ? "s" : ""}`
                  : "No reviews yet"}
              </p>
            </div>

            {/* Chat / no-chat */}
           {!isOwnProfile && (
  <>
    <button
      onClick={async () => {
        if (matchId) {
          setShowChat(!showChat);
          return;
        }
        // مفيش match → ابدئي inquiry
        setInquiryLoading(true);
        try {
          const res = await axios.post(
            `${API}/inquiry/${id}`,
            {},
            { headers }
          );
          setMatchId(res.data.match_id);
          setShowChat(true);
        } catch (err) {
          console.error(err);
        }
        setInquiryLoading(false);
      }}
      disabled={inquiryLoading}
      className="w-full py-3 rounded-2xl bg-green-300 hover:bg-green-400 active:scale-95 text-white font-bold text-sm transition-all disabled:opacity-60"
    >
      {inquiryLoading ? "Loading..." : showChat ? "✕ Close Chat" : "💬 Chat"}
    </button>
  </>
)}

            {/* {!isOwnProfile && !matchId && (
              <p className="text-xs text-gray-400 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 w-full">
                💬 Chat is available after service acceptance
              </p>
            )} */}
          </div>
        </div>

        {/* ── Inline Chat ── */}
        {showChat && matchId && (
          <div className="flex-1 w-full max-w-2xl">
            <ChatPage
              matchId={matchId.toString()}
              onClose={() => setShowChat(false)}
              inlineMode={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
