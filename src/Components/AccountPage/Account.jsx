import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BalancePopup from "./BalancePopup.jsx";
import axios from "axios";
import {
  FaUser, FaIdCard, FaCalendarAlt, FaMapMarkerAlt,
  FaPhone, FaEnvelope, FaTools, FaHandsHelping, FaEdit, FaTrash,
} from "react-icons/fa";
import { useUser } from '../../context/userContext';

const BASE_URL = "http://72.62.186.133";

const getImageUrl = (path, fallback) => {
  if (!path) return fallback;
  if (path.startsWith("http")) return path;
  if (path.includes("storage")) return `${BASE_URL}/${path}`;
  return `${BASE_URL}/storage/${path}`;
};

const FALLBACK_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e5e7eb'/%3E%3Ccircle cx='50' cy='35' r='20' fill='%239ca3af'/%3E%3Cellipse cx='50' cy='85' rx='30' ry='25' fill='%239ca3af'/%3E%3C/svg%3E";

const getLevelInfo = (totalMinutes) => {
  if (totalMinutes === 0) return { level: "0", levelColor: "border-white", progressColor: "bg-gray-300" };
  else if (totalMinutes < 200) return { level: "Bronze", levelColor: "border-[#cd7f32]", progressColor: "bg-[#cd7f32]" };
  else if (totalMinutes < 500) return { level: "Silver", levelColor: "border-gray-400", progressColor: "bg-gray-400" };
  else return { level: "Gold", levelColor: "border-yellow-500", progressColor: "bg-yellow-500" };
};

// ===== Personal Info Tab =====
const PersonalInfoTab = ({ personalInfo }) => {
  if (!personalInfo) return <p>Loading personal info...</p>;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-green-600 mb-6 flex items-center">
        <FaUser className="mr-2" /> Personal Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center border-b border-green-200 pb-3 gap-2">
          <FaUser className="text-green-600" />
          <span className="font-medium text-gray-700">Name:</span>
          <span>{personalInfo?.name || "-"}</span>
        </div>
        <div className="flex items-center border-b border-green-200 pb-3 gap-2">
          <FaIdCard className="text-green-600" />
          <span className="font-medium text-gray-700">National ID:</span>
          <span>{personalInfo?.national_id || "-"}</span>
        </div>
        <div className="flex items-center border-b border-green-200 pb-3 gap-2">
          <FaCalendarAlt className="text-green-600" />
          <span className="font-medium text-gray-700">Gender:</span>
          <span>{personalInfo?.gender || "-"}</span>
        </div>
        <div className="border-b border-green-200 pb-4 md:col-span-2">
          <div className="flex items-center mb-2">
            <FaMapMarkerAlt className="text-green-600 mr-2" />
            <span className="font-medium text-gray-700">Location:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
            <div><p className="text-xs text-gray-500">Country:</p><span>{personalInfo?.nationality || "-"}</span></div>
            <div><p className="text-xs text-gray-500">City:</p><span>{personalInfo?.city || "-"}</span></div>
            <div><p className="text-xs text-gray-500">Area:</p><span>{personalInfo?.street || "-"}</span></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FaPhone className="text-green-600" />
          <span className="font-medium text-gray-700">Phone:</span>
          <span>{personalInfo?.phone || "-"}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaEnvelope className="text-green-600" />
          <span className="font-medium text-gray-700">Email:</span>
          <span>{personalInfo?.email || "-"}</span>
        </div>
      </div>
    </div>
  );
};

