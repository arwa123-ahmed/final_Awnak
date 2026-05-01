import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
// import { motion, AnimatePresence } from "framer-presence";
import {
  FaHeart,
  FaSeedling,
  FaHandsHelping,
  FaInfoCircle,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import ServiceTypeSection from "./ServiceTypeSection";
import vhome from "../../../images/vhome3.jpg";
import { Joyride, STATUS } from "react-joyride"; // استيراد الجايد
import volAudio from "../../../audio/vol.mp3"; // استيراد الصوت

const VHomePage = () => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(-1);
  const [user, setUser] = useState(null);

  // ─── إعدادات الـ Guide المطور والصوت ───
  const [runTour, setRunTour] = useState(false);
  const audioRef = useRef(new Audio(volAudio));

  const steps = [
    {
      target: "#service-types",
      disableBeacon: true,
      content: (
        <div className="text-right font-almarai">
          <h3 className="font-bold text-green-600 mb-1 text-lg">
            اختيار الخدمة
          </h3>
          <p className="text-sm leading-relaxed">
            من هنا بتقدر تختار نوع الخدمة اللى انت عايز تتطوع ليها او تطلبها.
          </p>
        </div>
      ),
      placement: "top",
    },
    {
      target: "#offline-section",
      content: (
        <div className="text-right font-almarai">
          <h3 className="font-bold text-blue-600 mb-1 text-lg">
            قِسم الأوفلاين
          </h3>
          <p className="text-sm leading-relaxed">
            وهي الخدمات اللى بتطبق على ارض الواقع وتحتاج تواجدك الفعلي.
          </p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: "#online-section",
      content: (
        <div className="text-right font-almarai">
          <h3 className="font-bold text-purple-600 mb-1 text-lg">
            قِسم الأونلاين
          </h3>
          <p className="text-sm leading-relaxed">
            أو خدمات الفري لانسينج اللى ممكن تنفذها من البيت عبر الإنترنت.
          </p>
        </div>
      ),
      placement: "bottom",
    },
  ];

  const lines = [
    { text: t("vLine1"), icon: <FaHeart /> },
    { text: t("vLine2"), icon: <FaSeedling /> },
    { text: t("vLine3"), icon: <FaHandsHelping /> },
  ];

  const word = t("volunteer");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev >= lines.length - 1 ? -1 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [lines.length]);

  const handleStartGuide = () => {
    const element = document.getElementById("service-types");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    setTimeout(() => {
      setRunTour(true);
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .catch((err) => console.log("Audio play failed:", err));
    }, 500);
  };

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

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
      <Joyride
        steps={steps}
        run={runTour}
        continuous={true}
        showSkipButton={true}
        showProgress={true}
        scrollToFirstStep={true}
        scrollOffset={100}
        callback={handleJoyrideCallback}
        locale={{
          back: "السابق",
          close: "إنهاء",
          last: "فهمت",
          next: "التالي",
          skip: "تخطي",
        }}
        styles={{
          options: {
            primaryColor: "#16a34a",
            zIndex: 10000,
          },
          tooltipContainer: {
            textAlign: "right",
            direction: "rtl",
            fontFamily: "Almarai, sans-serif",
          },
        }}
      />

      <div className="relative w-full">
        <div className="relative w-full h-[600px] max-h-[600px] overflow-hidden rounded-b-[40px]">
          <img
            src={vhome}
            alt="volunteer home page"
            className="w-full h-full object-cover"
          />
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

      <div id="service-types" className="mt-10 md:mt-20 scroll-mt-24">
        <ServiceTypeSection />
      </div>

      {/* زر المساعد الإرشادي العائم */}
      <button
        onClick={handleStartGuide}
        className="fixed bottom-8 left-8 z-40 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 group transition-all duration-300 hover:scale-110 active:scale-95 shadow-green-100"
      >
        <FaInfoCircle className="text-2xl" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap">
          دليل القسم
        </span>
      </button>
    </>
  );
};

export default VHomePage;
