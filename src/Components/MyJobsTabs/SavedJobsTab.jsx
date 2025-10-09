
import React, { useEffect, useState, useContext } from "react";
import JobCard from "../JobBoard/JobCard";
import { AuthContext } from "../../context/AuthContext";
import Cookies from "js-cookie";
import { BASE_URL } from "../../config";

const SavedJobsTab = () => {
  const { user } = useContext(AuthContext);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSavedJobs = async () => {
    if (!user) {
      setSavedJobs([]);
      return;
    }
    const token = Cookies.get("userToken");
    if (!token) {
      setSavedJobs([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/jobseeker/getsavedJobs` ,{
        headers: { Authorization: `Bearer ${token} `},
      });

      if (!res.ok) {
        const t = await res.json().catch(() => ({}));
        throw new Error(t.message || "Failed to fetch saved jobs");
      }

      const data = await res.json();
      const formatted = (data.savedJobs || [])
        .map((item) => ({ ...item.job, savedAt: item.savedAt }))
        .filter((job) => job.isSaved !== false); // only keep saved jobs

      setSavedJobs(formatted);
    } catch (err) {
      console.error("fetchSavedJobs:", err);
      setError(err.message || "Error");
      setSavedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = (jobId) => {
    setSavedJobs((prev) => prev.filter((job) => job._id !== jobId && job.id !== jobId));
  };

  useEffect(() => {
    fetchSavedJobs();
  }, [user]);

  useEffect(() => {
    const handler = () => fetchSavedJobs();
    window.addEventListener("savedJobsUpdated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("savedJobsUpdated", handler);
      window.removeEventListener("storage", handler);
    };
  }, [user]);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      {savedJobs.length === 0 ? (
        <p className="text-gray-500">No saved jobs yet.</p>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((job, index) => (
            <JobCard
  key={job._id || job.id || index}
  job={job}
  isSaved={true}
  initialSaved={true}
  onUpdate={fetchSavedJobs}
  onUnsave={handleUnsave}
  savedAt={job.savedAt} // 👈 add this
/>

          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobsTab;