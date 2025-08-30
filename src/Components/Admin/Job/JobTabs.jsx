import React, { useState, useEffect } from "react";
import DashboardJobCard from "./dashboardJobCard";
import PostJobForm from "./PostJobForm";
import Cookies from "js-cookie";
import {
  getCreatedJobs,
  deleteJob,
  getLiveJobs,
  getPendingJobs,
  getClosedJobs, // ⬅️ import new API function
} from "../../../services/apis";

const statusTabs = ["All", "Live Jobs", "Pending Jobs", "Closed Jobs"];

const JobTabs = ({ setActiveTab, setSelectedJob }) => {
  const [jobs, setJobs] = useState([]);
  const [activeStatus, setActiveStatus] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [selectedJobEdit, setSelectedJobEdit] = useState(null);
  const token = Cookies.get("userToken");

  const fetchJobsFromAPI = async (status = "All") => {
    if (!token) return setJobs([]);

    try {
      let data, list;

      if (status === "Live Jobs") {
        data = await getLiveJobs(token);
        list = data.jobs || [];
      } else if (status === "Pending Jobs") {
        data = await getPendingJobs(token);
        list = data.jobs || [];
      } else if (status === "Closed Jobs") {
        data = await getClosedJobs(token); // ⬅️ call closed jobs API
        list = data.jobs || [];
      } else {
        data = await getCreatedJobs(token);
        list = Array.isArray(data) ? data : data.jobs || [];
      }

      // 🔑 Normalize for unique stable keys
      const normalized = list.map((j, index) => ({
        ...j,
        id: j._id ?? j.id ?? `job-${index}`,
        jobTitle: j.jobTitle ?? j.title ?? "",
        jobCategory: j.jobCategory ?? "",
        company: j.companyName ?? j.company ?? "No Company",
        status: j.status ?? "Unknown",
      }));

      setJobs(normalized);
    } catch (err) {
      console.error("Fetch jobs error:", err);
      alert("Error fetching jobs: " + err.message);
    }
  };

  useEffect(() => {
    fetchJobsFromAPI("All");
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const result = await deleteJob(id);
      if (result) {
        setJobs((prev) => prev.filter((job) => job.id !== id));
        alert("Job deleted successfully!");
      }
    } catch (err) {
      console.error("Delete job error:", err);
      alert("Error deleting job: " + err.message);
    }
  };

  const handleEditClick = (job) => {
    setSelectedJobEdit(job);
    setShowForm(true);
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setActiveTab("Database");
  };

  const handleFormSubmit = (updatedJob) => {
    if (updatedJob?.id) {
      setJobs((prev) =>
        prev.map((job) => (job.id === updatedJob.id ? updatedJob : job))
      );
    } else {
      fetchJobsFromAPI(activeStatus);
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center">
        {statusTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveStatus(tab);
              fetchJobsFromAPI(tab);
            }}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border
              ${
                activeStatus === tab
                  ? "bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            {tab}
          </button>
        ))}

        <div className="ml-auto">
          <button
            onClick={() => {
              setSelectedJobEdit(null);
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 
            text-white px-6 py-2 rounded-lg font-semibold shadow-md transition transform hover:scale-105"
          >
            + Post New Job
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <DashboardJobCard
              key={job.id}
              job={job}
              onDelete={handleDelete}
              onEditClick={handleEditClick}
              onJobClick={() => handleJobClick(job)}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 py-10 bg-white rounded-xl shadow border border-gray-200">
            No jobs found
          </p>
        )}
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-start w-full p-6 max-h-[100vh] justify-center overflow-y-auto"
          onClick={() => setShowForm(false)}
        >
          <div
            className="form w-full max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <PostJobForm
              onClose={() => setShowForm(false)}
              onSubmit={handleFormSubmit}
              initialData={selectedJobEdit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTabs;
