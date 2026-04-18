import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHandsHelping,
  FaClock,
  FaMapMarkerAlt,
  FaLock,
} from "react-icons/fa";

import ServiceTypeSectionC from "./ServiceTypeSectionC";
import Chome from "../../../images/chomemain.jpg";

const lines = [
  {
    text: "Start… Your Time Deserves Real Support",
    icon: <FaHandsHelping />,
  },
  {
    text: "Save Your Time for What Truly Matters",
    icon: <FaClock />,
  },
  {
    text: "Someone Can Help You Right Where You Are",
    icon: <FaMapMarkerAlt />,
  },
];

const word = "Customer";

const CHomePage = () => {
  const [index, setIndex] = useState(-1);
  const [user, setUser] = useState(null);

  // ✅ get user from localStorage
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
      <div className="relative w-full">
        <div className="relative w-full h-[600px] max-h-[600px] overflow-hidden rounded-b-[40px]">
          <img
            src={Chome}
            alt="volunteer home page"
            className="w-full h-full object-cover"
          />

          {/* overlay */}
          <div className="absolute inset-0 bg-green-900/60 backdrop-blur-[2px] flex items-center justify-center px-6 text-center">
            <AnimatePresence mode="wait">
              {index === -1 ? (
                <motion.h1
                  key="volunteer"
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
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { delay: i * 0.1 },
                        },
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
