"use client";

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
      const res = await fetch(`${BASE_URL}/jobseeker/getsavedJobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 404) {
        setSavedJobs([]);
        return;
      }

      if (!res.ok) {
        const t = await res.json().catch(() => ({}));
        throw new Error(t.message || "Failed to fetch saved jobs");
      }

      const data = await res.json();
      setSavedJobs(data.savedJobs || []);
    } catch (err) {
      console.error("fetchSavedJobs:", err);
      setError(err.message || "Error");
      setSavedJobs([]);
    } finally {
      setLoading(false);
    }
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
          {savedJobs.map((job) => (
            <JobCard
              key={job._id || job.id}
              job={job}
              isSaved={true}
              onUpdate={fetchSavedJobs}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobsTab;
