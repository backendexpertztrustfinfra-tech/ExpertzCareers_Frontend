"use client"

import { useState, useEffect, useCallback } from "react"
import Cookies from "js-cookie"
import CandidateCard from "../Database/CandidateCard"
import CandidateMiniCard from "../Database/CandidateMiniCard"
import {
  getAppliedUser,
  getSavedCandidates,
  saveCandidate,
  rejectCandidate,
  sendNotification,
} from "../../../services/apis"
import { Listbox } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid"
import Slider from "rc-slider"
import "rc-slider/assets/index.css"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const parseSkills = (skillField) => {
  if (!skillField) return []
  if (Array.isArray(skillField))
    return skillField
      .filter(Boolean)
      .map((s) => (typeof s === "string" ? s : s?.name || s?.skill || "").trim())
      .filter(Boolean)
  if (typeof skillField === "string") {
    try {
      const arr = JSON.parse(skillField)
      if (Array.isArray(arr))
        return arr
          .filter(Boolean)
          .map((s) => (typeof s === "string" ? s : s?.name || s?.skill || "").trim())
          .filter(Boolean)
    } catch {}
    return skillField
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return []
}

const parseQualOrExpArray = (field) => {
  if (!field) return []
  if (Array.isArray(field)) return field
  if (typeof field === "string") {
    const low = field.trim().toLowerCase()
    if (!low || low === "not provided" || low === "not specified") return []
    return field
      .split("@")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        try {
          const fixed = item.replace(/'/g, '"').replace(/(\b\w+\b)\s*:/g, '"$1":')
          return JSON.parse(fixed)
        } catch {
          return { degree: item }
        }
      })
      .filter(Boolean)
  }
  if (typeof field === "object") return [field]
  return []
}

