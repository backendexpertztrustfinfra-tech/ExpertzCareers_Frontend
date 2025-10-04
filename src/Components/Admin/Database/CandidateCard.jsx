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
import { sendNotification } from "../../../services/apis";
import { MdPersonAdd, MdOutlineWorkOutline } from "react-icons/md";

// Helper function to safely parse skills from a JSON string or comma-separated string
const safeParseSkills = (skills) => {
  if (Array.isArray(skills)) {
    return skills;
  }
  if (typeof skills === "string" && skills.trim()) {
    try {
      return JSON.parse(skills);
    } catch (e) {
      return skills.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
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
    qualification = "Not Provided",
    location = "Not Provided",
    expectedSalary = "N/A",
    lastActive = "Recently",
    experience = 0,
    phonenumber = "Not Provided",
    previousCompany = "Not Provided",
    introvideo = null,
    resume = null,
    portfioliolink = null,
    certificationlink = null,
    profilePhoto = null,
    appliedDate = null,
  } = candidate;

  // Use the helper function to get a clean skills array
  const skillsArray = safeParseSkills(candidate.skills);

  const recruiterCompany = selectedJob?.recruterCompany || "Our Company";
  const inviteMessage = `Hello ${username}, this is ${recruiterCompany}. You are selected for the interview. Please contact us for further details.`;

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

    const encodedMessage = encodeURIComponent(inviteMessage);
    window.open(`https://wa.me/${phonenumber}?text=${encodedMessage}`);

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
      onSave(_id);
    } else {
      console.error("Cannot save candidate: Missing candidate ID");
    }
  };

  const formatAppliedDate = (dateStr) => {
    if (!dateStr) return "Recently";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      if (diffInHours < 1) return "Just now";
      if (diffInHours < 24) return `${diffInHours} hours ago`;
      if (diffInHours < 48) return "Yesterday";
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays} days ago`;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (err) {
      return "Recently";
    }
  };

  const isAppliedToday = (dateStr) => {
    if (!dateStr) return false;
    try {
      const today = new Date();
      const date = new Date(dateStr);
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    } catch (err) {
      return false;
    }
  };

  const appliedToday = isAppliedToday(appliedDate);
  const appliedTimeText = formatAppliedDate(appliedDate);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 w-full max-w-5xl mx-auto hover:shadow-lg transition">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-5">
        <div className="flex items-start gap-4 w-full">
          <img
            src={profilePhoto || "https://cdn-icons-png.flaticon.com/512/219/219969.png"}
            alt={`${username}'s avatar`}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border object-cover"
            onError={(e) => {
              e.target.src = "https://cdn-icons-png.flaticon.com/512/219/219969.png";
            }}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                {username}
              </h2>
              {appliedToday && (
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
              <span className="flex items-center gap-1">
                <FaRupeeSign /> {expectedSalary}
              </span>
              <span className="flex items-center gap-1">
                <FaGraduationCap /> {qualification}
              </span>
              <span className="flex items-center gap-1">
                <FaMapMarkerAlt /> {location}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Applied: {appliedTimeText}
          </span>
          {!isSaved && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSaveClick(e);
              }}
              className="flex items-center gap-1 text-blue-600 text-sm hover:underline"
            >
              <MdPersonAdd /> Save
            </button>
          )}
          {isSaved && (
            <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
              Saved
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 text-sm">
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
            <FaBriefcase className="text-gray-500" />
            Skills
          </h3>
          <p className="text-gray-600">
            {skillsArray.length > 0 ? skillsArray.join(", ") : "Not Provided"}
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
            <MdOutlineWorkOutline className="text-gray-500" />
            Experience
          </h3>
          <p className="text-gray-600">
            {experience ? `${experience} years` : "Not Provided"}
          </p>
          {previousCompany && previousCompany !== "Not Provided" && (
            <p className="text-gray-500 text-xs mt-1">at {previousCompany}</p>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
            <FaFilePdf className="text-gray-500" />
            Documents
          </h3>
          <div className="space-y-1">
            {resume ? (
              <a
                href={resume}
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
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
            <FaLink className="text-gray-500" />
            Portfolio
          </h3>
          {portfioliolink ? (
            <a
              href={portfioliolink}
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