"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { MapPin, Briefcase, GraduationCap, IndianRupee, Clock, Users, TrendingUp, BookmarkIcon } from "lucide-react"
import Cookies from "js-cookie"
import { motion } from "framer-motion"
import { BASE_URL } from "../../config"

/**
 * Sanitize job description HTML
 */
function sanitizeHtml(dirty) {
  if (!dirty) return ""

  const parser = new DOMParser()
  const doc = parser.parseFromString(dirty, "text/html")

  const whitelist = {
    P: [],
    BR: [],
    STRONG: [],
    B: [],
    EM: [],
    I: [],
    U: [],
    UL: [],
    OL: [],
    LI: [],
    A: ["href"],
  }

  function cleanNode(node) {
    if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent)
    if (node.nodeType !== Node.ELEMENT_NODE) return null

    const tag = node.tagName.toUpperCase()
    if (!whitelist[tag]) {
      const frag = document.createDocumentFragment()
      node.childNodes.forEach((child) => {
        const cleaned = cleanNode(child)
        if (cleaned) frag.appendChild(cleaned)
      })
      return frag
    }

    const el = document.createElement(tag.toLowerCase())
    if (tag === "A") {
      const href = node.getAttribute("href")
      if (href && /^(https?:|mailto:|tel:)/i.test(href)) {
        el.setAttribute("href", href)
        el.setAttribute("target", "_blank")
        el.setAttribute("rel", "noopener noreferrer")
      }
    }
    node.childNodes.forEach((child) => {
      const cleaned = cleanNode(child)
      if (cleaned) el.appendChild(cleaned)
    })
    return el
  }

  const frag = document.createDocumentFragment()
  doc.body.childNodes.forEach((child) => {
    const c = cleanNode(child)
    if (c) frag.appendChild(c)
  })

  const container = document.createElement("div")
  container.appendChild(frag)
  return container.innerHTML
}

