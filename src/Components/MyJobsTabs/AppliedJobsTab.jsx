"use client";

import React, { useContext, useEffect, useState } from "react";
import JobCard from "../JobBoard/JobCard";
import { AuthContext } from "../../context/AuthContext";
import Cookies from "js-cookie";
import { BASE_URL } from "../../config";

const AppliedJobsTab = () => {
  const { user } = useContext(AuthContext);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppliedJobs = async () => {
    if (!user) {
      setAppliedJobs([]);
      return;
    }
    const token = Cookies.get("userToken");
    if (!token) {
      setAppliedJobs([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/jobseeker/appliedjobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 404) {
        setAppliedJobs([]);
        return;
      }

      if (!res.ok) {
        const t = await res.json().catch(() => ({}));
        throw new Error(t.message || "Failed to fetch applied jobs");
      }

      const data = await res.json();
      setAppliedJobs(data.appliedJobs || []);
    } catch (err) {
      console.error("fetchAppliedJobs:", err);
      setError(err.message || "Error");
      setAppliedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, [user]);

  useEffect(() => {
    const handler = () => fetchAppliedJobs();
    window.addEventListener("appliedJobsUpdated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("appliedJobsUpdated", handler);
      window.removeEventListener("storage", handler);
    };
  }, [user]);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-4" id="appliedjobs">
      {appliedJobs.length === 0 ? (
        <p className="text-gray-500">You haven’t applied for any jobs yet.</p>
      ) : (
        appliedJobs.map((job) => (
          <JobCard
            key={job._id || job.id}
            job={job}
            showActions={false}
            isApplied={true}
            onUpdate={fetchAppliedJobs}
          />
        ))
      )}
    </div>
  );
};

export default AppliedJobsTab;
