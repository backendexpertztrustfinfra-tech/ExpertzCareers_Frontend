"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { MapPin, Briefcase, GraduationCap, IndianRupee, Clock, Users, TrendingUp, BookmarkIcon } from "lucide-react"
import Cookies from "js-cookie"
import { motion } from "framer-motion"
import { BASE_URL } from "../../config"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const JobCard = ({ job, showActions = true, showBookmark = true, onUpdate, initialSaved = false, onUnsave }) => {
  const navigate = useNavigate()
  const token = Cookies.get("userToken")

  const [isSaved, setIsSaved] = useState(initialSaved)
  const [isApplied, setIsApplied] = useState(false)
  const [applyLoading, setApplyLoading] = useState(false)

  const normalized = {
    id: job._id || job.id || job.jobId,
    title: job.jobTitle || job.title || "Untitled Job",
    company: job.companyName || job.company || "Company Name",
    location: job.location || job.address || "—",
    type: job.jobType || job.type || "—",
    qualification: job.Qualification || job.qualification || "—",
    salary: job.SalaryIncentive || job.salary || job.salaryRange || "—",
    description: job.jobDescription || job.description || "",
    category: job.jobCategory || job.category || "—",
    skills:
      typeof job.jobSkills === "string"
        ? job.jobSkills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : job.skills || [],
    experience: job.totalExperience || job.experience || "—",
    postedDate: job.createdAt || job.postedDate,
    applicants: job.candidatesApplied?.length || job.applicants || 0,
    logo: job.companyLogo
      ? job.companyLogo.startsWith("http")
        ? job.companyLogo
        : `${BASE_URL}${job.companyLogo}`
      : job.logo
        ? job.logo.startsWith("http")
          ? job.logo
          : `${BASE_URL}${job.logo}`
        : "/placeholder.svg",

    benefits: job.jobBenefits || job.benefits || "",
    documents: job.documentRequired || job.documents || "",
    shift: job.shift,
    workingDays: job.workingDays,
    workingDaysFrom: job.workingDaysFrom,
    workingDaysTo: job.workingDaysTo,
    startTime: job.startTime,
    endTime: job.endTime,
    timing: job.timing,
    weekend: job.weekend,
    gender: job.gender,
    industry: job.industry || job.recruterIndustry,
    website: job.website,
    address: job.address,
    jobCreatedby: job.jobCreatedby,
  }

  useEffect(() => {
    setIsSaved(initialSaved)
  }, [initialSaved])

  const handleSave = async (e) => {
    e.stopPropagation()
    if (!token) return toast.error("❌ Please log in to save jobs.")

    try {
      const url = isSaved
        ? `${BASE_URL}/jobseeker/removesavedjob/${normalized.id}`
        : `${BASE_URL}/jobseeker/savejob/${normalized.id}`
      const method = isSaved ? "DELETE" : "POST"

      const resp = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!resp.ok) throw new Error("Failed to update saved job")

      setIsSaved(!isSaved)
      toast[isSaved ? "info" : "success"](isSaved ? "🗑 Job removed from saved" : "✅ Job saved!")
      if (isSaved && onUnsave) onUnsave(normalized.id)
      if (onUpdate) onUpdate()
      window.dispatchEvent(new Event("savedJobsUpdated"))
    } catch (err) {
      console.error(err)
      toast.error("❌ " + err.message)
    }
  }

  const handleApply = async (e) => {
    e.stopPropagation()
    if (!token) return toast.error("❌ Please log in to apply.")
    if (isApplied) return toast.info("✅ Already applied.")
    setApplyLoading(true)

    try {
      const resp = await fetch(`${BASE_URL}/jobseeker/applyforjob/${normalized.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
      if (!resp.ok) throw new Error("Failed to apply")

      setIsApplied(true)
      toast.success("✅ Application submitted!")

      if (isSaved) {
        try {
          const unsaveResp = await fetch(`${BASE_URL}/jobseeker/removesavedjob/${normalized.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          })
          if (unsaveResp.ok) {
            setIsSaved(false)
            if (onUnsave) onUnsave(normalized.id)
            window.dispatchEvent(new Event("savedJobsUpdated"))
          }
        } catch (e2) {
          console.error("Failed to remove saved job after applying:", e2)
        }
      }

      if (onUpdate) onUpdate()
    } catch (err) {
      console.error(err)
      toast.error("❌ " + err.message)
    } finally {
      setApplyLoading(false)
    }
  }

  const handleViewDetails = (e) => {
    e?.stopPropagation()
    navigate(`/jobs/${normalized.id}`, { state: { job: { ...job, ...normalized } } })
  }

  return (
    <div
      onClick={handleViewDetails}
      className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-6 mb-5 cursor-pointer border border-[#fff1ed]"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-[#fff1ed] flex items-center justify-center border border-[#fff1ed]">
            <img
              src={normalized.logo || "/placeholder.svg"}
              alt={normalized.company}
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 line-clamp-1">{normalized.title}</h3>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
              <TrendingUp size={14} className="text-[#caa057]" />
              <span className="line-clamp-1">{normalized.company}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 relative">
          {showBookmark && (
            <motion.button
              onClick={handleSave}
              whileTap={{ scale: 0.8 }}
              animate={{ scale: isSaved ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.3 }}
              className="p-1.5 rounded-lg relative"
            >
              <BookmarkIcon size={18} className={isSaved ? "text-[#caa057] fill-[#caa057]" : "text-gray-500"} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs sm:text-sm">
        <Detail icon={<MapPin size={13} />} text={normalized.location} />
        <Detail icon={<Briefcase size={13} />} text={normalized.type} />
        <Detail icon={<GraduationCap size={13} />} text={normalized.qualification} />
        <Detail icon={<IndianRupee size={13} />} text={normalized.salary} />
      </div>

      {/* Description */}
      {normalized.description && (
        <div
          className="mb-3 p-2 rounded-lg bg-[#fff1ed] border border-[#fff1ed] text-xs sm:text-sm text-gray-700 line-clamp-2 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{
            __html: Array.isArray(normalized.description) ? normalized.description.join(" ") : normalized.description,
          }}
        />
      )}

      {/* Skills / Category */}
      {(normalized.category || normalized.skills.length > 0) && (
        <div className="flex gap-2 mb-3 flex-wrap">
          {normalized.category && (
            <span className="px-2 py-1 text-[11px] sm:text-xs font-semibold bg-[#fff1ed] rounded-full">
              {normalized.category}
            </span>
          )}
          {normalized.skills.map((skill, idx) => (
            <span key={idx} className="px-2 py-1 text-[11px] sm:text-xs font-semibold bg-[#fff1ed] rounded-full">
              {skill}
            </span>
          ))}
          {normalized.experience && (
            <span className="px-2 py-1 text-[11px] sm:text-xs font-semibold bg-[#fff1ed] rounded-full">
              {normalized.experience}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-[#fff1ed]">
        <div className="flex gap-3 text-[11px] sm:text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Clock size={12} className="text-[#caa057]" />
            <span>{normalized.postedDate ? new Date(normalized.postedDate).toLocaleDateString() : "—"}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={12} className="text-[#caa057]" />
            <span>{normalized.applicants}</span>
          </span>
        </div>

        {showActions && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={handleApply}
              disabled={applyLoading || isApplied}
              className={`px-4 py-2 rounded-lg font-medium text-xs sm:text-sm w-full sm:w-auto ${
                isApplied
                  ? "bg-green-500 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-[#caa057] to-[#caa057] text-white"
              }`}
            >
              {applyLoading ? "Applying..." : isApplied ? "✅ Applied" : "Apply Now"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleViewDetails(e)
              }}
              className="px-4 py-2 rounded-lg font-medium text-xs sm:text-sm border border-[#caa057] text-[#caa057] w-full sm:w-auto"
            >
              View Details
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const Detail = ({ icon, text }) => (
  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 p-1.5 rounded bg-[#fff1ed]">
    <div className="p-1 rounded bg-white shadow-sm">{icon}</div>
    <span className="truncate">{text || "—"}</span>
  </div>
)

export default JobCard
