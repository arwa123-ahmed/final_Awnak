import React, { useState } from "react";
import axios from "axios";

const RoleSelectionModal = ({ onRoleSelected }) => {
  const [loading, setLoading] = useState(null);

  const handleRoleSelect = async (role) => {
    setLoading(role);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://72.62.186.133/api/update/role",
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem("role", role);
      onRoleSelected(role);
    } catch (err) {
      console.error(err);
    }
    setLoading(null);
  };

  return (
    // بدون backdrop - مجرد بوكس fixed في أعلى اليمين
    <div className="fixed top-20 right-6 z-50 bg-white rounded-2xl shadow-2xl p-5 w-72 border border-green-100">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">👋</span>
        <div>
          <h2 className="text-base font-bold text-gray-800">Welcome!</h2>
          <p className="text-xs text-gray-400">Choose your role to continue</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mb-4" />

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => handleRoleSelect("volunteer")}
          disabled={!!loading}
          className={`w-full py-2.5 rounded-xl font-bold text-white text-sm transition-all duration-200 flex items-center justify-center gap-2
            ${loading === "volunteer"
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-300 hover:bg-green-400 active:scale-95"}`}
        >
          {loading === "volunteer" ? "Loading..." : "🙋 Volunteer"}
        </button>

        <button
          onClick={() => handleRoleSelect("customer")}
          disabled={!!loading}
          className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 border-2
            ${loading === "customer"
              ? "border-green-300 text-green-300 cursor-not-allowed"
              : "border-green-300 text-green-500 hover:bg-green-50 active:scale-95"}`}
        >
          {loading === "customer" ? "Loading..." : "🛒 Customer"}
        </button>
      </div>

    </div>
  );
};

export default RoleSelectionModal;