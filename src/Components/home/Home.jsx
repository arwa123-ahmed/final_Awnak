import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import RoleSelectionModal from "../modal/UserRole"; // عدّل الـ path
import HeroSection from "./HeroSection";
import ShippingDetailsSection from "./Details";
import RatingsReviewsSection from "./rate";
import FirstSection from "./FirstSection";
import AIChatbot from "../AiChatBot/AiChatBot";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import testbg from "../../images/testbg.png";
import serv from "../../images/sec4.jpg";
import ProtectedWrapper from "../protected/ProtectedWrapper";

const Home = () => {
  const { t } = useTranslation();
  const [showRoleModal, setShowRoleModal] = useState(false);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const user = JSON.parse(localStorage.getItem("user") || "{}");

  //   // لو logged in ومفيش role → وريه الـ modal
  //   if (token && (!user.role || user.role === "none")) {
  //     setShowRoleModal(true);
  //   }
  // }, []);
  // const [showRoleBox, setShowRoleBox] = useState(false);
  useEffect(() => {
    const showMsg = localStorage.getItem("showRoleMessage");

    if (showMsg === "true") {
      setShowRoleModal(true);
      localStorage.removeItem("showRoleMessage");
    }
  }, []);
  const handleRoleSelected = (role) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem("user", JSON.stringify({ ...user, role }));
    localStorage.removeItem("showRoleMessage"); // امسح الـ flag
    setShowRoleModal(false);
  };

  return (
    <>
      <ProtectedWrapper>
        {/* Role Modal - أعلى الصفحة */}
        {showRoleModal && (
          <RoleSelectionModal onRoleSelected={handleRoleSelected} />
        )}

        <FirstSection />

        <div className="flex flex-col gap-3">
          <HeroSection />

          <section className="w-full px-6 lg:px-12 py-24 overflow-hidden dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
              <div className="text-right mb-16" dir="rtl">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-green-100 leading-tight">
                  من <span className="text-green-600">نخــــــــدم</span>
                </h2>
              </div>

              <div className="flex flex-col lg:flex-row gap-10 items-stretch">
                <div className="flex-1">
                  <motion.div
                    className="relative rounded-3xl overflow-hidden shadow-2xl h-full"
                    initial={{ x: -100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <img
                      src={serv}
                      alt="services"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-green-900/30 to-green-600/20" />
                  </motion.div>
                </div>

                <motion.div
                  className="flex-1 bg-green-50 dark:bg-green-100 rounded-3xl p-12 flex flex-col justify-center space-y-12 shadow-xl"
                  initial={{ x: 100, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  dir="rtl"
                >
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-green-700 border-b pb-2 border-green-300 inline-block">
                      العملاء
                    </h3>
                    <p className="text-gray-700 dark:text-blue-950 leading-relaxed text-lg">
                      الباحثون عن من يقومون بخدماتهم أو مساعدتهم أو حل مشكلاتهم
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-green-700 border-b pb-2 border-green-400 inline-block">
                      المتطوعون
                    </h3>
                    <p className="text-gray-700 dark:text-blue-950 leading-relaxed text-lg">
                      الأشخاص الذين يريدون استغلال أوقاتهم بطريقة صحيحة بالتعاون
                      مع العملاء
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <ShippingDetailsSection />
          <RatingsReviewsSection />
          <AIChatbot />
        </div>
      </ProtectedWrapper>
    </>
  );
};

export default Home;
