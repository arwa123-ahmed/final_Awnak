import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ service, type, onAccept }) => {
  const navigate = useNavigate();
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [showRoleAlert, setShowRoleAlert] = useState(false);
  const [showBalanceAlert, setShowBalanceAlert] = useState(false);

  // ✅ user كـ state يتحدث تلقائياً
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  // ✅ sync لو اتغير الـ user
  useEffect(() => {
    const syncUser = () => {
      setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    };
    window.addEventListener("userUpdated", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("userUpdated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const currentRole = user.role;
  const isOwner = service.user?.id === user.id;
  const requiredRole = type === "offers" ? "customer" : "volunteer";
  const hasCorrectRole = currentRole === requiredRole;

  const handleButtonClick = () => {
    if (isOwner) return;

    if (!hasCorrectRole) {
      setShowRoleAlert(true);
      return;
    }

    if (type === "offers" && currentRole === "customer") {
      const userBalance = parseFloat(user.balance ?? 0);
      const serviceCost = parseFloat(service.timesalary ?? 0);
      if (userBalance < serviceCost) {
        setShowBalanceAlert(true);
        return;
      }
    }

    handleAccept();
  };

  const handleChangeRole = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://72.62.186.133/api/update/role",
        { role: requiredRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedUser = { ...user, role: requiredRole };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("role", requiredRole);
      window.dispatchEvent(new Event("userUpdated")); // ✅ حدّث الـ navbar
      setShowRoleAlert(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = async () => {
    setAccepting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://72.62.186.133/api/services/${service.id}/request`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAccepted(true);
      if (onAccept) onAccept(service.id);
    } catch (err) {
      console.error(err);
    }
    setAccepting(false);
  };

  const userName = service.user?.name;
  const userImage = service.user?.id_image
    ? `http://72.62.186.133/storage/${service.user.id_image}`
    : userName
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=bbf7d0&color=15803d&bold=true`
      : `https://ui-avatars.com/api/?name=U&background=bbf7d0&color=15803d&bold=true`;

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-green-100 hover:shadow-lg">

        <div className="h-1.5 bg-gradient-to-r from-green-400 to-green-300" />

        <div className="p-5 flex flex-col gap-3 flex-1">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
              ${service.status === "pending" ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"}`}>
              <span className={`w-2 h-2 rounded-full ${service.status === "pending" ? "bg-amber-400" : "bg-green-400"}`} />
              {service.status}
            </span>
            <span className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold">
              ⏱ {service.timesalary} min
            </span>
          </div>

          <h3 className="text-base font-bold text-gray-800 leading-snug">{service.name}</h3>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{service.description}</p>

          {service.service_location && (
            <p className="text-xs text-gray-400 flex items-center gap-1 truncate">
              📍 {service.service_location}
            </p>
          )}
        </div>

        <div className="mx-5 h-px bg-gray-100" />

        <div
          className="px-5 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => navigate(`/profile/${service.user?.id}`)}
        >
          <div className="relative">
            <img
              src={userImage}
              alt={userName || "User"}
              className="w-10 h-10 rounded-full object-cover border-2 border-green-100"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || "U")}&background=bbf7d0&color=15803d&bold=true`;
              }}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white" />
          </div>
          <p className="text-sm font-semibold text-gray-800 hover:text-green-600 transition-colors">
            {userName || "Unknown User"}
          </p>
        </div>

        {service.status === "pending" && (
          <div className="px-5 pb-5">
            <button
              onClick={handleButtonClick}
              disabled={accepting || accepted || isOwner}
              className={`w-full py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200
                ${isOwner
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : accepted
                    ? "bg-green-100 text-green-600 cursor-not-allowed"
                    : accepting
                      ? "bg-green-300 text-white cursor-not-allowed"
                      : "bg-green-300 hover:bg-green-400 text-white active:scale-95"
                }`}
            >
              {isOwner ? "🔒 Your Service"
                : accepted ? "✓ Done!"
                : accepting ? "Loading..."
                : type === "requests" ? "✦ Accept" : "🛒 Order"
              }
            </button>
          </div>
        )}
      </div>

      {/* Role Alert */}
      {showRoleAlert && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-7 w-[90%] max-w-sm flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-3xl">⚠️</div>
            <h3 className="text-lg font-bold text-gray-800">Change Your Role?</h3>
            <p className="text-sm text-gray-500">
              {requiredRole === "customer"
                ? "To order a service, you need to switch your role to Customer. Do you want to change?"
                : "To accept a service, you need to switch your role to Volunteer. Do you want to change?"}
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setShowRoleAlert(false)} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50">
                No, Cancel
              </button>
              <button onClick={handleChangeRole} className="flex-1 py-2.5 rounded-xl bg-green-300 hover:bg-green-400 text-white font-bold text-sm">
                Yes, Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Balance Alert */}
      {showBalanceAlert && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-7 w-[90%] max-w-sm flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-4xl">💸</div>
            <h3 className="text-lg font-bold text-gray-800">Insufficient Balance</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your current balance is{" "}
              <span className="font-bold text-red-500">{parseFloat(user.balance ?? 0)} min</span>,
              but this service requires{" "}
              <span className="font-bold text-green-600">{service.timesalary} min</span>.
              <br />Please recharge your balance to proceed.
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setShowBalanceAlert(false)} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50 transition">
                Cancel
              </button>
              <button
                onClick={() => { setShowBalanceAlert(false); navigate("/rechargebalance"); }}
                className="flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition"
              >
                💳 Recharge Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceCard;