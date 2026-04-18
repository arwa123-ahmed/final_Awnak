import React, { useEffect, useState } from "react";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [reason, setReason] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchServices = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/admin/services", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setServices(data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async () => {
    await fetch(`http://127.0.0.1:8000/api/admin/services/${selectedId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });

    setReason("");
    setSelectedId(null);
    fetchServices();
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl mb-6 font-bold">🛠 Services Management</h2>

      <div className="grid gap-4">
        {services.map((s) => (
          <div
            key={s.id}
            className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{s.name}</h3>
              <p className="text-sm text-gray-500">{s.description}</p>
              <p className="text-xs text-gray-400">By: {s.user?.name}</p>
            </div>

            <button
              onClick={() => setSelectedId(s.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="text-lg mb-4">Delete Reason</h3>

            <textarea
              className="w-full border p-2 rounded"
              placeholder="Enter reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setSelectedId(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
