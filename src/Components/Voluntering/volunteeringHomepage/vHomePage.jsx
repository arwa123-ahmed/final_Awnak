import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaSeedling, FaHandsHelping } from "react-icons/fa";
import ServiceTypeSection from "./ServiceTypeSection";
import vhome from "../../../images/vhome3.jpg";

const lines = [
  {
    text: "Volunteering is not just time given… it’s a value that lasts forever.",
    icon: <FaHeart />,
  },
  {
    text: "Every hour you give never goes to waste — it plants a seed in someone’s life, and one day, it may return to you when you need a helping hand.",
    icon: <FaSeedling />,
  },
  {
    text: "Be the reason behind someone’s smile, comfort, or fresh start. Begin here — with your time — for it’s the most precious and beautiful gift you can offer. ⏳💖",
    icon: <FaHandsHelping />,
  },
];

const word = "Volunteer";

const VHomePage = () => {
  const [index, setIndex] = useState(-1);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev >= lines.length - 1 ? -1 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // if (!user) return <p className="text-center mt-10">Loading user...</p>;

  if (user && user.activation === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full text-center border border-gray-100"
        >
          <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-red-100 text-red-500 text-3xl mb-6 shadow-inner">
            <FaHandsHelping />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Account Not Activated
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Your account is currently not activated. Please wait until it gets
            approved by the admin.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full">
        <div className="relative w-full h-[600px] max-h-[600px] overflow-hidden rounded-b-[40px]">
          <img
            src={vhome}
            alt="volunteer home page"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-green-900/60 dark:bg-green-900/60 backdrop-blur-[2px] flex items-center justify-center px-6 text-center">
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
        <ServiceTypeSection />
      </div>
    </>
  );
};

export default VHomePage;
