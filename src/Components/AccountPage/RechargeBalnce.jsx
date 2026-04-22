import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API = "http://72.62.186.133/api";

export default function BalanceSection({ balanceData, onBalanceUpdate }) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const amounts = [199, 499, 999];
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) setUploadedFile(file);
    };

    const handleSubmit = async () => {
        if (!selectedAmount || !uploadedFile) return;
        setLoading(true);
        setError("");
        try {
            const formData = new FormData();
            formData.append("amount", selectedAmount);
            formData.append("image", uploadedFile);
            await axios.post(`${API}/recharge-balance`, formData, {
                headers: { ...headers, "Content-Type": "multipart/form-data" },
            });
            setIsSubmitted(true);
            setTimeout(() => { navigate("/"); }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || t("somethingWentWrong"));
        }
        setLoading(false);
    };

    return (
        <div className="bg-white dark:!bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-auto my-6 md:max-w-2xl md:p-12 lg:max-w-3xl"
             dir={i18n.language === "ar" ? "rtl" : "ltr"}>
            
            <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">
                {t("rechargeBalance")}
            </h2>

            {!isSubmitted ? (
                <>
                    {/* Current Balance */}
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t("currentBalance")}</p>
                        <p className="text-2xl font-bold text-green-600">
                            {balanceData?.balance || 0} EGP
                        </p>
                    </div>

                    {/* Amount Selection */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t("chooseAmount")}</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {amounts.map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => setSelectedAmount(amount)}
                                    className={`px-4 py-2 rounded-xl border-2 transition-all duration-200 ${
                                        selectedAmount === amount
                                            ? "border-green-600 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 shadow-lg"
                                            : "border-gray-300 dark:border-gray-600 bg-white dark:!bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-green-400"
                                    }`}
                                >
                                    <span className="text-xl font-bold">{amount}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Upload Screenshot */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{t("uploadScreenshot")}</h3>
                        <label className="block">
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-green-400 transition-colors">
                                {uploadedFile ? (
                                    <div>
                                        <p className="text-green-600 font-semibold">{uploadedFile.name}</p>
                                        <img
                                            src={URL.createObjectURL(uploadedFile)}
                                            alt="Preview"
                                            className="mt-2 max-h-20 mx-auto rounded"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("clickToUpload")}</p>
                                )}
                            </div>
                        </label>
                    </div>

                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                    <button
                        onClick={handleSubmit}
                        disabled={!selectedAmount || !uploadedFile || loading}
                        className={`w-full py-2 rounded-xl font-bold text-white transition-all ${
                            selectedAmount && uploadedFile && !loading
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                        }`}
                    >
                        {loading ? t("submitting") : t("submitRecharge")}
                    </button>
                </>
            ) : (
                <div className="text-center">
                    <p className="text-4xl mb-4">🎉</p>
                    <h3 className="text-xl font-bold text-green-600 mb-2">
                        {t("rechargeSubmitted")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t("rechargeReceivedDesc")}
                        <br />
                        {t("balanceAddedWithin")}{" "}
                        <span className="font-semibold text-green-600">{t("48hours")}</span>.
                    </p>
                </div>
            )}
        </div>
    );
}