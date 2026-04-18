import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Disclosure, DisclosureButton, DisclosurePanel,
  Menu, MenuButton, MenuItem, MenuItems,
} from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faGear, faClock, faMoon, faSun, faBell } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import axios from "axios";
import logo from "../../images/logoA.png";

const navigation = [
  { name: t("home"), href: "/" },
  { name: t("about"), href: "/about" },
  { name: t("volunteer"), href: "/volunteering" },
  { name: t("customer"), href: "/customers" },
  { name: t("contact"), href: "/contact" },
];

const getAvatar = (u) => {
  const imagePath = u?.profile_image || u?.avatar || u?.id_image;
  if (imagePath) {
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:8000/storage/${imagePath}`;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    u?.name || "U"
  )}&background=bbf7d0&color=15803d&bold=true&size=200`;
};

const MainNavBar = ({ userLevel }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [userBalance, setUserBalance] = useState(0);

  // ✅ user كـ state يتحدث تلقائياً
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  // ✅ sync الـ user من localStorage لو اتغير
  useEffect(() => {
    const syncUser = () => {
      const updated = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(updated);
    };
    window.addEventListener("storage", syncUser);
    window.addEventListener("userUpdated", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("userUpdated", syncUser);
    };
  }, []);

  // dark mode
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    document.documentElement.classList.toggle("dark", savedMode);
  }, []);

  // balance
  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserBalance(res.data.balance || 0);

        // ✅ حدّث الـ user بالكامل من الـ API وحفظه
        const freshUser = res.data;
        localStorage.setItem("user", JSON.stringify(freshUser));
        setUser(freshUser);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBalance();
    window.addEventListener("balanceUpdated", fetchBalance);
    window.addEventListener("userUpdated", fetchBalance);
    return () => {
      window.removeEventListener("balanceUpdated", fetchBalance);
      window.removeEventListener("userUpdated", fetchBalance);
    };
  }, []);

  // notifications
  useEffect(() => {
    const fetchNotifCount = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const role = currentUser.role;
        const headers = { Authorization: `Bearer ${token}` };

        if (role === "volunteer") {
          const res = await axios.get("http://localhost:8000/api/volunteer/requests", { headers });
          setNotifCount(res.data.requests?.length || 0);
        } else if (role === "customer") {
          const res = await axios.get("http://localhost:8000/api/customer/requests", { headers });
          setNotifCount(res.data.requests?.length || 0);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifCount();
    const interval = setInterval(fetchNotifCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    document.documentElement.classList.toggle("dark", newMode);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <Disclosure as="nav" className="fixed top-0 left-0 w-full z-50 bg-transparent text-[#2a3048] dark:text-white shadow-none backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">

          {/* ☰ mobile */}
          <div className="flex items-center sm:hidden">
            <DisclosureButton className="p-2 rounded-md hover:text-green-600 dark:hover:text-green-400 transition">
              <FontAwesomeIcon icon={faBars} className="text-xl text-green-600 dark:text-green-400" />
            </DisclosureButton>
          </div>

          {/* logo + links */}
          <div className="flex items-center space-x-4">
            <img src={logo} alt="Logo" className="h-8 w-auto hover:scale-105 transition" />
            <div className="hidden sm:flex space-x-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    isActive
                      ? "text-green-600 dark:text-green-400 font-semibold border-b-2 border-green-600 dark:border-green-400 px-3 py-2 text-sm"
                      : "text-[#2a3048] dark:text-white hover:text-green-600 dark:hover:text-green-400 px-3 py-2 text-sm"
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* right side */}
          <div className="flex items-center space-x-5">
            {!isLoggedIn && (
              <NavLink
                to="/login"
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-lg"
              >
                {t("login")}
              </NavLink>
            )}

            {isLoggedIn && (
              <div className="flex items-center gap-5">

                {/* Balance */}
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-lg text-[#2a3048] dark:text-white" />
                  <span className="text-sm font-semibold text-[#2a3048] dark:text-white">
                    {userBalance} {t("min")}
                  </span>
                </div>

                {/* 🔔 Notifications */}
                <button
                  onClick={() => navigate("/notifications")}
                  className="relative flex items-center justify-center text-[#2a3048] dark:text-white hover:text-green-600 dark:hover:text-green-400 transition"
                >
                  <FontAwesomeIcon icon={faBell} className="text-xl" />
                  {notifCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {notifCount > 9 ? "9+" : notifCount}
                    </span>
                  )}
                </button>

                {/* Dark Mode */}
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center justify-center text-[#2a3048] dark:text-white hover:text-green-600 dark:hover:text-green-400 transition"
                >
                  <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="text-xl" />
                </button>

                {/* Settings */}
                <button
                  onClick={() => navigate("/settings")}
                  className="flex items-center justify-center text-[#2a3048] dark:text-white hover:text-green-600 dark:hover:text-green-400 transition"
                >
                  <FontAwesomeIcon icon={faGear} className="text-xl" />
                </button>

                {/* ✅ User Avatar */}
                <Menu as="div" className="relative">
                  <MenuButton className="flex rounded-full overflow-hidden hover:scale-110 transition border-2 border-green-200 hover:border-green-400">
                    <img
                      src={getAvatar(user)}
                      alt={user?.name || "User"}
                      className="h-8 w-8 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=bbf7d0&color=15803d&bold=true&size=200`;
                      }}
                    />
                  </MenuButton>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {/* User name header */}
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <MenuItem>
                      <button
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                        onClick={() => navigate("/profile")}
                      >
                        {t("profile")}
                      </button>
                    </MenuItem>
                    <MenuItem>
                      <button
                        className="block px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 w-full text-left"
                        onClick={logout}
                      >
                        {t("logout")}
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>

              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2 bg-white dark:bg-gray-800">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className="block rounded-md px-3 py-2 text-base text-[#2a3048] dark:text-white hover:text-green-600 dark:hover:text-green-400"
            >
              {item.name}
            </NavLink>
          ))}
          <button
            onClick={() => navigate("/notifications")}
            className="flex items-center gap-2 w-full rounded-md px-3 py-2 text-base text-[#2a3048] dark:text-white hover:text-green-600"
          >
            <FontAwesomeIcon icon={faBell} />
            Notifications
            {notifCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-1.5 rounded-full">{notifCount}</span>
            )}
          </button>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default MainNavBar;