import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
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
    // console.log("✅ API Data:", data);

    if (!res.ok) throw new Error(data.message || "Failed to fetch DB points");

    //  Fix: return data.users if present
    if (Array.isArray(data.users)) return data.users;
    if (Array.isArray(data.details)) return data.details;
    if (Array.isArray(data)) return data;

    return [];
  } catch (err) {
    console.error("❌ getDbPointUser API Error:", err.message);
    return [];
  }
};

const CandidateCard = ({ candidate }) => {
  const {
    profilphoto,
    username,
    useremail,
    designation,
    yearsofExperience,
    previousCompany,
    previousSalary,
    salaryExpectation,
    location,
    phonenumber,
    Skill,
    resume,
    projectlink,
    certificationlink,
    portfioliolink,
    introvideo,
  } = candidate;

  const placeholderImg = "https://via.placeholder.com/120?text=Profile";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition duration-300 p-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-4">
          <img
            src={profilphoto || placeholderImg}
            alt={username}
            className="w-20 h-20 rounded-full object-cover border-2 border-orange-500 shadow-md"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{username}</h2>
            <p className="text-sm text-gray-500">{useremail}</p>
            <p className="text-sm font-medium text-orange-600">
              {designation || "No Designation"}
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-2">
          {resume && <CardLink href={resume} label="📄 Resume" primary />}
          {introvideo && <CardLink href={introvideo} label="🎥 Video" />}
        </div>
      </div>

      {/* Main Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mt-4 text-sm text-gray-700">
        <CardInfo label="📍 Location" value={location} />
        <CardInfo
          label="💼 Experience"
          value={yearsofExperience ? `${yearsofExperience} yrs` : null}
        />
        <CardInfo label="🏢 Company" value={previousCompany} />
        <CardInfo label="💸 Prev Salary" value={previousSalary} />
        <CardInfo
          label="💰 Expected"
          value={salaryExpectation ? `₹${salaryExpectation}` : null}
        />
        <CardInfo label="📞 Phone" value={phonenumber} />
      </div>

      {/* Skills */}
      <div className="mt-5">
        <h3 className="font-semibold text-gray-900 mb-2">🛠 Skills</h3>
        <div className="flex flex-wrap gap-2">
          {Skill ? (
            Skill.split(",").map((s, i) => (
              <span
                key={i}
                className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                {s.trim()}
              </span>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Not Provided</p>
          )}
        </div>
      </div>

      {/* Extra Links */}
      <div className="mt-5 flex flex-wrap gap-2">
        {projectlink && <CardLink href={projectlink} label="🔗 Project" />}
        {portfioliolink && (
          <CardLink href={portfioliolink} label="📂 Portfolio" />
        )}
        {certificationlink && (
          <CardLink href={certificationlink} label="🎓 Certification" />
        )}
      </div>
    </div>
  );
};

// ✅ Renamed to avoid conflicts
const CardInfo = ({ label, value }) => (
  <p>
    <span className="font-medium text-gray-800">{label}:</span>{" "}
    {value || "Not Provided"}
  </p>
);

const CardLink = ({ href, label, primary }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`text-xs px-3 py-1.5 rounded-md border transition font-medium ${
      primary
        ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
        : "border-gray-300 text-gray-700 hover:bg-gray-100"
    }`}
  >
    {label}
  </a>
);

// ✅ Reusable Small Components
const Info = ({ label, value }) => (
  <p className="text-sm">
    <span className="font-semibold text-gray-800">{label}:</span>{" "}
    {value || "Not Provided"}
  </p>
);

const LinkBtn = ({ href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-xs px-3 py-1 rounded-full border border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white transition"
  >
    {label}
  </a>
);

// --- Main Component ---
const DatabaseView = ({ onShowPlan }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const subResult = await getActiveSubscription();
        if (subResult.subscription) {
          setHasActivePlan(true);
          setSubscriptionDetails(subResult.subscription);
          setShowOverlay(false);

          const dbResult = await getDbPointUser();
          setCandidates(Array.isArray(dbResult) ? dbResult : []);
        } else {
          setHasActivePlan(false);
          setShowOverlay(true);
          setCandidates([]);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setHasActivePlan(false);
        setShowOverlay(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleShowMore = () => {
    setShowOverlay(true);
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
      {/* Debugging */}
      <p className="text-red-600 mb-2">
        Total Candidates Loaded: {candidates.length}
      </p>

      {/* Database Content */}
      <div
        className={`transition-all duration-500 ${
          showOverlay ? "blur-sm pointer-events-none" : ""
        }`}
      >
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Candidates Database
        </h1>
        <p className="text-gray-600 mb-6">
          {hasActivePlan
            ? `Viewing candidates for your ${
                subscriptionDetails?.planName || "active"
              } plan.`
            : "Please activate a plan to view candidates."}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(candidates) && candidates.length > 0 ? (
            candidates.map((candidate, index) => (
              <CandidateCard key={index} candidate={candidate} />
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No candidates to display.
            </p>
          )}
        </div>

        {/* Show More Button */}
        {hasActivePlan && candidates.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={handleShowMore}
              className="bg-orange-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors transform hover:scale-105"
            >
              Show More Candidates
            </button>
          </div>
        )}
      </div>

      {/* Overlay */}
      {showOverlay && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col justify-center items-center text-center p-6 rounded-lg transition-opacity duration-500 z-50">
          <h2 className="text-3xl font-bold text-white mb-4">
            No Active Subscription
          </h2>
          <p className="text-white text-lg mb-6 max-w-md">
            Buy or upgrade a plan to unlock the candidates database.
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
