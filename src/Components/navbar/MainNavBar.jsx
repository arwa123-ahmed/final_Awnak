import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faGear,
  faClock,
  faMoon,
  faSun,
  faBell,
  faTimes,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Joyride, STATUS } from "react-joyride"; // استيراد الجايد
import logoLight from "../../images/logoA.png";
import logoDark from "../../images/logoDark2.1.png";

const getAvatar = (u) => {
  const imagePath = u?.profile_image || u?.avatar || u?.id_image;
  if (imagePath) {
    if (imagePath.startsWith("http")) return imagePath;
    return `http://72.62.186.133/storage/${imagePath}`;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(u?.name || "U")}&background=bbf7d0&color=15803d&bold=true&size=200`;
};

const MainNavBar = ({ userLevel }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}"),
  );

  // ─── إعدادات الجولة التعريفية (Guide) ───
  const [runTour, setRunTour] = useState(false);
  const steps = [
    {
      target: "body",
      placement: "center",
      content: (
        <div className="text-right font-almarai p-2">
          <img src={logoLight} alt="عونك" className="w-16 mx-auto mb-4" />
          <h3 className="font-black text-xl text-green-700 mb-2">
            أهلاً بك في منصة عونك!
          </h3>
          <p className="text-gray-600 leading-relaxed text-sm">
            نحن هنا لنسهل عليك تقديم وتلقي المساعدة. دعنا نلقي نظرة سريعة على
            واجهة منصتك.
          </p>
        </div>
      ),
    },
    {
      target: "#home-link",
      content: "هنا تجد الصفحة الرئيسية، والتعريف بالمنصة، وآخر التحديثات.",
      placement: "bottom",
    },
    {
      target: "#volunteer-link",
      content:
        "قسم المتطوعين: إذا كنت تمتلك مهارة وترغب بمساعدة الآخرين لكسب الدقائق.",
      placement: "bottom",
    },
    {
      target: "#customer-link",
      content: "قسم العملاء: ابحث عن متطوعين لمساعدتك في مهامك مقابل رصيدك.",
      placement: "bottom",
    },
    {
      target: "#balance-section",
      content:
        "رصيدك الحالي: الدقائق التي تملكها لاستخدام الخدمات داخل المنصة.",
      placement: "bottom",
    },
    {
      target: "#profile-menu",
      content:
        "ملفك الشخصي: من هنا يمكنك تحديث بياناتك، رفع صورتك، وإكمال معلوماتك.",
      placement: "bottom",
    },
    {
      target: "#settings-link",
      content: "الإعدادات: لتعديل بيانات الدخول، كلمة المرور، وتفضيلات المظهر.",
      placement: "bottom",
    },
  ];

  const handleJoyrideCallback = (data) => {
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
      setRunTour(false);
    }
  };

  // ─── مزامنة بيانات المستخدم والـ Dark Mode ───
  useEffect(() => {
    const syncUser = () =>
      setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    window.addEventListener("storage", syncUser);
    window.addEventListener("userUpdated", syncUser);

    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    document.documentElement.classList.toggle("dark", savedMode);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("userUpdated", syncUser);
    };
  }, []);

  // ─── جلب الرصيد ───
  const fetchBalance = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get("http://72.62.186.133/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserBalance(res.data.balance || 0);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBalance();
    window.addEventListener("balanceUpdated", fetchBalance);
    window.addEventListener("userUpdated", fetchBalance);
    return () => {
      window.removeEventListener("balanceUpdated", fetchBalance);
      window.removeEventListener("userUpdated", fetchBalance);
    };
  }, []);

  // ─── جلب عدد التنبيهات ───
  useEffect(() => {
    const fetchNotifCount = async () => {
      const token = localStorage.getItem("token");
      if (!token || !user.role) return;
      try {
        const endpoint =
          user.role === "volunteer"
            ? "volunteer/requests"
            : "customer/requests";
        const res = await axios.get(`http://72.62.186.133/api/${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifCount(res.data.requests?.length || 0);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifCount();
    const interval = setInterval(fetchNotifCount, 60000);
    return () => clearInterval(interval);
  }, [user.role]);

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

  const navigation = [
    { name: t("home"), href: "/", id: "home-link" },
    { name: t("about"), href: "/about", id: "about-link" },
    { name: t("volunteer"), href: "/volunteering", id: "volunteer-link" },
    { name: t("customer"), href: "/customers", id: "customer-link" },
    { name: t("contact"), href: "/contact", id: "contact-link" },
  ];

  return (
    <>
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        callback={handleJoyrideCallback}
        locale={{
          back: "السابق",
          close: "إنهاء",
          last: "فهمت",
          next: "التالي",
          skip: "تخطي",
        }}
        styles={{
          options: { primaryColor: "#22c55e", zIndex: 10000 },
          tooltipContainer: {
            textAlign: "right",
            direction: "rtl",
            fontFamily: "Almarai, sans-serif",
          },
        }}
      />

      <Disclosure
        as="nav"
        className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/90 border-b border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-300"
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between items-center">
                {/* Logo & Desktop Nav */}
                <div className="flex items-center gap-4">
                  <img
                    src={logoLight}
                    alt="Logo"
                    className="h-8 w-auto hover:scale-105 transition dark:hidden"
                  />
                  <img
                    src={logoDark}
                    alt="Logo"
                    className="h-8 w-auto hover:scale-105 transition hidden dark:block"
                  />

                  <div className="hidden sm:flex space-x-1">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        id={item.id}
                        to={item.href}
                        className={({ isActive }) =>
                          isActive
                            ? "text-green-600 dark:text-green-400 font-semibold border-b-2 border-green-600 px-3 py-2 text-sm transition-all"
                            : "text-gray-700 dark:text-green-100 hover:text-green-600 px-3 py-2 text-sm transition-all"
                        }
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>

                {/* Right Side Tools */}
                <div className="flex items-center gap-3">
                  {!isLoggedIn ? (
                    <>
                      <button
                        onClick={toggleDarkMode}
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-green-300 transition"
                      >
                        <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
                      </button>
                      <NavLink
                        to="/login"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition"
                      >
                        {t("login")}
                      </NavLink>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Guide Toggle Button */}
                      <button
                        onClick={() => setRunTour(true)}
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-green-300 hover:bg-green-50 transition"
                        title="Platform Guide"
                      >
                        <FontAwesomeIcon
                          icon={faCircleInfo}
                          className="text-base"
                        />
                      </button>

                      {/* Balance */}
                      <div
                        id="balance-section"
                        className="hidden sm:flex items-center gap-1.5 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full border border-green-100 dark:border-green-800/30"
                      >
                        <FontAwesomeIcon
                          icon={faClock}
                          className="text-green-600 dark:text-green-400 text-sm"
                        />
                        <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                          {userBalance} {t("min")}
                        </span>
                      </div>

                      {/* Notifications */}
                      <button
                        onClick={() => navigate("/notifications")}
                        className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-green-300 transition"
                      >
                        <FontAwesomeIcon icon={faBell} />
                        {notifCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            {notifCount > 9 ? "9+" : notifCount}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={toggleDarkMode}
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-green-300 transition"
                      >
                        <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
                      </button>

                      <button
                        id="settings-link"
                        onClick={() => navigate("/settings")}
                        className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 transition"
                      >
                        <FontAwesomeIcon icon={faGear} />
                      </button>

                      {/* Profile Menu */}
                      <Menu as="div" id="profile-menu" className="relative">
                        <MenuButton className="flex rounded-full border-2 border-green-300 dark:border-green-600 overflow-hidden hover:scale-110 transition">
                          <img
                            src={getAvatar(user)}
                            alt="User"
                            className="h-8 w-8 object-cover"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=bbf7d0&color=15803d&bold=true`;
                            }}
                          />
                        </MenuButton>
                        <MenuItems className="absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-2xl bg-white dark:bg-gray-800 py-2 shadow-xl ring-1 ring-black/5 focus:outline-none">
                          <div className="px-4 py-3 border-b dark:border-gray-700">
                            <p className="text-sm font-bold text-gray-800 dark:text-green-100 truncate">
                              {user?.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate uppercase">
                              {user?.role || "user"}
                            </p>
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
                              className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full text-left font-bold"
                              onClick={logout}
                            >
                              {t("logout")}
                            </button>
                          </MenuItem>
                        </MenuItems>
                      </Menu>
                    </div>
                  )}

                  {/* Mobile Menu Button */}
                  <DisclosureButton className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 transition">
                    <FontAwesomeIcon icon={open ? faTimes : faBars} />
                  </DisclosureButton>
                </div>
              </div>
            </div>

            {/* Mobile Menu Panel */}
            <DisclosurePanel className="sm:hidden border-t dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="px-4 py-3 space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-xl text-sm ${isActive ? "text-green-600 font-bold bg-green-50 dark:bg-green-900/20" : "text-gray-700 dark:text-green-100"}`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
                {isLoggedIn && (
                  <>
                    <button
                      onClick={() => navigate("/notifications")}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-green-100"
                    >
                      <FontAwesomeIcon icon={faBell} /> {t("notifications")}
                    </button>
                    <button
                      onClick={() => navigate("/settings")}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-green-100"
                    >
                      <FontAwesomeIcon icon={faGear} /> {t("settings")}
                    </button>
                  </>
                )}
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </>
  );
};

export default MainNavBar;
