"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { Users, Bookmark } from "lucide-react"
import { getCreatedJobs, getAppliedUser, getSavedCandidates } from "../../../services/apis"

const DatabaseQuickBox = () => {
  const [appliedCount, setAppliedCount] = useState(0)
  const [savedCount, setSavedCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const token = Cookies.get("userToken")

  // ✅ Applied Candidates Count
  useEffect(() => {
    const loadApplied = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        let totalApplied = 0
        const jobsRes = await getCreatedJobs(token)
        const jobs = Array.isArray(jobsRes) ? jobsRes : jobsRes.jobs || []

        await Promise.all(
          jobs.map(async (job) => {
            try {
              const res = await getAppliedUser(token, job._id || job.id)
              totalApplied += res?.candidatesApplied?.length || 0
            } catch (err) {
              console.error("Error fetching applied count:", err)
            }
          })
        )

        setAppliedCount(totalApplied)
      } catch (err) {
        console.error("Error loading jobs:", err)
      } finally {
        setLoading(false)
      }
    }

    loadApplied()
  }, [token])

  // ✅ Saved Candidates Count
  useEffect(() => {
    const loadSaved = async () => {
      if (!token) return
      try {
        const savedData = await getSavedCandidates(token)
        setSavedCount(savedData?.savedCandidates?.length || 0)
      } catch (err) {
        console.error("Error fetching saved candidates:", err)
      }
    }

    loadSaved()
  }, [token])

  // ✅ Stats array banana simple rakha
  const stats = [
    {
      title: "Applied",
      value: appliedCount,
      icon: Users,
      color: "from-[#caa057] to-[#caa057]",
    },
    {
      title: "Saved Candidates",
      value: savedCount,
      icon: Bookmark,
      color: "from-[pink] to-[orange]",
    },
  ]

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">Database Overview</h3>

      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {stats.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 bg-white hover:shadow-md hover:scale-[1.02] transition-all duration-300"
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-gradient-to-r ${item.color} mb-3 shadow-md`}
              >
                <Icon size={22} className="text-white" />
              </div>

              {/* Title */}
              <span className="text-gray-600 font-medium text-sm sm:text-base text-center">{item.title}</span>

              {/* Count */}
              <span className="text-lg sm:text-2xl font-extrabold text-gray-900 mt-1">
                {loading ? <span className="animate-pulse">...</span> : item.value}
              </span>

              {/* Progress bar */}
              <div className="w-full h-1.5 mt-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${item.color} transition-all duration-700`}
                  style={{
                    width: loading ? "0%" : `${Math.min(item.value * 10, 100)}%`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DatabaseQuickBox