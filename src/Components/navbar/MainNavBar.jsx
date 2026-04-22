import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Disclosure, DisclosureButton, DisclosurePanel,
  Menu, MenuButton, MenuItem, MenuItems,
} from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faGear, faClock, faMoon, faSun, faBell, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import axios from "axios";
import logoLight from "../../images/logoA.png";
import logoDark from "../../images/logoDark2.1.png"; // ✅ غيري الاسم للصورة الداكنة

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
    return `http://72.62.186.133/storage/${imagePath}`;
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

  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}")
  );

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

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    document.documentElement.classList.toggle("dark", savedMode);
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("http://72.62.186.133/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserBalance(res.data.balance || 0);
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

  useEffect(() => {
    const fetchNotifCount = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const role = currentUser.role;
        const headers = { Authorization: `Bearer ${token}` };
        if (role === "volunteer") {
          const res = await axios.get("http://72.62.186.133/api/volunteer/requests", { headers });
          setNotifCount(res.data.requests?.length || 0);
        } else if (role === "customer") {
          const res = await axios.get("http://72.62.186.133/api/customer/requests", { headers });
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
    <Disclosure as="nav" className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/90 border-b border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-300">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">

              {/* Logo */}
              <div className="flex items-center gap-4">
                {/* ✅ لوجو اللايت */}
                <img src={logoLight} alt="Logo" className="h-8 w-auto hover:scale-105 transition dark:hidden" />
                {/* ✅ لوجو الدارك */}
                <img src={logoDark} alt="Logo" className="h-8 w-auto hover:scale-105 transition hidden dark:block" />

                {/* Desktop Nav Links */}
                <div className="hidden sm:flex space-x-1">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        isActive
                          ? "text-green-600 dark:text-green-400 font-semibold border-b-2 border-green-600 dark:border-green-400 px-3 py-2 text-sm transition-all"
                          : "text-gray-700 dark:text-green-100 hover:text-green-600 dark:hover:text-green-300 px-3 py-2 text-sm transition-all"
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-3">

                {!isLoggedIn && (
                  <>
                    {/* Dark Mode for guests */}
                    <button
                      onClick={toggleDarkMode}
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-green-300 hover:bg-green-50 dark:hover:bg-gray-600 transition"
                    >
                      <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="text-base" />
                    </button>

                    <NavLink
                      to="/login"
                      className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition"
                    >
                      {t("login")}
                    </NavLink>
                  </>
                )}

                {isLoggedIn && (
                  <div className="flex items-center gap-2 sm:gap-3">

                    {/* Balance */}
                    <div className="hidden sm:flex items-center gap-1.5 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full">
                      <FontAwesomeIcon icon={faClock} className="text-green-600 dark:text-green-400 text-sm" />
                      <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                        {userBalance} {t("min")}
                      </span>
                    </div>

                    {/* Notifications */}
                    <button
                      onClick={() => navigate("/notifications")}
                      className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-green-300 hover:bg-green-50 dark:hover:bg-gray-600 transition"
                    >
                      <FontAwesomeIcon icon={faBell} className="text-base" />
                      {notifCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                          {notifCount > 9 ? "9+" : notifCount}
                        </span>
                      )}
                    </button>

                    {/* Dark Mode */}
                    <button
                      onClick={toggleDarkMode}
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-green-300 hover:bg-green-50 dark:hover:bg-gray-600 transition"
                    >
                      <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="text-base" />
                    </button>

                    {/* Settings */}
                    <button
                      onClick={() => navigate("/settings")}
                      className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-green-300 hover:bg-green-50 dark:hover:bg-gray-600 transition"
                    >
                      <FontAwesomeIcon icon={faGear} className="text-base" />
                    </button>

                    {/* User Avatar */}
                    <Menu as="div" className="relative">
                      <MenuButton className="flex rounded-full overflow-hidden hover:scale-110 transition border-2 border-green-300 dark:border-green-600 hover:border-green-500">
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
                     <MenuItems className="absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-2xl bg-white dark:!bg-gray-800 py-2 shadow-xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none ltr:right-0 rtl:left-0 rtl:right-auto">

                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm font-bold text-gray-800 dark:text-green-100 truncate">{user?.name}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user?.email}</p>
                          {/* Balance in dropdown for mobile */}
                          <div className="sm:hidden flex items-center gap-1.5 mt-2 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full w-fit">
                            <FontAwesomeIcon icon={faClock} className="text-green-600 dark:text-green-400 text-xs" />
                            <span className="text-xs font-semibold text-green-700 dark:text-green-300">
                              {userBalance} {t("min")}
                            </span>
                          </div>
                        </div>

                        <MenuItem>
                          <button
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left transition"
                            onClick={() => navigate("/profile")}
                          >
                            {t("profile")}
                          </button>
                        </MenuItem>


                        <MenuItem>
                          <button
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 w-full text-left transition"
                            onClick={logout}
                          >
                            {t("logout")}
                          </button>
                        </MenuItem>
                      </MenuItems>
                    </Menu>

                  </div>
                )}

                {/* ☰ Mobile Menu Button */}
                <DisclosureButton className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-green-300 hover:bg-green-50 dark:hover:bg-gray-600 transition">
                  <FontAwesomeIcon icon={open ? faTimes : faBars} className="text-base" />
                </DisclosureButton>

              </div>
            </div>
          </div>

          
          {/* Mobile Menu */}
<DisclosurePanel className="sm:hidden border-t border-gray-100 dark:border-gray-700">
  <div className="px-4 py-3 space-y-1 bg-white dark:!bg-gray-900">
    {navigation.map((item) => (
      <NavLink
        key={item.name}
        to={item.href}
        className={({ isActive }) =>
          isActive
            ? "block px-3 py-2 rounded-xl text-sm font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
            : "block px-3 py-2 rounded-xl text-sm text-gray-700 dark:text-green-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        }
      >
        {item.name}
      </NavLink>
    ))}

    {isLoggedIn && (
      <>
        <button
          onClick={() => navigate("/notifications")}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-gray-700 dark:text-green-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <FontAwesomeIcon icon={faBell} />
          {t("notifications")}
          {notifCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-1.5 rounded-full">{notifCount}</span>
          )}
        </button>

        {/* ✅ Dark Mode في الموبايل */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-gray-700 dark:text-green-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          {darkMode ? t("lightMode") : t("darkMode")}
        </button>

        {/* ✅ Settings في الموبايل */}
        <button
          onClick={() => navigate("/settings")}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-gray-700 dark:text-green-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <FontAwesomeIcon icon={faGear} />
          {t("settings") || "Settings"}
        </button>
      </>
    )}
  </div>
</DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default MainNavBar;