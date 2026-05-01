import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

// صور fallback لو مفيش صورة من الـ API
import delivary from "../../../../images/delivery.jpg";
import education from "../../../../images/education.jpg";
import medcine from "../../../../images/medcine.jpg";
import homeServices from "../../../../images/homeservices.jpg";
import others from "../../../../images/others.jpg";

const fallbackImages = {
  Delivery: delivary,
  Education: education,
  Medicine: medcine,
  "Home Services": homeServices,
  Others: others,
};

const CardsVo = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // تم توحيد الرابط ليكون متوافقاً مع الـ IP المعتمد في مشروعك
    axios
      .get("http://72.62.186.133/api/categories/filter?mode=offline")
      .then((res) => {
        setCategories(res.data.categories);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-6 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg animate-pulse">
            {isArabic ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-6 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </section>
    );
  }

  return (
    // تم إضافة id="categories-grid" ليرتبط بالـ Guide في الصفحة الأب (VOffline)
    <section
      id="categories-grid"
      className="py-20 px-6 dark:bg-gray-900 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-16"
        >
          {isArabic ? (
            <>
              اختر{" "}
              <span className="text-green-600 dark:text-green-300">الفئة</span>
            </>
          ) : (
            <>
              Choose{" "}
              <span className="text-green-600 dark:text-green-300">
                Category
              </span>
            </>
          )}
        </motion.h2>

        {/* Grid Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((card, i) => {
            const title = isArabic ? card.ar_name : card.en_name;
            const description = isArabic
              ? card.ar_description
              : card.en_description;
            const image = fallbackImages[card.en_name] || others;

            return (
              <motion.div
                key={card.id}
                onClick={() => navigate(`/volunteer/category/${card.id}`)}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative h-64 md:h-72 lg:h-64 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300"
              >
                {/* الصورة مع تأثير Zoom عند الـ Hover */}
                <img
                  src={image}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Hover Overlay (يظهر عند تمرير الماوس) */}
                <div className="absolute inset-0 bg-green-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center px-6 text-center">
                  <div className="text-white transform translate-y-6 group-hover:translate-y-0 transition duration-500">
                    <h3 className="text-2xl font-bold mb-2">{title}</h3>
                    <p className="text-sm leading-relaxed opacity-90">
                      {description}
                    </p>
                  </div>
                </div>

                {/* الجزء السفلي (يختفي عند الـ Hover) */}
                <div className="absolute bottom-0 w-full bg-white dark:!bg-slate-800 p-4 text-center transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-full border-t dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                    {title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-[12px] line-clamp-1">
                    {description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CardsVo;
