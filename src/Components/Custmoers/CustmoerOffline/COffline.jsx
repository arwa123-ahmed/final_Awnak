import React, { useEffect, useState } from "react";
import CardsVo from "./cardsCo";
import offHero from "../../../images/vofflinemain.jpg";
import { motion } from "framer-motion";
import { FaLock } from "react-icons/fa";

const COffline = () => {
  const [user, setUser] = useState(null);

  // ✅ get user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // ❌ لو مش متأكتف
  if (user && user.activation === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full text-center border border-gray-100"
        >
          {/* icon */}
          <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-red-100 text-red-500 text-3xl mb-6 shadow-inner">
            <FaLock />
          </div>

          {/* title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Account Not Activated
          </h2>

          {/* description */}
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Your account is currently not activated.
            <br />
            Please wait until it gets approved by the admin.
          </p>

          {/* note */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs text-gray-400">
            Once your account is activated, you will be able to access all
            features.
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* ===== Hero Section بدل السلايدر ===== */}
      <div className="bg-emerald-800 dark:bg-slate-800 rounded-3xl mx-6 mt-10 flex flex-col md:flex-row items-center justify-between overflow-hidden">
        {/* Text */}
        <div className="text-white p-10 md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Boost your business with
            <span className="text-green-300"> offline services</span>
          </h1>

          <p className="text-gray-300 mb-6">
            Discover trusted offline professionals near you. From photography
            and event planning to maintenance and local services — we connect
            you with experts ready to deliver real-world results.
          </p>

          <button className="bg-green-300 text-slate-800 hover:bg-green-400 px-6 py-3 rounded-lg font-semibold transition">
            Explore Services
          </button>
        </div>

        {/* Image */}
        <div className="md:w-1/2 h-[350px] md:h-[450px]">
          <img
            src={offHero}
            alt="Offline Services"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* ===== Categories ===== */}
      <CardsVo />

      {/* ===== Services ===== */}
      <div>{/* <ServiceCardVo /> */}</div>
    </>
  );
};

export default COffline;
