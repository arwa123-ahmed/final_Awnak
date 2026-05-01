import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Joyride, STATUS } from "react-joyride";

// components
import AddServiceFAB from "../../AddService";
import CardsVo from "./cardsVo/cardsVo";

// image & audio
import offHero from "../../../images/vofflinemain.jpg";
import volAudio from "../../../audio/off.mp3";

const VOffline = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);

  const [runTour, setRunTour] = useState(false);
  const audioRef = useRef(new Audio(volAudio));

  const steps = [
    {
      target: "#hero-section",
      disableBeacon: true,
      content: (
        <div
          className={`text-right font-almarai ${i18n.language === "ar" ? "rtl" : "ltr"}`}
        >
          <h3 className="font-bold text-green-600 mb-2">
            {t("offlineHeroTitle1")}
          </h3>
          <p className="text-sm">
            {i18n.language === "ar"
              ? "أهلاً بك في قسم الخدمات الميدانية، هنا تجد الخبراء المستعدين لتقديم المساعدة على أرض الواقع."
              : "Welcome to the offline services section, where you find experts ready to provide on-ground assistance."}
          </p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: "#categories-grid",
      content: (
        <div
          className={`text-right font-almarai ${i18n.language === "ar" ? "rtl" : "ltr"}`}
        >
          <h3 className="font-bold text-blue-600 mb-2">{t("category")}</h3>
          <p className="text-sm">
            {i18n.language === "ar"
              ? "الخدمات متقسمة لفئات واضحة: استشارات طبية، تعليم، توصيل، وخدمات منزلية. تقدر تختار الفئة اللي محتاجها أو حابب تتطوع فيها."
              : "Services are divided into clear categories: medical, education, delivery, and home services. You can choose the category you need or want to volunteer in."}
          </p>
        </div>
      ),
      placement: "top",
    },
  ];

  const handleStartGuide = () => {
    setRunTour(true);
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch((err) => console.log("Audio failed:", err));
  };

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // إيقاف الصوت عند مغادرة الصفحة
  useEffect(() => {
    return () => {
      audioRef.current.pause();
    };
  }, []);

  if (!user)
    return (
      <p className="text-center mt-10 font-black uppercase animate-pulse">
        Loading Data...
      </p>
    );

  if (user.activation === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100 px-4">
        <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full text-center border border-gray-100">
          <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-red-100 text-red-500 text-3xl mb-6 shadow-inner">
            ⚠️
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3 font-almarai">
            {i18n.language === "ar"
              ? "الحساب غير مفعل"
              : "Account Not Activated"}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6 font-almarai">
            {i18n.language === "ar"
              ? "يرجى الانتظار حتى يتم تفعيل حسابك من قبل الإدارة."
              : "Your account is currently not activated. Please wait until it gets approved by the admin."}
          </p>
        </div>
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
        callback={handleJoyrideCallback}
        locale={{
          back: t("back") || "السابق",
          close: t("close") || "إنهاء",
          last: t("last") || "فهمت",
          next: t("next") || "التالي",
          skip: t("skip") || "تخطي",
        }}
        styles={{ options: { primaryColor: "#10b981", zIndex: 10000 } }}
      />

      {/* ===== Hero Section ===== */}
      <div
        id="hero-section"
        className={`bg-emerald-800 dark:bg-slate-800 rounded-[2.5rem] mx-6 mt-10 flex flex-col ${
          i18n.language === "ar" ? "md:flex-row-reverse" : "md:flex-row"
        } items-center justify-between overflow-hidden shadow-xl border border-white/10`}
      >
        {/* Text */}
        <div
          className="text-white p-10 md:w-1/2"
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
        >
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6 uppercase tracking-tighter">
            {t("offlineHeroTitle1")}
            <span className="text-green-300 italic">
              {" "}
              {t("offlineHeroTitle2")}
            </span>
          </h1>
          <p className="text-emerald-100/70 mb-6 text-sm font-medium leading-relaxed">
            {t("offlineHeroDesc")}
          </p>
          <div className="flex gap-4">
            <button className="bg-green-300 text-slate-800 hover:bg-green-400 px-6 py-3 rounded-xl font-bold transition active:scale-95">
              {t("exploreServices")}
            </button>
            <button
              onClick={handleStartGuide}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl font-bold transition active:scale-95"
            >
              {i18n.language === "ar" ? "دليل سريع" : "Quick Guide"}
            </button>
          </div>
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

      {/* ===== Categories Grid ===== */}
      <div id="categories-grid" className="mt-12">
        <CardsVo />
      </div>

      <button
        onClick={handleStartGuide}
        className={`fixed bottom-8 ${i18n.language === "ar" ? "right-8" : "left-8"} z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-2 group transition-all duration-300 hover:scale-110 active:scale-95 border border-emerald-500/30`}
      >
        <span className="text-xl">💡</span>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap text-xs uppercase tracking-widest">
          {i18n.language === "ar" ? "دليل القسم" : "Section Guide"}
        </span>
      </button>

      {/* Add Service FAB */}
      <AddServiceFAB />
    </>
  );
};

export default VOffline;
