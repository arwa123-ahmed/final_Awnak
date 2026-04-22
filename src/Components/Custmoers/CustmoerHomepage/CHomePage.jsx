import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHandsHelping, FaClock, FaMapMarkerAlt, FaLock } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import ServiceTypeSectionC from "./ServiceTypeSectionC";
import Chome from "../../../images/chomemain.jpg";

const CHomePage = () => {
  const [index, setIndex] = useState(-1);
  const [user, setUser] = useState(null);
  const { t } = useTranslation();

  const lines = [
    { text: t("cLine1"), icon: <FaHandsHelping /> },
    { text: t("cLine2"), icon: <FaClock /> },
    { text: t("cLine3"), icon: <FaMapMarkerAlt /> },
  ];

  const word = t("customer");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev >= lines.length - 1) return -1;
        return prev + 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (user && user.activation === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-10 max-w-md w-full text-center border border-gray-100 dark:border-gray-700"
        >
          <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-red-100 text-red-500 text-3xl mb-6 shadow-inner">
            <FaLock />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
            {t("accountNotActivated")}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
            {t("accountNotActivatedDesc")}
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl p-4 text-xs text-gray-400">
            {t("accountActivatedNote")}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full">
        <div className="relative w-full h-[600px] max-h-[600px] overflow-hidden rounded-b-[40px]">
          <img src={Chome} alt="customer home page" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-green-900/60 dark:bg-green-900/70 backdrop-blur-[2px] flex items-center justify-center px-6 text-center">
            <AnimatePresence mode="wait">
              {index === -1 ? (
                <motion.h1
                  key="customer"
                  className="text-6xl md:text-8xl font-extrabold text-white tracking-widest"
                  style={{ fontFamily: "Playfair Display" }}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                >
                  {word.split("").map((char, i) => (
                    <motion.span
                      key={i}
                      variants={{
                        hidden: { opacity: 0, y: 40 },
                        visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } },
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.h1>
              ) : (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.8 }}
                  className="text-white max-w-4xl"
                  style={{ fontFamily: "Poppins" }}
                >
                  <div className="flex flex-col items-center gap-6">
                    <div className="text-4xl md:text-5xl text-green-300 drop-shadow-lg">
                      {lines[index].icon}
                    </div>
                    <p className="text-xl md:text-3xl font-semibold leading-relaxed">
                      {lines[index].text}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="mt-10 md:mt-20">
        <ServiceTypeSectionC />
      </div>
    </>
  );
};

export default CHomePage;