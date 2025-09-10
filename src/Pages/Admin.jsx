import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Admin/Sidebar/Sidebar";
import Navbar from "../Components/Home/Navbar/Navbar";
import StatCards from "../Components/Admin/Home/StatCards";
import JobTabs from "../Components/Admin/Job/JobTabs";
import DatabaseView from "../Components/Admin/Database/DatabaseView";
import CreditPlanCard from "../Components/Admin/Credits/CreditPlanCard";
import BillingProfileCard from "../Components/Admin/Billing/BillingProfileCard";
import ProfileEditor from "../Components/Admin/More/ProfileEditor";
import PostJobPage from "../Components/Admin/Job/PostJobForm";
import defaultLogo from "../assets/Image/download.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { getRecruiterProfile } from "../services/apis";
import CandidateView from "../Components/Admin/Candidate/CandidateView";
import { SubscriptionProvider } from "../context/SubscriptionContext";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Load recruiter profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("userToken");
        if (token) {
          const profile = await getRecruiterProfile(token);
          setUserProfile(profile || {});
        }
      } catch (err) {
        console.error("Profile load failed", err);
      }
    };
    fetchProfile();
  }, []);

  // ✅ Sync tab from query param
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tab = query.get("tab");
    if (!tab) {
      navigate("/admin?tab=Home", { replace: true });
    } else {
      setActiveTab(tab);
    }
  }, [location.search, navigate]);

  // ✅ Collapse sidebar for some tabs
  useEffect(() => {
    setCollapsed(activeTab === "Database" || activeTab === "JobPost");
  }, [activeTab]);

  // ✅ updateTab helper (prevents duplicate history entries)
  const updateTab = (tab) => {
    if (tab === activeTab) {
      // same tab → replace (no duplicate in history)
      navigate(`/admin?tab=${tab}`, { replace: true });
    } else {
      // new tab → push new entry in history
      navigate(`/admin?tab=${tab}`);
    }
  };

  // ✅ Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "Home":
        return <StatCards setActiveTab={updateTab} />;
      case "Job":
        return (
          <JobTabs setActiveTab={updateTab} setSelectedJob={setSelectedJob} />
        );
      case "JobPost":
        return <PostJobPage />;
      case "Candidate":
        return <CandidateView selectedJob={selectedJob} />;
      case "Database":
        return (
          <DatabaseView
            hasSubscription={userProfile?.subscriptionActive}
            onShowPlan={() => updateTab("Credits")}
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
        return <StatCards setActiveTab={updateTab} />;
    }
  };

  return (
    <SubscriptionProvider>
      <div className="h-screen flex flex-col bg-[#fefcf9]">
        {/* ✅ Navbar */}
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex flex-1">
          {/* ✅ Desktop Sidebar */}
          <div
            className={`hidden md:block fixed bg-white shadow-md transition-all duration-300 
            ${collapsed ? "w-20" : "w-64"}`}
          >
            <Sidebar
              setActiveTab={updateTab}
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
                    updateTab(tab);
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
