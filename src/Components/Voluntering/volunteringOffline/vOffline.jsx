import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// components
import AddServiceFAB from "../../AddService";
import CardsVo from "./cardsVo/cardsVo";

// image
import offHero from "../../../images/vofflinemain.jpg";

const VOffline = () => {
   const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  if (user && user.activation === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100 px-4">
        <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full text-center border border-gray-100">
          <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-red-100 text-red-500 text-3xl mb-6 shadow-inner">
            ⚠️
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Account Not Activated
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Your account is currently not activated. Please wait until it gets
            approved by the admin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ===== Hero Section بدل السلايدر ===== */}
      <div className={`bg-emerald-800 dark:bg-slate-800 rounded-3xl mx-6 mt-10 flex flex-col overflow-hidden ${
  i18n.language === "ar" ? "md:flex-row-reverse" : "md:flex-row"
} items-center justify-between`}>
  {/* Text */}
  <div className="text-white p-10 md:w-1/2" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
      {t("offlineHeroTitle1")}
      <span className="text-green-300"> {t("offlineHeroTitle2")}</span>
    </h1>
    <p className="text-gray-300 mb-6">
      {t("offlineHeroDesc")}
    </p>
    <button className="bg-green-300 text-slate-800 hover:bg-green-400 px-6 py-3 rounded-lg font-semibold transition">
      {t("exploreServices")}
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

      {/* ===== ADD Services =====
      <div><AddServiceFAB /></div> */}
    </>
  );
};

export default VOffline;
