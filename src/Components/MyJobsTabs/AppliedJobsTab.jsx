import React, { useContext, useEffect, useState } from "react";
import JobCard from "../JobBoard/JobCard";
import { AuthContext } from "../../context/AuthContext";

const AppliedJobsTab = () => {
  const { user } = useContext(AuthContext);
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    if (!user) return;

    const applied = JSON.parse(localStorage.getItem("appliedJobs")) || [];
    const userAppliedJobs = applied.filter((job) => job.userId === user.uid);
    setAppliedJobs(userAppliedJobs);
  }, [user]);

  useEffect(() => {
    const syncAppliedJobs = () => {
      const applied = JSON.parse(localStorage.getItem("appliedJobs")) || [];
      const userAppliedJobs = applied.filter((job) => job.userId === user?.uid);
      setAppliedJobs(userAppliedJobs);
    };

    window.addEventListener("appliedJobsUpdated", syncAppliedJobs);
    return () =>
      window.removeEventListener("appliedJobsUpdated", syncAppliedJobs);
  }, [user]);

  return (
    <div className="space-y-4" id="appliedjobs">
      {appliedJobs.length === 0 ? (
        <p className="text-gray-500">You haven’t applied for any jobs yet.</p>
      ) : (
        appliedJobs.map((job) => (
          <JobCard key={job.id} job={job} showActions={false} />
        ))
      )}
    </div>
  );
};

export default AppliedJobsTab;
