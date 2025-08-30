

import React, { useState } from "react";
import Sidebar from "../Components/Admin/Sidebar/Sidebar";
import Navbar from "../Components/Home/Navbar/Navbar";
import StatCards from "../Components/Admin/Home/StatCards";
import JobTabs from "../Components/Admin/Job/JobTabs";
import DatabaseView from "../Components/Admin/Database/DatabaseView";
import CreditPlanCard from "../Components/Admin/Credits/CreditPlanCard";
import BillingProfileCard from "../Components/Admin/Billing/BillingProfileCard";
import ProfileEditor from "../Components/Admin/More/ProfileEditor";
import defaultLogo from "../assets/Image/download.jpg";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("Home");

  const [userProfile, setUserProfile] = useState({
    name: "Nanda",
    phone: "+91 9811377155",
    email: "nanda@example.com",
    logo: defaultLogo,
  });

  const [selectedJob, setSelectedJob] = useState(null);

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
            profile={userProfile}
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
    <div className="h-screen flex flex-col">
      {/* Navbar fixed at top */}
      <Navbar />

      <div className="flex flex-1 bg-[#fefcf9]">
        {/* Sidebar fixed left */}
        <div className="fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64">
          <Sidebar
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            userProfile={userProfile}
            onUpdate={(data) =>
              setUserProfile((prev) => ({ ...prev, ...data }))
            }
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6 overflow-y-auto">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default Admin;
