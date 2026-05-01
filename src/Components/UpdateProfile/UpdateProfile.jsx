import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../../context/userContext";
import { useTranslation } from "react-i18next";
import {
  FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUpload,
} from "react-icons/fa";
import passport from "../../images/passport1.webp";
import idCardImg from "../../images/national id.avif";

const BASE_URL = "http://72.62.186.133";

const getImageUrl = (path, fallback) => {
  if (!path) return fallback;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/storage/${path}`;
};

const FALLBACK_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e5e7eb'/%3E%3Ccircle cx='50' cy='35' r='20' fill='%239ca3af'/%3E%3Cellipse cx='50' cy='85' rx='30' ry='25' fill='%239ca3af'/%3E%3C/svg%3E";

const UpdateProfilePage = () => {
  const { t, i18n } = useTranslation();
  const { updateUser, fetchUserData } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", age: "", nationality: "", city: "", area: "",
    gps: "", phone: "", email: "", national_id: "",
  });

  const [profilePicture, setProfilePicture] = useState(FALLBACK_AVATAR);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [nationalIdImage, setNationalIdImage] = useState(idCardImg);
  const [newNationalIdImage, setNewNationalIdImage] = useState(null);
  const [passportImage, setPassportImage] = useState(passport);
  const [newPassportImage, setNewPassportImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    const loadUserData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data.user || res.data;
        setFormData({
          name: user.name || "", age: user.age || "",
          nationality: user.nationality || "", city: user.city || "",
          area: user.street || "", gps: user.location?.gps || "",
          phone: user.phone || "", email: user.email || "",
          national_id: user.national_id || "",
        });
        setProfilePicture(getImageUrl(user.id_image, FALLBACK_AVATAR));
        setNationalIdImage(getImageUrl(user.national_id_image, idCardImg));
        setPassportImage(getImageUrl(user.passport_image, passport));
      } catch (err) {
        console.error(err);
        toast.error(t("failedToLoadUserData"));
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) { setNewProfilePicture(file); setProfilePicture(URL.createObjectURL(file)); }
  };

  const handleNationalIdImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setNewNationalIdImage(file); setNationalIdImage(URL.createObjectURL(file)); }
  };

  const handlePassportImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setNewPassportImage(file); setPassportImage(URL.createObjectURL(file)); }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t("nameRequired");
    if (!formData.email.trim()) newErrors.email = t("emailRequired");
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t("emailInvalid");
    if (!formData.phone.trim()) newErrors.phone = t("phoneRequired");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    const token = localStorage.getItem("token");
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== "" && key !== "name" && key !== "email") {
        data.append(key, formData[key]);
      }
    });
    if (newProfilePicture) data.append("id_image", newProfilePicture);
    if (newNationalIdImage) data.append("national_id_image", newNationalIdImage);
    if (newPassportImage) data.append("passport_image", newPassportImage);

    try {
      const response = await axios.post(`${BASE_URL}/api/update/user`, data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      const updatedUser = response.data.user;
      updateUser(updatedUser);
      await fetchUserData();
      toast.success(t("profileUpdatedSuccess"));
      setTimeout(() => { navigate("/profile"); }, 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || t("failedToUpdateProfile"));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:!bg-gray-900">
        <p className="text-xl text-gray-600 dark:text-gray-400">{t("loadingUserData")}</p>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-white dark:!bg-gray-700 text-gray-800 dark:text-white transition-colors duration-300";

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900"
         dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-4xl mx-auto bg-white dark:!bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-green-600 mb-8 text-center">
          {t("updateProfile")}
        </h1>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

          {/* Profile Picture */}
          <div className="text-center">
            <label className="block text-lg font-semibold text-gray-700 dark:text-white mb-4">
              {t("profilePicture")}
            </label>
            <div className="relative inline-block">
              <img src={profilePicture} alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-green-600 shadow-lg mx-auto object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_AVATAR; }} />
              <label className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 transition-colors duration-300">
                <FaUpload />
                <input type="file" accept="image/*" onChange={handleProfilePictureChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <FaUser className="text-green-600" /> {t("fullName")}
              </label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} disabled
                className={`${inputClass} opacity-60 cursor-not-allowed ${errors.name ? "border-red-500" : ""}`} />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* National ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <FaUser className="text-green-600" /> {t("nationalId")}
              </label>
              <input type="text" name="national_id" value={formData.national_id} onChange={handleInputChange}
                className= {inputClass}  disabled/>
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-green-600" /> {t("location")}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="nationality" value={formData.nationality} onChange={handleInputChange}
                  placeholder={t("country")} className={inputClass} />
                <input type="text" name="city" value={formData.city} onChange={handleInputChange}
                  placeholder={t("city")} className={inputClass} />
                <input type="text" name="area" value={formData.area} onChange={handleInputChange}
                  placeholder={t("area")} className={inputClass} />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <FaPhone className="text-green-600" /> {t("phone")}
              </label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                className={`${inputClass} ${errors.phone ? "border-red-500" : ""}`} />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <FaEnvelope className="text-green-600" /> {t("email")}
              </label>
              <input type="email" name="email" value={formData.email} disabled onChange={handleInputChange}
                className={`${inputClass} opacity-60 cursor-not-allowed ${errors.email ? "border-red-500" : ""}`} />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Official Documents */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 dark:text-white mb-4">
              {t("officialDocuments")}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* National ID Image */}
              <div className="text-center">
                <img src={nationalIdImage} alt="ID Card"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600 mx-auto mb-2"
                  onError={(e) => { e.target.onerror = null; e.target.src = idCardImg; }} />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t("idCardImage")}</p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition-colors duration-300">
                  <FaUpload /> {t("replace")}
                  <input type="file" accept="image/*" onChange={handleNationalIdImageChange} className="hidden" />
                </label>
              </div>

              {/* Passport Image */}
              <div className="text-center">
                <img src={passportImage} alt="Passport"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600 mx-auto mb-2"
                  onError={(e) => { e.target.onerror = null; e.target.src = passport; }} />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t("passportImage")}</p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition-colors duration-300">
                  <FaUpload /> {t("replace")}
                  <input type="file" accept="image/*" onChange={handlePassportImageChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="text-center">
            <button type="button" onClick={handleSave}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-green-700 hover:shadow-xl transition-all duration-300">
              {t("saveChanges")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfilePage;