"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import DashboardJobCard from "../Job/dashboardJobCard"
import { getCreatedJobs, getAppliedUser } from "../../../services/apis"

const JobListCard = ({ setActiveTab, setSelectedJob }) => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const token = Cookies.get("userToken")

  useEffect(() => {
    const loadJobs = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const createdJobs = await getCreatedJobs(token)
        const jobsArray = createdJobs || []

        const jobsWithCounts = await Promise.all(
          jobsArray.map(async (job) => {
            try {
              const res = await getAppliedUser(token, job._id)
              const appliedCount = res?.candidatesApplied?.length || 0
              return {
                ...job,
                id: job._id,
                jobTitle: job.jobTitle || job.title || "",
                company: job.companyName || job.company || "No Company",
                appliedCount,
              }
            } catch (err) {
              console.error(`Error fetching applied count for job ${job._id}`, err)
              return {
                ...job,
                id: job._id,
                jobTitle: job.jobTitle || job.title || "",
                company: job.companyName || job.company || "No Company",
                appliedCount: 0,
              }
            }
          })
        )

        setJobs(jobsWithCounts)
      } catch (err) {
        console.error("Error fetching jobs:", err)
        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [token])

  const handleDelete = async (_id) => {
    try {
      setJobs((prev) => prev.filter((job) => job._id !== _id))
      return true
    } catch (err) {
      console.error("Error deleting job:", err)
      return false
    }
  }

  const handleEditClick = (job) => {
    setActiveTab("Job")
  }

  const handleJobClick = (job) => {
    const jobForCandidateView = {
      ...job,
      id: job._id || job.id, // Ensure consistent ID field
      _id: job._id || job.id, // Keep both for compatibility
      jobTitle: job.jobTitle || job.title || "",
      company: job.companyName || job.company || "No Company",
    }

    console.log("[v0] JobListCard - Original job:", job)
    console.log("[v0] JobListCard - Normalized job for candidate view:", jobForCandidateView)

    if (setSelectedJob) {
      setSelectedJob(jobForCandidateView)
      setActiveTab("Candidate")
    } else {
      console.error("[v0] JobListCard - setSelectedJob function not available")
      setActiveTab("Job")
    }
  }

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg border border-gray-200 w-full relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Job Listings</h3>
          {!loading && <p className="text-sm text-gray-500">Total Jobs: {jobs.length}</p>}
        </div>
        <button
          onClick={() => setActiveTab("Job")}
          className="px-6 py-2 text-sm sm:text-base rounded-lg font-semibold 
             bg-gradient-to-r from-[#caa057] via-[#caa057] to-[#caa057] text-white 
             hover:from-[#b4924c] hover:via-[#b4924c] hover:to-[#b4924c] 
             shadow-md transition-transform hover:scale-105"
        >
          View All
        </button>
      </div>

      {/* Job Cards */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 h-24 rounded-xl"></div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <span className="text-5xl mb-3">📭</span>
          <p className="mb-3">No jobs found</p>
          <button
            onClick={() => setActiveTab("Job")}
            className="px-5 py-2 rounded-lg bg-[#caa057] hover:bg-[#b4924c] text-white font-medium shadow"
          >
            ➕ Post a Job
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[22rem] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#caa057] scrollbar-track-gray-100">
          {jobs.map((job) => (
            <DashboardJobCard
              key={job._id}
              job={job}
              onDelete={handleDelete}
              onEditClick={handleEditClick}
              onJobClick={() => handleJobClick(job)}
            />
          ))}
        </div>
      )}

      {/* Scroll Fade Effect */}
      {!loading && jobs.length > 4 && (
        <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-2xl"></div>
      )}
    </div>
  )
}

export default JobListCard