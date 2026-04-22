import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import heroLight from "../../images/logoA.png";
import heroDark from "../../images/logoDark2.1.png"; // ✅ أضيفي صورة الدارك

const HeroSection = () => {
  const isDark = document.documentElement.classList.contains("dark");
  const { t } = useTranslation();
  const [showRoleModal, setShowRoleModal] = useState(false);


  return (
    <motion.section
      className="min-h-screen flex items-center justify-center px-4 md:px-16 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center justify-center">

        {/* Text Section */}
        <motion.div
          className="text-center md:text-left space-y-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-green-100 leading-[1.3]">
            {t("HeroSectionTitle")} <span className="text-green-600">{t("Awnak")}</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300">
            {t("HeroSectionDescp1")}
          </p>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mt-4">
            {t("HeroSectionDescp2")}
          </p>
        </motion.div>

        {/* Illustration Section */}
        <motion.div
          className="hidden md:flex justify-center"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {/* ✅ صورة اللايت */}
          <img
            src={heroLight}
            alt="Hero Illustration"
            className="w-96 h-auto rounded-2xl shadow-2xl dark:hidden"
          />
          {/* ✅ صورة الدارك */}
          <img
            src={heroDark}
            alt="Hero Illustration Dark"
            className="w-96 h-auto rounded-2xl shadow-2xl hidden dark:block"
          />
        </motion.div>

      </div>
    </motion.section>
  );
};

export default HeroSection;