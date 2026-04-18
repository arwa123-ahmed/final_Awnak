import React from "react";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { motion } from "framer-motion";

const FreeTrialSection = () => {
    const { t } = useTranslation();
    return (
        <>
    <motion.section
        className="py-16 bordeer rounded-xl shadow-md px-4 md:px-16 bg-gradient-to-r from-green-300 to-green-400 text-darkBackground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
    >
        <div className="max-w-7xl mx-auto text-center">
            <motion.h2
                className="text-3xl md:text-5xl font-bold mb-4 "
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                {t("freeTrialTitle")}
            </motion.h2>
            <p className="text-lg md:text-xl mb-8 ">
               {t("freeTrialDesc")}
            </p>

            {/* Timer Visual */}
            <div className="flex justify-center">
                <div className="relative w-32 h-32 ">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="5"
                            fill="none"
                        />
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            stroke="white"
                            strokeWidth="5"
                            fill="none"
                            strokeDasharray="283"
                            strokeDashoffset="283"
                            animate={{ strokeDashoffset: 0 }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold ">
                        {t("min120")}
                    </div>
                </div>
            </div>

            <button className="mt-8 bg-white text-green-600 px-8 py-2 rounded-2xl font-semibold hover:bg-slate-100 hover:scale-105 transition-all duration-300 shadow-lg">
                {t("claimTrialBtn")}
            </button>
        </div>
    </motion.section>
    </>
);}

export default FreeTrialSection;
