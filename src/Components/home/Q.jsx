import React from "react";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { motion } from "framer-motion";

const MotivationalQuestionSection = () => {
  const { t } = useTranslation();
  return (<>
   <motion.section 
    className="py-16 px-4 border rounded-lg shadow-md md:px-16 bg-gradient-to-r from-green-300 to-green-400 text-darkBackground text-center"
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    transition={{ duration: 0.8 }}
  >
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl md:text-5xl font-bold mb-8">
        {t("Question1")}
      </h2>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button 
          className="bg-white text-green-600 px-8 py-2 rounded-2xl font-semibold hover:scale-105 hover:shadow-2xl transition-all duration-300"
          whileHover={{ boxShadow: "0 0 30px rgba(255,255,255,0.5)" }}
        >
          {t("volunteer")}
        </motion.button>
        <motion.button 
          className="bg-white text-green-600 px-8 py-2 rounded-2xl font-semibold hover:scale-105 hover:shadow-2xl transition-all duration-300"
          whileHover={{ boxShadow: "0 0 30px rgba(255,255,255,0.5)" }}
        >
          {t("requestS")}
        </motion.button>
      </div>
    </div>
  </motion.section>
  </>);
}


export default MotivationalQuestionSection;
