import React, { useEffect, useState } from "react";
import CardsVf from "./cardsVf/cardsVf";
import offHero from "../../../images/vonlinemain.jpg";
import { useTranslation } from "react-i18next";


const VFreelance = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // Loading user data
  // if (!user) return <p className="text-center mt-10">Loading user...</p>;

  // Check activation
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
      {/* ===== Hero Section ===== */}
      <div className="bg-[#0f2f2d] rounded-3xl mx-6 mt-10 flex flex-col md:flex-row items-center justify-between overflow-hidden">
  {/* Text */}
  <div className="text-white p-10 md:w-1/2" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
      {t("freelanceHeroTitle1")}
      <span className="text-green-400"> {t("freelanceHeroTitle2")}</span>
    </h1>

    <p className="text-gray-300 mb-6">
      {t("freelanceHeroDesc")}
    </p>

    <button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold transition">
      {t("exploreServices")}
    </button>
  </div>

  {/* Image */}
  <div className="md:w-1/2 h-[350px] md:h-[450px]">
    <img src={offHero} alt="Freelance Services" className="w-full h-full object-cover" />
  </div>
</div>
      {/* ===== Categories ===== */}
      <CardsVf />
    </>
  );
};

export default VFreelance;
