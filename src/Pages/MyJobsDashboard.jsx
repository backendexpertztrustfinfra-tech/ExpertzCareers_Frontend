import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SavedJobsTab from "../Components/MyJobsTabs/SavedJobsTab";
import AppliedJobsTab from "../Components/MyJobsTabs/AppliedJobsTab";
import InterviewInvitesTab from "../Components/MyJobsTabs/InterviewInvitesTab";

const MyJobsDashboard = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") || "saved";

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tabFromUrl = queryParams.get("tab") || "saved";
    setActiveTab(tabFromUrl);
  }, [location.search]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "saved":
        return <SavedJobsTab />;
      case "applied":
        return <AppliedJobsTab />;
      case "interview":
        return <InterviewInvitesTab />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">My Jobs</h1>

      {/* Tabs */}
      <div className="flex space-x-6 border-b border-gray-300 mb-6">
        {[
          { id: "saved", label: "Saved Jobs" },
          { id: "applied", label: "Applied Jobs" },
          // { id: "interview", label: "Interview Invites" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`pb-2 text-lg font-medium ${
              activeTab === tab.id
                ? "border-b-4 border-[#caa057] text-[#caa057]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>{renderTabContent()}</div>
    </div>
  );
};

export default MyJobsDashboard;