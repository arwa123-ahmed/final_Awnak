// import { useEffect, useState } from "react";
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import BalancePopup from "./BalancePopup.jsx";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Joyride, STATUS } from "react-joyride";
import profileAudio from "../../audio/profile.mp3";
import {
  FaUser,
  FaIdCard,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaTools,
  FaHandsHelping,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useUser } from "../../context/userContext";

const BASE_URL = "http://72.62.186.133";

const getImageUrl = (path, fallback) => {
  if (!path) return fallback;
  if (path.startsWith("http")) return path;
  if (path.includes("storage")) return `${BASE_URL}/${path}`;
  return `${BASE_URL}/storage/${path}`;
};

const FALLBACK_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e5e7eb'/%3E%3Ccircle cx='50' cy='35' r='20' fill='%239ca3af'/%3E%3Cellipse cx='50' cy='85' rx='30' ry='25' fill='%239ca3af'/%3E%3C/svg%3E";

const getLevelInfo = (totalMinutes) => {
  if (totalMinutes === 0)
    return {
      level: "0",
      levelColor: "border-white",
      progressColor: "bg-gray-300",
    };
  else if (totalMinutes < 200)
    return {
      level: "Bronze",
      levelColor: "border-[#cd7f32]",
      progressColor: "bg-[#cd7f32]",
    };
  else if (totalMinutes < 500)
    return {
      level: "Silver",
      levelColor: "border-gray-400",
      progressColor: "bg-gray-400",
    };
  else
    return {
      level: "Gold",
      levelColor: "border-yellow-500",
      progressColor: "bg-yellow-500",
    };
};

