// App.jsx
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "./App.css";
import { useEffect } from "react";
import "./i18n";
import { UserProvider } from "./context/userContext.jsx";
import axios from "axios";
import ProtectedRoute from "./context/ProtectedRoute.jsx";

// Registration
// import RegisterComponent from "./Routes/RegisterComponent.jsx";
// import SecondRegisterPage from "./Components/Registeration/SecondRegisterPage.jsx";
// import ThirdRegisterPage from "./Components/Registeration/ThirdRegisterPage.jsx";
// import LastRegisterPage from "./Components/Registeration/ThirdRegisterPage.jsx";
// import { RegistrationProvider } from "./Provider/RegistrationProvider.jsx";

// Login
import Login from "./Components/login/login.jsx";

// Home
import Home from "./Components/home/Home.jsx";

// Volunteering
import VHomePage from "./Components/Voluntering/volunteeringHomepage/vHomePage.jsx";
import VOffline from "./Components/Voluntering/volunteringOffline/vOffline.jsx";
import VFreelance from "./Components/Voluntering/volunteringFreelance/vFreelance.jsx";

// Customer
import CHomePage from "./Components/Custmoers/CustmoerHomepage/CHomePage.jsx";
import COffline from "./Components/Custmoers/CustmoerOffline/COffline.jsx";
import CFreelance from "./Components/Custmoers/CustmerFreelance/cFreelance.jsx";

// Static Pages
import ContactForm from "./Components/Contactus/ContactUs.jsx";
import AboutUs from "./Components/AboutUs/AboutUs.jsx";

// Layout
import Layout from "./Components/Layout/Layout.jsx";

// Not Found
import NotFound from "./Components/NotFound/NotFound.jsx";

// Account & Balance
import AccountPage from "./Components/AccountPage/Account.jsx";

// Update Profile
import UpdateProfilePage from "./Components/UpdateProfile/UpdateProfile.jsx";

// Recharge balance
import RechargeBalance from "./Components/AccountPage/RechargeBalnce.jsx";

// Settings
import Settings from "./Components/Settings/Settings.jsx";

// profile page
import ProfilePage from "./Components/ProfilePage/ProfilePage.jsx";

// chat page
import ChatPage from "./Components/Chat/Chat.jsx";

// Language change
import Language from "./Components/LanguagePage.jsx";

// category pages
import ServicesByCategory from "./Components/CategoryPages/ServicesByCategory.jsx";

// notification
import NotificationsPage from "./Components/notifications/notification.jsx";

import "@fontsource/almarai";

// Admin
import AdminDashboard from "./Components/Admin/AdminDashboard.jsx";
import AdminUsers from "./Components/Admin/AdminUsers.jsx";
import AdminServices from "./Components/Admin/AdminServices.jsx";
import AdminLogin from "./Components/Admin/AdminLoginPage.jsx";
import AdminProtectedRoute from "./Components/Admin/AdminProtectedRoute.jsx";
//forget password
import ForgetPassword from "./Components/ForgetPass/ForgetPassword.jsx";
import ResetPassword from "./Components/ForgetPass/ResetPassword.jsx";
//register
import { RegistrationProvider } from "../src/Provider/RegistrationProvider.jsx";
import MainRegisterationComponent from "./Components/Registeration/MainRegisterationComponent.jsx";
import SecondRegisterPage from "./Components/Registeration/SecondRegisterPage.jsx";
import ThirdRegisterPage from "./Components/Registeration/ThirdRegisterPage.jsx";
import LastRegisterPage from "./Components/Registeration/LastRegisterPage.jsx";


//Recharge Balance from Admin 
import AdminRecharges from "./Components/Admin/AdminRecharge.jsx";

axios.defaults.withCredentials = true;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },

      // Volunteering
      { path: "volunteering", element: <VHomePage /> },
      { path: "volunteering-offline", element: <VOffline /> },
      { path: "volunteering-freelance", element: <VFreelance /> },

      // Customers
      { path: "customers", element: <CHomePage /> },
      { path: "customers-offline", element: <COffline /> },
      { path: "customers-freelance", element: <CFreelance /> },

      // Static pages
      { path: "contact", element: <ContactForm /> },
      { path: "about", element: <AboutUs /> },

      // Account
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },

      { path: "updateprofile", element: <UpdateProfilePage /> },
      { path: "rechargebalance", element: <RechargeBalance /> },
      { path: "settings", element: <Settings /> },

      { path: "profile/:id", element: <ProfilePage /> },
      { path: "chat/:id", element: <ChatPage /> },

      { path: "language", element: <Language /> },

      {
        path: "volunteer/category/:id",
        element: <ServicesByCategory type="requests" />,
      },
      {
        path: "customer/category/:id",
        element: <ServicesByCategory type="offers" />,
      },

      { path: "notifications", element: <NotificationsPage /> },

      { path: "*", element: <NotFound /> },
    ],
  },

 // ADMIN ROUTES
{ path: "/admin/login", element: <AdminLogin /> },
{
  path: "/admin",
  element: (
    <AdminProtectedRoute>
      <Layout />
    </AdminProtectedRoute>
  ),
  children: [
    { index: true, element: <AdminDashboard /> },
    { path: "users", element: <AdminUsers /> },
    { path: "services", element: <AdminServices /> },
    { path: "payments", element: <AdminRecharges /> },
  ],
},
  

  // Registration
  {
    element: (
      <RegistrationProvider>
        <Outlet />
      </RegistrationProvider>
    ),
    children: [
      { path: "/register", element: <MainRegisterationComponent /> },
      { path: "/countinueregister1", element: <SecondRegisterPage /> },
      { path: "/countinueregister2", element: <ThirdRegisterPage /> },
      { path: "/countinueregister3", element: <LastRegisterPage /> },
    ],
  },

  // Login
  { path: "/login", element: <Login /> },
  //forget password
  { path: "forget", element: <ForgetPassword /> },
  { path: "reset-password", element: <ResetPassword /> },
]);

function App() {
  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, []);

  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
