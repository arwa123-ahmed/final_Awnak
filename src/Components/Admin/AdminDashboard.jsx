import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  FileText,
  CreditCard,
  LogOut,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/admin/login");
  };

  const cards = [
    {
      title: "Users",
      desc: "Manage registered users and accounts",
      icon: Users,
      path: "/admin/users",
      color: "from-blue-500 to-blue-700 shadow-blue-200",
    },
    {
      title: "Services",
      desc: "Control active and pending services",
      icon: Briefcase,
      path: "/admin/services",
      color: "from-emerald-500 to-emerald-700 shadow-emerald-200",
    },
    {
      title: "Reports",
      desc: "Review user disputes and complaints",
      icon: FileText,
      path: "/admin/reports",
      color: "from-rose-500 to-rose-700 shadow-rose-200",
    },
    {
      title: "Payments",
      desc: "Monitor recharges and transactions",
      icon: CreditCard,
      path: "/admin/payments",
      color: "from-amber-500 to-amber-700 shadow-amber-200",
    },
  ];

  return (
    <section className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-7xl">
        {/* --- Header Section --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 w-full">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl font-black text-slate-800 tracking-tighter"
            >
              Admin <span className="text-emerald-600">Dashboard</span>
            </motion.h2>
            <p className="text-slate-500 font-medium mt-2 text-lg">
              System Management and Control Portal.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 bg-white border-2 border-rose-100 text-rose-500 hover:bg-rose-50 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-sm"
          >
            <LogOut size={18} />
            Logout
          </motion.button>
        </header>

        {/* --- Full Page Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full min-h-[500px]">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              onClick={() => navigate(card.path)}
              className="group cursor-pointer relative bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/60 hover:shadow-emerald-200/40 transition-all duration-500 overflow-hidden flex flex-col justify-between"
            >
              {/* Decorative Background Blob */}
              <div
                className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${card.color} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700`}
              />

              <div className="flex justify-between items-start relative z-10">
                <div
                  className={`p-6 rounded-[2rem] bg-gradient-to-br ${card.color} text-white shadow-2xl shadow-inherit transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <card.icon size={36} />
                </div>
                <div className="text-slate-300 group-hover:text-emerald-500 transition-colors duration-300">
                  <ArrowUpRight size={32} />
                </div>
              </div>

              <div className="mt-12 relative z-10">
                <h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">
                  {card.desc}
                </p>
              </div>

              {/* Bottom Progress Bar Decor */}
              <div className="mt-8 w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${card.color} w-0 group-hover:w-full transition-all duration-1000 ease-out`}
                />
              </div>

              {/* Status Glow */}
              <div
                className={`absolute top-0 left-0 w-2 h-0 bg-gradient-to-b ${card.color} group-hover:h-full transition-all duration-500`}
              />
            </motion.div>
          ))}
        </div>

        {/* --- Footer Note --- */}
        <footer className="mt-16 text-center">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-300">
            Aounak Management Engine v2.0
          </p>
        </footer>
      </div>
    </section>
  );
};

export default AdminDashboard;
