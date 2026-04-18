import React, { useEffect, useState } from "react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const [editId, setEditId] = useState(null);
  const [newNationalId, setNewNationalId] = useState("");

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://72.62.186.133/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // delete
  const handleDelete = async (id) => {
    await fetch(`http://72.62.186.133/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  // suspend
  const handleSuspend = async (id) => {
    await fetch(`http://72.62.186.133/api/admin/users/${id}/suspend`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  // unsuspend
  const handleUnsuspend = async (id) => {
    await fetch(`http://72.62.186.133/api/admin/users/${id}/unsuspend`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  // activation
  const handleToggleActivation = async (id) => {
    await fetch(`http://72.62.186.133/api/admin/users/${id}/activation`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  // 🔥 update national id
  const handleUpdateNationalId = async (id) => {
    await fetch(
      `http://72.62.186.133/api/admin/users/${id}/update-national-id`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          national_id: newNationalId,
        }),
      },
    );

    setEditId(null);
    setNewNationalId("");
    fetchUsers();
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Users Management
      </h2>

      <div className="overflow-x-auto bg-white shadow-xl rounded-2xl">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">User Image</th>
              <th className="px-6 py-4">ID img</th>
              <th className="px-6 py-4">National ID</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Activation</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{user.id}</td>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>

                {/* User Image */}
                <td className="px-6 py-4">
                  <img
                    src={`http://72.62.186.133/storage/${user.id_image}`}
                    className="w-12 h-12 object-cover rounded cursor-pointer"
                    onClick={() =>
                      setPreviewImage(
                        `http://72.62.186.133/storage/${user.id_image}`,
                      )
                    }
                  />
                </td>
                <td className="px-6 py-4">
                  <img
                    src={`http://72.62.186.133/storage/${user.national_id_image}`}
                    alt="id"
                    className="w-12 h-12 object-cover rounded cursor-pointer border"
                    onClick={() =>
                      setPreviewImage(
                        `http://72.62.186.133/storage/${user.national_id_image}`,
                      )
                    }
                  />
                </td>

                {/* 🔥 National ID */}
                <td className="px-6 py-4">
                  {editId === user.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newNationalId}
                        onChange={(e) => setNewNationalId(e.target.value)}
                        className="border px-2 py-1 rounded"
                        placeholder="Enter ID"
                      />
                      <button
                        onClick={() => handleUpdateNationalId(user.id)}
                        className="bg-green-500 text-white px-2 rounded"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>{user.national_id}</span>
                      <button
                        onClick={() => {
                          setEditId(user.id);
                          setNewNationalId(user.national_id || "");
                        }}
                        className="text-blue-500 text-xs"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  {user.is_suspended ? (
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">
                      Suspended
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
                      Active
                    </span>
                  )}
                </td>

                {/* Activation */}
                <td className="px-6 py-4">
                  {user.activation ? (
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">
                      Activated
                    </span>
                  ) : (
                    <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">
                      Not Active
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 flex gap-2 justify-center">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                  {!user.is_suspended ? (
                    <button
                      onClick={() => handleSuspend(user.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnsuspend(user.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Unsuspend
                    </button>
                  )}

                  <button
                    onClick={() => handleToggleActivation(user.id)}
                    className={`px-3 py-1 rounded text-white ${
                      user.activation ? "bg-gray-500" : "bg-blue-500"
                    }`}
                  >
                    {user.activation ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔥 Image Popup */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center"
        >
          <img src={previewImage} className="max-w-[90%]" />
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
