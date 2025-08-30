import React, { useState } from "react";
import SavedJobsTab from "../Components/MyJobsTabs/SavedJobsTab";
import AppliedJobsTab from "../Components/MyJobsTabs/AppliedJobsTab";
import InterviewInvitesTab from "../Components/MyJobsTabs/InterviewInvitesTab";

const MyJobsDashboard = () => {
  const [activeTab, setActiveTab] = useState("saved");

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
          { id: "interview", label: "Interview Invites" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`pb-2 text-lg font-medium ${
              activeTab === tab.id
                ? "border-b-4 border-yellow-500 text-yellow-600"
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
