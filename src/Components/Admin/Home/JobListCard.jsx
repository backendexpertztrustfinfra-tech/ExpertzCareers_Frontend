import React, { useEffect, useState } from "react";
import { getCreatedJobs } from "../../../services/apis";
import Cookies from "js-cookie";
import DashboardJobCard from "../Job/dashboardJobCard";

const JobListCard = ({ setActiveTab }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("userToken");

  useEffect(() => {
    const loadJobs = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const createdJobs = await getCreatedJobs(token);
        setJobs(createdJobs || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [token]);

  const handleDelete = async (_id) => {
    try {
      setJobs((prev) => prev.filter((job) => job._id !== _id));
      return true;
    } catch (err) {
      console.error("Error deleting job:", err);
      return false;
    }
  };

  const handleEditClick = (job) => {
    alert("Edit job: " + job.jobTitle);
    setActiveTab("Job");
  };

  const handleJobClick = (job) => {
    alert("Job clicked: " + job.jobTitle);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Job Listings</h3>
        <button
          onClick={() => setActiveTab("Job")}
          className="px-6 py-2 text-sm rounded-lg font-semibold 
          bg-gradient-to-r from-yellow-300 via-amber-500 to-orange-500 text-white 
          hover:from-yellow-500 hover:to-yellow-700 shadow-md transition transform hover:scale-105"
        >
          View All
        </button>
      </div>

      {/* Job Cards */}
      {loading ? (
        <p className="text-center text-gray-400">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-center text-gray-400">No jobs found</p>
      ) : (
        <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
          {jobs.map((job) => (
            <DashboardJobCard
              key={job._id}
              job={job}
              onDelete={handleDelete}
              onEditClick={handleEditClick}
              onJobClick={handleJobClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListCard;
