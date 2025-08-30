import React, { useState } from "react";
import CandidateCard from "../Components/Admin/Database/CandidateCard";

const mockCandidates = [
  { name: "Aman Kumar", role: "UI/UX Designer", location: "Delhi", image: "/user1.jpg" },
  { name: "Riya Sharma", role: "Frontend Dev", location: "Mumbai", image: "/user2.jpg" },
];

const mockJobs = [
  "UI Designer @ XYZ",
  "Frontend Developer @ ABC",
  "React Developer @ QuickJobs",
];

const DatabasePage = () => {
 
  return (
    <div className="p-4 flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <div className="mt-4">
          {filtered.map((candidate, idx) => (
            <CandidateCard key={idx} candidate={candidate} />
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default DatabasePage;
