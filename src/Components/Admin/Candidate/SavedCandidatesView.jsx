"use client"

import { useState, useEffect, useCallback } from "react"
import Cookies from "js-cookie"
import CandidateCard from "../Database/CandidateCard"
import CandidateMiniCard from "../Database/CandidateMiniCard"
import { getSavedCandidates } from "../../../services/apis"
import { Listbox } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid"
import Slider from "rc-slider"
import "rc-slider/assets/index.css"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// --- Helper Functions from Previous Logic (Re-implemented for Consistency) ---

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

// --- Main Component ---
const SavedCandidatesView = () => {
  const token = Cookies.get("userToken")
  const [savedCandidates, setSavedCandidates] = useState([])
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

  // FIX: Updated to use the comprehensive transformCandidateData logic
  const transformCandidateData = useCallback((candidatesArray) => {
    if (!Array.isArray(candidatesArray)) {
      console.error("Expected array, got:", typeof candidatesArray, candidatesArray)
      return []
    }

    return candidatesArray.map((item) => {
      const user = item.userId || item // User object is often item.userId or item itself
      const applicationData = item.userId ? item : {}

      // Comprehensive Data Parsing (Qualification, Experience, Skills)
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

      // FIX: Combined link fetching logic from all previous versions for maximum compatibility
      const introvideo = 
        user.introvideo ||              // Check user root
        user.candidate?.introvideo ||   // Check user.candidate
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
        
        // Use raw fields for complex parsing in cards, and Text for filtering/display
        qualification: qualificationRaw, 
        qualificationText, // Used for filtering
        experience: experienceRaw,
        experienceYears, // Used for filtering
        
        skills: skillsArray,
        location: user.location || "Not Provided",
        expectedSalary: user.salaryExpectation || user.expectedSalary || "N/A",
        phonenumber: user.phonenumber || "Not Provided",
        resume: user.resume || null,
        
        // --- ALL LINKS NOW INCLUDED ---
        introvideo: introvideo,
        certificationlink: certificationlink,
        portfioliolink: portfioliolink, 
        // ------------------------------

        profilePhoto: user.profilphoto || user.profilePhoto || null,
        appliedDate: applicationData.appliedAt || user.appliedDate || user.createdAt || new Date().toISOString(),
        status: applicationData.status || "saved",
        jobId: applicationData.jobId || item.jobId || null,
      }
    })
  }, []) // Dependency array is correctly empty

  const fetchSavedCandidates = useCallback(async () => {
    if (!token) {
      setError("Please log in to view saved candidates")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getSavedCandidates(token)
      console.log("[v0] Raw saved candidates response:", data)

      let candidatesArray = []

      if (data?.user?.savedCandidates && Array.isArray(data.user.savedCandidates)) {
        candidatesArray = data.user.savedCandidates
      } else if (data?.savedCandidates && Array.isArray(data.savedCandidates)) {
        candidatesArray = data.savedCandidates
      } else if (Array.isArray(data)) {
        candidatesArray = data
      }

      const transformed = transformCandidateData(candidatesArray)
      setSavedCandidates(transformed)
      console.log("[v0] All saved candidates loaded:", transformed.length)
    } catch (err) {
      console.error("Error fetching saved candidates:", err)
      setError(`Failed to load saved candidates: ${err.message}`)
      setSavedCandidates([])
    } finally {
      setLoading(false)
    }
  }, [token, transformCandidateData]) // Dependencies are token and transformCandidateData

  const handleRemoveFromSaved = async (candidateId) => {
    // NOTE: This function currently only updates the UI and calls fetch. 
    // It should ideally call an API endpoint to unsave the candidate first.
    if (!candidateId) {
      toast.error("Candidate ID is missing!")
      return
    }

    try {
      // Assuming you will implement the unsave API call here, e.g.:
      // await unsaveCandidate(token, candidateId); 

      // Remove from saved list locally
      setSavedCandidates((prev) => prev.filter((c) => c._id !== candidateId))

      if (activeCandidate?._id === candidateId) {
        setActiveCandidate(null)
      }

      toast.success("Candidate removed from saved list!")
      console.log(`[v0] Candidate removed from saved list`)

      // Refresh the list to sync with backend (Keeping fetch for now, though direct state update is better)
      setTimeout(() => {
        fetchSavedCandidates()
      }, 500)
    } catch (err) {
      console.error("Error removing candidate:", err)
      toast.error("Failed to remove candidate!")
      // In a real app, you would rollback the UI change here if the API failed.
    }
  }

  const handleMiniCardClick = (candidate) => {
    if (!candidate || !candidate._id) {
      console.error("Invalid candidate data")
      return
    }
    setActiveCandidate(candidate)
  }

  useEffect(() => {
    if (token) {
      fetchSavedCandidates()
    }
  }, [token, fetchSavedCandidates])

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
    setFilters((prev) => {
      if (prev.skills.includes(skill)) {
        return { ...prev, skills: prev.skills.filter((s) => s !== skill) }
      } else {
        return { ...prev, skills: [...prev.skills, skill] }
      }
    })
  }
  
  // NOTE: Filtering now uses qualificationText and experienceYears provided by transformCandidateData
  const filteredCandidates = savedCandidates.filter((c) => {
    const skillsMatch =
      !filters.skills.length ||
      filters.skills.every((s) => c.skills?.some((skill) => skill.toLowerCase().includes(s.toLowerCase())))

    const customSkillMatch =
      !filters.customSkill || c.skills?.some((s) => s.toLowerCase().includes(filters.customSkill.toLowerCase()))

    const locationMatch = !filters.location || c.location?.toLowerCase().includes(filters.location.toLowerCase())

    const qualSource = c.qualificationText || (typeof c.qualification === "string" ? c.qualification : "")
    const qualificationMatch =
      !filters.qualification || qualSource.toLowerCase().includes(filters.qualification.toLowerCase())

    const customQualificationMatch =
      !filters.customQualification || qualSource.toLowerCase().includes(filters.customQualification.toLowerCase())

    const experienceMatch = !filters.experience || Number(c.experienceYears || 0) >= Number(filters.experience)

    const distanceMatch = filters.distance === 0 || Number(c.distance || 999) <= Number(filters.distance)

    let dateMatch = true
    if (filters.dateFrom || filters.dateTo) {
      try {
        const appliedDate = new Date(c.appliedDate)
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom)
          fromDate.setHours(0, 0, 0, 0)
          dateMatch = dateMatch && appliedDate >= fromDate
        }
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo)
          toDate.setHours(23, 59, 59, 999)
          dateMatch = dateMatch && appliedDate <= toDate
        }
      } catch (err) {
        console.error("Error parsing date:", err)
      }
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

  return (
    <div className="flex gap-6 flex-col md:flex-row">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Filters Sidebar */}
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
          <label className="block text-sm mb-1 font-medium text-gray-700">Saved Date Range</label>
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

      {/* Main Content */}
      <div className="w-full md:w-3/4">
        <div className="mb-4 p-4 bg-gradient-to-r from-[#caa057] to-[#b4924c] text-white rounded-lg shadow">
          <h2 className="text-2xl font-bold">All Saved Candidates</h2>
          <p className="text-sm opacity-90">View and manage all your saved candidates across all jobs</p>
        </div>

        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-800">{savedCandidates.length}</p>
              <p className="text-sm text-gray-600">Total Saved Candidates</p>
            </div>
            <div className="text-4xl">💾</div>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

        {loading && (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p className="ml-3 text-gray-600">Loading saved candidates...</p>
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
                  onSave={() => handleRemoveFromSaved(activeCandidate._id)}
                  onReject={() => handleRemoveFromSaved(activeCandidate._id)}
                  isSaved={true}
                  selectedJob={null}
                  token={token}
                />
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <div className="text-5xl mb-4">{savedCandidates.length === 0 ? "📭" : "🔍"}</div>
                <p className="text-lg font-medium mb-2">
                  {savedCandidates.length === 0 ? "No saved candidates found." : "No candidates match your filters."}
                </p>
                {savedCandidates.length > 0 && (
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

export default SavedCandidatesView