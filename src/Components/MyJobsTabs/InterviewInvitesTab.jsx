import React from "react";
import JobCard from "../JobBoard/JobCard";

const InterviewInvitesTab = () => {
  const invites = [
    {
      id: 1,
      title: "Frontend Engineer",
      company: "AppWorks",
      location: "Gurgaon",
      postedDate: "Interview on Aug 5",
      applyUrl: "#",
    },
  ];

  return (
    <div>
      {invites.map((job) => (
        <JobCard key={job.id} job={job} showActions={false} />
      ))}
    </div>
  );
};

export default InterviewInvitesTab;
