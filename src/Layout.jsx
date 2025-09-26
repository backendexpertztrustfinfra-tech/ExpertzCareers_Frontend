import React from "react";
import { useLocation, Outlet } from "react-router-dom"; 
import Navbar from "./Components/Home/Navbar/Navbar";
import Footer from "./Components/Home/Footer";

const Layout = () => {
  const location = useLocation();
  const isJobPostPage = location.pathname === "/post-job";

  return (
    <>
      {!isJobPostPage && <Navbar />}

      <main className="min-h-screen">
        <Outlet />
      </main>
      {!isJobPostPage && <Footer />}
    </>
  );
};

export default Layout;