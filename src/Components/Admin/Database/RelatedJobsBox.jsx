"use client";

import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import Cookies from "js-cookie";
import { BASE_URL } from "../../../config";

const RelatedJobsBox = ({ jobId }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [candidates, setCandidates] = useState({
    all: [],
    saved: [],
    selected: [],
  });
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("userToken");

  useEffect(() => {
    if (!jobId || !token) {
      setLoading(false);
      return;
    }

    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/job/getapplieduser/${jobId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch candidates");

        const data = await res.json();

        const applied = Array.isArray(data.candidatesApplied?.candidatesApplied)
          ? data.candidatesApplied.candidatesApplied
          : [];
        const saved = Array.isArray(data.candidatesApplied?.savedCandidates)
          ? data.candidatesApplied.savedCandidates
          : [];
        const selected = Array.isArray(
          data.candidatesApplied?.selectedCandidates
        )
          ? data.candidatesApplied.selectedCandidates
          : [];

        // Normalize candidates
        const normalize = (arr) =>
          arr.map((c) => ({
            _id: c._id,
            name: c.username || "No Name",
            role: c.designation || "No Designation",
          }));

        setCandidates({
          all: normalize(applied),
          saved: normalize(saved),
          selected: normalize(selected),
        });
      } catch (err) {
        console.error("Error fetching candidates:", err);
        setCandidates({ all: [], saved: [], selected: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [jobId, token]);

  const tabs = [
    { key: "all", label: "All" },
    { key: "saved", label: "Saved" },
    { key: "selected", label: "Selected" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
        Candidates
      </h2>

      {/* Tab Buttons with Counts */}
      <div className="flex sm:gap-3 gap-2 mb-5 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const count = candidates[tab.key]?.length || 0;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-sm sm:text-base font-medium whitespace-nowrap transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-[#caa057] to-[#caa057] text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-[#fff1ed]"
              }`}
            >
              {tab.label}
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab.key
                    ? "bg-white text-[#caa057]"
                    : "bg-[#fff1ed] text-[#caa057]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Candidate Cards */}
      {loading ? (
        <p className="text-center text-gray-500 py-6">Loading candidates...</p>
      ) : candidates[activeTab].length === 0 ? (
        <p className="text-center text-gray-400 py-6">No candidates found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {candidates[activeTab].map((candidate) => (
            <div
              key={candidate._id}
              className="flex items-center gap-3 p-4 rounded-xl bg-[#fff1ed] border border-[#fff1ed] hover:shadow-md transition"
            >
              <FaUserCircle className="text-[#caa057] text-3xl flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                  {candidate.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {candidate.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedJobsBox;