import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ServiceCard from "../ServiceCard/ServiceCard";
import { FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

const ServicesByCategory = ({ type }) => {
  const { id } = useParams();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ✅ get user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      if (!user) return; // safety check

      try {
        let url = "";
        if (type === "requests") {
          url = `http://72.62.186.133/api/services/requests/${id}`;
        } else {
          url = `http://72.62.186.133/api/services/offers/${id}`;
        }

        const token = localStorage.getItem("token");
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", res.data);

        let data =
          res.data.services || res.data.offers || res.data.Requests || [];

        // ترتيب pending أولاً
        data.sort((a, b) => {
          if (a.status === "pending" && b.status !== "pending") return -1;
          if (a.status !== "pending" && b.status === "pending") return 1;
          return 0;
        });

        setServices(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchServices();
  }, [id, type, user]);

  if (!user) {
    return <p className="text-center mt-10">Loading user...</p>;
  }

  // ❌ لو مش مفعل
  if (user.activation === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full text-center border border-gray-100"
        >
          <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-red-100 text-red-500 text-3xl mb-6 shadow-inner">
            <FaLock />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Account Not Activated
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Your account is currently not activated.
            <br />
            Please wait until it gets approved by the admin.
          </p>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs text-gray-400">
            Once your account is activated, you will be able to access all
            features.
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return <p className="text-center mt-10">Loading services...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto py-20 px-6">
      <h2 className="text-3xl font-bold mb-10 text-center">Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} type={type} />
        ))}
      </div>
    </div>
  );
};

export default ServicesByCategory;