// ===== Personal Info Tab =====
const PersonalInfoTab = ({ personalInfo }) => {
  const { t } = useTranslation();
  if (!personalInfo) return <p>{t("loadingPersonalInfo")}</p>;
  return (
    <div
      id="personal-info-card"
      className="bg-white dark:!bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-6"
    >
      <h2 className="text-2xl font-bold text-green-600 mb-6 flex items-center">
        <FaUser className="mr-2" /> {t("personalInfo")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center border-b border-green-200 dark:border-green-800 pb-3 gap-2">
          <FaUser className="text-green-600" />
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {t("name")}:
          </span>
          <span className="dark:text-gray-200">
            {personalInfo?.name || "-"}
          </span>
        </div>
        <div className="flex items-center border-b border-green-200 dark:border-green-800 pb-3 gap-2">
          <FaIdCard className="text-green-600" />
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {t("nationalId")}:
          </span>
          <span className="dark:text-gray-200">
            {personalInfo?.national_id || "-"}
          </span>
        </div>
        <div className="flex items-center border-b border-green-200 dark:border-green-800 pb-3 gap-2">
          <FaCalendarAlt className="text-green-600" />
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {t("gender")}:
          </span>
          <span className="dark:text-gray-200">
            {personalInfo?.gender || "-"}
          </span>
        </div>
        <div className="border-b border-green-200 dark:border-green-800 pb-4 md:col-span-2">
          <div className="flex items-center mb-2">
            <FaMapMarkerAlt className="text-green-600 mr-2" />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {t("location")}:
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("country")}:
              </p>
              <span className="dark:text-gray-200">
                {personalInfo?.nationality || "-"}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("city")}:
              </p>
              <span className="dark:text-gray-200">
                {personalInfo?.city || "-"}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("area")}:
              </p>
              <span className="dark:text-gray-200">
                {personalInfo?.street || "-"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FaPhone className="text-green-600" />
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {t("phone")}:
          </span>
          <span className="dark:text-gray-200">
            {personalInfo?.phone || "-"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaEnvelope className="text-green-600" />
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {t("email")}:
          </span>
          <span className="dark:text-gray-200">
            {personalInfo?.email || "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

// ===== Service Card في البروفايل =====
const ProfileServiceCard = ({ service, onEdit, onDelete, onNavigate }) => {
  const { t } = useTranslation();
  const isPending = service.status === "pending";
  return (
    <div
      className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer dark:bg-gray-700"
      onClick={() => onNavigate(service)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            {service.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
            {service.description}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full font-medium">
              ⏱ {service.timesalary} min
            </span>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${isPending ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"}`}
            >
              {service.status}
            </span>
            {service.service_location && (
              <span className="text-xs text-gray-400">
                📍 {service.service_location}
              </span>
            )}
          </div>
        </div>
        <div
          className="flex flex-col gap-2 ml-3"
          onClick={(e) => e.stopPropagation()}
        >
          {isPending && (
            <button
              onClick={() => onEdit(service)}
              className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30 hover:bg-green-100 text-green-600 transition-colors"
              title="Edit"
            >
              <FaEdit size={14} />
            </button>
          )}
          <button
            onClick={() => onDelete(service.id)}
            className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30 hover:bg-red-100 text-red-500 transition-colors"
            title="Delete"
          >
            <FaTrash size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ===== Requested Services Tab =====
const RequestedServicesTab = ({
  services,
  onEdit,
  onDelete,
  onNavigate,
  loading,
}) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white dark:!bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-green-600 mb-6 flex items-center">
        <FaTools className="mr-2" /> {t("requestedServices")}
      </h2>
      {loading ? (
        <p className="text-gray-400 text-center py-8">{t("loading")}</p>
      ) : services.length === 0 ? (
        <p className="text-gray-400 text-center py-8">
          {t("noRequestedServices")}
        </p>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <ProfileServiceCard
              key={service.id}
              service={service}
              onEdit={onEdit}
              onDelete={onDelete}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ===== Volunteering Tab =====
const VolunteeringTab = ({
  services,
  onEdit,
  onDelete,
  onNavigate,
  loading,
}) => {
  const { t } = useTranslation();
  const totalMinutes = services.reduce(
    (sum, s) => sum + (s.timesalary || 0),
    0,
  );
  const levelInfo = getLevelInfo(totalMinutes);
  return (
    <div className="bg-white dark:!bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-green-600 mb-6 flex items-center">
        <FaHandsHelping className="mr-2" /> {t("volunteeringServices")}
      </h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          {t("progressLevel")}
        </h3>
        <div className="flex items-center gap-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className={`h-4 ${levelInfo.progressColor}`}
              style={{
                width:
                  totalMinutes === 0
                    ? "0%"
                    : totalMinutes < 200
                      ? `${(totalMinutes / 200) * 100}%`
                      : "100%",
              }}
            />
          </div>
          <span
            className={`px-4 py-1 rounded-full text-white font-semibold text-sm ${levelInfo.progressColor}`}
          >
            {levelInfo.level}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {totalMinutes} min – {t("level")}: {levelInfo.level}
        </p>
      </div>
      {loading ? (
        <p className="text-gray-400 text-center py-8">{t("loading")}</p>
      ) : services.length === 0 ? (
        <p className="text-gray-400 text-center py-8">
          {t("noVolunteeringServices")}
        </p>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <ProfileServiceCard
              key={service.id}
              service={service}
              onEdit={onEdit}
              onDelete={onDelete}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ===== Edit Modal =====
const EditServiceModal = ({ service, categories, onClose, onSave }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    description: service.description || "",
    timesalary: service.timesalary || "",
    category_id: service.category_id || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://72.62.186.133/api/services/${service.id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onSave(res.data.service);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:!bg-slate-800 rounded-3xl shadow-2xl p-7 w-[95%] max-w-md flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {t("editService")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="h-px bg-gray-100 dark:bg-gray-700" />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            {t("description")}
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            rows={3}
            className="border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-300 resize-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            {t("timeMin")}
          </label>
          <input
            type="number"
            value={form.timesalary}
            onChange={(e) =>
              setForm((p) => ({ ...p, timesalary: e.target.value }))
            }
            className="border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-300"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            {t("category")}
          </label>
          <select
            value={form.category_id}
            onChange={(e) =>
              setForm((p) => ({ ...p, category_id: e.target.value }))
            }
            className="border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-300 bg-white w-full"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.en_name || cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="h-px bg-gray-100 dark:!bg-gray-700" />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-green-300 hover:bg-green-400 text-white font-bold text-sm disabled:opacity-60"
          >
            {saving ? t("saving") : t("saveChanges")}
          </button>
        </div>
      </div>
    </div>
  );
};

// ===== Main Account Component =====
export default function Account() {
  const { t } = useTranslation();
  const { user, loading: userLoading } = useUser();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("personal");
  const [showBalancePopup, setShowBalancePopup] = useState(false);
  const [profileImage, setProfileImage] = useState(FALLBACK_AVATAR);
  const [myOffers, setMyOffers] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [runTour, setRunTour] = useState(false);
  const audioRef = useRef(new Audio(profileAudio));
  const totalVolunteeringMinutes = myOffers.reduce(
    (sum, s) => sum + (s.timesalary || 0),
    0,
  );
  const levelInfo = getLevelInfo(totalVolunteeringMinutes);

  const balanceData = {
    basicCharge: { minutes: 150, currency: "EGP" },
    VolunteeringBalance: { minutes: 0, currency: "EGP" },
    total: { minutes: 150, currency: "EGP" },
  };

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    setServicesLoading(true);
    Promise.all([
      axios.get("http://72.62.186.133/api/my-offers", { headers }),
      axios.get("http://72.62.186.133/api/my-requests", { headers }),
      axios.get("http://72.62.186.133/api/categories"),
    ])
      .then(([offersRes, requestsRes, catsRes]) => {
        setMyOffers(offersRes.data.offers || []);
        setMyRequests(requestsRes.data.requests || []);
        setCategories(catsRes.data.categories || catsRes.data || []);
      })
      .catch(console.error)
      .finally(() => setServicesLoading(false));
  }, [user]);

  useEffect(() => {
    if (user?.id_image) {
      setProfileImage(
        `${getImageUrl(user.id_image, FALLBACK_AVATAR)}?t=${Date.now()}`,
      );
    }
  }, [user?.id_image]);

  useEffect(() => {
    if (!userLoading && !user) navigate("/login");
  }, [user, userLoading, navigate]);

  const handleNavigateToService = (service) => {
    if (service.type === "offer")
      navigate(`/customer/category/${service.category_id}`);
    else navigate(`/volunteer/category/${service.category_id}`);
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm(t("confirmDelete"))) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://72.62.186.133/api/services/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyOffers((prev) => prev.filter((s) => s.id !== serviceId));
      setMyRequests((prev) => prev.filter((s) => s.id !== serviceId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEdit = (updatedService) => {
    setMyOffers((prev) =>
      prev.map((s) => (s.id === updatedService.id ? updatedService : s)),
    );
    setMyRequests((prev) =>
      prev.map((s) => (s.id === updatedService.id ? updatedService : s)),
    );
    setEditingService(null);
    handleNavigateToService(updatedService);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInfoTab personalInfo={user} />;
      case "requested":
        return (
          <RequestedServicesTab
            services={myRequests}
            onEdit={setEditingService}
            onDelete={handleDelete}
            onNavigate={handleNavigateToService}
            loading={servicesLoading}
          />
        );
      case "volunteering":
        return (
          <VolunteeringTab
            services={myOffers}
            onEdit={setEditingService}
            onDelete={handleDelete}
            onNavigate={handleNavigateToService}
            loading={servicesLoading}
          />
        );
      default:
        return null;
    }
  };

  if (userLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:!bg-slate-800">
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {t("loadingUserData")}
        </p>
      </div>
    );
  }

  const steps = [
    {
      target: "#personal-info-card",
      disableBeacon: true,
      content: (
        <div className="text-right font-almarai">
          <h3 className="font-bold text-green-600 mb-2">بيانات الملف الشخصي</h3>
          <p className="text-sm">
            هنا في صفحة الملف الشخصي بتظهر البيانات الخاصه بحسابك كلها، زي الاسم
            والرقم القومي والموقع.
          </p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: "#update-profile-btn",
      content: (
        <div className="text-right font-almarai">
          <h3 className="font-bold text-blue-600 mb-2">تعديل المعلومات</h3>
          <p className="text-sm">
            بتقدر كمان تعدل على المعلومات الخاصه بيك او المعلومات اللى مش مكتمله
            او اللى كانت مش مطلوبه وقت التسجيل من هنا.
          </p>
        </div>
      ),
      placement: "top",
    },
    {
      target: "#recharge-btn",
      content: (
        <div className="text-right font-almarai">
          <h3 className="font-bold text-orange-500 mb-2">شحن الحساب</h3>
          <p className="text-sm">
            وكمان بتقدر تعيد شحن حسابك عن طريق الـ <b>recharge balance</b> عشان
            تزود رصيد دقايقك.
          </p>
        </div>
      ),
      placement: "top",
    },
  ];

  const handleStartGuide = () => {
    setActiveTab("personal"); // لضمان ظهور الكارد المطلوب شرحه
    setRunTour(true);
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch((e) => console.log("Audio Error:", e));
  };

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
      audioRef.current.pause();
    }
  };
  return (
    <div className="min-h-screen p-4 md:p-8 dark:!bg-gray-900">
      <div className="max-w-4xl mx-auto bg-white dark:!bg-slate-800 rounded-lg shadow-lg p-6 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">
            {t("myProfile")}
          </h1>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div
            className={`w-28 h-28 rounded-full border-4 shadow-lg overflow-hidden flex items-center justify-center ${levelInfo.levelColor}`}
          >
            <img
              key={profileImage}
              src={profileImage}
              alt="avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_AVATAR;
              }}
            />
          </div>
          <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t("level")}:{" "}
            <span className="text-green-600">{levelInfo.level}</span>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 px-2">
          <div className="flex w-full max-w-3xl bg-gray-100 dark:bg-gray-700 rounded-full p-1 shadow-inner">
            {["personal", "requested", "volunteering"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 text-center px-2 py-2 rounded-full font-medium transition-all duration-300
                  ${activeTab === tab ? "bg-green-600 text-white shadow-md" : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              >
                <span className="truncate text-[10px] sm:text-sm md:text-base">
                  {tab === "personal" && t("personalInfo")}
                  {tab === "requested" && t("requestedServices")}
                  {tab === "volunteering" && t("volunteeringServices")}
                </span>
              </button>
            ))}
          </div>
        </div>

        {renderTabContent()}

        <div className="flex flex-col md:flex-row items-center justify-between mt-6">
          <div
            className="inline-flex items-center bg-green-100 dark:bg-green-900/30 border border-green-600 rounded-full px-6 py-3 shadow-md mb-3 md:mb-0 cursor-pointer hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors duration-300"
            onClick={() => setShowBalancePopup(true)}
          >
            <span className="text-lg font-semibold text-green-700 dark:text-green-400 mr-2">
              {t("currentBalance")}
            </span>
            <span className="text-2xl font-bold text-green-700 dark:text-green-400">
              {user?.balance ?? 0}
            </span>
          </div>

          <BalancePopup
            show={showBalancePopup}
            onClose={() => setShowBalancePopup(false)}
            balanceData={balanceData}
          />

          <button
            id="recharge-btn"
            className="border-2 border-green-600 text-green-700 dark:text-green-400 dark:border-green-500 px-8 py-2 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-all duration-300"
            onClick={() => navigate("/rechargebalance")}
          >
            {t("rechargeBalance")}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
          <button
            id="update-profile-btn"
            className="bg-green-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300"
            onClick={() => navigate("/updateprofile")}
          >
            {t("updateProfile")}
          </button>
        </div>
      </div>

      {editingService && (
        <EditServiceModal
          service={editingService}
          categories={categories}
          onClose={() => setEditingService(null)}
          onSave={handleSaveEdit}
        />
      )}
      <Joyride
        steps={steps}
        run={runTour}
        continuous={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{ options: { primaryColor: "#16a34a", zIndex: 10000 } }}
        locale={{
          back: t("back"),
          close: t("close"),
          last: t("done"),
          next: t("next"),
          skip: t("skip"),
        }}
      />

      {/* زر المساعد الإرشادي العائم */}
      <button
        onClick={handleStartGuide}
        type="button"
        style={{ zIndex: 9999 }}
        className="fixed bottom-6 left-6 bg-green-600 hover:bg-green-700 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center group transition-all duration-300 hover:w-36 active:scale-95 border-2 border-white"
      >
        <span className="text-xl group-hover:hidden">👤</span>
        <span className="hidden group-hover:inline-block font-black text-[10px] uppercase whitespace-nowrap">
          Open Guide
        </span>
      </button>
    </div>
  );
}
