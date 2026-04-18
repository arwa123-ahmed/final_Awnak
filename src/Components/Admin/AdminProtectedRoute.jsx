// src/components/AdminProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("admin_token");
  const user = JSON.parse(localStorage.getItem("admin_user") || "{}");

  // ✅ لو مفيش token أو مش admin → ارجعه لصفحة اللوجين
  if (!token || user.account_type !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;