const CandidateView = ({ selectedJob, showAllSaved = false }) => {
  const token = Cookies.get("userToken")
  const [appliedCandidates, setAppliedCandidates] = useState([])
  const [savedCandidates, setSavedCandidates] = useState([])
  const [rejectedCandidates, setRejectedCandidates] = useState([])
  const [savedCandidateIds, setSavedCandidateIds] = useState(new Set())
  const [tab, setTab] = useState("Applied")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeCandidate, setActiveCandidate] = useState(null)

  const locations = ["Remote", "Onsite", "Hybrid"]
  const qualifications = ["B.Tech", "MBA", "MCA", "Diploma", "Other"]
  const skillsList = ["React", "Node.js", "Python", "Java", "SQL", "AWS"]

  const [filters, setFilters] = useState({
    location: "",
    qualification: "",
    customQualification: "",
    distance: 0,
    skills: [],
    customSkill: "",
    experience: 0,
    dateFrom: "",
    dateTo: "",
  })

  const transformCandidateData = useCallback((candidatesArray) => {
    if (!Array.isArray(candidatesArray)) {
      console.error("Expected array, got:", typeof candidatesArray, candidatesArray)
      return []
    }

    return candidatesArray.map((item) => {
      const user = item.userId || item
      const applicationData = item.userId ? item : {}
      const skillsArray = parseSkills(user.Skill ?? user.skills ?? item.skills)
      const qualificationRaw = user.qualification ?? ""
      const experienceRaw = user.Experience ?? user.experience ?? ""
      const quals = parseQualOrExpArray(qualificationRaw)
      const qualificationText = quals.length
        ? quals
            .map((q) => {
              const deg = q.degree || q.title || ""
              const inst = q.institution || q.instution || ""
              return [deg, inst].filter(Boolean).join(" - ")
            })
            .filter(Boolean)
            .join(", ")
        : typeof qualificationRaw === "string"
        ? qualificationRaw
        : "Not Provided"

      let experienceYears = 0
      if (user.yearsofExperience) {
        const match = String(user.yearsofExperience).match(/(\d+)/)
        experienceYears = match ? Number(match[1]) : 0
      }

      // FIX: Ensure all links (introvideo, portfolio, certification) are retrieved
      // from all possible locations (user root, user.candidate, or applicationData)

      const introvideo = 
        user.introvideo ||              // Check user root (Database View style)
        user.candidate?.introvideo ||   // Check user.candidate (Applied User style)
        null;
        
      const certificationlink = 
        user.certificationlink ||              // Check user root
        user.candidate?.certificationlink ||   // Check user.candidate
        null;

      const portfioliolink = 
        user.portfioliolink || 
        user.portfoliolink ||               // Check user root
        user.candidate?.portfioliolink ||   // Check user.candidate
        user.candidate?.portfoliolink ||    // Check user.candidate (typo check)
        null;


      return {
        _id: user._id || user.id,
        username: user.username || "No Name",
        useremail: user.useremail || "No Email",
        designation: user.designation || "No Designation",
        qualification: qualificationRaw,
        qualificationText,
        experience: experienceRaw,
        experienceYears,
        skills: skillsArray,
        location: user.location || "Not Provided",
        // expectedSalary: user.salaryExpectation || user.expectedSalary || "N/A",
        phonenumber: user.phonenumber || "Not Provided",
        resume: user.resume || null,
        
        // --- UPDATED LINKS ---
        introvideo: introvideo,
        certificationlink: certificationlink,
        portfioliolink: portfioliolink, 
        // ---------------------

        profilePhoto: user.profilphoto || user.profilePhoto || null,
        appliedDate: applicationData.appliedAt || user.appliedDate || user.createdAt || new Date().toISOString(),
        status: applicationData.status || "applied",
        jobId: applicationData.jobId || item.jobId || null,
      }
    })
  }, []) 

  const fetchCandidates = useCallback(
    async (apiCall, setter, jobId = null) => {
      if (!token) {
        setError("Please log in to view candidates")
        return
      }
      setLoading(true)
      setError(null)

      try {
        const data = await apiCall(token, jobId)
        let candidatesArray = []
        if (data?.candidatesApplied && Array.isArray(data.candidatesApplied)) {
          candidatesArray = data.candidatesApplied
        } else if (data?.user?.savedCandidates && Array.isArray(data.user.savedCandidates)) {
          candidatesArray = data.user.savedCandidates
        } else if (Array.isArray(data)) {
          candidatesArray = data
        } else {
          console.warn("Unexpected response structure:", data)
        }
        setter(transformCandidateData(candidatesArray))
      } catch (err) {
        console.error("Error fetching candidates:", err)
        setError(`Failed to load candidates: ${err.message}`)
        setter([])
      } finally {
        setLoading(false)
      }
    },
    [token, transformCandidateData],
  )

  const handleFetchApplied = useCallback(() => {
    if (selectedJob && selectedJob._id) {
      fetchCandidates(
        getAppliedUser,
        (candidates) => {
          const applied = candidates.filter((c) => c.status !== "rejected")
          const rejected = candidates.filter((c) => c.status === "rejected")
          setAppliedCandidates(applied)
          setRejectedCandidates(rejected)
        },
        selectedJob._id,
      )
    }
  }, [selectedJob, fetchCandidates])

  const handleFetchSaved = useCallback(async () => {
    if (!token) return
    try {
      const data = await getSavedCandidates(token)
      let candidatesArray = []
      if (data?.user?.savedCandidates && Array.isArray(data.user.savedCandidates)) {
        candidatesArray = data.user.savedCandidates
      } else if (data?.savedCandidates && Array.isArray(data.savedCandidates)) {
        candidatesArray = data.savedCandidates
      } else if (Array.isArray(data)) {
        candidatesArray = data
      }
      const transformed = transformCandidateData(candidatesArray)
      const filteredByJob =
        showAllSaved || !selectedJob
          ? transformed
          : transformed.filter((c) => c.jobId === selectedJob._id || c.jobId === selectedJob.id)

      setSavedCandidates(filteredByJob)
      setSavedCandidateIds(new Set(transformed.map((c) => c._id).filter(Boolean)))
    } catch (err) {
      console.error("❌ Error fetching saved candidates:", err)
      setSavedCandidates([])
      setSavedCandidateIds(new Set())
    }
  }, [token, transformCandidateData, showAllSaved, selectedJob])

  const handleRejectCandidate = async (candidateId) => {
    if (!candidateId) {
      console.error("Cannot reject candidate: Missing candidate ID")
      toast.error("Candidate ID is missing!")
      return
    }

    try {
      const candidate =
        appliedCandidates.find((c) => c._id === candidateId) || savedCandidates.find((c) => c._id === candidateId)

      if (!candidate) throw new Error("Candidate not found")
      const jobId = selectedJob._id || selectedJob.id

      await fetch(`https://expertzcareers-backend.onrender.com/recruiter/updateapplyjobstatus/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ candidateId, status: "rejected" }),
      })

      await rejectCandidate(token, candidateId, jobId)

      if (token && selectedJob) {
        await sendNotification({
          token,
          type: "REJECTED",
          userId: candidateId,
          extraData: { job: selectedJob },
        })
      }

      const rejectedCandidate = { ...candidate, status: "rejected" }
      setRejectedCandidates((prev) => [...prev, rejectedCandidate])
      setAppliedCandidates((prev) => prev.filter((c) => c._id !== candidateId))
      setSavedCandidates((prev) => prev.filter((c) => c._id !== candidateId))
      setSavedCandidateIds((prev) => {
        const next = new Set(prev)
        next.delete(candidateId)
        return next
      })

      if (activeCandidate?._id === candidateId) setActiveCandidate(null)
      toast.success("Candidate rejected successfully!")
    } catch (err) {
      console.error("❌ Error rejecting candidate:", err)
      setError(`Failed to reject candidate: ${err.message}`)
      toast.error("Failed to reject candidate!")
    }
  }

  const handleMiniCardClick = async (candidate) => {
    if (!candidate || !candidate._id) return
    setActiveCandidate(candidate)
    if (token && selectedJob) {
      try {
        await sendNotification({
          token,
          type: "VIEWED",
          userId: candidate._id,
          extraData: { job: selectedJob },
        })
      } catch (err) {
        console.error("Failed to send view notification:", err)
      }
    }
  }

  const handleSaveCandidate = async (candidateId) => {
    if (!candidateId) {
      console.error("[v0] handleSaveCandidate: Missing candidate ID")
      toast.error("Candidate ID is missing!")
      return
    }
    if (!token) {
      console.error("[v0] handleSaveCandidate: Missing token")
      toast.error("You are not authenticated!")
      return
    }
    if (savedCandidateIds.has(candidateId)) {
      toast.info("Candidate is already saved!")
      return
    }

    try {
      const response = await saveCandidate(token, candidateId)
      if (response.alreadySaved) {
        setSavedCandidateIds((prev) => new Set([...prev, candidateId]))
        toast.info("Candidate was already saved!")
        setTimeout(() => handleFetchSaved(), 500)
        return
      }

      const candidateToSave = appliedCandidates.find((c) => c._id === candidateId)
      if (candidateToSave) {
        setSavedCandidates((prev) => (prev.some((c) => c._id === candidateId) ? prev : [...prev, candidateToSave]))
        setSavedCandidateIds((prev) => new Set([...prev, candidateId]))
        toast.success("Candidate saved successfully!")
        setTimeout(() => {
          setTab("Saved")
          setActiveCandidate(candidateToSave)
        }, 500)
      } else {
        setSavedCandidateIds((prev) => new Set([...prev, candidateId]))
        toast.success("Candidate saved successfully!")
      }
      setTimeout(() => handleFetchSaved(), 1000)
    } catch (err) {
      console.error("[v0] Error saving candidate:", err)
      if (err?.message?.toLowerCase().includes("already saved")) {
        setSavedCandidateIds((prev) => new Set([...prev, candidateId]))
        toast.info("Candidate is already saved!")
        setTimeout(() => handleFetchSaved(), 500)
      } else if (err?.response?.status === 500) {
        toast.error("Server error! Please try again later.")
      } else {
        toast.error(`Failed to save candidate: ${err.message}`)
      }
    }
  }

  const handleTabChange = (t) => {
    setTab(t)
    setError(null)
    setActiveCandidate(null)
    if (t === "Saved") handleFetchSaved()
    else handleFetchApplied()
  }

  useEffect(() => {
    if (token) handleFetchSaved()
  }, [token, handleFetchSaved])

  useEffect(() => {
    if (selectedJob && token) handleFetchApplied()
  }, [selectedJob, token, handleFetchApplied])

  const resetFilters = useCallback(() => {
    setFilters({
      location: "",
      qualification: "",
      customQualification: "",
      distance: 0,
      skills: [],
      customSkill: "",
      experience: 0,
      dateFrom: "",
      dateTo: "",
    })
  }, [])

  const toggleSkill = (skill) => {
    setFilters((prev) =>
      prev.skills.includes(skill)
        ? { ...prev, skills: prev.skills.filter((s) => s !== skill) }
        : { ...prev, skills: [...prev.skills, skill] },
    )
  }

  const candidatesToShow =
    tab === "Applied" ? appliedCandidates : tab === "Rejected" ? rejectedCandidates : savedCandidates

  const filteredCandidates = candidatesToShow.filter((c) => {
    const skillsMatch =
      !filters.skills.length ||
      filters.skills.every((s) =>
        (c.skills || []).some((skill) => String(skill).toLowerCase().includes(String(s).toLowerCase())),
      )

    const customSkillMatch =
      !filters.customSkill ||
      (c.skills || []).some((s) => String(s).toLowerCase().includes(String(filters.customSkill).toLowerCase()))

    const locationMatch =
      !filters.location ||
      String(c.location || "")
        .toLowerCase()
        .includes(String(filters.location).toLowerCase())

    const qualSource = c.qualificationText || (typeof c.qualification === "string" ? c.qualification : "")
    const qualificationMatch =
      !filters.qualification || String(qualSource).toLowerCase().includes(String(filters.qualification).toLowerCase())

    const customQualificationMatch =
      !filters.customQualification ||
      String(qualSource).toLowerCase().includes(String(filters.customQualification).toLowerCase())

    const experienceMatch = !filters.experience || Number(c.experienceYears || 0) >= Number(filters.experience)
    const distanceMatch = filters.distance === 0 || Number(c.distance || 999) <= Number(filters.distance)

    let dateMatch = true
    if (filters.dateFrom || filters.dateTo) {
      try {
        const applied = new Date(c.appliedDate)
        if (filters.dateFrom) {
          const from = new Date(filters.dateFrom)
          from.setHours(0, 0, 0, 0)
          dateMatch = dateMatch && applied >= from
        }
        if (filters.dateTo) {
          const to = new Date(filters.dateTo)
          to.setHours(23, 59, 59, 999)
          dateMatch = dateMatch && applied <= to
        }
      } catch {}
    }

    return (
      locationMatch &&
      qualificationMatch &&
      customQualificationMatch &&
      experienceMatch &&
      distanceMatch &&
      skillsMatch &&
      customSkillMatch &&
      dateMatch
    )
  })

  if (!selectedJob && !showAllSaved) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 text-center text-gray-500">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-lg font-medium mb-2">Please select a job first to view candidates.</p>
        <p className="text-sm text-gray-400">Choose a job from the Job Listings to see applied and saved candidates.</p>
      </div>
    )
  }

  return (
    <div className="flex gap-6 flex-col md:flex-row">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Filters */}
      <div className="w-full md:w-1/4 bg-white rounded-lg shadow p-5 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          {(filters.location ||
            filters.qualification ||
            filters.customQualification ||
            filters.distance > 0 ||
            filters.skills.length > 0 ||
            filters.customSkill ||
            filters.experience > 0 ||
            filters.dateFrom ||
            filters.dateTo) && (
            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">Active</span>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Location</label>
          <Listbox value={filters.location} onChange={(value) => setFilters({ ...filters, location: value })}>
            <div className="relative">
              <Listbox.Button className="w-full border rounded-full py-2 px-3 text-left bg-gray-50">
                <span>{filters.location || "Select Location"}</span>
                <span className="absolute right-2 inset-y-0 flex items-center pointer-events-none">
                  <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
                {locations.map((loc) => (
                  <Listbox.Option
                    key={loc}
                    value={loc}
                    className={({ active }) => `cursor-pointer px-3 py-2 ${active ? "bg-blue-100" : ""}`}
                  >
                    {({ selected }) => (
                      <span className="flex items-center gap-2">
                        {selected && <CheckIcon className="w-4 h-4 text-blue-600" />}
                        {loc}
                      </span>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        <div>
          <label className="block text-sm mb-1">Qualification</label>
          <Listbox
            value={filters.qualification}
            onChange={(value) =>
              setFilters({
                ...filters,
                qualification: value,
                customQualification: value === "Other" ? filters.customQualification : "",
              })
            }
          >
            <div className="relative">
              <Listbox.Button className="w-full border rounded-full py-2 px-3 text-left bg-gray-50">
                <span>{filters.qualification || "Select Qualification"}</span>
                <span className="absolute right-2 inset-y-0 flex items-center pointer-events-none">
                  <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
                {qualifications.map((q) => (
                  <Listbox.Option
                    key={q}
                    value={q}
                    className={({ active }) => `cursor-pointer px-3 py-2 ${active ? "bg-blue-100" : ""}`}
                  >
                    {({ selected }) => (
                      <span className="flex items-center gap-2">
                        {selected && <CheckIcon className="w-4 h-4 text-blue-600" />}
                        {q}
                      </span>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
          {filters.qualification === "Other" && (
            <input
              type="text"
              placeholder="Enter qualification..."
              value={filters.customQualification}
              onChange={(e) => setFilters({ ...filters, customQualification: e.target.value })}
              className="w-full mt-2 border rounded-full py-2 px-3 text-sm bg-gray-50"
            />
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Max Distance: {filters.distance} km</label>
          <Slider
            min={0}
            max={100}
            value={filters.distance}
            onChange={(val) => setFilters({ ...filters, distance: val })}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Min Experience: {filters.experience} years</label>
          <Slider
            min={0}
            max={20}
            value={filters.experience}
            onChange={(val) => setFilters({ ...filters, experience: val })}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Skills</label>
          <div className="flex flex-wrap gap-2">
            {skillsList.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  filters.skills.includes(skill)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Enter other skill..."
            value={filters.customSkill}
            onChange={(e) => setFilters({ ...filters, customSkill: e.target.value })}
            className="w-full mt-2 border rounded-full py-2 px-3 text-sm bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 font-medium text-gray-700">Applied Date Range</label>
          <div className="space-y-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-full border rounded-lg py-2 px-3 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-full border rounded-lg py-2 px-3 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <button
          onClick={resetFilters}
          className="w-full bg-gradient-to-r from-[#caa057] via-[#caa057] to-[#caa057] text-white py-2 rounded-lg hover:bg-[#caa057] transition-colors"
        >
          Clear Filters
        </button>
      </div>

      {/* List / Details */}
      <div className="w-full md:w-3/4">
        {selectedJob && (
          <div className="mb-4 p-4 bg-gradient-to-r from-[#caa057] to-[#b4924c] text-white rounded-lg shadow">
            <h2 className="text-xl font-bold">{selectedJob.jobTitle || selectedJob.title}</h2>
            <p className="text-sm opacity-90">{selectedJob.company || selectedJob.companyName}</p>
          </div>
        )}

        <div className="flex gap-3 mb-6">
          {["Applied", "Rejected"].map((t) => (
            <button
              key={t}
              className={`px-5 py-2 rounded-full font-medium shadow-sm transition-colors ${
                tab === t
                  ? "bg-gradient-to-r from-[#caa057] to-[#caa057] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => handleTabChange(t)}
            >
              {t} Candidates (
              {t === "Applied"
                ? appliedCandidates.length
                : t === "Rejected"
                ? rejectedCandidates.length
                : savedCandidates.length}
              )
            </button>
          ))}
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

        {loading && (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p className="ml-3 text-gray-600">Loading candidates...</p>
          </div>
        )}

        {!loading && (
          <div className="space-y-4">
            {activeCandidate ? (
              <div>
                <button onClick={() => setActiveCandidate(null)} className="mb-4 text-sm text-blue-600 hover:underline">
                  ← Back to list
                </button>
                <CandidateCard
                  candidate={activeCandidate}
                  onSave={() => handleSaveCandidate(activeCandidate._id)}
                  onReject={() => handleRejectCandidate(activeCandidate._id)}
                  isSaved={savedCandidateIds.has(activeCandidate._id)}
                  selectedJob={selectedJob}
                  token={token}
                />
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <div className="text-5xl mb-4">{candidatesToShow.length === 0 ? "📭" : "🔍"}</div>
                <p className="text-lg font-medium mb-2">
                  {candidatesToShow.length === 0
                    ? `No ${tab.toLowerCase()} candidates found.`
                    : "No candidates match your filters."}
                </p>
                {candidatesToShow.length > 0 && (
                  <button onClick={resetFilters} className="text-orange-600 hover:text-orange-700 underline">
                    Clear filters to see all candidates
                  </button>
                )}
              </div>
            ) : (
              filteredCandidates.map((candidate) => (
                <CandidateMiniCard
                  key={candidate._id}
                  candidate={candidate}
                  onClick={() => handleMiniCardClick(candidate)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CandidateView