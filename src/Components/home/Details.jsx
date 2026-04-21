import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaUserCheck, FaBolt, FaSmileBeam } from "react-icons/fa";

const steps = [
  { title: "step1Title", desc: "step1Desc", icon: FaUserCheck },
  { title: "step2Title", desc: "step2Desc", icon: FaBolt },
  { title: "step3Title", desc: "step3Desc", icon: FaSmileBeam },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

const ShippingDetailsSection = () => {
  const { t } = useTranslation();

  return (
    <motion.section
      className="py-16 px-4 md:px-16 dark:bg-transparent transition-colors duration-300"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Title */}
      <motion.div
        variants={itemVariants}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <h2 className="leading-tight">
          <span className="block text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-green-100">
            {t("howItWorksTitle1")}
          </span>

          <span className="block text-4xl md:text-6xl font-extrabold text-green-600 dark:text-green-400">
            {t("howItWorksTitle2")}
          </span>
        </h2>
      </motion.div>

      {/* Steps Layout */}
      <div className="relative mt-16">
        {/* Animated Line */}
        <motion.div
          className="hidden md:block absolute top-10 left-0 h-1 bg-green-200 dark:bg-slate-700"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 1 }}
        />

        <motion.div
          className="grid md:grid-cols-3 gap-12 relative"
          variants={containerVariants}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="text-center relative"
              variants={itemVariants}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.08 }}
            >
              {/* Number Circle */}
              <motion.div
                className="relative z-10 flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-white dark:!bg-green-100 shadow-lg border-4 border-green-500 dark:border-green-600"
                initial={{ rotate: -180, opacity: 0 }}
                whileInView={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-2xl font-bold text-green-600 dark:text-green-700">
                  {index + 1}
                </span>
              </motion.div>

              {/* Card */}
              <div className="mt-6 p-6 rounded-2xl shadow-lg dark:bg-slate-800 transition-all duration-300 hover:shadow-2xl">
                <div className="text-green-600 dark:text-green-400 mb-4">
                  <step.icon className="w-10 h-10 mx-auto" />
                </div>

                <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-green-100">
                  {t(step.title)}
                </h3>

                <p className="text-slate-600 dark:text-green-100">{t(step.desc)}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ShippingDetailsSection;
