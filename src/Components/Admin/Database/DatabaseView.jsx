"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import CandidateCard from "./CandidateCard";
import { saveCandidate, getSavedCandidates } from "../../../services/apis";
import { BASE_URL } from "../../../config";

// --- API Calls ---
export const getActiveSubscription = async () => {
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

// --- Main Component ---
const DatabaseView = ({ onShowPlan }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [visibleCandidates, setVisibleCandidates] = useState([]);
  const [savedCandidates, setSavedCandidates] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);

  const token = Cookies.get("userToken");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const subResult = await getActiveSubscription();

        if (subResult.subscription) {
          setSubscriptionDetails(subResult.subscription);

          const dbResult = await getDbPointUser();
          const rawCandidates = Array.isArray(dbResult) ? dbResult : [];

          const transformedCandidates = rawCandidates.map((candidate) => ({
            _id: candidate._id,
            username: candidate.username || "No Name",
            qualification: candidate.qualification || "Not Provided",
            skills: candidate.Skill
              ? Array.isArray(candidate.Skill)
                ? candidate.Skill
                : candidate.Skill.split(",").map((s) => s.trim())
              : [],
            location: candidate.location || "Not Provided",
            expectedSalary: candidate.salaryExpectation || "N/A",
            lastActive: candidate.lastActive || "Recently",
            experience: candidate.yearsofExperience || 0,
            phonenumber: candidate.phonenumber || "Not Provided",
            previousCompany: candidate.previousCompany || "Not Provided",
            introvideo: candidate.introvideo || null,
            resume: candidate.resume || null,
            portfioliolink: candidate.portfioliolink || null,
            certificationlink: candidate.certificationlink || null,
            profilePhoto: candidate.profilphoto || null,
            appliedDate: candidate.appliedDate || new Date().toISOString(),
          }));

          setCandidates(transformedCandidates);

          // limit candidates based on DB points from plan
          const allowed = subResult.subscription.dbPoints || 0;
          setVisibleCandidates(transformedCandidates.slice(0, allowed));
          setShowOverlay(false);

          try {
            const savedData = await getSavedCandidates(token);
            setSavedCandidates(savedData?.savedCandidates || []);
          } catch (err) {
            console.error("Error fetching saved candidates:", err);
          }
        } else {
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
    try {
      const response = await saveCandidate(token, candidateId);
      console.log("✅ Candidate Saved:", response);

      // Add to saved candidates list
      const candidateToSave = visibleCandidates.find(
        (c) => c._id === candidateId
      );
      if (
        candidateToSave &&
        !savedCandidates.some((c) => c._id === candidateId)
      ) {
        setSavedCandidates((prev) => [...prev, candidateToSave]);
      }
    } catch (error) {
      console.error("❌ Error saving candidate:", error);
    }
  };

  const handleShowMore = () => {
    if (subscriptionDetails?.dbPoints < candidates.length) {
      // trying to see more than allowed
      setShowOverlay(true);
    } else {
      setVisibleCandidates(candidates);
    }
  };

  const handleViewPlansClick = () => {
    onShowPlan();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
        <p className="ml-4 text-xl font-medium text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-100 p-6 font-sans">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Candidates Database
      </h1>

      <p className="text-gray-600 mb-6">
        {subscriptionDetails
          ? `Viewing candidates for your ${subscriptionDetails.planName} plan.`
          : "Please activate a plan to view candidates."}
      </p>

      <p className="text-red-600 mb-4">
        Showing {visibleCandidates.length} of {candidates.length} candidates
        (Plan Limit: {subscriptionDetails?.dbPoints || 0})
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <p className="text-gray-500 text-center">
              No candidates to display.
            </p>
          </div>
        )}
      </div>

      {/* Show More Button */}
      {subscriptionDetails && visibleCandidates.length < candidates.length && (
        <div className="mt-8 text-center">
          <button
            onClick={handleShowMore}
            className="bg-orange-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors transform hover:scale-105"
          >
            Show More Candidates
          </button>
        </div>
      )}

      {/* Overlay */}
      {showOverlay && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col justify-center items-center text-center p-6 rounded-lg transition-opacity duration-500 z-50">
          <h2 className="text-3xl font-bold text-white mb-4">
            No Access / Upgrade Needed
          </h2>
          <p className="text-white text-lg mb-6 max-w-md">
            {subscriptionDetails
              ? "Your current plan does not allow more candidate views. Upgrade to unlock full access."
              : "Buy a plan to unlock the candidates database."}
          </p>
          <button
            onClick={handleViewPlansClick}
            className="bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            View Plans
          </button>
        </div>
      )}
    </div>
  );
};

export default DatabaseView;