// ===== Service Card في البروفايل =====
const ProfileServiceCard = ({ service, onEdit, onDelete, onNavigate }) => {
  const isPending = service.status === "pending";

  return (
    <div
      className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => onNavigate(service)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-2">{service.description}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full font-medium">
              ⏱ {service.timesalary} min
            </span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium
              ${isPending ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"}`}>
              {service.status}
            </span>
            {service.service_location && (
              <span className="text-xs text-gray-400">📍 {service.service_location}</span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div
          className="flex flex-col gap-2 ml-3"
          onClick={(e) => e.stopPropagation()} // منع الـ navigate لو ضغط على الأزرار
        >
          {isPending && (
            <button
              onClick={() => onEdit(service)}
              className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-colors"
              title="Edit"
            >
              <FaEdit size={14} />
            </button>
          )}
          <button
            onClick={() => onDelete(service.id)}
            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
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
const RequestedServicesTab = ({ services, onEdit, onDelete, onNavigate, loading }) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-bold text-green-600 mb-6 flex items-center">
      <FaTools className="mr-2" /> Requested Services
    </h2>
    {loading ? (
      <p className="text-gray-400 text-center py-8">Loading...</p>
    ) : services.length === 0 ? (
      <p className="text-gray-400 text-center py-8">No requested services yet.</p>
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

// ===== Volunteering Tab =====
const VolunteeringTab = ({ services, onEdit, onDelete, onNavigate, loading }) => {
  const totalMinutes = services.reduce((sum, s) => sum + (s.timesalary || 0), 0);
  const levelInfo = getLevelInfo(totalMinutes);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-green-600 mb-6 flex items-center">
        <FaHandsHelping className="mr-2" /> Volunteering Services
      </h2>

      {/* Progress */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Progress Level</h3>
        <div className="flex items-center gap-4">
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div className={`h-4 ${levelInfo.progressColor}`} style={{
              width: totalMinutes === 0 ? "0%"
                : totalMinutes < 200 ? `${(totalMinutes / 200) * 100}%`
                  : "100%",
            }} />
          </div>
          <span className={`px-4 py-1 rounded-full text-white font-semibold text-sm ${levelInfo.progressColor}`}>
            {levelInfo.level}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-2">{totalMinutes} min – Level: {levelInfo.level}</p>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center py-8">Loading...</p>
      ) : services.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No volunteering services yet.</p>
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSave(res.data.service);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-7 w-[95%] max-w-md flex flex-col gap-4">

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Edit Service</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            rows={3}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-300 resize-none"
          />
        </div>

        {/* Time */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">Time (min)</label>
          <input
            type="number"
            value={form.timesalary}
            onChange={(e) => setForm((p) => ({ ...p, timesalary: e.target.value }))}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-300"
          />
        </div>

        {/* Category */}
        {/* Category */}
<div className="flex flex-col gap-1" style={{ position: "relative", zIndex: 9999 }}>
  <label className="text-sm font-semibold text-gray-600">Category</label>
  <select
    value={form.category_id}
    onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value }))}
    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-300 bg-white w-full"
  >
    {categories.map((cat) => (
      <option key={cat.id} value={cat.id}>{cat.en_name || cat.name}</option>
    ))}
  </select>
</div>

        <div className="h-px bg-gray-100" />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-green-300 hover:bg-green-400 text-white font-bold text-sm disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
};

// ===== Main Account Component =====
export default function Account() {
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

  const totalVolunteeringMinutes = myOffers.reduce((sum, s) => sum + (s.timesalary || 0), 0);
  const levelInfo = getLevelInfo(totalVolunteeringMinutes);

  const balanceData = {
    basicCharge: { minutes: 150, currency: "EGP" },
    VolunteeringBalance: { minutes: 0, currency: "EGP" },
    total: { minutes: 150, currency: "EGP" },
  };

  // جيب الـ services والـ categories
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    setServicesLoading(true);

    Promise.all([
      axios.get("http://72.62.186.133/api/my-offers", { headers }),
      axios.get("http://72.62.186.133/api/my-requests", { headers }),
      axios.get("http://72.62.186.133/api/categories"),
    ]).then(([offersRes, requestsRes, catsRes]) => {
      setMyOffers(offersRes.data.offers || []);
      setMyRequests(requestsRes.data.requests || []);
      setCategories(catsRes.data.categories || catsRes.data || []);
    }).catch(console.error)
      .finally(() => setServicesLoading(false));
  }, [user]);

  useEffect(() => {
    if (user?.id_image) {
      setProfileImage(`${getImageUrl(user.id_image, FALLBACK_AVATAR)}?t=${Date.now()}`);
    }
  }, [user?.id_image]);

  useEffect(() => {
    if (!userLoading && !user) navigate("/login");
  }, [user, userLoading, navigate]);

  // Navigate للصفحة اللي فيها الخدمة
  const handleNavigateToService = (service) => {
    if (service.type === "offer") {
      navigate(`/customer/category/${service.category_id}`);
    } else {
      navigate(`/volunteer/category/${service.category_id}`);
    }
  };

  // Delete
  const handleDelete = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
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

  // بعد Save → أپديت الـ list وـ navigate
  const handleSaveEdit = (updatedService) => {
    setMyOffers((prev) => prev.map((s) => s.id === updatedService.id ? updatedService : s));
    setMyRequests((prev) => prev.map((s) => s.id === updatedService.id ? updatedService : s));
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">My Profile</h1>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className={`w-28 h-28 rounded-full border-4 shadow-lg overflow-hidden flex items-center justify-center ${levelInfo.levelColor}`}>
            <img
              key={profileImage}
              src={profileImage}
              alt="avatar"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_AVATAR; }}
            />
          </div>
          <p className="mt-3 text-sm font-semibold text-gray-700">
            Level: <span className="text-green-600">{levelInfo.level}</span>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 px-2">
          <div className="flex w-full max-w-3xl bg-gray-100 rounded-full p-1 shadow-inner">
            {["personal", "requested", "volunteering"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 text-center px-2 py-2 rounded-full font-medium transition-all duration-300
                  ${activeTab === tab ? "bg-green-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-200"}`}>
                <span className="truncate text-[10px] sm:text-sm md:text-base">
                  {tab === "personal" && "Personal Info"}
                  {tab === "requested" && "Requested Services"}
                  {tab === "volunteering" && "Volunteering Services"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {renderTabContent()}

        <div className="flex flex-col md:flex-row items-center justify-between mt-6">
          <div
            className="inline-flex items-center bg-green-100 border border-green-600 rounded-full px-6 py-3 shadow-md mb-3 md:mb-0 cursor-pointer hover:bg-green-200 transition-colors duration-300"
            onClick={() => setShowBalancePopup(true)}
          >
            <span className="text-lg font-semibold text-green-700 mr-2">Current Balance</span>
            <span className="text-2xl font-bold text-green-700">${user?.balance ?? 0}</span>
          </div>

          <BalancePopup show={showBalancePopup} onClose={() => setShowBalancePopup(false)} balanceData={balanceData} />

          <button
            className="border-2 border-green-600 text-green-700 px-8 py-2 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-all duration-300"
            onClick={() => navigate("/rechargebalance")}
          >
            Recharge Balance
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
          <button
            className="bg-green-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300"
            onClick={() => navigate("/updateprofile")}
          >
            Update Profile
          </button>
        </div>

      </div>

      {/* Edit Modal */}
      {editingService && (
        <EditServiceModal
          service={editingService}
          categories={categories}
          onClose={() => setEditingService(null)}
          onSave={handleSaveEdit}
        />
      )}

    </div>
  );
}