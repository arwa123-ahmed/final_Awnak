import React from "react";
import { motion } from "framer-motion";
import {
    FaLaptopCode,
    FaBookOpen,
    FaTruck,
    FaTools,
} from "react-icons/fa";
import { t } from "i18next";

const categories = [
    {
        title: t("Freelance"),
        desc: t("FreelanceDesc"),
        icon: FaLaptopCode
    },
    {
        title: t("Education"),
        desc: t("EducationDesc"),
        icon: FaBookOpen
    },
    {
        title: t("Shipping"),
        desc: t("ShippingDesc"),
        icon: FaTruck
    },
    {
        title: t("Trade"),
        desc: t("TradeDesc"),
        icon: FaTools
    },
];

const CategoriesSection = () => (
    <motion.section
        className="py-16 px-4 md:px-16  dark:bg-slate-900 transition-colors duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
    >
        <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-10">
                {t("HCategoriesTitle")}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((cat, index) => (
                    <motion.div
                        key={index}
                        className=" dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="text-green-600 dark:text-green-400 mb-4">
                            <cat.icon className="w-12 h-12" />
                        </div>

                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {cat.title}
                        </h3>

                        <p className="text-slate-600 dark:text-slate-300 text-sm">
                            {cat.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    </motion.section>
);

export default CategoriesSection;
