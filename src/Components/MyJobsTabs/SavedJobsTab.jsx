import React, { useEffect, useState, useContext } from "react";
import JobCard from "../JobBoard/JobCard";
import { AuthContext } from "../../context/AuthContext";

const SavedJobsTab = () => {
  const { user } = useContext(AuthContext);
  const [savedJobs, setSavedJobs] = useState([]);

  // 🔁 Load saved jobs when user logs in
  useEffect(() => {
    if (!user) return;
    const saved = JSON.parse(localStorage.getItem("savedJobs")) || [];
    const userSavedJobs = saved.filter((job) => job.userId === user.uid);
    setSavedJobs(userSavedJobs);
  }, [user]);

  // ✅ Listen to both custom event + localStorage changes
  useEffect(() => {
    const updateSavedJobs = () => {
      const saved = JSON.parse(localStorage.getItem("savedJobs")) || [];
      const userSavedJobs = saved.filter((job) => job.userId === user?.uid);
      setSavedJobs(userSavedJobs);
    };

    // Custom event when user saves a job
    window.addEventListener("savedJobsUpdated", updateSavedJobs);

    // LocalStorage event (other tabs)
    window.addEventListener("storage", updateSavedJobs);

    return () => {
      window.removeEventListener("savedJobsUpdated", updateSavedJobs);
      window.removeEventListener("storage", updateSavedJobs);
    };
  }, [user]);

  return (
    <div>
      {savedJobs.length === 0 ? (
        <p className="text-gray-500">No saved jobs yet.</p>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobsTab;
