import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Admin/Sidebar/Sidebar";
import Navbar from "../Components/Home/Navbar/Navbar";
import StatCards from "../Components/Admin/Home/StatCards";
import JobTabs from "../Components/Admin/Job/JobTabs";
import DatabaseView from "../Components/Admin/Database/DatabaseView";
import CreditPlanCard from "../Components/Admin/Credits/CreditPlanCard";
import BillingProfileCard from "../Components/Admin/Billing/BillingProfileCard";
import ProfileEditor from "../Components/Admin/More/ProfileEditor";
import defaultLogo from "../assets/Image/download.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { getRecruiterProfile } from "../services/apis";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [collapsed, setCollapsed] = useState(false); // desktop collapse
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedJob, setSelectedJob] = useState(null);

  // ✅ Load profile once
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("userToken");
        if (token) {
          const profile = await getRecruiterProfile(token);
          setUserProfile(profile?.user || {});
        }
      } catch (err) {
        console.error("Profile load failed", err);
      }
    };
    fetchProfile();
  }, []);

  // ✅ Redirect to Google if back pressed on dashboard root
  useEffect(() => {
    const handlePopState = () => {
      if (location.pathname === "/admin") {
        window.location.href = "https://www.google.com";
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [location]);

  // ✅ Collapse sidebar when Database tab is active
  useEffect(() => {
    setCollapsed(activeTab === "Database");
  }, [activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Home":
        return <StatCards setActiveTab={setActiveTab} />;
      case "Job":
        return (
          <JobTabs
            setActiveTab={setActiveTab}
            setSelectedJob={setSelectedJob}
          />
        );
      case "Database":
        return <DatabaseView selectedJob={selectedJob} />;
      case "Credits":
        return <CreditPlanCard />;
      case "Billing":
        return <BillingProfileCard />;
      case "More":
        return (
          <ProfileEditor
            profile={userProfile || { logo: defaultLogo }}
            onUpdate={(newData) =>
              setUserProfile((prev) => ({ ...prev, ...newData }))
            }
          />
        );
      default:
        return <StatCards setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#fefcf9]">
      {/* ✅ Navbar with mobile toggle */}
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 pt-[64px]">
        {/* ✅ Desktop Sidebar */}
        <div
          className={`hidden md:block fixed top-[64px] left-0 h-[calc(100vh-64px)] bg-white shadow-md transition-all duration-300 
            ${collapsed ? "w-20" : "w-64"}`}
        >
          <Sidebar
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            userProfile={userProfile}
          />
        </div>

        {/* ✅ Mobile Sidebar Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Drawer */}
            <div className="relative w-64 bg-white h-full shadow-lg z-50">
              <Sidebar
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setSidebarOpen(false);
                }}
                activeTab={activeTab}
                collapsed={false}
                setCollapsed={() => {}}
                userProfile={userProfile}
              />
            </div>
          </div>
        )}

        {/* ✅ Main Content */}
        <main
          className={`flex-1 transition-all duration-300 p-4 md:p-6 overflow-y-auto 
            ${collapsed ? "md:ml-20" : "md:ml-64"} 
            ${activeTab === "Database" ? "w-full md:ml-20" : ""}`}
        >
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default Admin;
