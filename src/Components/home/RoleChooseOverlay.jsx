import axios from "axios";

const RoleChooseOverlay = ({ onDone }) => {
  const token = localStorage.getItem("token");

  const chooseRole = async (role) => {
    try {
      const res = await axios.post(
        "http://72.62.186.133/api/user/update-role",
        { user_role: role },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.removeItem("showRoleMessage");

      onDone();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl w-[90%] max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">You want to continue as ?</h2>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => chooseRole("customer")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg"
          >
            Customer
          </button>

          <button
            onClick={() => chooseRole("volunteer")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Volunteer
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleChooseOverlay;
