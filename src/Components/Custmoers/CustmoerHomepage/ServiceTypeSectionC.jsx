import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import offlineImg from "../../../images/vofflinemain.jpg";
import onlineImg from "../../../images/vonlinemain.jpg";

const ServiceTypeSectionC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const cards = [
    {
      title: t("traditional"),
      desc: t("traditionalDesc"),
      image: offlineImg,
      path: "/customers-offline",
    },
    {
      title: t("freelance"),
      desc: t("freelanceDesc"),
      image: onlineImg,
      path: "/customers-freelance",
    },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

        {cards.map((card, i) => (
          <motion.div
            key={i}
            onClick={() => navigate(card.path)}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
            viewport={{ once: true }}
            className="group cursor-pointer"
          >
            <div className="relative h-96 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">

              {/* الصورة */}
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay الأخضر */}
              <div className="absolute inset-0 bg-green-900/60 backdrop-blur-[2px] 
                              opacity-0 group-hover:opacity-100 
                              transition-all duration-500 
                              flex items-center justify-center px-6 text-center">

                <div className="text-white transform translate-y-6 group-hover:translate-y-0 transition duration-500">
                  <h3 className="text-2xl font-bold mb-3">
                    {card.title}
                  </h3>
                  <p className="text-lg leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>

              {/* الجزء الأبيض */}
              <div className="absolute bottom-0 w-full bg-white p-6 text-center
                              transition-all duration-500
                              group-hover:opacity-0 group-hover:translate-y-full">

                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-500">
                  {card.desc}
                </p>
              </div>

            </div>
          </motion.div>
        ))}

      </div>
    </section>
  );
};

export default ServiceTypeSectionC;