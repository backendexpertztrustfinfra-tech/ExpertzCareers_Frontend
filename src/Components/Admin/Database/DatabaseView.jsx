"use client";

import { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import CandidateCard from "./CandidateCard";
import { saveCandidate, getSavedCandidates } from "../../../services/apis";
import { BASE_URL } from "../../../config";
import toast, { Toaster } from 'react-hot-toast'; 
import { Listbox } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon, FunnelIcon } from "@heroicons/react/20/solid"

// --- Utility Components and Constants ---

const Slider = ({ min, max, value, onChange }) => (
  <input
    type="range"
    min={min}
    max={max}
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
    className="w-full h-2 bg-[#caa057] bg-opacity-30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-[#caa057] [&::-moz-range-thumb]:bg-[#caa057]"
  />
)

const locations = ["New Delhi", "Mumbai", "Bangalore", "Chennai", "Remote", "Pune", "Hyderabad", "Enter Location"]
const qualifications = ["B.Tech", "M.Tech", "MBA", "BCA", "B.Sc", "Other"]
const skillsList = ["React", "Node.js", "JavaScript", "Python", "Java", "SQL", "Cloud", "Data Science"]

const parseQualOrExp = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === "string") {
    return field
      .split("@")
      .map((item) => {  
        try {
          const fixed = item.replace(/'/g, '"');
          return JSON.parse(fixed);
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);
  }
  if (typeof field === "object") return [field];
  return [];
};

// --- API Calls (Moved for clarity, though kept unchanged) ---
export const getActiveSubscription = async () => {
// ... (Your existing API code for getActiveSubscription) ...
  try {
    const token = Cookies.get("userToken");
    if (!token) throw new Error("Authentication token not found.");
    const res = await fetch(`${BASE_URL}/recruiter/getActiveSubscription`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(data.message || "Failed to fetch active subscription");
    return data;
  } catch (err) {
    console.error("❌ getActiveSubscription API Error:", err.message);
    return { subscription: null };
  }
};

export const getDbPointUser = async () => {
// ... (Your existing API code for getDbPointUser) ...
  try {
    const token = Cookies.get("userToken");
    if (!token) throw new Error("Authentication token not found.");
    const res = await fetch(`${BASE_URL}/recruiter/dbpointUser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to fetch DB points");

    if (Array.isArray(data.users)) return data.users;
    if (Array.isArray(data.details)) return data.details;
    if (Array.isArray(data)) return data;

    return [];
  } catch (err) {
    console.error("❌ getDbPointUser API Error:", err.message);
    return [];
  }
};

const initialFilters = {
  location: "",
  customLocation: "", 
  qualification: "",
  customQualification: "",
  skills: [],
  customSkill: "",
  experience: 0, 
  dateFrom: "",
  dateTo: "",
}

// --- Main Component ---
const DatabaseView = ({ onShowPlan }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [candidates, setCandidates] = useState([]);
  // visibleCandidates state is now largely managed by useMemo, but we keep it 
  // for the initial load structure. However, it's safer to remove it to avoid confusion 
  // and rely on the filtered/limited list calculated below.
  // const [visibleCandidates, setVisibleCandidates] = useState([]); 
  const [savedCandidates, setSavedCandidates] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState(initialFilters)

  const token = Cookies.get("userToken");

  // --- Missing Filter Handlers ---
  const resetFilters = () => {
    setSearchTerm("");
    setFilters(initialFilters);
  };

  const toggleSkill = (skill) => {
    setFilters((prev) => {
      const newSkills = prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills: newSkills };
    });
  };
  // --- End Filter Handlers ---


  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const subResult = await getActiveSubscription();
        setSubscriptionDetails(subResult.subscription);

        if (subResult.subscription) {
          const dbResult = await getDbPointUser();
          const rawCandidates = Array.isArray(dbResult) ? dbResult : [];
          
          // Data Transformation
          const transformedCandidates = rawCandidates.map((candidate) => {
            const skillsArray = candidate.Skill
              ? Array.isArray(candidate.Skill)
                ? candidate.Skill
                : candidate.Skill.split(",").map((s) => s.trim())
              : [];
            const qualificationsArray = parseQualOrExp(candidate.qualification);
            const latestQualification = qualificationsArray[0]?.degree || candidate.qualification || "Not Provided";
            const totalExperience = candidate.yearsofExperience || 0; 

            return {
              _id: candidate._id,
              username: candidate.username || "No Name",
              location: candidate.location || "Not Provided",
              displayQualification: latestQualification, 
              displayExperience: totalExperience, 
              skills: skillsArray,
              previousCompany: candidate.previousCompany || "Not Provided",
              appliedDate: candidate.appliedDate || new Date().toISOString(),
              // Retain other candidate properties here
              expectedSalary: candidate.salaryExpectation || "N/A",
              lastActive: candidate.lastActive || "Recently",
              phonenumber: candidate.phonenumber || "Not Provided",
              introvideo: candidate.introvideo || null,
              resume: candidate.resume || null,
              portfioliolink: candidate.portfioliolink || null,
              certificationlink: candidate.certificationlink || null,
              profilePhoto: candidate.profilphoto || null,
            };
          });

          setCandidates(transformedCandidates);
          setShowOverlay(false);

          try {
            const savedData = await getSavedCandidates(token);
            setSavedCandidates(savedData?.savedCandidates || []);
          } catch (err) {
            console.error("Error fetching saved candidates:", err);
          }
        } else {
          setCandidates([]);
          setShowOverlay(true);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setShowOverlay(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [token]);

  const handleSaveCandidate = async (candidateId) => {
    // Use the main candidates list for a consistent source of truth
    const candidateToSave = candidates.find((c) => c._id === candidateId);
    const isCurrentlySaved = savedCandidates.some((c) => c._id === candidateId);

    // Optimistic UI Update (Reverted on failure in toast.promise)
    if (isCurrentlySaved) {
        setSavedCandidates((prev) => prev.filter((c) => c._id !== candidateId));
    } else if (candidateToSave) {
        setSavedCandidates((prev) => [...prev, candidateToSave]);
    }

    const promise = saveCandidate(token, candidateId);

    toast.promise(promise, {
        loading: isCurrentlySaved ? 'Removing from saved...' : 'Saving candidate...',
        success: (response) => {
            // Final UI confirmation (and correction if needed)
            if (response.message.includes('removed') || response.message.includes('unsaved')) {
                 setSavedCandidates((prev) => prev.filter((c) => c._id !== candidateId));
                 return <b>Candidate removed from saved list!</b>;
            } else {
                 if (candidateToSave && !savedCandidates.some((c) => c._id === candidateId)) {
                     setSavedCandidates((prev) => [...prev, candidateToSave]);
                 }
                 return <b>Candidate saved successfully!</b>;
            }
        },
        error: (err) => {
            // Revert optimistic UI update on failure
            if (isCurrentlySaved) {
                setSavedCandidates((prev) => [...prev, candidateToSave]); 
            } else {
                 setSavedCandidates((prev) => prev.filter((c) => c._id !== candidateId));
            }
            return <b>Failed to save candidate. Please try again.</b>;
        },
    });
 };

  const handleViewPlansClick = () => {
    onShowPlan();
  };


  // --- Filtering Logic using useMemo ---
  const areFiltersActive = useMemo(() => {
    return (
      searchTerm ||
      filters.location ||
      filters.customLocation ||
      filters.qualification ||
      filters.customQualification ||
      filters.skills.length > 0 ||
      filters.customSkill ||
      filters.experience > 0 ||
      filters.dateFrom ||
      filters.dateTo
    )
  }, [searchTerm, filters])

  const filteredCandidates = useMemo(() => {
    let list = candidates
    const search = searchTerm.toLowerCase().trim()

    // 1. Apply Search Term Filter
    if (search) {
      list = list.filter((c) => {
        return (
          c.username.toLowerCase().includes(search) ||
          c.location.toLowerCase().includes(search) ||
          c.displayQualification.toLowerCase().includes(search) ||
          c.skills.some((skill) => skill.toLowerCase().includes(search)) ||
          c.previousCompany.toLowerCase().includes(search)
        )
      })
    }

    // 2. Apply Sidebar Filters
    list = list.filter((c) => {
      const cLocation = c.location.toLowerCase()
      const cQual = c.displayQualification.toLowerCase()
      const cExperience = Number(c.displayExperience)
      const cSkills = c.skills.map((s) => s.toLowerCase())
      const cAppliedDate = new Date(c.appliedDate)

      const filterLocation =
        filters.location === "Enter Location"
          ? filters.customLocation.toLowerCase().trim()
          : filters.location.toLowerCase().trim()

      if (filterLocation && filterLocation !== "enter location") {
        if (!cLocation.includes(filterLocation)) return false
      }

      const filterQual = filters.qualification === "Other" ? filters.customQualification : filters.qualification

      if (filterQual && !cQual.includes(filterQual.toLowerCase())) return false

      // Experience Filter
      if (filters.experience > 0 && cExperience < filters.experience) return false

      // Skills Filter
      if (filters.skills.length > 0) {
        const requiredSkills = filters.skills.map((s) => s.toLowerCase())
        const hasRequiredSkill = requiredSkills.some((reqSkill) => cSkills.some((cSkill) => cSkill.includes(reqSkill)))
        if (!hasRequiredSkill) return false
      }

      if (filters.customSkill) {
        const customSearch = filters.customSkill.toLowerCase()
        if (!cSkills.some((cSkill) => cSkill.includes(customSearch))) return false
      }

      // Date Range Filter
      if (filters.dateFrom) {
        const dateFrom = new Date(filters.dateFrom)
        if (cAppliedDate < dateFrom) return false
      }

      if (filters.dateTo) {
        const dateTo = new Date(filters.dateTo)
        dateTo.setHours(23, 59, 59, 999) // Include the entire 'To' day
        if (cAppliedDate > dateTo) return false
      }

      return true
    })
    
    return list;
  }, [candidates, searchTerm, filters])
  
  const allowed = subscriptionDetails?.dbPoints || 0
  const totalFilteredCount = filteredCandidates.length
  const visibleCandidates = filteredCandidates.slice(0, allowed)

  const handleShowMore = () => {
    if (allowed < totalFilteredCount) {
      setShowOverlay(true)
    }
  }
  // --- End Filtering Logic ---


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#caa057]"></div>
        <p className="ml-4 text-xl font-medium text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-100 p-6 font-sans">
        {/* --- TOASTER COMPONENT --- */}
        <Toaster position="top-right" reverseOrder={false} /> 

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Candidates Database
      </h1>

      <div className="flex flex-col md:flex-row gap-6 mt-0">
        {/* --- 1. FILTER SIDEBAR (md:w-1/4) --- */}
        <div className="w-full md:w-1/4 bg-white rounded-xl shadow-lg p-6 h-fit sticky top-6 z-30 order-2 md:order-1">
          <div className="flex items-center justify-between mb-6 border-b pb-3">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-[#caa057]" />
              Filter Candidates
            </h3>
            {areFiltersActive && (
              <button
                onClick={resetFilters}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <Listbox
                value={filters.location}
                onChange={(value) =>
                  setFilters({
                    ...filters,
                    location: value,
                    customLocation: value === "Enter Location" ? filters.customLocation : "",
                  })
                }
              >
                <div className="relative">
                  <Listbox.Button className="w-full border rounded-lg py-2 px-3 text-left bg-gray-50 text-gray-700 text-sm">
                    <span>{filters.location || "Select Location"}</span>
                    <span className="absolute right-2 inset-y-0 flex items-center pointer-events-none">
                      <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    <Listbox.Option value="" className="cursor-pointer px-3 py-2 text-gray-500">No Filter</Listbox.Option>
                    {locations.map((loc) => (
                      <Listbox.Option
                        key={loc}
                        value={loc}
                        className={({ active }) =>
                          `cursor-pointer px-3 py-2 text-sm ${
                            active ? "bg-[#fef8e7] text-gray-900" : "text-gray-900"
                          }`
                        }
                      >
                        {({ selected }) => (
                          <span className="flex items-center gap-2">
                            {selected && (<CheckIcon className="w-4 h-4 text-[#caa057]" />)}
                            {loc}
                          </span>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
              {/* Manual Location Input */}
              {filters.location === "Enter Location" && (
                <input
                  type="text"
                  placeholder="Enter custom location..."
                  value={filters.customLocation}
                  onChange={(e) => setFilters({ ...filters, customLocation: e.target.value })}
                  className="w-full mt-2 border rounded-lg py-2 px-3 text-sm bg-white shadow-sm"
                />
              )}
            </div>

            {/* Qualification Filter (Similar structure as Location Filter) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
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
                  <Listbox.Button className="w-full border rounded-lg py-2 px-3 text-left bg-gray-50 text-gray-700 text-sm">
                    <span>{filters.qualification || "Select Qualification"}</span>
                    <span className="absolute right-2 inset-y-0 flex items-center pointer-events-none">
                      <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    <Listbox.Option value="" className="cursor-pointer px-3 py-2 text-gray-500">No Filter</Listbox.Option>
                    {qualifications.map((q) => (
                      <Listbox.Option
                        key={q}
                        value={q}
                        className={({ active }) =>
                          `cursor-pointer px-3 py-2 text-sm ${active ? "bg-[#fef8e7] text-gray-900" : "text-gray-900"}`
                        }
                      >
                        {({ selected }) => (
                          <span className="flex items-center gap-2">
                            {selected && (<CheckIcon className="w-4 h-4 text-[#caa057]" />)}
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
                  placeholder="Enter custom qualification..."
                  value={filters.customQualification}
                  onChange={(e) => setFilters({ ...filters, customQualification: e.target.value })}
                  className="w-full mt-2 border rounded-lg py-2 px-3 text-sm bg-white shadow-sm"
                />
              )}
            </div>

            {/* Experience Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Experience: <span className="font-semibold text-[#caa057]">{filters.experience} years</span>
              </label>
              <Slider min={0} max={20} value={filters.experience} onChange={(val) => setFilters({ ...filters, experience: val })} />
            </div>

            {/* Skills Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Skills</label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {skillsList.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      filters.skills.includes(skill)
                        ? "bg-[#caa057] text-white border-[#caa057] hover:bg-[#b4924c]"
                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Or enter other skill..."
                value={filters.customSkill}
                onChange={(e) => setFilters({ ...filters, customSkill: e.target.value })}
                className="w-full mt-3 border rounded-lg py-2 px-3 text-sm bg-white shadow-sm"
              />
            </div>

            {/* Date Range Filter (Kept unchanged) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Applied Date Range</label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">From</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="w-full border rounded-lg py-2 px-3 text-sm bg-white shadow-sm focus:ring-1 focus:ring-[#caa057]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className="w-full border rounded-lg py-2 px-3 text-sm bg-white shadow-sm focus:ring-1 focus:ring-[#caa057]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 2. CANDIDATE LIST AREA (md:w-3/4) --- */}
        <div className="w-full md:w-3/4 order-1 md:order-2">
          
          {/* Search Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="🔍 Search by name, skill, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border rounded-full shadow-md focus:ring-2 focus:ring-[#caa057] focus:border-[#caa057] transition duration-200 text-gray-700"
            />
          </div>

          {/* Candidate Count Info */}
          <p className="text-gray-600 mb-4 font-semibold">
            {areFiltersActive
              ? `Showing ${visibleCandidates.length} of ${totalFilteredCount} candidates based on your criteria.`
              : `Showing ${visibleCandidates.length} of ${candidates.length} total candidates (Plan Limit: ${allowed}).`}
          </p>

          {/* Candidate List Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-4"> 
            {visibleCandidates.length > 0 ? (
              visibleCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate._id}
                  candidate={candidate}
                  onSave={handleSaveCandidate}
                  isSaved={savedCandidates.some((c) => c._id === candidate._id)}
                />
              ))
            ) : (
              <div className="col-span-full">
                <p className="text-gray-500 text-center p-10 bg-white rounded-xl shadow">
                  No candidates match your current search and filter criteria.
                  Try broadening your search.
                </p>
              </div>
            )}
          </div>

          {/* Show More Button */}
          {subscriptionDetails && visibleCandidates.length < totalFilteredCount && (
            <div className="mt-8 text-center">
              <button
                onClick={handleShowMore}
                className="bg-[#caa057] text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-[#b4924c] transition-colors transform hover:scale-105"
              >
                Show More Candidates
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- OVERLAY --- */}
      {showOverlay && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col justify-center items-center text-center p-6 rounded-lg transition-opacity duration-500 z-50">
          <h2 className="text-3xl font-bold text-white mb-4">
            Access Restricted / Upgrade Needed
          </h2>
          <p className="text-white text-lg mb-6 max-w-md">
            {subscriptionDetails
              ? "Your current plan limits the number of visible candidates. Upgrade to unlock full database access."
              : "Buy a plan to unlock the candidates database and start recruiting."}
          </p>
          <button
            onClick={handleViewPlansClick}
            className="bg-gradient-to-r from-[#caa057] via-[#b4924c] to-[#caa057] text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            View Plans
          </button>
        </div>
      )}
    </div>
  );
};

export default DatabaseView;