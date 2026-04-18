import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { motion } from "framer-motion";
import "./AboutUs.css";
import ProtectedWrapper from "../protected/ProtectedWrapper";

const AboutUs = () => {
  const { t } = useTranslation();
  const isRTL = i18n.language === "ar";

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -30 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.9, ease: "easeOut" },
  };

  const slideInRight = {
    initial: { opacity: 0, x: 30 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.9, ease: "easeOut" },
  };

  const float = {
    animate: { y: [0, -10, 0] },
    transition: { duration: 6, ease: "easeInOut", repeat: Infinity },
  };

  const pulseGlow = {
    animate: {
      boxShadow: [
        "0 0 15px rgba(16,185,129,0.25)",
        "0 0 30px rgba(16,185,129,0.45)",
        "0 0 15px rgba(16,185,129,0.25)",
      ],
    },
    transition: { duration: 3, ease: "easeInOut", repeat: Infinity },
  };

  const rotateSlow = {
    animate: { rotate: 360 },
    transition: { duration: 40, ease: "linear", repeat: Infinity },
  };

  return (
    <ProtectedWrapper>
      <div className="min-h-full w-full bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 pattern-dots">
        {/* Decorative Background Elements */}
        <motion.div
          className="fixed top-20 right-10 w-72 h-72 bg-green-300 dark:bg-emerald-400 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 dark:opacity-10"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="fixed bottom-20 left-10 w-96 h-96 bg-emerald-300 dark:bg-teal-400 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 dark:opacity-10"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />

        {/* Hero Section */}
        <header className="relative w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-500 to-teal-600 dark:from-slate-800 dark:via-blue-900 dark:to-slate-800" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full">
              <motion.div
                className="absolute top-10 left-10 w-64 h-64 border-4 border-white dark:border-emerald-300 rounded-full opacity-20"
                {...rotateSlow}
              />
              <motion.div
                className="absolute bottom-10 right-10 w-80 h-80 border-4 border-white dark:border-emerald-300 rounded-full opacity-20"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, ease: "linear", repeat: Infinity }}
              />
            </div>
          </div>
          <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
            <div className="text-center">
              <motion.div className="inline-block mb-8" {...fadeInUp}>
                <div className="relative">
                  <div className="absolute inset-0 bg-white dark:bg-emerald-400 rounded-full blur-xl opacity-50" />
                  <motion.div
                    className="relative bg-white dark:bg-slate-800 rounded-full p-6"
                    {...pulseGlow}
                  />
                </div>
              </motion.div>
              <motion.h1
                id="page-title"
                className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 tracking-tight"
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: 0.2 }}
              >
                {t("about")}
              </motion.h1>
              <motion.div
                className="flex justify-center mb-8"
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: 0.2 }}
              >
                <div className="h-2 w-32 bg-white dark:bg-emerald-400 rounded-full" />
              </motion.div>
              <motion.p
                className="text-xl md:text-2xl text-green-50 dark:text-slate-200 max-w-3xl mx-auto leading-relaxed"
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: 0.2 }}
              >
                {t("aboutDesc")}
              </motion.p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full"
            >
              <path
                d="M0,64 C360,20 720,100 1440,64 L1440,120 L0,120 Z"
                fill="currentColor"
                className="text-emerald-50 dark:text-slate-900"
              />
            </svg>
          </div>
        </header>

        {/* Introduction Section */}
        <section className="relative max-w-7xl mx-auto px-6 py-20">
          <motion.div
            className="glass-effect dark:bg-slate-800/80 dark:backdrop-blur-xl rounded-3xl shadow-2xl dark:shadow-emerald-500/10 p-10 md:p-16 border-l-8 border-green-500 dark:border-emerald-400"
            {...slideInLeft}
          >
            <div className="flex items-start gap-6">
              <div className="hidden md:block flex-shrink-0">
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 dark:from-emerald-400 dark:to-teal-500 rounded-2xl flex items-center justify-center shadow-lg"
                  {...float}
                >
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </motion.div>
              </div>
              <div>
                <div className="inline-block bg-green-100 dark:bg-emerald-400/20 text-green-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  {t("story")}
                </div>
                <p
                  id="intro-text"
                  className="text-gray-700 dark:text-slate-200 text-xl md:text-2xl leading-relaxed font-light"
                >
                  {t("storyDesc")}
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Mission & Vision Grid */}
        <section className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Mission Card */}
            <motion.div
              className="glass-effect dark:bg-slate-800/80 dark:backdrop-blur-xl rounded-3xl shadow-2xl dark:shadow-emerald-500/10 p-10 h-full card-hover"
              {...slideInLeft}
              transition={{ ...slideInLeft.transition, delay: 0.2 }}
            >
              <div className="relative mb-8">
                <div
                  className={`absolute -top-4 ${isRTL ? "-right-4" : "-left-4"} w-24 h-24 bg-green-200 dark:bg-emerald-400/20 rounded-full opacity-30`}
                />
                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-emerald-400 dark:to-teal-500 rounded-2xl shadow-lg">
                  <svg
                    className="w-11 h-11 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <h2
                id="mission-title"
                className="text-4xl font-bold gradient-text dark:text-emerald-300 mb-6"
              >
                {t("mission")}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-transparent dark:from-emerald-400 rounded-full mb-6" />
              <p
                id="mission-text"
                className="text-gray-700 dark:text-slate-200 text-lg leading-relaxed"
              >
                {t("missionDesc")}
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              className="glass-effect dark:bg-slate-800/80 dark:backdrop-blur-xl rounded-3xl shadow-2xl dark:shadow-emerald-500/10 p-10 h-full card-hover"
              {...slideInRight}
              transition={{ ...slideInRight.transition, delay: 0.2 }}
            >
              <div className="relative mb-8">
                <div
                  className={`absolute -top-4 ${isRTL ? "-right-4" : "-left-4"} w-24 h-24 bg-emerald-200 dark:bg-teal-400/20 rounded-full opacity-30`}
                />
                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 rounded-2xl shadow-lg">
                  <svg
                    className="w-11 h-11 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
              </div>
              <h2
                id="vision-title"
                className="text-4xl font-bold gradient-text dark:text-emerald-300 mb-6"
              >
                {t("vision")}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-transparent dark:from-teal-400 rounded-full mb-6" />
              <p
                id="vision-text"
                className="text-gray-700 dark:text-slate-200 text-lg leading-relaxed"
              >
                {t("visionDesc")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="relative max-w-7xl mx-auto px-6 py-20">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <div className="inline-block bg-green-100 dark:bg-emerald-400/20 text-green-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              {t("meetTeam")}
            </div>
            <h2
              id="team-title"
              className="text-5xl md:text-6xl font-bold gradient-text dark:text-white mb-6"
            >
              {t("team")}
            </h2>
            <div className="flex justify-center">
              <div className="h-2 w-32 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-emerald-400 dark:to-teal-400 rounded-full" />
            </div>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { initial: "A", member: "member1" },
              { initial: "A", member: "member2" },
              { initial: "G", member: "member3" },
              { initial: "AM", member: "member4" },
              { initial: "M", member: "member5" },
              { initial: "M", member: "member6" },
              { initial: "Y", member: "member7" },
              { initial: "H", member: "member8" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="glass-effect dark:bg-slate-800/80 dark:backdrop-blur-xl rounded-3xl p-6 shadow-xl dark:shadow-emerald-500/10 card-hover text-center"
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: 0.2 }}
              >
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 dark:from-emerald-400 dark:to-teal-500 rounded-full blur-lg opacity-50" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 dark:from-emerald-400 dark:to-teal-500 rounded-full mx-auto flex items-center justify-center shadow-lg">
                    <span className="text-white text-3xl font-bold">
                      {t(item.initial)}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 dark:bg-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {t(item.member)}
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-300">
                  {t("teamMembers")}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </ProtectedWrapper>
  );
};

export default AboutUs;
