import React, { useEffect, useState } from "react";
import JobCard from "../JobBoard/JobCard";
import Cookies from "js-cookie";
import { BASE_URL } from "../../config";

const InterviewInvitesTab = () => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("userToken");

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const resp = await fetch(`${BASE_URL}/jobseeker/interviewInvites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!resp.ok) throw new Error("Failed to fetch interview invites");
        const data = await resp.json();
        setInvites(data.invites || []);
      } catch (err) {
        console.error("❌ Error fetching invites:", err);
        setInvites([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchInvites();
  }, [token]);

  if (!token) {
    return <p className="text-gray-500 text-sm">⚠️ Please log in to see interview invites.</p>;
  }

  if (loading) {
    return <p className="text-gray-500 text-sm">⏳ Loading invites...</p>;
  }

  if (invites.length === 0) {
    return <p className="text-gray-500 text-sm">📭 No interview invites yet.</p>;
  }

  return (
    <div>
      {invites.map((job) => (
        <JobCard key={job._id || job.id} job={job} showActions={false} />
      ))}
    </div>
  );
};

export default InterviewInvitesTab;
