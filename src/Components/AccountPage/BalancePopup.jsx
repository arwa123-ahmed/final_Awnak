import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const API = "http://72.62.186.133/api";

export default function BalancePopup({ show, onClose }) {
  const { t, i18n } = useTranslation();
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!show) return;
    fetchBalance();
  }, [show]);

  const fetchBalance = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/balance`, { headers });
      setBalanceData(res.data);
    } catch (err) {
      console.error(err);
      setError(t("failedToLoadBalance"));
    }
    setLoading(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:!bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 relative"
     dir={i18n.language === "ar" ? "rtl" : "ltr"}>

        {/* Close */}
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-3xl font-bold leading-none"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-xl font-bold text-green-600 mb-5 text-center">
          💰 {t("balanceDetails")}
        </h2>

        {/* Loading */}
        {loading && (
          <div className="text-center py-8 text-gray-400 animate-pulse">
            {t("loading")}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-6">
            <p className="text-red-500 text-sm mb-3">{error}</p>
            <button
              onClick={fetchBalance}
              className="px-4 py-2 rounded-xl bg-green-300 hover:bg-green-400 text-white text-sm font-semibold"
            >
              {t("retry")}
            </button>
          </div>
        )}

        {/* Data */}
        {!loading && !error && balanceData && (
          <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
            <table className={`w-full border-collapse ${i18n.language === "ar" ? "text-right" : "text-left"}`}>
              <thead>
                <tr className="bg-green-300 dark:bg-green-700 text-white">
                  <th className="py-2.5 px-4 text-sm font-semibold">{t("balanceType")}</th>
                  <th className={`py-2.5 px-4 text-sm font-semibold ${i18n.language === "ar" ? "text-left" : "text-right"}`}>{t("minutes")}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-green-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{t("basicBalance")}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{t("basicBalanceDesc")}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`py-3 px-4 ${i18n.language === "ar" ? "text-left" : "text-right"}`}>
                    <span className="text-sm font-bold text-blue-600">
                      {balanceData.basicCharge?.minutes ?? 0}
                      <span className="ml-1 text-xs font-normal text-gray-400">min</span>
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-green-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{t("volunteeringBalance")}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{t("volunteeringBalanceDesc")}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`py-3 px-4 ${i18n.language === "ar" ? "text-left" : "text-right"}`}>
                    <span className="text-sm font-bold text-green-600">
                      {balanceData.VolunteeringBalance?.minutes ?? 0}
                      <span className="ml-1 text-xs font-normal text-gray-400">min</span>
                    </span>
                  </td>
                </tr>

                <tr className="bg-green-50 dark:bg-gray-700">
                  <td className={`py-3 px-4 `}>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">{t("total")}</p>
                  </td>
                  <td className={`py-3 px-4 ${i18n.language === "ar" ? "text-left" : "text-right"}`}>
                    <span className="text-base font-bold text-gray-800 dark:text-white">
                      {balanceData.total?.minutes ?? 0}
                      <span className="ml-1 text-xs font-normal text-gray-400">min</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* No data */}
        {!loading && !error && !balanceData && (
          <p className="text-center text-gray-400 py-8">{t("noBalanceData")}</p>
        )}
      </div>
    </div>
  );
}