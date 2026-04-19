import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "أحمد محمود",
    photo: "https://randomuser.me/api/portraits/men/1.jpg",
    comment: "خدمة رائعة! أنصح بها بشدة.",
    rating: 5
  },
  {
    name: "سارة علي",
    photo: "https://randomuser.me/api/portraits/women/2.jpg",
    comment: "منتجات عالية الجودة وسعر ممتاز.",
    rating: 5
  },
  {
    name: "محمد حسن",
    photo: "https://randomuser.me/api/portraits/men/3.jpg",
    comment: "شحن سريع ودعم فني ممتاز!",
    rating: 4
  },
  {
    name: "فاطمة خالد",
    photo: "https://randomuser.me/api/portraits/women/4.jpg",
    comment: "تجربة رائعة، سأتعامل معهم مرة أخرى.",
    rating: 5
  },
  {
    name: "عمر سعيد",
    photo: "https://randomuser.me/api/portraits/men/5.jpg",
    comment: "احترافية عالية في التعامل.",
    rating: 5
  }
];

const RatingsReviewsSection = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen transition-colors duration-500  
dark:from-gray-900  rounded-[50px] dark:to-green-9500 dark:via-slate-800 dark:to-slate-900">
      <motion.section
        className="py-20 px-4 md:px-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-green-600 to-teal-600 dark:from-blue-400 dark:via-green-500 dark:to-teal-400 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ['0%', '100%', '0%'],
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "linear" 
              }}
            >
              آراء عملائنا
            </motion.h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              اكتشف تجارب عملائنا السعداء
            </p>
          </motion.div>

          {/* Reviews Carousel */}
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-8"
              animate={{ 
                x: [0, -(320 * reviews.length)] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 25, 
                ease: "linear" 
              }}
            >
              {[...reviews, ...reviews].map((review, index) => (
                <motion.div
                  key={index}
                  className="min-w-[300px] p-8 rounded-3xl backdrop-blur-lg border transition-all duration-300 bg-white/80 border-slate-200 shadow-2xl shadow-slate-300/50 dark:bg-slate-800/50 dark:border-slate-700/50 dark:shadow-2xl dark:shadow-green-500/10"
                  whileHover={{ 
                    scale: 1.05,
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Header with Avatar */}
                  <div className="flex items-center mb-6">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img
                        src={review.photo}
                        alt={review.name}
                        className="w-16 h-16 rounded-full border-4 object-cover border-green-600 dark:border-green-500"
                      />
                    </motion.div>
                    <div className="mr-4">
                      <h4 className="font-bold text-lg text-slate-900 dark:text-green-100">
                        {review.name}
                      </h4>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                    "{review.comment}"
                  </p>

                  {/* Decorative Element */}
                  <motion.div
                    className="mt-6 h-1 rounded-full bg-gradient-to-r from-blue-400 via-green-600 to-teal-400 dark:from-blue-500 dark:via-green-500 dark:to-teal-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
          >
            {[
              { number: "1000+", label: t("user") },
              { number: "4.9" ,label: t("rate") },
              { number: "99.9%" ,label: t("rate") },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-8 rounded-3xl backdrop-blur-lg border bg-white/60 border-slate-200/60 dark:bg-slate-800/30 dark:border-slate-700/30"
                whileHover={{ scale: 1.05 }}
              >
                <motion.h3
                  className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-500 bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.8, delay: index * 0.1 }}
                >
                  {stat.number}
                </motion.h3>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default RatingsReviewsSection;