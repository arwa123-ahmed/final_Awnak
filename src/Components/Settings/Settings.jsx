import React, { useState, useEffect } from "react";
import { FaMoon, FaSun, FaLanguage, FaUser, FaPhone, FaEnvelope } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

const Settings = () => {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem("lang") || "en");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Dark Mode ──
  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    setDarkMode(saved);
    document.documentElement.classList.toggle("dark", saved);
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("darkMode", next);
    document.documentElement.classList.toggle("dark", next);
  };

  // ── Language ──
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", language);
    i18n.changeLanguage(language);
  }, [language]);

  const toggleLanguage = () => setLanguage(p => (p === "en" ? "ar" : "en"));

  // ── Fetch User ──
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://72.62.186.133/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ── Toggle Card ──
  const ToggleCard = ({ icon, label, checked, onChange, sublabel }) => (
    <div className="flex items-center justify-between bg-white dark:!bg-gray-800 rounded-2xl px-5 py-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-gray-800 dark:text-green-100 font-semibold text-sm">{label}</p>
          {sublabel && <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">{sublabel}</p>}
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
          checked ? "bg-green-500" : "bg-gray-200 dark:bg-gray-600"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:!bg-gray-900 transition-colors duration-300">
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-green-100">
            {t("setting") || "Settings"}
          </h1>
        </div>

        {/* User Card */}
        <div className="bg-white dark:!bg-gray-800 rounded-2xl p-5 mb-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          {loading ? (
            <div className="flex items-center gap-4 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              </div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {user.name?.charAt(0).toUpperCase() || <FaUser />}
                </div>
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-800" />
              </div>

              {/* Info */}
 {/* Info */}
<div className="flex-1">
  <h3 className="text-gray-900 dark:text-green-100 font-bold text-base">{user.name}</h3>

  {/* <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
    <p className="text-gray-400 dark:text-gray-500 text-xs">{user.email}</p>
  </div>

  {user.phone && (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
      <p className="text-gray-400 dark:text-gray-500 text-xs">{user.phone}</p>
    </div>
  )} */}
</div>    </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <FaUser className="text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                {t("userNotFound") || "Could not load user data"}
              </p>
            </div>
          )}
        </div>

        {/* Section Label */}
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 px-1">
          {t("preferences") || "Preferences"}
        </p>

        {/* Toggles */}
        <div className="space-y-3">
          <ToggleCard
            icon={darkMode
              ? <FaMoon className="text-green-500 text-lg" />
              : <FaSun className="text-green-500 text-lg" />
            }
            label={t("darkMode") || "Dark Mode"}
            sublabel={darkMode
              ? (t("darkModeOn") || "Dark theme active")
              : (t("darkModeOff") || "Light theme active")
            }
            checked={darkMode}
            onChange={toggleDarkMode}
          />

          <ToggleCard
            icon={<FaLanguage className="text-green-500 text-lg" />}
            label={t("Language") || "Language"}
            sublabel={language === "en" ? "English" : "العربية"}
            checked={language === "ar"}
            onChange={toggleLanguage}
          />
        </div>

      </div>
    </div>
  );
};

export default Settings;