import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddServiceFAB = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showRoleAlert, setShowRoleAlert] = useState(false);
    const [pendingType, setPendingType] = useState(null);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user.role; // "volunteer" | "customer"

    const defaultType = role === "volunteer" ? "offer" : "request";
    const [form, setForm] = useState({
        name: "",
        description: "",
        timesalary: "",
        service_location: "",
        category_id: "",
        type: defaultType,
    });

    // جيب الـ categories
    useEffect(() => {
        if (isOpen) {
            axios
                .get("http://72.62.186.133/api/categories")
                .then((res) => setCategories(res.data.categories || res.data))
                .catch(console.error);
        }
    }, [isOpen]);

    const handleTypeChange = (newType) => {
        // لو volunteer حاول يغير لـ request
        if (role === "volunteer" && newType === "request") {
            setPendingType(newType);
            setShowRoleAlert(true);
            return;
        }
        // لو customer حاول يغير لـ offer
        if (role === "customer" && newType === "offer") {
            setPendingType(newType);
            setShowRoleAlert(true);
            return;
        }
        setForm((prev) => ({ ...prev, type: newType }));
    };

    const handleChangeRole = async () => {
        const newRole = role === "volunteer" ? "customer" : "volunteer";
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://72.62.186.133/api/update/role",
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // أپديت الـ localStorage
            const updatedUser = { ...user, role: newRole };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            localStorage.setItem("role", newRole);

            setForm((prev) => ({ ...prev, type: pendingType }));
            setShowRoleAlert(false);

            // reload عشان الـ role يتحدث في كل الـ app
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };
  
const handleSubmit = async () => {
    if (!form.name || !form.category_id || !form.timesalary) return;

    setSubmitting(true);
    try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
            "http://72.62.186.133/api/services",
            form,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // ✅ غيّر الاسم من service لـ newService
        const newService = res.data.service;
        console.log("newService:", newService);

        setIsOpen(false);
        setForm({
            name: "",
            description: "",
            timesalary: "",
            service_location: "",
            category_id: "",
            type: defaultType,
        });

        // ✅ navigate حسب الـ type
        if (newService.type === "offer") {
            navigate(`/customer/category/${newService.category_id}`);
        } else {
            navigate(`/volunteer/category/${newService.category_id}`);
        }

    } catch (err) {
        console.error(err);
    }
    setSubmitting(false);
};
    return (
        <>
            {/* ===== FAB Button ===== */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-green-300 hover:bg-green-400 text-white rounded-full shadow-lg flex items-center justify-center text-3xl transition-all duration-200 active:scale-90"
            >
                +
                
            </button>
      

            {/* ===== Modal ===== */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:!bg-slate-700 rounded-3xl shadow-2xl p-7 w-[95%] max-w-lg flex flex-col gap-4">

                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Add New Service</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <div className="h-px bg-gray-100" />

                        {/* Name */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Service Name</label>
                            <input
                                value={form.name}
                                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                placeholder="e.g. Delivery, Translation..."
                                className="border border-gray-200 dark:!border-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-300 dark:bg-slate-800 dark:focus:border-green-400"
                            />
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                                placeholder="Describe the service..."
                                rows={3}
                                className="border border-gray-200 dark:!border-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-300 resize-none dark:bg-slate-800"
                            />
                        </div>

                        {/* Time + Location */}
                        <div className="flex gap-3">
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Time (min)</label>
                                <input
                                    type="number"
                                    value={form.timesalary}
                                    onChange={(e) => setForm((p) => ({ ...p, timesalary: e.target.value }))}
                                    placeholder="e.g. 60"
                                    className="border border-gray-200 dark:!border-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-300 dark:bg-slate-800"
                                />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Location</label>
                                <input
                                    value={form.service_location}
                                    onChange={(e) => setForm((p) => ({ ...p, service_location: e.target.value }))}
                                    placeholder="e.g. Cairo, Maadi..."
                                    className="border border-gray-200 dark:!border-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-300 dark:bg-slate-800"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 ">Category</label>
                            <select
                                value={form.category_id}
                                onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value }))}
                                className="border border-gray-200 dark:!border-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-300 bg-white dark:!bg-slate-800"
                            >
                                <option value="">Select a category...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.en_name || cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Type Radio */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Service Type</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="offer"
                                        checked={form.type === "offer"}
                                        onChange={() => handleTypeChange("offer")}
                                        className="accent-green-400"
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-400">🙋 Offer Service</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="request"
                                        checked={form.type === "request"}
                                        onChange={() => handleTypeChange("request")}
                                        className="accent-green-400"
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-400">🛒 Request Service</span>
                                </label>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100" />

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || !form.name || !form.category_id || !form.timesalary}
                            className={`w-full py-3 rounded-2xl font-bold text-white text-sm tracking-wide transition-all duration-200
                ${submitting || !form.name || !form.category_id || !form.timesalary
                                    ? "bg-green-200cursor-not-allowed"
                                    : "bg-green-300 dark:!bg-green-300 dark:!text-sky-950 hover:bg-green-400 active:scale-95"
                                }`}
                        >
                            {submitting ? "Adding..." : " Add Service"}
                        </button>

                    </div>
                </div>
            )}

            {/* ===== Role Change Alert ===== */}
            {showRoleAlert && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl p-7 w-[90%] max-w-sm flex flex-col items-center gap-4 text-center">

                        <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-3xl">
                            ⚠️
                        </div>

                        <h3 className="text-lg font-bold text-gray-800">Change Your Role?</h3>
                        <p className="text-sm text-gray-500">
                            {role === "volunteer"
                                ? "To request a service, you need to switch your role to Customer. Do you want to change?"
                                : "To offer a service, you need to switch your role to Volunteer. Do you want to change?"}
                        </p>

                        <div className="flex gap-3 w-full">
                            <button
                                onClick={() => setShowRoleAlert(false)}
                                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50"
                            >
                                No, Cancel
                            </button>
                            <button
                                onClick={handleChangeRole}
                                className="flex-1 py-2.5 rounded-xl bg-green-300 hover:bg-green-400 text-white font-bold text-sm"
                            >
                                Yes, Change
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default AddServiceFAB;