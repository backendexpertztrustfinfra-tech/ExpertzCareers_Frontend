import React, { useState, useEffect } from "react";
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
    { key: "all", label: "All Candidates" },
    { key: "saved", label: "Saved Candidates" },
    { key: "selected", label: "Selected Candidates" },
  ];

  return (
    <div className="bg-white rounded-[20px] shadow-md border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Candidates</h2>

      {/* Tab Buttons */}
      <div className="space-y-3 mb-4">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`p-3 rounded-lg cursor-pointer transition text-sm font-medium ${
              activeTab === tab.key
                ? "bg-yellow-100 text-yellow-800 font-semibold"
                : "bg-[#f9f9f9] text-gray-700 hover:bg-yellow-50"
            }`}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Candidate Cards */}
      {loading ? (
        <p className="text-center text-gray-500">Loading candidates...</p>
      ) : candidates[activeTab].length === 0 ? (
        <p className="text-center text-gray-400">No candidates found.</p>
      ) : (
        <div className="space-y-3">
          {candidates[activeTab].map((candidate) => (
            <div
              key={candidate._id}
              className="flex items-center gap-3 p-4 rounded-xl bg-[#fdf8e8] hover:bg-yellow-50 border border-yellow-200 transition shadow-sm"
            >
              <FaUserCircle className="text-yellow-600 text-3xl" />
              <div>
                <p className="font-semibold text-gray-800">{candidate.name}</p>
                <p className="text-sm text-gray-600">{candidate.role}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedJobsBox;
