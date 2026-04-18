import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://72.62.186.133/api";

export default function BalancePopup({ show, onClose }) {
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // ── جيب الرصيد من الـ API كل ما الـ popup يتفتح ──
  useEffect(() => {
    if (!show) return;
    fetchBalance();
  }, [show]);

  const fetchBalance = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/balance`, { headers });
      // Backend المفروض يرجع:
      // {
      //   basicCharge:        { minutes: 120, currency: "min" },
      //   VolunteeringBalance: { minutes: 45,  currency: "min" },
      //   total:              { minutes: 165, currency: "min" }
      // }
      setBalanceData(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load balance. Please try again.");
    }
    setLoading(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 relative">

        {/* Close */}
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-3xl font-bold leading-none"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-xl font-bold text-green-600 mb-5 text-center">
          💰 Balance Details
        </h2>

        {/* Loading */}
        {loading && (
          <div className="text-center py-8 text-gray-400 animate-pulse">
            Loading...
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
              Retry
            </button>
          </div>
        )}

        {/* Data */}
        {!loading && !error && balanceData && (
          <>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-green-300 text-white">
                    <th className="py-2.5 px-4 text-sm font-semibold">Balance Type</th>
                    <th className="py-2.5 px-4 text-sm font-semibold text-right">Minutes</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Basic Balance - بتشحنه وبتصرف منه */}
                  <tr className="hover:bg-green-50 border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Basic Balance</p>
                          <p className="text-xs text-gray-400">Charged via top-up • spent on services</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-bold text-blue-600">
                        {balanceData.basicCharge?.minutes ?? 0}
                        <span className="ml-1 text-xs font-normal text-gray-400">min</span>
                      </span>
                    </td>
                  </tr>

                  {/* Volunteering Balance - بتكسبه من التطوع */}
                  <tr className="hover:bg-green-50 border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Volunteering Balance</p>
                          <p className="text-xs text-gray-400">Earned by completing services</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-bold text-green-600">
                        {balanceData.VolunteeringBalance?.minutes ?? 0}
                        <span className="ml-1 text-xs font-normal text-gray-400">min</span>
                      </span>
                    </td>
                  </tr>

                  {/* Total */}
                  <tr className="bg-green-50">
                    <td className="py-3 px-4">
                      <p className="text-sm font-bold text-gray-800">Total</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-base font-bold text-gray-800">
                        {balanceData.total?.minutes ?? 0}
                        <span className="ml-1 text-xs font-normal text-gray-400">min</span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          
          </>
        )}

        {/* No data */}
        {!loading && !error && !balanceData && (
          <p className="text-center text-gray-400 py-8">No balance data available.</p>
        )}
      </div>
    </div>
  );
}