import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { useNavigate } from "react-router-dom";

export default function ServiceCardCf() {
  const { t } = useTranslation();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "offline",
    time: "",
    price: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const sample = [
      {
        id: "1",
        title: "Pharmacy Medicine Delivery",
        description: "A person needs medicine from a nearby pharmacy!",
        volunteers: "1/1",
        eta: "30",
        helper: {
          id: "101",
          name: "Ahmed Sami",
          rating: 4.8,
          avatar: null,
        },
      },
    ];

    setTimeout(() => {
      setCards(sample);
      setLoading(false);
    }, 300);
  }

  const handleAdd = () => {
    if (!formData.title || !formData.description)
      return alert("Please fill all fields");

    const newCard = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      volunteers: "0/1",
      eta: formData.time || "N/A",
      helper: {
        id: Date.now().toString(), // temporary ID until API
        name: "New Service",
        rating: 5.0,
        avatar: null,
      },
    };

    setCards((prev) => [...prev, newCard]);
    setFormData({
      title: "",
      description: "",
      type: "offline",
      time: "",
      price: "",
    });
    setShowAlert(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-start p-6 relative">
      <div className="max-w-6xl w-full">
        <header className="flex items-end justify-between mb-6">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
            {t("availableorders")}
          </h2>
        </header>

        <div className="pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="py-10 text-gray-400 dark:text-gray-500">Loading...</div>
            ) : (
              cards.map((card) => <CardComponent key={card.id} card={card} />)
            )}
          </div>
        </div>
      </div>

      {/* Add Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAlert(true)}
        className="fixed bottom-6 right-6 flex items-center justify-center w-16 h-10 
        bg-green-500 dark:bg-green-600 text-white text-3xl font-light rounded-full 
        shadow-lg hover:bg-green-600 dark:hover:bg-green-700 hover:shadow-xl transition-all duration-300"
      >
        +
      </motion.button>

      {/* Popup */}
         <AnimatePresence>
                    {showAlert && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50"
                      >
                        <div className=" dark:bg-gray-800 w-full max-w-md p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                            {t("addNewService")}
                          </h2>
                          <div className="space-y-3">
                            <input
                              className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded  dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                              placeholder={t("title")}
                              value={formData.title}
                              onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                              }
                            />
                            <textarea
                              className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded  dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                              placeholder={t("description")}
                              value={formData.description}
                              onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                              }
                            />
                            <div className="flex gap-4 items-center">
                              <label className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                <input
                                  type="radio"
                                  name="type"
                                  checked={formData.type === "online"}
                                  onChange={() =>
                                    setFormData({ ...formData, type: "online" })
                                  }
                                />
                                {t("freelance")}
                              </label>
                              <label className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                <input
                                  type="radio"
                                  name="type"
                                  checked={formData.type === "offline"}
                                  onChange={() =>
                                    setFormData({ ...formData, type: "offline" })
                                  }
                                />
                                {t("traditional")}
                              </label>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                className="border border-gray-300 dark:border-gray-600 p-2 rounded  dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                                placeholder={t("time")}
                                value={formData.time}
                                onChange={(e) =>
                                  setFormData({ ...formData, time: e.target.value })
                                }
                              />
                              <input
                                className="border border-gray-300 dark:border-gray-600 p-2 rounded  dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                                placeholder={t("price")}
                                value={formData.price}
                                onChange={(e) =>
                                  setFormData({ ...formData, price: e.target.value })
                                }
                              />
                            </div>
                            <div className="flex justify-between mt-4">
                              <button
                                onClick={() => setShowAlert(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                {t("cancel")}
                              </button>
                              <button
                                onClick={handleAdd}
                                className="px-4 py-2 rounded-lg bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-800"
                              >
                                {t("add")}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
    </div>
  );
}

/* ------------------ CARD ------------------ */

function CardComponent({ card }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const openProfile = () => {
    navigate(`/profile/${card.helper.id}`, {
      state: {
        name: card.helper.name,
        rating: card.helper.rating,
        avatar: card.helper.avatar,
        timesVolunteered: 5,
      },
    });
  };

  return (
    <div className="w-full  dark:bg-gray-800 rounded-2xl shadow-md p-5 border border-gray-100 dark:border-gray-700 flex flex-col">
      <div>
        <div className="text-2xl font-bold text-gray-500 dark:text-gray-400">{card.title}</div>
      </div>

      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{card.description}</p>
     <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div className=" p-3 rounded-lg text-center">
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {card.volunteers}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{t("customer")}</div>
        </div>
        <div className=" p-3 rounded-lg text-center">
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">{card.eta}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {t("min")}
          </div>
        </div>
      </div>
      <div
        className="flex items-center gap-3 mt-6 cursor-pointer"
        onClick={openProfile}
      >
        <Avatar name={card.helper.name} avatar={card.helper.avatar} />
        <div>
          <div className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400">
            {card.helper.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {renderStars(card.helper.rating)}
          </div>
        </div>
      </div>

      <button className="mt-6 px-5 py-2 rounded-full bg-green-600 dark:bg-green-700 text-white font-medium shadow hover:bg-green-700 dark:hover:bg-green-800">
        {t("requestS")}
      </button>
    </div>
  );
}

/* ------------------ SMALL COMPONENTS ------------------ */

function Avatar({ name, avatar }) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
      />
    );
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-700 dark:text-gray-300">
      {initials}
    </div>
  );
}

function renderStars(rating) {
  const n = Math.round(rating);
  return "★".repeat(n) + "☆".repeat(5 - n);
}
