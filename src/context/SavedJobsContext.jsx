import { createContext, useEffect, useState } from "react";

export const SavedJobsContext = createContext();

export const SavedJobsProvider = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem("savedJobs")) || [];
    setSavedJobs(local);
  }, []);

  const saveJob = (job, userId) => {
    const isAlreadySaved = savedJobs.some(
      (item) => item.id === job.id && item.userId === userId
    );

    if (!isAlreadySaved) {
      const updated = [...savedJobs, { ...job, userId }];
      localStorage.setItem("savedJobs", JSON.stringify(updated));
      setSavedJobs(updated);
    }
  };

  const removeJob = (jobId, userId) => {
    const updated = savedJobs.filter(
      (job) => !(job.id === jobId && job.userId === userId)
    );
    localStorage.setItem("savedJobs", JSON.stringify(updated));
    setSavedJobs(updated);
  };

  return (
    <SavedJobsContext.Provider value={{ savedJobs, saveJob, removeJob }}>
      {children}
    </SavedJobsContext.Provider>
  );
};
