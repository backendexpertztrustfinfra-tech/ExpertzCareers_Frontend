import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardJobCard from "./dashboardJobCard";
import PostJobForm from "./PostJobForm";
import Cookies from "js-cookie";
import {
  getCreatedJobs,
  deleteJob,
  getLiveJobs,
  getPendingJobs,
  getClosedJobs,
  getAppliedUser,
} from "../../../services/apis";

const statusTabs = ["All", "Live Jobs", "Pending Jobs", "Closed Jobs"];

const JobTabs = ({ setActiveTab, setSelectedJob }) => {
  const [jobs, setJobs] = useState([]);
  const [activeStatus, setActiveStatus] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [selectedJobEdit, setSelectedJobEdit] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ Hero-style loading

  const token = Cookies.get("userToken");
  const navigate = useNavigate();
  const location = useLocation();

  const fetchJobsFromAPI = async (status = "All") => {
    if (!token) return setJobs([]);

    setLoading(true);
    try {
      let data, list;

      if (status === "Live Jobs") {
        data = await getLiveJobs(token);
        list = data.jobs || [];
      } else if (status === "Pending Jobs") {
        data = await getPendingJobs(token);
        list = data.jobs || [];
      } else if (status === "Closed Jobs") {
        data = await getClosedJobs(token);
        list = data.jobs || [];
      } else {
        data = await getCreatedJobs(token);
        list = Array.isArray(data) ? data : data.jobs || [];
      }

      const normalized = list.map((j, index) => ({
        ...j,
        id: j._id ?? j.id ?? `job-${index}`,
        jobTitle: j.jobTitle ?? j.title ?? "",
        jobCategory: j.jobCategory ?? "",
        company: j.companyName ?? j.company ?? "No Company",
        status: j.status ?? "Unknown",
        appliedCount: 0,
      }));

      const withCounts = await Promise.all(
        normalized.map(async (job) => {
          try {
            const res = await getAppliedUser(token, job.id);
            const count = res?.candidatesApplied?.length ?? 0;
            return { ...job, appliedCount: count };
          } catch (err) {
            console.error(
              `Error fetching applied count for job ${job.id}`,
              err
            );
            return job;
          }
        })
      );

      setJobs(withCounts);
    } catch (err) {
      console.error("Fetch jobs error:", err);
      alert("Error fetching jobs: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsFromAPI("All");
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchJobsFromAPI(activeStatus);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.refresh]);

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
    setActiveTab("Candidate");
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
    <div className="space-y-6 pb-20 relative">
      {/* ✅ Fullscreen Loader Overlay (same as Hero) */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999]">
          <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-700 font-medium">Loading jobs...</p>
          </div>
        </div>
      )}

      {/* Tabs + Post Button */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          {statusTabs.map((tab) => (
            <motion.button
              key={tab}
              onClick={() => {
                setActiveStatus(tab);
                fetchJobsFromAPI(tab);
              }}
              whileTap={{ scale: 0.9 }}
              animate={{
                scale: activeStatus === tab ? 1.05 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                ${
                  activeStatus === tab
                    ? "bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Post Job Button (Mobile Floating Button) */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() =>
            navigate("/post-job", {
              state: { returnTo: { tab: "Job", refresh: true } },
            })
          }
          className="sm:hidden fixed bottom-5 right-5 z-50 rounded-full shadow-lg 
          bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 
          text-white w-16 h-16 flex items-center justify-center text-3xl"
        >
          +
        </motion.button>

        {/* Post Job Button */}
        <div className="hidden sm:block ml-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              navigate("/post-job", {
                state: { returnTo: { tab: "Job", refresh: true } },
              })
            }
            className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 
              text-white px-6 py-2 rounded-lg font-semibold shadow-md"
          >
            + Post New Job
          </motion.button>
        </div>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {jobs.length > 0
            ? jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <DashboardJobCard
                    job={job}
                    onDelete={handleDelete}
                    onEditClick={handleEditClick}
                    onJobClick={() => handleJobClick(job)}
                  />
                </motion.div>
              ))
            : !loading && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-500 py-10 bg-white rounded-xl shadow border border-gray-200 col-span-full"
                >
                  No jobs found
                </motion.p>
              )}
        </AnimatePresence>
      </div>

      {/* Job Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="form w-full max-w-lg sm:max-w-3xl mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <PostJobForm
                onClose={() => setShowForm(false)}
                onSubmit={handleFormSubmit}
                initialData={selectedJobEdit}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobTabs;
