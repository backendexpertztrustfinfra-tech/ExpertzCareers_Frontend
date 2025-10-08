"use client";

import { useState } from "react";
import {
  FaRupeeSign,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaBriefcase,
  FaLink,
  FaPlayCircle,
  FaFilePdf,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { MdPersonAdd, MdOutlineWorkOutline } from "react-icons/md";
import { sendNotification } from "../../../services/apis";
import { BASE_URL } from "../../../config";

/* Parse skills from array, JSON, or CSV */
const safeParseSkills = (skills) => {
  if (!skills) return [];
  if (Array.isArray(skills))
    return skills
      .filter(Boolean)
      .map((s) =>
        (typeof s === "string" ? s : s?.name || s?.skill || "").trim()
      )
      .filter(Boolean);
  if (typeof skills === "string") {
    try {
      const arr = JSON.parse(skills);
      if (Array.isArray(arr))
        return arr
          .filter(Boolean)
          .map((s) =>
            (typeof s === "string" ? s : s?.name || s?.skill || "").trim()
          )
          .filter(Boolean);
    } catch {}
    return skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

/* Parse array of JSON-like items separated by '@', fix quotes and keys */
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
          // If still not JSON, return as a best-effort object
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
}) => {
  const [showPhone, setShowPhone] = useState(false);

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
    appliedDate = null,
  } = candidate;

  // Skills can come from candidate.skills or candidate.Skill
  const skillsArray = safeParseSkills(candidate.skills ?? candidate.Skill);

  // Qualifications/Experience can be arrays or '@'-joined strings
  const qualificationsArray = Array.isArray(candidate.qualification)
    ? candidate.qualification
    : parseMultiObjectString(candidate.qualification);

  const experienceArray = Array.isArray(candidate.experience)
    ? candidate.experience
    : parseMultiObjectString(candidate.experience);

  // Applied time helpers
  const formatAppliedDate = (dateStr) => {
    if (!dateStr) return "Recently";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      if (Number.isNaN(date.getTime())) return "Recently";
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      if (diffInHours < 1) return "Just now";
      if (diffInHours < 24) return `${diffInHours} hours ago`;

      const todayStr = new Date().toDateString();
      const yest = new Date();
      yest.setDate(yest.getDate() - 1);
      const yestStr = yest.toDateString();

      if (date.toDateString() === todayStr) {
        return `Today at ${date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      }
      if (date.toDateString() === yestStr) {
        return `Yesterday at ${date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      }
      return date.toLocaleString("en-US", {
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

  const appliedRecently = isAppliedWithin24Hours(appliedDate);
  const appliedTimeText = formatAppliedDate(appliedDate);

  const recruiterCompany = selectedJob?.recruterCompany || "Our Company";
  const inviteMessage = `Hello ${username}, this is ${recruiterCompany}. You are selected for the interview. Please contact us for further details.`;

  // Actions
  const handleCall = () => {
    if (phonenumber && phonenumber !== "Not Provided") {
      window.open(`tel:${phonenumber}`, "_self");
    } else {
      alert("Phone number not available");
    }
  };

  const handleSMS = () => {
    if (phonenumber && phonenumber !== "Not Provided") {
      window.open(
        `sms:${phonenumber}?body=Hello ${username}, you are shortlisted for the interview.`,
        "_self"
      );
    } else {
      alert("Phone number not available");
    }
  };

  const handleWhatsAppInvite = async () => {
    if (!phonenumber || phonenumber === "Not Provided") {
      alert("Phone number not available");
      return;
    }
    const formattedPhone = String(phonenumber).replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(inviteMessage);
    window.open(`https://wa.me/${formattedPhone}?text=${encodedMessage}`);

    if (token && selectedJob && _id) {
      try {
        await sendNotification({
          token,
          type: "SHORTLISTED",
          userId: _id,
          extraData: {
            jobId: selectedJob._id || selectedJob.id,
            username: selectedJob.username || "Recruiter",
            title: selectedJob.title || "Job Position",
          },
        });
        console.log("✅ Shortlist notification sent");
      } catch (err) {
        console.error("❌ Failed to send shortlist notification:", err);
      }
    }
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (_id) {
      onSave?.(_id);
    } else {
      console.error("Cannot save candidate: Missing candidate ID");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 w-full max-w-5xl mx-auto hover:shadow-lg transition">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-5">
        <div className="flex items-start gap-4 w-full">
          <img
            src={
              profilePhoto ||
              profilphoto ||
              "https://cdn-icons-png.flaticon.com/512/219/219969.png"
            }
            alt={`${username}'s avatar`}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://cdn-icons-png.flaticon.com/512/219/219969.png";
            }}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
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
            <div className="flex flex-wrap gap-4 mt-2 text-gray-600 text-sm">
              {/* <span className="flex items-center gap-1">
                <FaRupeeSign /> {expectedSalary}
              </span> */}

              {/* Qualification list (multi) */}
              <div className="min-w-[200px]">
                <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-1">
                  <FaGraduationCap className="text-gray-500" />
                  Qualification
                </h3>
                {qualificationsArray.length > 0 ? (
                  <ul className="space-y-1 text-gray-600">
                    {qualificationsArray.map((q, index) => (
                      <li key={index} className="leading-snug">
                        <strong>{q.degree || q.title || "N/A"}</strong>
                        {q.fieldOfStudy ? <> – {q.fieldOfStudy}</> : null}
                        <div className="text-sm text-gray-500">
                          {q.institution ||
                            q.instution ||
                            "Institution not provided"}
                        </div>
                        {q.duration && (
                          <div className="text-xs text-gray-400">
                            {q.duration}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">Not Provided</p>
                )}
              </div>

              <span className="flex items-center gap-1">
                <FaMapMarkerAlt /> {location}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
            Applied: {appliedTimeText}
          </span>
          {!isSaved && (
            <button
              onClick={handleSaveClick}
              className="flex items-center gap-1 text-blue-600 text-sm hover:underline"
            >
              <MdPersonAdd /> Save
            </button>
          )}
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 text-sm">
        {/* Skills */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
            <FaBriefcase className="text-gray-500" />
            Skills
          </h3>
          <p className="text-gray-600">
            {skillsArray.length > 0 ? skillsArray.join(", ") : "Not Provided"}
          </p>
        </div>

        {/* Experience */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
            <MdOutlineWorkOutline className="text-gray-500" />
            Experience
          </h3>
          {experienceArray.length > 0 ? (
            <ul className="space-y-1 text-gray-600">
              {experienceArray.map((exp, index) => (
                <li key={index} className="leading-snug">
                  <strong>{exp.position || exp.designation || "N/A"}</strong> at{" "}
                  {exp.companyName || exp.company || "N/A"}
                  {exp.duration && (
                    <div className="text-xs text-gray-400">{exp.duration}</div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Not Provided</p>
          )}
        </div>

        {/* Documents */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
            <FaFilePdf className="text-gray-500" />
            Documents
          </h3>
          <div className="space-y-1">
            {resume ? (
              <a
                href={
                  resume?.startsWith("http") ? resume : `${BASE_URL}/${resume}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                <FaExternalLinkAlt className="w-3 h-3" /> Resume
              </a>
            ) : (
              <p className="text-gray-400">Resume Not Provided</p>
            )}
            {certificationlink ? (
              <a
                href={certificationlink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                <FaExternalLinkAlt className="w-3 h-3" /> Certificates
              </a>
            ) : (
              <p className="text-gray-400">Certificates Not Provided</p>
            )}
          </div>
        </div>

        {/* Portfolio */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
            <FaLink className="text-gray-500" />
            Portfolio
          </h3>
          {portfioliolink || portfoliolink ? (
            <a
              href={portfioliolink || portfoliolink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:underline"
            >
              <FaExternalLinkAlt className="w-3 h-3" /> View Portfolio
            </a>
          ) : (
            <p className="text-gray-400">Not Provided</p>
          )}
        </div>
      </div>

      {/* Intro Video */}
      {introvideo && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
            <FaPlayCircle className="text-red-500" />
            Video Intro
          </h3>
          <video
            src={introvideo}
            className="w-full max-w-lg rounded-lg shadow-sm border"
            controls
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
        <button
          onClick={() => {
            setShowPhone(true);
            handleCall();
          }}
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-5 py-2.5 rounded-lg transition w-full sm:w-auto"
        >
          <FaPhoneAlt />{" "}
          {showPhone && phonenumber !== "Not Provided"
            ? phonenumber
            : "View Phone"}
        </button>

        <button
          onClick={handleSMS}
          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm px-5 py-2.5 rounded-lg transition w-full sm:w-auto"
        >
          <IoMdSend /> SMS
        </button>

        <button
          onClick={handleWhatsAppInvite}
          className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-5 py-2.5 rounded-lg border transition w-full sm:w-auto"
        >
          <MdPersonAdd /> WhatsApp Invite
        </button>

        {onReject && (
          <button
            onClick={() => onReject(_id)}
            className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm px-5 py-2.5 rounded-lg transition w-full sm:w-auto"
          >
            ❌ Reject
          </button>
        )}
      </div>
    </div>
  );
};

export default CandidateCard;
