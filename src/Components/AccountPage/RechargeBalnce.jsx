import React, { useState , useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Joyride, STATUS } from "react-joyride";
import { FaWallet, FaCopy, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import rechargeAudio from "../../audio/recharge .mp3";

const API = "http://72.62.186.133/api";

export default function BalanceSection({ balanceData, onBalanceUpdate }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const audioRef = useRef(new Audio(rechargeAudio));
  const walletNumber = "01010101010";

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
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || t("somethingWentWrong"));
    }
    setLoading(false);
  };
  const steps = [
    {
      target: "#wallet-info-box",
      disableBeacon: true,
      content:
        "علشان تقدر تعيد شحن حسابك، محتاج تحول على الرقم اللي ظاهرلك Vodafone Cash.",
      placement: "bottom",
    },
    {
      target: "#amount-selection-box",
      content: "اختار المبلغ المطلوب على حسب الباقات اللى ظاهره عندك.",
      placement: "bottom",
    },
    {
      target: "#upload-screenshot-box",
      content: "ومن بعدها بتبعت الـ screenshot بتاعت التحويل هنا للتأكيد.",
      placement: "top",
    },
  ];

  const handleStartGuide = () => {
    setRunTour(true);
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch((e) => console.log(e));
  };

  const handleJoyrideCallback = (data) => {
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
      setRunTour(false);
      audioRef.current.pause();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div
      className="relative min-h-screen py-10 px-4"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{ options: { primaryColor: "#16a34a", zIndex: 10000 } }}
        locale={{
          back: t("back"),
          last: t("done"),
          next: t("next"),
          skip: t("skip"),
        }}
      />

      <div className="bg-white dark:!bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full mx-auto md:max-w-2xl lg:max-w-3xl border border-gray-50 dark:border-gray-700">
        <h2 className="text-3xl font-black text-green-600 mb-8 text-center uppercase tracking-tighter">
          {t("rechargeBalance")}
        </h2>

        {!isSubmitted ? (
          <>
            {/* 1. Wallet Info Box (الجديد) */}
            <div
              id="wallet-info-box"
              className="mb-8 p-6 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl text-white shadow-lg relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 opacity-80">
                  <FaWallet />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Transfer to this number
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black tracking-widest">
                    {walletNumber}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-all active:scale-90"
                  >
                    {copied ? <FaCheckCircle /> : <FaCopy />}
                  </button>
                </div>
                <p className="mt-3 text-[10px] font-medium bg-black/10 inline-block px-2 py-1 rounded">
                  Vodafone Cash Wallet
                </p>
              </div>
              <div className="absolute -right-4 -bottom-4 text-white/10 text-8xl rotate-12">
                <FaWallet />
              </div>
            </div>

            {/* Current Balance */}
            <div className="mb-8 flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-600">
              <span className="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase">
                {t("currentBalance")}
              </span>
              <span className="text-xl font-black text-green-600">
                {balanceData?.balance || 0} EGP
              </span>
            </div>

            {/* 2. Amount Selection */}
            <div id="amount-selection-box" className="mb-8">
              <h3 className="text-sm font-black text-gray-400 uppercase mb-4 ml-1">
                {t("chooseAmount")}
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {amounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`py-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-1 ${
                      selectedAmount === amount
                        ? "border-green-600 bg-green-50 dark:bg-green-900/30 text-green-700 shadow-md scale-105"
                        : "border-gray-100 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-400"
                    }`}
                  >
                    <span className="text-2xl font-black">{amount}</span>
                    <span className="text-[10px] font-bold uppercase">EGP</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Upload Screenshot */}
            <div id="upload-screenshot-box" className="mb-8">
              <h3 className="text-sm font-black text-gray-400 uppercase mb-4 ml-1">
                {t("uploadScreenshot")}
              </h3>
              <label className="block group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl p-8 text-center group-hover:border-green-400 transition-all bg-gray-50/50 dark:bg-gray-700/30">
                  {uploadedFile ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={URL.createObjectURL(uploadedFile)}
                        alt="Preview"
                        className="max-h-32 rounded-xl shadow-md mb-2"
                      />
                      <p className="text-green-600 font-bold text-xs truncate max-w-xs">
                        {uploadedFile.name}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <FaInfoCircle size={24} className="text-gray-300" />
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                        {t("clickToUpload")}
                      </p>
                    </div>
                  )}
                </div>
              </label>
            </div>

            {error && (
              <p className="text-red-500 text-xs font-bold mb-4 text-center">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!selectedAmount || !uploadedFile || loading}
              className={`w-full py-4 rounded-2xl font-black text-white uppercase tracking-widest text-sm transition-all shadow-xl ${
                selectedAmount && uploadedFile && !loading
                  ? "bg-green-600 hover:bg-green-700 shadow-green-200 active:scale-95"
                  : "bg-gray-200 dark:bg-gray-600 cursor-not-allowed"
              }`}
            >
              {loading ? t("submitting") : `✦ ${t("submitRecharge")}`}
            </button>
          </>
        ) : (
          <div className="text-center py-10 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              <FaCheckCircle />
            </div>
            <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2 uppercase">
              {t("rechargeSubmitted")}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
              {t("rechargeReceivedDesc")} <br />
              {t("balanceAddedWithin")}{" "}
              <span className="text-green-600 font-black">{t("48hours")}</span>.
            </p>
          </div>
        )}
      </div>

      {/* زر المساعد الإرشادي العائم */}
      <button
        onClick={handleStartGuide}
        type="button"
        style={{ zIndex: 9999 }}
        className="fixed bottom-6 left-6 bg-green-600 hover:bg-green-700 text-white w-12 h-12 rounded-full shadow-lg shadow-green-200 flex items-center justify-center group transition-all duration-300 hover:w-36 active:scale-95 border-2 border-white"
      >
        <span className="text-xl group-hover:hidden">💡</span>
        <span className="hidden group-hover:inline-block font-black text-[10px] uppercase tracking-tighter whitespace-nowrap">
          Open Guide
        </span>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      </button>
    </div>
  );
}
