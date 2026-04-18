import React from "react";
import { motion } from "framer-motion";
import { Users, Briefcase, FileText, CreditCard, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";

const cards = [
  { title: "Users", value: "1,248", desc: "Total registered users", icon: Users, path: "/admin/users" },
  { title: "Services", value: "86", desc: "Active services", icon: Briefcase, path: "/admin/services" },
  { title: "Reports", value: "32", desc: "Pending reports", icon: FileText, path: "/admin/reports" },
  { title: "Payments", value: "EGP", desc: "Total revenue", icon: CreditCard, path: "/admin/payments" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  // ✅ جوا الـ component
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/admin/login");
  };

  return (
    <section className={styles.dashboard}>
      <div className={styles.container}>

        {/* ✅ Header فيه العنوان + زرار logout */}
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.title}
          >
            Admin <span>Dashboard</span>
          </motion.h2>

          <motion.button
            onClick={handleLogout}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition"
          >
            <LogOut size={16} />
            Logout
          </motion.button>
        </div>

        <div className={styles.grid}>
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              className={styles.card}
              onClick={() => navigate(card.path)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className={styles.iconWrapper}>
                <card.icon className={styles.icon} />
              </div>
              <h3>{card.title}</h3>
              <p className={styles.value}>{card.value}</p>
              <span>{card.desc}</span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AdminDashboard;