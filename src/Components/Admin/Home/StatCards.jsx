import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import JobListCard from "./JobListCard";
import PostJobForm from "../Job/PostJobForm";
import {
  getCreatedJobs,
  getRecruiterProfile,
  getLiveJobs,
  getPendingJobs,
  getClosedJobs,
} from "../../../services/apis";
import {
  FaBriefcase,
  FaClipboardList,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import DatabaseQuickBox from "./DatabaseQuickBox";

// ✅ normalize API response
const normalizeJobs = (data) =>
  Array.isArray(data) ? data : Array.isArray(data?.jobs) ? data.jobs : [];

const StatCards = ({ setActiveTab }) => {
  const [showForm, setShowForm] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  const [stats, setStats] = useState({
    liveJobs: 0,
    totalJobs: 0,
    pendingJobs: 0,
    closedJobs: 0,
  });

  const token = Cookies.get("userToken");

  // ✅ fetch profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return;
      try {
        const profile = await getRecruiterProfile(token);
        setUserProfile(profile);
      } catch (err) {
        console.error("Profile error:", err);
      }
    };
    loadProfile();
  }, [token]);

  // ✅ fetch jobs + stats
  useEffect(() => {
    let interval;
    const loadJobs = async () => {
      if (!token) return;
      try {
        const createdJobs = normalizeJobs(await getCreatedJobs(token));
        const liveJobs = normalizeJobs(await getLiveJobs(token));
        const pendingJobs = normalizeJobs(await getPendingJobs(token));
        const closedJobs = normalizeJobs(await getClosedJobs(token));

        setJobs(createdJobs);
        setStats({
          totalJobs: createdJobs.length,
          liveJobs: liveJobs.length,
          pendingJobs: pendingJobs.length,
          closedJobs: closedJobs.length,
        });
      } catch (err) {
        console.error("Jobs error:", err);
      }
    };

    loadJobs();
    interval = setInterval(loadJobs, 30000);
    return () => clearInterval(interval);
  }, [token]);

  // ✅ add new job
  const handlePostJob = (newJob) => {
    setJobs((prev) => [...prev, { ...newJob, id: Date.now() }]);
    setStats((prev) => ({
      ...prev,
      totalJobs: prev.totalJobs + 1,
      liveJobs: newJob.status === "live" ? prev.liveJobs + 1 : prev.liveJobs,
      pendingJobs:
        newJob.status === "pending" ? prev.pendingJobs + 1 : prev.pendingJobs,
      closedJobs:
        newJob.status === "closed" ? prev.closedJobs + 1 : prev.closedJobs,
    }));
    setShowForm(false);
  };

  return (
    <div className="space-y-10">
      {/* ✅ Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
            Welcome Back, {userProfile?.user?.username || "User"} 👋
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Here’s a quick overview of your hiring activity.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto px-5 py-3 rounded-xl font-semibold 
            bg-gradient-to-r from-amber-400 to-orange-500 text-white 
            shadow-md hover:shadow-lg hover:scale-105 transition"
        >
          + Post New Job
        </button>
      </div>

      {/* ✅ Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 animate-[fadeIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <PostJobForm
              onClose={() => setShowForm(false)}
              onSubmit={handlePostJob}
            />
          </div>
        </div>
      )}

      {/* ✅ Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Live Jobs", value: stats.liveJobs, icon: <FaBriefcase /> },
          {
            title: "Total Jobs",
            value: stats.totalJobs,
            icon: <FaClipboardList />,
          },
          { title: "Pending Jobs", value: stats.pendingJobs, icon: <FaClock /> },
          {
            title: "Closed Jobs",
            value: stats.closedJobs,
            icon: <FaTimesCircle />,
          },
        ].map((card, i) => (
          <div
            key={i}
            className="p-5 sm:p-6 rounded-2xl border border-gray-200 
              shadow-md bg-white hover:shadow-xl hover:scale-[1.02] transition"
          >
            <div className="flex items-center gap-4">
              <div className="text-xl sm:text-2xl text-orange-500">
                {card.icon}
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-medium text-gray-600">
                  {card.title}
                </h2>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Database quick access */}
      <DatabaseQuickBox />

      {/* ✅ Job list */}
      <JobListCard setActiveTab={setActiveTab} jobs={jobs} showAllButtonOnly />
    </div>
  );
};

export default StatCards;
