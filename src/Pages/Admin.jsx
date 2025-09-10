import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Admin/Sidebar/Sidebar";
import Navbar from "../Components/Home/Navbar/Navbar";
import StatCards from "../Components/Admin/Home/StatCards";
import JobTabs from "../Components/Admin/Job/JobTabs";
import DatabaseView from "../Components/Admin/Database/DatabaseView";
import CreditPlanCard from "../Components/Admin/Credits/CreditPlanCard";
import BillingProfileCard from "../Components/Admin/Billing/BillingProfileCard";
import ProfileEditor from "../Components/Admin/More/ProfileEditor";
import PostJobPage from "../Components/Admin/Job/PostJobForm"; // ✅ added
import defaultLogo from "../assets/Image/download.jpg";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { getRecruiterProfile } from "../services/apis";
import CandidateView from "../Components/Admin/Candidate/CandidateView";
import { SubscriptionProvider } from "../context/SubscriptionContext";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const location = useLocation();
  const [selectedJob, setSelectedJob] = useState(null);

  // ✅ Load profile once
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("userToken");
        if (token) {
          const profile = await getRecruiterProfile(token);
          setUserProfile(profile || {}); // ✅ keep full object
        }
      } catch (err) {
        console.error("Profile load failed", err);
      }
    };
    fetchProfile();
  }, []);

  // ✅ Set activeTab if passed via navigate state
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  // ✅ Collapse sidebar for some tabs
  useEffect(() => {
    setCollapsed(activeTab === "Database" || activeTab === "JobPost");
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
      case "JobPost": // ✅ added
        return <PostJobPage />;
      case "Candidate":
        return <CandidateView selectedJob={selectedJob} />;
      case "Database":
        return (
          <DatabaseView
            hasSubscription={userProfile?.subscriptionActive}
            onShowPlan={() => setActiveTab("Credits")}
          />
        );
      case "Credits":
        return <CreditPlanCard />;
      case "Billing":
        return <BillingProfileCard />;
      case "Profile":
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
    <SubscriptionProvider>
      <div className="h-screen flex flex-col bg-[#fefcf9]">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-1">
          {/* ✅ Desktop Sidebar */}
          <div
            className={`hidden md:block fixed bg-white shadow-md transition-all duration-300 
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
              <div
                className="fixed inset-0 bg-black/50"
                onClick={() => setSidebarOpen(false)}
              />
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
            ${activeTab === "Database" || activeTab === "JobPost" ? "w-full md:ml-20" : ""}`}
          >
            {renderTabContent()}
          </main>
        </div>
      </div>
    </SubscriptionProvider>
  );
};

export default Admin;
