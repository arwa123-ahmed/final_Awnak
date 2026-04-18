import React, { useState, useEffect } from "react";

export default function Language() {
  const [language, setLanguage] = useState(localStorage.getItem("lang") || "en");

  const changeLang = (lang) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
    window.location.reload(); // لإعادة تحميل الموقع بالاتجاه الجديد
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold text-green-600 mb-6 text-center">
        Select Language
      </h1>

      <div className="space-y-3 max-w-md mx-auto">
        <button
          onClick={() => changeLang("en")}
          className={`w-full p-4 rounded-xl border ${
            language === "en" ? "border-green-500 bg-green-50" : "border-gray-300"
          }`}
        >
          English
        </button>

        <button
          onClick={() => changeLang("ar")}
          className={`w-full p-4 rounded-xl border ${
            language === "ar" ? "border-green-500 bg-green-50" : "border-gray-300"
          }`}
        >
          العربية
        </button>
      </div>
    </div>
  );
}