const JobCard = ({
  job,
  showActions = true,
  onJobClick,
  isSaved: isSavedFromParent = false,
  isApplied: isAppliedFromParent = false,
  onUpdate,
}) => {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(Boolean(isSavedFromParent))
  const [applied, setApplied] = useState(Boolean(isAppliedFromParent))
  const [loading, setLoading] = useState(false)
  const token = Cookies.get("userToken")
  const [saveFeedback, setSaveFeedback] = useState("")

  // Normalize job fields
  const normalized = {
    id: job.id || job._id || job.raw?._id || job.jobId,
    title: job.title || job.jobTitle || (job.raw && (job.raw.jobTitle || job.raw.title)),
    company:
      job.jobCreatedby?.recruterCompany ||
      job.company ||
      job.companyName ||
      job.raw?.jobCreatedby?.recruterCompany ||
      "Company Name",
    location: job.location || job.jobLocation || job.address || (job.raw && job.raw.location),
    type: job.type || job.jobType,
    qualification: job.qualification || job.Qualification,
    salary: job.salary || job.SalaryIncentive || job.salaryRange,
    description: job.description || job.jobDescription || (job.raw && (job.raw.description || job.raw.jobDescription)),
    category: job.category || job.jobCategory || (job.skills ? job.skills.join(", ") : job.jobSkills),
    experience: job.experience || job.totalExperience || job.relevantExperience,
    postedDate: job.postedDate || job.createdAt || (job.raw && job.raw.createdAt),
    applicants:
      job.applicants ||
      (job.candidatesApplied
        ? Array.isArray(job.candidatesApplied)
          ? job.candidatesApplied.length
          : job.candidatesApplied
        : undefined),
    logo: job.logo || job.companyLogo || "/placeholder.svg",
    featured: job.featured || false,
    skills:
      job.skills ||
      (job.raw && job.raw.jobSkills
        ? Array.isArray(job.raw.jobSkills)
          ? job.raw.jobSkills
          : typeof job.raw.jobSkills === "string"
            ? job.raw.jobSkills.split(",").map((s) => s.trim())
            : []
        : []),
    raw: job.raw || job,
  }

  // 🔥 Reset cache instantly when user changes (login/logout)
  useEffect(() => {
    const resetCache = () => {
      window.__SAVED_IDS = {}
      window.__APPLIED_IDS = {}
      setSaved(false)
      setApplied(false)
    }

    window.addEventListener("userChanged", resetCache)

    return () => {
      window.removeEventListener("userChanged", resetCache)
    }
  }, [])

  // Fetch saved/applied jobs for current user
  useEffect(() => {
    const fetchStatusListsIfNeeded = async () => {
      if (!token) return
      if (isSavedFromParent || isAppliedFromParent) return

      const userKey = `user_${token}`

      try {
        if (!window.__SAVED_IDS) window.__SAVED_IDS = {}
        if (!window.__APPLIED_IDS) window.__APPLIED_IDS = {}

        if (!window.__SAVED_IDS[userKey]) {
          const resp = await fetch(`${BASE_URL}/jobseeker/getsavedJobs`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (resp.ok) {
            const d = await resp.json()
            window.__SAVED_IDS[userKey] = (d.savedJobs || []).map((j) => j._id || j.id)
          } else {
            window.__SAVED_IDS[userKey] = []
          }
        }

        if (!window.__APPLIED_IDS[userKey]) {
          const resp2 = await fetch(`${BASE_URL}/jobseeker/appliedjobs`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (resp2.ok) {
            const d2 = await resp2.json()
            window.__APPLIED_IDS[userKey] = (d2.appliedJobs || []).map((j) => j._id || j.id)
          } else {
            window.__APPLIED_IDS[userKey] = []
          }
        }

        setSaved(Boolean(window.__SAVED_IDS[userKey]?.includes(normalized.id)))
        setApplied(Boolean(window.__APPLIED_IDS[userKey]?.includes(normalized.id)))
      } catch (err) {
        console.error("JobCard status fetch error:", err)
      }
    }

    fetchStatusListsIfNeeded()
  }, [normalized.id, token, isSavedFromParent, isAppliedFromParent])

  // Save / Unsave
  const handleSave = async (e) => {
    e?.stopPropagation()
    if (!token) return alert("❌ Please log in to save jobs.")

    const userKey = `user_${token}`

    try {
      if (!saved) {
        const resp = await fetch(`${BASE_URL}/jobseeker/savejob/${normalized.id}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await resp.json().catch(() => ({}))
        if (!resp.ok) throw new Error(data.message || "Failed to save job")

        window.__SAVED_IDS[userKey] = window.__SAVED_IDS[userKey] || []
        if (!window.__SAVED_IDS[userKey].includes(normalized.id)) window.__SAVED_IDS[userKey].push(normalized.id)
        setSaved(true)
      } else {
        const resp = await fetch(`${BASE_URL}/jobseeker/removesavedjob/${normalized.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await resp.json().catch(() => ({}))
        if (!resp.ok) throw new Error(data.message || "Failed to remove job")

        window.__SAVED_IDS[userKey] = (window.__SAVED_IDS[userKey] || []).filter((id) => id !== normalized.id)
        setSaved(false)
      }

      if (typeof onUpdate === "function") onUpdate()
      window.dispatchEvent(new Event("savedJobsUpdated"))
    } catch (err) {
      console.error("save/unsave error:", err)
      alert("❌ " + (err.message || "Failed to update saved jobs"))
    }
  }

  // Apply
  const handleApply = async (e) => {
    e?.stopPropagation()
    if (applied) return alert("✅ You've already applied for this job.")
    if (!token) return alert("❌ Please log in to apply for jobs.")

    const userKey = `user_${token}`
    setLoading(true)

    try {
      const resp = await fetch(`${BASE_URL}/jobseeker/applyforjob/${normalized.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })
      const data = await resp.json().catch(() => ({}))
      if (!resp.ok) throw new Error(data.message || "Apply failed")

      window.__APPLIED_IDS[userKey] = window.__APPLIED_IDS[userKey] || []
      if (!window.__APPLIED_IDS[userKey].includes(normalized.id)) window.__APPLIED_IDS[userKey].push(normalized.id)

      setApplied(true)

      if (typeof onUpdate === "function") onUpdate()
      window.dispatchEvent(new Event("appliedJobsUpdated"))
      alert("✅ Application submitted!")
    } catch (err) {
      console.error("apply error:", err)
      alert("❌ " + (err.message || "Failed to apply"))
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (e) => {
    e?.stopPropagation()
    if (typeof onJobClick === "function") {
      onJobClick(normalized)
    } else {
      navigate(`/jobs/${normalized.id}`, { state: { job: normalized } })
    }
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
          {/* <button
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg"
          >
            <Share2 size={16} className="text-gray-500" />
          </button> */}

          {/* Save button with animation */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              handleSave(e)
            }}
            whileTap={{ scale: 0.8 }}
            animate={{ scale: saved ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.3 }}
            className="p-1.5 rounded-lg relative"
          >
            <BookmarkIcon size={18} className={saved ? "text-[#caa057] fill-[#caa057]" : "text-gray-500"} />
          </motion.button>
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
      {normalized.category && (
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className="px-2 py-1 text-[11px] sm:text-xs font-semibold bg-[#fff1ed] rounded-full">
            {normalized.category}
          </span>
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
            <span>{normalized.applicants || "—"}</span>
          </span>
        </div>

        {showActions && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={handleApply}
              disabled={loading || applied}
              className={`px-4 py-2 rounded-lg font-medium text-xs sm:text-sm w-full sm:w-auto ${
                applied
                  ? "bg-green-500 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-[#caa057] to-[#caa057] text-white"
              }`}
            >
              {loading ? "Applying..." : applied ? "✅ Applied" : "Apply Now"}
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