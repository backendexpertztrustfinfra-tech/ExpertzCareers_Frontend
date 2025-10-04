"use client";

import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import CandidateCard from "../Database/CandidateCard";
import CandidateMiniCard from "../Database/CandidateMiniCard";
import {
  getAppliedUser,
  getSavedCandidates,
  saveCandidate,
  rejectCandidate,
  sendNotification,
} from "../../../services/apis";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const CandidateView = ({ selectedJob }) => {
  const token = Cookies.get("userToken");
  const [appliedCandidates, setAppliedCandidates] = useState([]);
  const [savedCandidates, setSavedCandidates] = useState([]);
  const [tab, setTab] = useState("Applied");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCandidate, setActiveCandidate] = useState(null);

  const locations = ["Remote", "Onsite", "Hybrid"];
  const qualifications = ["B.Tech", "MBA", "MCA", "Diploma", "Other"];
  const skillsList = ["React", "Node.js", "Python", "Java", "SQL", "AWS"];

  const [filters, setFilters] = useState({
    location: "",
    qualification: "",
    customQualification: "",
    distance: 0,
    skills: [],
    customSkill: "",
    experience: 0,
  });

const transformCandidateData = useCallback((candidatesArray) => {
  if (!Array.isArray(candidatesArray)) {
    console.error("Expected array, got:", typeof candidatesArray, candidatesArray)
    return []
  }

  return candidatesArray.map((item) => {
    const user = item.userId || item
    const applicationData = item.userId ? item : {}

    // --- Qualification ---
    let qualificationText = "Not Provided"
    if (user.qualification) {
      try {
        const parsed = JSON.parse(user.qualification)
        if (Array.isArray(parsed)) {
          qualificationText = parsed
            .map((q) => `${q.degree || ""}${q.institution ? " - " + q.institution : ""}`)
            .join(", ")
        }
      } catch {
        qualificationText = user.qualification
      }
    }

    // --- Experience ---
    let experienceText = "0"
    let experienceYears = 0
    if (user.yearsofExperience) {
      const match = user.yearsofExperience.match(/(\d+)/)
      experienceYears = match ? Number(match[1]) : 0
      experienceText = user.yearsofExperience
    } else if (user.Experience) {
      try {
        const expParsed = JSON.parse(user.Experience)
        if (Array.isArray(expParsed)) {
          experienceText = expParsed
            .map((e) => `${e.designation || "Role"} at ${e.company || "Company"}`)
            .join(", ")
        }
      } catch {
        experienceText = user.Experience
      }
    }

    // --- Skills ---
    let skillsArray = []
    if (user.Skill) {
      try {
        skillsArray = JSON.parse(user.Skill)
      } catch {
        if (Array.isArray(user.Skill)) skillsArray = user.Skill
        else skillsArray = [user.Skill]
      }
    }

    return {
      _id: user._id || user.id,
      username: user.username || "No Name",
      useremail: user.useremail || "No Email",
      designation: user.designation || "No Designation",
      qualification: qualificationText,
      skills: skillsArray,
      location: user.location || "Not Provided",
      expectedSalary: user.salaryExpectation || user.expectedSalary || "N/A",
      experience: experienceText,   // readable string
      experienceYears,              // numeric for filters
      phonenumber: user.phonenumber || "Not Provided",
      resume: user.resume || null,
      portfioliolink: user.portfioliolink || user.portfoliolink || null,
      profilePhoto: user.profilphoto || user.profilePhoto || null,
      appliedDate: applicationData.appliedAt || user.appliedDate || user.createdAt || new Date().toISOString(),
      status: applicationData.status || "applied",
    }
  })
}, [])


  const fetchCandidates = useCallback(
    async (apiCall, setter, jobId = null) => {
      if (!token) {
        setError("Please log in to view candidates");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await apiCall(token, jobId);
        let candidatesArray = [];
        if (data?.candidatesApplied && Array.isArray(data.candidatesApplied)) {
          candidatesArray = data.candidatesApplied;
        } else if (
          data?.savedCandidates &&
          Array.isArray(data.savedCandidates)
        ) {
          candidatesArray = data.savedCandidates;
        } else if (Array.isArray(data)) {
          candidatesArray = data;
        } else {
          console.warn("Unexpected response structure:", data);
        }

        setter(transformCandidateData(candidatesArray));
      } catch (err) {
        console.error("Error fetching candidates:", err);
        setError(`Failed to load candidates: ${err.message}`);
        setter([]);
      } finally {
        setLoading(false);
      }
    },
    [token, transformCandidateData]
  );

  const handleFetchApplied = useCallback(() => {
    if (selectedJob && selectedJob._id) {
      fetchCandidates(getAppliedUser, setAppliedCandidates, selectedJob._id);
    }
  }, [selectedJob, fetchCandidates]);

  const handleFetchSaved = useCallback(() => {
    fetchCandidates(getSavedCandidates, setSavedCandidates);
  }, [fetchCandidates]);

  // 🔹 Reject candidate and send notification
  const handleRejectCandidate = async (candidateId) => {
    try {
      const candidate = appliedCandidates.find((c) => c._id === candidateId);
      if (!candidate) throw new Error("Candidate not found");

      const jobId = selectedJob._id || selectedJob.id;
      await rejectCandidate(token, candidateId, jobId);

      if (token && selectedJob) {
        const res = await sendNotification({
          token,
          type: "REJECTED",
          userId: candidateId,
          extraData: { job: selectedJob },
        });
        console.log("✅ Rejection notification response:", res);
      }

      setAppliedCandidates((prev) => prev.filter((c) => c._id !== candidateId));
      if (activeCandidate?._id === candidateId) setActiveCandidate(null);
    } catch (err) {
      console.error("Error rejecting candidate:", err);
      setError(`Failed to reject candidate: ${err.message}`);
    }
  };

  // 🔹 View candidate and send notification
  const handleMiniCardClick = async (candidate) => {
    setActiveCandidate(candidate);
    if (token && selectedJob) {
      try {
        const res = await sendNotification({
          token,
          type: "VIEWED",
          userId: candidate._id,
          extraData: { job: selectedJob },  
        });
        // console.log("👁 View notification response:", res);
      } catch (err) {
        console.error("Failed to send view notification:", err);
      }
    }
  };

  // ✅ Tab change
  const handleTabChange = (t) => {
    setTab(t);
    setError(null);
    setActiveCandidate(null);
    if (t === "Saved") handleFetchSaved();
    else if (t === "Applied") handleFetchApplied();
  };

  useEffect(() => {
    if (selectedJob && token) handleFetchApplied();
  }, [selectedJob, token, handleFetchApplied]);

  const resetFilters = useCallback(() => {
    setFilters({
      location: "",
      qualification: "",
      customQualification: "",
      distance: 0,
      skills: [],
      customSkill: "",
      experience: 0,
    });
  }, []);

  const toggleSkill = (skill) => {
    setFilters((prev) => {
      if (prev.skills.includes(skill)) {
        return { ...prev, skills: prev.skills.filter((s) => s !== skill) };
      } else {
        return { ...prev, skills: [...prev.skills, skill] };
      }
    });
  };

  useEffect(() => {
    if (selectedJob && token) {
      handleFetchApplied();
    } else {
      console.log("Missing requirements:", {
        hasSelectedJob: !!selectedJob,
        hasToken: !!token,
      });
    }
  }, [selectedJob, token, handleFetchApplied]);

  if (!selectedJob) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 text-center text-gray-500">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-lg font-medium mb-2">
          Please select a job first to view candidates.
        </p>
        <p className="text-sm text-gray-400">
          Choose a job from the Job Listings to see applied and saved
          candidates.
        </p>
      </div>
    );
  }

  const candidatesToShow =
    tab === "Applied" ? appliedCandidates : savedCandidates;

  const filteredCandidates = candidatesToShow.filter((c) => {
    const skillsMatch =
      !filters.skills.length ||
      filters.skills.every((s) =>
        c.skills?.some((skill) => skill.toLowerCase().includes(s.toLowerCase()))
      );

    const customSkillMatch =
      !filters.customSkill ||
      c.skills?.some((s) =>
        s.toLowerCase().includes(filters.customSkill.toLowerCase())
      );

    const locationMatch =
      !filters.location ||
      c.location?.toLowerCase().includes(filters.location.toLowerCase());

    const qualificationMatch =
      !filters.qualification ||
      c.qualification
        ?.toLowerCase()
        .includes(filters.qualification.toLowerCase());

    const customQualificationMatch =
      !filters.customQualification ||
      c.qualification
        ?.toLowerCase()
        .includes(filters.customQualification.toLowerCase());

    const experienceMatch =
      !filters.experience ||
      Number(c.experience || 0) >= Number(filters.experience);

    const distanceMatch =
      filters.distance === 0 ||
      Number(c.distance || 999) <= Number(filters.distance);

    return (
      locationMatch &&
      qualificationMatch &&
      customQualificationMatch &&
      experienceMatch &&
      distanceMatch &&
      skillsMatch &&
      customSkillMatch
    );
  });

  return (
    <div className="flex gap-6 flex-col md:flex-row">
      <div className="w-full md:w-1/4 bg-white rounded-lg shadow p-5 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          {(filters.location ||
            filters.qualification ||
            filters.customQualification ||
            filters.distance > 0 ||
            filters.skills.length > 0 ||
            filters.customSkill ||
            filters.experience > 0) && (
            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Location</label>
          <Listbox
            value={filters.location}
            onChange={(value) => setFilters({ ...filters, location: value })}
          >
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
                    className={({ active }) =>
                      `cursor-pointer px-3 py-2 ${active ? "bg-blue-100" : ""}`
                    }
                  >
                    {({ selected }) => (
                      <span className="flex items-center gap-2">
                        {selected && (
                          <CheckIcon className="w-4 h-4 text-blue-600" />
                        )}
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
                customQualification:
                  value === "Other" ? filters.customQualification : "",
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
                    className={({ active }) =>
                      `cursor-pointer px-3 py-2 ${active ? "bg-blue-100" : ""}`
                    }
                  >
                    {({ selected }) => (
                      <span className="flex items-center gap-2">
                        {selected && (
                          <CheckIcon className="w-4 h-4 text-blue-600" />
                        )}
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
              onChange={(e) =>
                setFilters({ ...filters, customQualification: e.target.value })
              }
              className="w-full mt-2 border rounded-full py-2 px-3 text-sm bg-gray-50"
            />
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">
            Max Distance: {filters.distance} km
          </label>
          <Slider
            min={0}
            max={100}
            value={filters.distance}
            onChange={(val) => setFilters({ ...filters, distance: val })}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            Min Experience: {filters.experience} years
          </label>
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
            onChange={(e) =>
              setFilters({ ...filters, customSkill: e.target.value })
            }
            className="w-full mt-2 border rounded-full py-2 px-3 text-sm bg-gray-50"
          />
        </div>

        <button
          onClick={resetFilters}
          className="w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Clear Filters
        </button>
      </div>

      <div className="w-full md:w-3/4">
        <div className="flex gap-3 mb-6">
          {["Applied", "Saved"].map((t) => (
            <button
              key={t}
              className={`px-5 py-2 rounded-full font-medium shadow-sm transition-colors ${
                tab === t
                  ? "bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => handleTabChange(t)}
            >
              {t} Candidates (
              {tab === "Applied"
                ? appliedCandidates.length
                : savedCandidates.length}
              )
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

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
                <button
                  onClick={() => setActiveCandidate(null)}
                  className="mb-4 text-sm text-blue-600 hover:underline"
                >
                  ← Back to list
                </button>
                <CandidateCard
                  candidate={activeCandidate}
                  onSave={() => handleSaveCandidate(activeCandidate._id)}
                  onReject={handleRejectCandidate}
                  isSaved={savedCandidates.some(
                    (c) => c._id === activeCandidate._id
                  )}
                  selectedJob={selectedJob}
                  token={token}
                />
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <div className="text-5xl mb-4">
                  {candidatesToShow.length === 0 ? "📭" : "🔍"}
                </div>
                <p className="text-lg font-medium mb-2">
                  {candidatesToShow.length === 0
                    ? `No ${tab.toLowerCase()} candidates found.`
                    : "No candidates match your filters."}
                </p>
                {candidatesToShow.length > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-orange-600 hover:text-orange-700 underline"
                  >
                    Clear filters to see all candidates
                  </button>
                )}
              </div>
            ) : (
              filteredCandidates.map((candidate) => (
                <CandidateMiniCard
                  key={candidate._id}
                  candidate={candidate}
                  onClick={handleMiniCardClick}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateView;
