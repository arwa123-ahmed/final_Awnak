import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

export default function ContactForm() {
    const { t } = useTranslation();

    const [darkMode, setDarkMode] = useState(false);

    // ✅ state للفورم
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    // ✅ state للـ status
    const [status, setStatus] = useState("idle"); // idle | loading | success | error

    useEffect(() => {
        const savedMode = localStorage.getItem("darkMode") === "true";
        setDarkMode(savedMode);
        document.documentElement.classList.toggle("dark", savedMode);
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem("darkMode", newMode.toString());
        document.documentElement.classList.toggle("dark", newMode);
    };

    const fadeUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, ease: "easeOut" },
    };

    const fadeRight = {
        initial: { opacity: 0, x: 40 },
        whileInView: { opacity: 1, x: 0 },
        transition: { duration: 0.8, ease: "easeOut" },
        viewport: { once: true },
    };

    // ✅ handleChange
    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // ✅ handleSubmit يبعت للـ Laravel
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            setStatus("error");
            return;
        }

        setStatus("loading");

        try {
            const response = await fetch("http://localhost:8000/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Server error");

            setStatus("success");
            setFormData({ name: "", email: "", subject: "", message: "" });
            setTimeout(() => setStatus("idle"), 4000);

        } catch (error) {
            console.error("Error:", error);
            setStatus("error");
            setTimeout(() => setStatus("idle"), 4000);
        }
    };

    return (
        <div className="min-h-screen bg-[#f0f8ed] dark:bg-gray-900 text-gray-800 dark:text-white py-16 flex justify-center items-start">
            <div className="w-[95%] max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16">

                {/* Left Side */}
                <motion.div {...fadeUp} className="flex flex-col justify-start space-y-8 mt-5">
                    <h1 className="text-5xl font-bold flex items-center gap-3">
                        {t("contact")}
                        <span className="text-green-600 dark:text-green-400">{t("us")}</span>
                    </h1>
                    <p className="text-lg leading-relaxed max-w-xl">{t("contactDesc")}</p>

                    <div className="space-y-6 text-xl font-medium max-w-xl">
                        <div>
                            <p className="flex items-center gap-4">
                                <i className="fa-solid fa-location-dot text-green-600 dark:text-green-400 text-2xl"></i>
                                {t("contactAddress")}
                            </p>
                            <hr className="my-4 border-green-200 dark:border-green-700" />
                        </div>
                        <div>
                            <p className="flex items-center gap-4">
                                <i className="fa-solid fa-phone text-green-600 dark:text-green-400 text-2xl"></i>
                                +201011111111
                            </p>
                            <hr className="my-4 border-green-200 dark:border-green-700" />
                        </div>
                        <div>
                            <p className="flex items-center gap-4">
                                <i className="fa-solid fa-envelope text-green-600 dark:text-green-400 text-2xl"></i>
                                example@gmail.com
                            </p>
                            <hr className="my-4 border-green-200 dark:border-green-700" />
                        </div>
                    </div>
                </motion.div>

                {/* Right Side – Form */}
                <motion.div
                    {...fadeRight}
                    className="w-full p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-green-100 dark:border-gray-700"
                >
                    {/* ✅ رسالة النجاح */}
                    {status === "success" && (
                        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-xl text-center font-semibold">
                            ✅ {t("contactSuccess") || "تم الإرسال بنجاح!"}
                        </div>
                    )}

                    {/* ✅ رسالة الخطأ */}
                    {status === "error" && (
                        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-xl text-center font-semibold">
                            ❌ {t("contactError") || "حدث خطأ، تأكد من البيانات وحاول مرة أخرى"}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 w-full text-lg">

                        {/* Name */}
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
                            <label className="font-semibold w-28 text-gray-800 dark:text-white">{t("contactName")}</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="flex-1 w-full border border-green-300 dark:border-gray-600 rounded-xl p-3 focus:outline-none focus:border-green-600 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
                            <label className="font-semibold w-28 text-gray-800 dark:text-white">{t("contactEmail")}</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="flex-1 border w-full border-green-300 dark:border-gray-600 rounded-xl p-3 focus:outline-none focus:border-green-600 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            />
                        </div>

                        {/* Subject */}
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
                            <label className="font-semibold w-28 text-gray-800 dark:text-white">{t("contactSubject")}</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="flex-1 border w-full border-green-300 dark:border-gray-600 rounded-xl p-3 focus:outline-none focus:border-green-600 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            />
                        </div>

                        {/* Message */}
                        <div className="flex flex-col md:flex-row items-start gap-4 w-full">
                            <label className="font-semibold w-28 mt-1 text-gray-800 dark:text-white">{t("contactMessage")}</label>
                            <textarea
                                rows="6"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                className="flex-1 border w-full border-green-300 dark:border-gray-600 rounded-xl p-3 focus:outline-none focus:border-green-600 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            ></textarea>
                        </div>

                        {/* Submit */}
                        <div className="w-full flex justify-end">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={status === "loading"}
                                className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-3 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {status === "loading" ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                        </svg>
                                        {t("contactSending") || "جاري الإرسال..."}
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-paper-plane"></i>
                                        {t("contactSubmit")}
                                    </>
                                )}
                            </motion.button>
                        </div>

                    </form>
                </motion.div>
            </div>
        </div>
    );
}