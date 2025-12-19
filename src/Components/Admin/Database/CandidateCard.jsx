import { useState } from "react";
import {
  FaRupeeSign,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaBriefcase,
  FaLink,
  FaPlayCircle,
  FaFilePdf,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { MdPersonAdd, MdOutlineWorkOutline, MdClose } from "react-icons/md";
import { sendNotification } from "../../../services/apis";
import { BASE_URL } from "../../../config";

/* Parse skills from array, JSON, or CSV */
const safeParseSkills = (skills) => {
  if (!skills) return [];
  if (Array.isArray(skills))
    return skills
      .filter(Boolean)
      .map((s) => (typeof s === "string" ? s : s?.name || s?.skill || ""))
      .map((s) => s.trim())
      .filter(Boolean);

  if (typeof skills === "string") {
    try {
      const arr = JSON.parse(skills);
      if (Array.isArray(arr))
        return arr
          .filter(Boolean)
          .map((s) => (typeof s === "string" ? s : s?.name || s?.skill || ""))
          .map((s) => s.trim())
          .filter(Boolean);
    } catch {}
    return skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

const parseMultiObjectString = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;

  if (typeof field === "string") {
    const trimmed = field.trim().toLowerCase();
    if (!trimmed || trimmed === "not provided") return [];
    return field
      .split("@")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        try {
          const fixed = item
            .replace(/'/g, '"')
            .replace(/(\b\w+\b)\s*:/g, '"$1":');
          return JSON.parse(fixed);
        } catch {
          return { degree: item };
        }
      })
      .filter(Boolean);
  }

  if (typeof field === "object") return [field];
  return [];
};

const CandidateCard = ({
  candidate,
  onSave,
  onReject,
  isSaved,
  selectedJob,
  token,
  appliedCandidates,
  setAppliedCandidates,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");

  if (!candidate) {
    console.warn("CandidateCard: No candidate data provided");
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 w-full max-w-5xl mx-auto">
        <p className="text-gray-500 text-center">No candidate data available</p>
      </div>
    );
  }

  const {
    _id,
    username = "Unknown",
    location = "Not Provided",
    expectedSalary = "N/A",
    phonenumber = "Not Provided",
    introvideo = null,
    resume = null,
    portfioliolink = null,
    portfoliolink = null,
    certificationlink = null,
    profilePhoto = null,
    profilphoto = null,
    appliedAt = candidate.appliedAt,
    contacted = false,
  } = candidate;

  const skillsArray = safeParseSkills(candidate.skills ?? candidate.Skill);
  const qualificationsArray = Array.isArray(candidate.qualification)
    ? candidate.qualification
    : parseMultiObjectString(candidate.qualification);
  const experienceArray = Array.isArray(candidate.experience)
    ? candidate.experience
    : parseMultiObjectString(candidate.experience);

  const formatAppliedDate = (dateStr) => {
    if (!dateStr) return "Recently";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      if (isNaN(date.getTime())) return "Recently";

      const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
      if (diffHours < 1) return "Just now";
      if (diffHours < 24) return `${diffHours} hours ago`;

      const todayStr = new Date().toDateString();
      const yest = new Date();
      yest.setDate(yest.getDate() - 1);

      if (date.toDateString() === todayStr)
        return `Today at ${date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      if (date.toDateString() === yest.toDateString())
        return `Yesterday at ${date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;

      return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Recently";
    }
  };

  const isAppliedWithin24Hours = (dateStr) => {
    if (!dateStr) return false;
    try {
      const date = new Date(dateStr);
      const now = new Date();
      return (now - date) / (1000 * 60 * 60) < 24;
    } catch {
      return false;
    }
  };
  const appliedRecently = isAppliedWithin24Hours(appliedAt);
  const appliedTimeText = formatAppliedDate(appliedAt);

  const recruiterCompany = selectedJob?.recruterCompany || "Our Company";
  const inviteMessage = `Hello ${username}, this is ${recruiterCompany}. You are selected for the interview. Please contact us for further details.`;

  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (_id) onSave?.(_id);
  };
  const markAsContacted = async (candidateId) => {
    if (!selectedJob?._id || !candidateId) return;

    try {
      const res = await fetch(
        `${BASE_URL}/recruiter/contacted/${selectedJob._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ candidateId }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to mark contacted");

      // 🔥 FIX: instant UI update
      setAppliedCandidates((prev) =>
        prev.map((c) =>
          c.userId?._id === candidateId || c._id === candidateId
            ? { ...c, contacted: true, contactedAt: new Date().toISOString() }
            : c
        )
      );
    } catch (error) {
      console.error("Failed to mark contacted:", error);
    }
  };

  const InfoRow = ({ Icon, title, content }) => (
    <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
      <Icon className="w-5 h-5 text-[#caa057] shrink-0 mt-1" />
      <div>
        <p className="text-xs text-gray-500 font-medium">{title}</p>
        <p className="text-sm font-semibold text-gray-800 break-words">
          {content || "Not Provided"}
        </p>
      </div>
    </div>
  );

  const LinkButton = ({ link, Icon, label, colorClass = "text-blue-600" }) => {
    if (!link) return null;
    const finalLink = link.startsWith("http") ? link : `${BASE_URL}${link}`;
    return (
      <a
        href={finalLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center gap-1 text-xs ${colorClass} hover:underline transition`}
      >
        <Icon className="w-4 h-4" /> {label}
      </a>
    );
  };

  const renderListItems = (arr) => {
    if (!arr || arr.length === 0)
      return <p className="text-gray-400">Not Provided</p>;
    return arr.map((item, index) => (
      <li
        key={index}
        className="leading-tight mb-2 p-1 border-b border-gray-100 last:border-b-0"
      >
        <strong className="text-gray-800 block text-sm">
          {item.position || item.degree || "N/A"}
        </strong>
        <div className="text-xs text-gray-600">
          {item.companyName || item.instution || "N/A"}
        </div>
        {item.duration && (
          <div className="text-xs text-gray-500 mt-1">{item.duration}</div>
        )}
      </li>
    ));
  };

  const previewQualification = qualificationsArray[0]?.degree || "N/A";
  const previewExperience = experienceArray[0]?.position || "N/A";

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border-2 border-orange-100 p-5 w-full mx-auto hover:shadow-xl transition flex flex-col justify-between relative ${
        isExpanded ? "h-auto" : "h-[400px]"
      }`}
      style={!isExpanded ? { maxHeight: "400px" } : {}}
    >
      {candidate.contacted && (
        <span className="absolute top-3 right-3 bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold rounded-full">
          Contacted
        </span>
      )}

      <div
        className={`flex flex-col gap-4 flex-grow relative ${
          !isExpanded ? "overflow-hidden" : ""
        }`}
      >
        {/* User Info */}
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <img
              src={
                profilePhoto ||
                profilphoto ||
                "https://cdn-icons-png.flaticon.com/512/219/219969.png"
              }
              alt={`${username}'s avatar`}
              className="w-16 h-16 rounded-full border-2 border-[#caa057] object-cover"
              onError={(e) =>
                (e.currentTarget.src =
                  "https://cdn-icons-png.flaticon.com/512/219/219969.png")
              }
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-gray-800 truncate max-w-[150px]">
                  {username}
                </h2>
                {appliedRecently && (
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    NEW
                  </span>
                )}
                {isSaved && (
                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    Saved
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Applied: {appliedTimeText}
              </p>
            </div>
          </div>

          <button
            onClick={handleSaveClick}
            className={`p-2 rounded-full transition-colors shrink-0 ${
              isSaved
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500"
            }`}
            title={isSaved ? "Unsave Candidate" : "Save Candidate"}
          >
            <MdPersonAdd className="w-5 h-5" />
          </button>
        </div>

        {/* Core Info */}
        <div className="grid grid-cols-2 gap-3 text-sm border-y py-3">
          <InfoRow Icon={FaMapMarkerAlt} title="Location" content={location} />
          
          <InfoRow
            Icon={FaGraduationCap}
            title="Education"
            content={previewQualification}
          />
          <InfoRow
            Icon={MdOutlineWorkOutline}
            title="Last Role"
            content={previewExperience}
          />
        </div>

        {/* Skills */}
        <div className="mt-2">
          <h3 className="text-xs font-semibold text-[#caa057] mb-1">Skills:</h3>
          <div className="flex flex-wrap gap-2">
            {skillsArray.slice(0, 5).map((skill, idx) => (
              <span
                key={idx}
                className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-md"
              >
                {skill}
              </span>
            ))}
            {skillsArray.length === 0 && (
              <span className="text-xs text-gray-400">Not Provided</span>
            )}
            {skillsArray.length > 5 && (
              <span className="text-xs text-gray-500">
                +{skillsArray.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Document Links */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs mt-3 border-t pt-3">
          <LinkButton
            link={resume}
            Icon={FaFilePdf}
            label="Resume"
            colorClass="text-red-600"
          />
          <LinkButton
            link={portfioliolink || portfoliolink}
            Icon={FaLink}
            label="Portfolio"
          />
          <LinkButton
            link={certificationlink}
            Icon={FaLink}
            label="Certificates"
          />
          {introvideo && (
            <button
              onClick={() => {
                setVideoSrc(introvideo);
                setIsVideoOpen(true);
              }}
              className="flex items-center gap-2 text-purple-600 hover:underline"
            >
              <FaPlayCircle />
              <span>Video Intro</span>
            </button>
          )}
        </div>

        {/* Detailed Profile */}
        <div
          className={`transition-all duration-300 ${
            isExpanded ? "mt-4 pt-4 border-t block" : "h-0 overflow-hidden"
          }`}
        >
          <h3 className="text-md font-bold text-gray-700 mb-2">
            Detailed Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm flex items-center mb-1">
                <MdOutlineWorkOutline className="w-4 h-4 mr-1" /> Work History:
              </h4>
              <ul className="space-y-1 text-xs bg-gray-50 p-2 rounded max-h-[150px] overflow-y-auto">
                {renderListItems(experienceArray)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm flex items-center mb-1">
                <FaGraduationCap className="w-4 h-4 mr-1" /> Qualifications:
              </h4>
              <ul className="space-y-1 text-xs bg-gray-50 p-2 rounded max-h-[150px] overflow-y-auto">
                {renderListItems(qualificationsArray)}
              </ul>
            </div>
          </div>
        </div>

        {!isExpanded && (
          <div className="absolute inset-x-0 bottom-[56px] h-[40px] bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-[#caa057] font-semibold py-2 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center text-sm mb-3 border border-[#caa057]"
        >
          {isExpanded ? (
            <>
              <FaChevronUp className="w-4 h-4 mr-2" /> View Less
            </>
          ) : (
            <>
              <FaChevronDown className="w-4 h-4 mr-2" /> View More Details
            </>
          )}
        </button>

        <div className="flex justify-between gap-3">
          <button
            onClick={() => {
              markAsContacted(candidate._id);
              window.open(`https://wa.me/${candidate.phonenumber}`, "_blank");
            }}
            className="w-1/3 bg-green-500 hover:bg-green-600 text-white text-sm py-2 rounded-lg"
          >
            WhatsApp
          </button>

          <button
            onClick={() => {
              markAsContacted(candidate._id);
              window.open(`tel:${candidate.phonenumber}`);
            }}
            className="w-1/3 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 rounded-lg"
          >
            Call
          </button>

          {onReject && (
            <button
              onClick={() => onReject(_id)}
              className="w-1/4 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1.5 rounded-lg transition"
            >
              <MdClose />Reject
            </button>
          )}

          {isVideoOpen && (
            <div className="fixed inset-0  bg-opacity-20 flex items-center justify-center z-[9999]">
              <div className="bg-white rounded-lg p-4 w-[90%] max-w-2xl relative">
                {/* Close Button */}
                <button
                  className="absolute top-5 right-5 text-gray-600 text-xl z-20 "
                  onClick={() => setIsVideoOpen(false)}
                >
                  ✕
                </button>

                {/* Video Player */}
                <video
                  src={videoSrc}
                  controls
                  autoPlay
                  className="w-full rounded z-10" 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
