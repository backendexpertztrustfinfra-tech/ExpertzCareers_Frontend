// src/Layout.jsx
import React from "react";
import Navbar from "./Components/Home/Navbar/Navbar";
import Footer from "./Components/Home/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Outlet /> {/* Renders the current route's component here */}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
