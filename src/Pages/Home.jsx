
import React, { useRef, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Hero from "../Components/Home/Hero";
import JobSearchBar from "../Components/Home/JobSearchBar";
import CategoryCards from "../Components/Home/CategoryCards";
import JobPromo from "../Components/Home/JobPromo";
import QualificationCards from "../Components/Home/QualificationCards";
import JobTypeCards from "../Components/Home/JobTypeCards";
import JobFasterForm from "../Components/Home/JobFasterForm";
import FaqSection from "../Components/Home/FaqSection";

const Home = () => {
  const { user } = useContext(AuthContext); // ✅ useContext instead of localStorage
  const [showLoginMsg, setShowLoginMsg] = useState(false);
  const heroRef = useRef();

  const handleAccessAttempt = () => {
    if (!user) {
      heroRef.current?.scrollToLogin();
      setShowLoginMsg(true);
      setTimeout(() => setShowLoginMsg(false), 3000);
    }
  };

  return (
    <div className="relative">
      <Hero ref={heroRef} />

      {/* Login alert */}
      {showLoginMsg && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-white-500 text-black px-4 py-2 rounded shadow z-50">
          Please login first to continue
        </div>
      )}

      {/* Main Content */}
      <div className={`${!user ? "filter opacity-100 pointer-events-auto select-none" : ""}`}>
        {/* <JobSearchBar /> */}
        <CategoryCards />
        <JobPromo />
        <QualificationCards />
        <JobTypeCards />
        {/* <JobFasterForm /> */}
        <FaqSection />
      </div>

      {/* Blur Click Blocker */}
      {!user && (
        <div
          className="fixed top-0 left-0 w-full h-full z-40"
          onClick={handleAccessAttempt}
        ></div>
      )}
    </div>
  );
};

export default Home;
