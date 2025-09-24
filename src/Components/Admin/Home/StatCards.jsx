"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import JobListCard from "./JobListCard"
import DatabaseQuickBox from "./DatabaseQuickBox"
import {
  getCreatedJobs,
  getRecruiterProfile,
  getLiveJobs,
  getPendingJobs,
  getClosedJobs,
  getActiveSubscription,
} from "../../../services/apis"
import { FaBriefcase, FaClipboardList, FaClock, FaTimesCircle } from "react-icons/fa"

// ✅ normalize API response
const normalizeJobs = (data) => (Array.isArray(data) ? data : Array.isArray(data?.jobs) ? data.jobs : [])

const StatCards = ({ setActiveTab }) => {
  const [jobs, setJobs] = useState([])
  const [userProfile, setUserProfile] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null) // Add setSelectedJob state

  const [stats, setStats] = useState({
    liveJobs: 0,
    totalJobs: 0,
    pendingJobs: 0,
    closedJobs: 0,
  })

  const token = Cookies.get("userToken")
  const navigate = useNavigate()

  // ✅ fetch profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return
      try {
        const profile = await getRecruiterProfile(token)
        setUserProfile(profile)
      } catch (err) {
        console.error("Profile error:", err)
      }
    }
    loadProfile()
  }, [token])

  // ✅ fetch jobs + stats
  useEffect(() => {
    let interval
    const loadJobs = async () => {
      if (!token) return
      try {
        const createdJobs = normalizeJobs(await getCreatedJobs(token))
        const liveJobs = normalizeJobs(await getLiveJobs(token))
        const pendingJobs = normalizeJobs(await getPendingJobs(token))
        const closedJobs = normalizeJobs(await getClosedJobs(token))

        setJobs(createdJobs)
        setStats({
          totalJobs: createdJobs.length,
          liveJobs: liveJobs.length,
          pendingJobs: pendingJobs.length,
          closedJobs: closedJobs.length,
        })
      } catch (err) {
        console.error("Jobs error:", err)
      }
    }

    loadJobs()
    interval = setInterval(loadJobs, 30000)
    return () => clearInterval(interval)
  }, [token])

  // ✅ check if new job was just posted via PostJobPage
  useEffect(() => {
    const latestJob = localStorage.getItem("latest_posted_job")
    if (latestJob) {
      try {
        const job = JSON.parse(latestJob)
        setJobs((prev) => [...prev, job])
        setStats((prev) => ({
          ...prev,
          totalJobs: prev.totalJobs + 1,
          liveJobs: job.status === "live" ? prev.liveJobs + 1 : prev.liveJobs,
          pendingJobs: job.status === "pending" ? prev.pendingJobs + 1 : prev.pendingJobs,
          closedJobs: job.status === "closed" ? prev.closedJobs + 1 : prev.closedJobs,
        }))
      } catch (err) {
        console.error("Error parsing latest_posted_job:", err)
      }
      localStorage.removeItem("latest_posted_job")
    }
  }, [])

  // ✅ handle Post Job button click
  const handlePostJobClick = async () => {
    if (!token) {
      navigate("/login")
      return
    }
    try {
      const sub = await getActiveSubscription()
      console.log("👉 Active Subscription API Response:", sub)

      // ✅ Handle multiple possible API shapes
      const remainingJobs = sub?.remainingJobs ?? sub?.subscription?.remainingJobs ?? 0

      console.log("👉 Extracted Remaining Jobs:", remainingJobs)

      if (remainingJobs > 0) {
        // ✅ Recruiter has credits → open Post Job form in Admin
        setActiveTab("JobPost")
      } else {
        // ❌ No subscription OR credits = 0 → go to credits
        console.warn("⚠️ No active credits. Redirecting to Credits page...")
        setActiveTab("Credits")
      }
    } catch (err) {
      console.error("❌ Subscription check failed:", err)
      setActiveTab("Credits")
    }
  }

  return (
    <div className="space-y-10">
      {/* ✅ Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#caa057] to-[#caa057] bg-clip-text text-transparent">
            Welcome Back, {userProfile?.user?.username || "User"} 👋
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Here’s a quick overview of your hiring activity.</p>
        </div>

        {/* ✅ Desktop button */}
        {/* <button
          onClick={handlePostJobClick}
          className="hidden sm:inline-block w-full sm:w-auto px-5 py-3 rounded-xl font-semibold 
            bg-gradient-to-r from-amber-400 to-orange-500 text-white 
            shadow-md hover:shadow-lg hover:scale-105 transition"
        >
          + Post New Job
        </button> */}

        {/* ✅ Mobile floating button */}
        {/* <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePostJobClick}
          className="sm:hidden fixed bottom-5 right-5 z-50 rounded-full shadow-lg 
            bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 
            text-white w-16 h-16 flex items-center justify-center text-3xl"
        >
          +
        </motion.button> */}
      </div>

      {/* ✅ Stat cards - Updated to remove saved candidates */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { title: "Live Jobs", value: stats.liveJobs, icon: <FaBriefcase /> },
          {
            title: "Total Jobs",
            value: stats.totalJobs,
            icon: <FaClipboardList />,
          },
          {
            title: "Pending Jobs",
            value: stats.pendingJobs,
            icon: <FaClock />,
          },
          // {
          //   title: "Closed Jobs",
          //   value: stats.closedJobs,
          //   icon: <FaTimesCircle />,
          // },
        ].map((card, i) => (
          <div
            key={i}
            className="p-5 sm:p-6 rounded-2xl border border-gray-200 
              shadow-md bg-white hover:shadow-xl hover:scale-[1.02] transition"
          >
            <div className="flex items-center gap-4">
              <div className="text-xl sm:text-2xl text-[#caa057]">{card.icon}</div>
              <div>
                <h2 className="text-sm sm:text-base font-medium text-gray-600">{card.title}</h2>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Database quick access */}
      <DatabaseQuickBox />

      {/* ✅ Job list - Pass setSelectedJob prop */}
      <JobListCard
        setActiveTab={setActiveTab}
        setSelectedJob={setSelectedJob}
        selectedJob={selectedJob}
        jobs={jobs}
        showAllButtonOnly
      />
    </div>
  )
}

export default StatCards