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
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg border border-gray-200 w-full relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
            Job Listings
          </h3>
          {!loading && (
            <p className="text-sm text-gray-500">
              Total Jobs: {jobs.length}
            </p>
          )}
        </div>
        <button
          onClick={() => setActiveTab("Job")}
          className="px-6 py-2 text-sm sm:text-base rounded-lg font-semibold 
            bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white 
            hover:from-yellow-500 hover:via-amber-600 hover:to-orange-600 
            shadow-md transition-transform hover:scale-105"
        >
          View All
        </button>
      </div>

      {/* Job Cards */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-100 h-24 rounded-xl"
            ></div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <span className="text-5xl mb-3">📭</span>
          <p className="mb-3">No jobs found</p>
          <button
            onClick={() => setActiveTab("Job")}
            className="px-5 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-medium shadow"
          >
            ➕ Post a Job
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[22rem] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-gray-100">
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

      {/* Scroll Fade Effect */}
      {!loading && jobs.length > 4 && (
        <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-2xl"></div>
      )}
    </div>
  );
};

export default JobListCard;
