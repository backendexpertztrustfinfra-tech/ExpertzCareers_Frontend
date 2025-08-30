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

// ✅ Utility to normalize any API response
const normalizeJobs = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.jobs)) return data.jobs;
  return [];
};

const StatCards = ({ setActiveTab }) => {
  const [showForm, setShowForm] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [stats, setStats] = useState({
    liveJobs: 0,
    totalJobs: 0,
    pendingJobs: 0,
    closedJobs: 0,
  });

  const token = Cookies.get("userToken");

  // ✅ Fetch user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return setLoadingProfile(false);
      try {
        const profile = await getRecruiterProfile(token);
        setUserProfile(profile);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    };
    loadProfile();
  }, [token]);

  // ✅ Fetch jobs + auto refresh (poll every 30s for "live" status)
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
        console.error("Error fetching jobs:", err);
      }
    };

    loadJobs();
    interval = setInterval(loadJobs, 30000); // 🔄 refresh every 30s

    return () => clearInterval(interval);
  }, [token]);

  // ✅ When a new job is posted, update counts immediately
  const handlePostJob = (newJob) => {
    setJobs((prev) => [
      ...prev,
      {
        ...newJob,
        id: newJob.id ?? Date.now(),
        jobCategory: newJob.jobCategory ?? "General",
        appliedCount: 0,
      },
    ]);

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

  if (loadingProfile) return <p>Loading profile...</p>;

  return (
    <div className="space-y-10 mt-0">
      {/* ✅ Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent tracking-wide">
            Welcome Back, {userProfile?.user?.username || "User"} 👋
          </h1>
          <p className="text-lg text-gray-600 italic mt-2">
            Here’s a quick overview of your hiring activity.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="mt-4 md:mt-0 bg-gradient-to-r from-yellow-400 to-orange-500 
            text-white px-6 py-3 rounded-xl 
          font-semibold shadow-lg transition transform hover:scale-110"
        >
          + Post New Job
        </button>
      </div>

      {/* ✅ Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-[#fdfaf5] bg-opacity-40 flex items-start w-full p-6 min-h-[100vh] justify-center overflow-y-auto"
          onClick={() => setShowForm(false)}
        >
          <div
            className="form w-full max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <PostJobForm
              onClose={() => setShowForm(false)}
              onSubmit={handlePostJob}
            />
          </div>
        </div>
      )}

      {/* ✅ Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-0">
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              title: "Live Jobs",
              count: stats.liveJobs,
              icon: <FaBriefcase />,
              color: "from-yellow-400 via-amber-500 to-orange-500",
            },
            {
              title: "Total Jobs",
              count: stats.totalJobs,
              icon: <FaClipboardList />,
              color: "from-yellow-400 via-amber-500 to-orange-500",
            },
            {
              title: "Pending Jobs",
              count: stats.pendingJobs,
              icon: <FaClock />,
              color: "from-yellow-400 via-amber-500 to-orange-500",
            },
            {
              title: "Closed Jobs",
              count: stats.closedJobs,
              icon: <FaTimesCircle />,
              color: "from-yellow-400 via-amber-500 to-orange-500",
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`relative p-6 rounded-2xl shadow-xl bg-gradient-to-br ${card.color} text-white
        transform transition hover:scale-105 hover:shadow-2xl hover:brightness-110 backdrop-blur-lg bg-opacity-90`}
            >
              <div className="flex items-start gap-7">
                <div className="text-4xl">{card.icon}</div>
                <div>
                  <h2 className="text-lg font-semibold tracking-wide">
                    {card.title}
                  </h2>
                  <p className="text-4xl font-extrabold mt-1">{card.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Database Quick Access */}
      <div className="block">
        <DatabaseQuickBox />
      </div>

      {/* ✅ Job List */}
      <div className="grid grid-cols-1">
        <JobListCard setActiveTab={setActiveTab} jobs={jobs} showAllButtonOnly />
      </div>
    </div>
  );
};

export default StatCards;
