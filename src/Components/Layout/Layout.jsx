import React from "react";
import MainNavBar from "../navbar/MainNavBar";
import Footer from "../Footer/Footer.jsx";
import { Outlet } from "react-router-dom";
import AddServiceFAB from "../AddService.jsx";

const Layout = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <>
      <MainNavBar />
      <div className="container mx-auto my-6 py-6">
        <Outlet />
      </div>
      <Footer />

      {/* FAB - يظهر بس لو logged in وعنده role */}
      {user.role && user.role !== "none" && <AddServiceFAB />}
    </>
  );
};

export default Layout;
