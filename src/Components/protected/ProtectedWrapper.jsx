import React, { useEffect, useState } from "react";
import axios from "axios"; // افترضنا إنك بتستخدم axios

const ProtectedWrapper = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!storedUser || !token) {
          setLoading(false);
          return;
        }

        // الأفضل: نادى الـ API الخاص بالبروفايل للتأكد من الحالة من قاعدة البيانات مباشرة
        const response = await axios.get("http://72.62.186.133/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const latestUserData = response.data;
        setUser(latestUserData);

        // تحديث الـ localStorage بالبيانات الجديدة (عشان لو الأدمن غير الحالة)
        localStorage.setItem("user", JSON.stringify(latestUserData));
      } catch (error) {
        console.error("Error fetching user status", error);
        // لو الـ Token انتهى أو فيه مشكلة، ممكن تمسح البيانات
        // localStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  if (loading)
    return <p className="text-center mt-10">Loading user status...</p>;

  // في ProtectedWrapper - لو مفيش يوزر مش نرجعه، نسيبه يشوف الصفحة
// بس الـ GuestWrapper هيمنع أي action
if (!user) {
  return <>{children}</>; // ✅ يشوف بس ميعملش حاجة
}

  // فحص الحظر (Suspended)
  if (user.is_suspended === 1 || user.is_suspended === "1") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-md text-center border border-red-200">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Account Suspended
          </h2>
          <p className="text-gray-500">
            Your account has been suspended by admin.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedWrapper;
