import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import CandidateCard from "./CandidateCard";
import {
  getAppliedUser,
  getSavedCandidates,
  saveCandidate,
} from "../../../services/apis";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const DatabaseView = ({ selectedJob }) => {
  const [appliedCandidates, setAppliedCandidates] = useState([]);
  const [savedCandidates, setSavedCandidates] = useState([]);
  const [tab, setTab] = useState("Applied");
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    location: "",
    qualification: "",
    customQualification: "",
    distance: 0,
    skills: [],
    customSkill: "",
    experience: 0,
  });

  const token = Cookies.get("userToken");

  const locations = ["Remote", "Onsite", "Hybrid"];
  const qualifications = ["B.Tech", "MBA", "MCA", "Diploma"];
  const skillsList = ["React", "Node.js", "Python", "Java", "SQL", "AWS"];

  // Fetch Applied Candidates
  useEffect(() => {
    if (!selectedJob || !token) return;

    const fetchApplied = async () => {
      setLoading(true);
      setAppliedCandidates([]);

      try {
        const data = await getAppliedUser(token, selectedJob.id);

        const mapped = (data?.candidatesApplied || []).map((user) => ({
          _id: user._id,
          username: user.username || "No Name",
          useremail: user.useremail || "No Email",
          designation: user.designation || "No Designation",
          qualification: user.qualification || "No Info",
          skills: user.Skill ? [user.Skill] : [],
          location: user.location || "Not Provided",
          expectedSalary: user.expectedSalary || "N/A",
          lastActive: user.lastActive || "Recently",
          experience: user.experience || null,
          distance: user.distance || null,
          phonenumber: user.phonenumber || "Not Provided",
        }));

        setAppliedCandidates(mapped);
      } catch (err) {
        console.error("Error fetching applied candidates:", err);
        setAppliedCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplied();
  }, [selectedJob, token]);

  // Fetch Saved Candidates
  const fetchSavedCandidates = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getSavedCandidates(token);

      const mapped = (data?.savedCandidates || []).map((user) => ({
        _id: user._id,
        username: user.username || "No Name",
        useremail: user.useremail || "No Email",
        designation: user.designation || "No Designation",
        qualification: user.qualification || "No Info",
        skills: user.Skill ? [user.Skill] : [],
        location: user.location || "Not Provided",
        expectedSalary: user.expectedSalary || "N/A",
        lastActive: user.lastActive || "Recently",
        experience: user.experience || null,
        assets: user.assets || [],
        distance: user.distance || null,
      }));

      setSavedCandidates(mapped);
    } catch (err) {
      console.error("Error fetching saved candidates:", err);
      setSavedCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedCandidates();
  }, [token]);

  // Save Candidate
  const handleSaveCandidate = async (candidateId) => {
    try {
      const response = await saveCandidate(token, candidateId);
      console.log("✅ Candidate Saved:", response);

      // Add candidate to savedCandidates if not already present
      const candidateToAdd = appliedCandidates.find(
        (c) => c._id === candidateId
      );
      if (candidateToAdd && !savedCandidates.some((c) => c._id === candidateId)) {
        setSavedCandidates((prev) => [...prev, candidateToAdd]);
      }
    } catch (error) {
      console.error("❌ Error saving candidate:", error);
    }
  };

  // Handle tab change
  const handleTabChange = (t) => {
    setTab(t);
    if (t === "Saved") {
      fetchSavedCandidates();
    }
  };

  if (!selectedJob) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 text-center text-gray-500">
        <p className="text-lg font-medium">
          Please select a job first to view candidates.
        </p>
      </div>
    );
  }

  const candidatesToShow = tab === "Applied" ? appliedCandidates : savedCandidates;

  // Apply filters
  const filteredCandidates = candidatesToShow.filter((c) => {
    return (
      (!filters.location ||
        c.location?.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.qualification ||
        c.qualification
          ?.toLowerCase()
          .includes(filters.qualification.toLowerCase())) &&
      (!filters.customQualification ||
        c.qualification
          ?.toLowerCase()
          .includes(filters.customQualification.toLowerCase())) &&
      (!filters.experience ||
        Number(c.experience || 0) >= Number(filters.experience)) &&
      (!filters.distance ||
        Number(c.distance || 999) <= Number(filters.distance)) &&
      (!filters.skills.length ||
        filters.skills.every((s) =>
          c.skills.map((x) => x.toLowerCase()).includes(s.toLowerCase())
        )) &&
      (!filters.customSkill ||
        c.skills.some((s) =>
          s.toLowerCase().includes(filters.customSkill.toLowerCase())
        ))
    );
  });

  const toggleSkill = (skill) => {
    if (filters.skills.includes(skill)) {
      setFilters({
        ...filters,
        skills: filters.skills.filter((s) => s !== skill),
      });
    } else {
      setFilters({ ...filters, skills: [...filters.skills, skill] });
    }
  };

  return (
    <div className="flex gap-6 flex-col md:flex-row ">
      {/* Filter Sidebar */}
      <div className="w-full md:w-1/4 bg-white rounded-lg shadow p-5 space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>

        {/* Location */}
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
                  <ChevronUpDownIcon className="w-5 h-5 text-gray-400" /> {/* ✅ FIXED */}
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

        {/* Qualification */}
        <div>
          <label className="block text-sm mb-1">Qualification</label>
          <Listbox
            value={filters.qualification}
            onChange={(value) =>
              setFilters({ ...filters, qualification: value })
            }
          >
            <div className="relative">
              <Listbox.Button className="w-full border rounded-full py-2 px-3 text-left bg-gray-50">
                <span>{filters.qualification || "Select Qualification"}</span>
                <span className="absolute right-2 inset-y-0 flex items-center pointer-events-none">
                  <ChevronUpDownIcon className="w-5 h-5 text-gray-400" /> {/* ✅ FIXED */}
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
                        {selected && <CheckIcon className="w-4 h-4 text-blue-600" />}
                        {q}
                      </span>
                    )}
                  </Listbox.Option>
                ))}
                <Listbox.Option className="p-3" value="Other">
                  Other
                </Listbox.Option>
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

        {/* Distance */}
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

        {/* Experience */}
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

        {/* Skills */}
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

        {/* Clear Filters */}
        <button
          onClick={() =>
            setFilters({
              location: "",
              qualification: "",
              customQualification: "",
              distance: 0,
              skills: [],
              customSkill: "",
              experience: 0,
            })
          }
          className="w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
        >
          Clear Filters
        </button>
      </div>

      {/* Candidates List */}
      <div className="w-full md:w-3/4">
        <div className="flex gap-3 mb-6">
          {["Applied", "Saved"].map((t) => (
            <button
              key={t}
              className={`px-5 py-2 rounded-full font-medium shadow-sm ${
                tab === t
                  ? "bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => handleTabChange(t)}
            >
              {t} Candidates
            </button>
          ))}
        </div>

        {loading && <p className="text-center text-gray-400">Loading...</p>}

        {!loading && (
          <div className="space-y-4">
            {filteredCandidates.length === 0 ? (
              <p className="text-gray-400 text-center">
                No {tab.toLowerCase()} candidates found.
              </p>
            ) : (
              filteredCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate._id}
                  candidate={candidate}
                  onSave={handleSaveCandidate}
                  isSaved={savedCandidates.some((c) => c._id === candidate._id)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseView;
