import React, { useState } from "react";
import {
  FaRupeeSign,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaLanguage,
  FaPhoneAlt,
  FaBriefcase,
  FaLink,
} from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { MdPersonAdd } from "react-icons/md";
import { FaPlayCircle, FaFilePdf, FaExternalLinkAlt } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";

const CandidateCard = ({ candidate, onSave, isSaved }) => {
  const [showphonenumber, setShowphonenumber] = useState(false);

  const {
    _id,
    username,
    useremail,
    designation,
    qualification,
    skills,
    location,
    expectedSalary,
    lastActive,
    experience,
    phonenumber,
    previousCompany,
    introvideo,
    resume,
    portfioliolink,
    certificationlink,
    profilePhoto,
    appliedDate,
  } = candidate || {};

  const recruiterCompany = "Expertz Trust Finfra Pvt Ltd";
  const inviteMessage = `Hello ${username}, this side ${recruiterCompany}. You are selected for the interview. Please contact us for further details.`;

  const handleCall = () => {
    if (phonenumber) {
      window.open(`tel:${phonenumber}`, "_self");
    } else {
      alert("Candidate phone number is not available");
    }
  };

  const handleSMS = () => {
    if (phonenumber) {
      window.open(
        `sms:${phonenumber}?body=Hello ${username}, you are shortlisted for the interview.`,
        "_self"
      );
    } else {
      alert("Candidate phone number is not available");
    }
  };

  const handleWhatsAppInvite = () => {
    if (phonenumber) {
      const encodedMessage = encodeURIComponent(inviteMessage);
      window.open(
        `https://wa.me/${phonenumber}?text=${encodedMessage}`,
        "_blank"
      );
    } else {
      alert("Candidate phone number is not available");
    }
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    onSave(_id);
  };

  const isAppliedToday = (appliedDate) => {
    if (!appliedDate) return false;
    const today = new Date();
    const date = new Date(appliedDate);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const appliedToday = isAppliedToday(appliedDate);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 sm:p-8 w-full max-w-5xl mx-auto transition-transform hover:scale-[1.01]">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-5">
        <div className="flex items-start gap-4 w-full">
          <img
            src={profilePhoto || "https://cdn-icons-png.flaticon.com/512/219/219969.png"}
            alt={`${username}'s avatar`}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border shadow-sm object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                {username || "Unknown"}
              </h2>
              {appliedToday && (
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  NEW
                </span>
              )}
              {isSaved && (
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  Saved
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-gray-600 text-sm">
              <span className="flex items-center gap-1">
                <FaRupeeSign /> {expectedSalary || "N/A"}
              </span>
              <span className="flex items-center gap-1">
                <FaGraduationCap /> {qualification || "Not Provided"}
              </span>
              <span className="flex items-center gap-1">
                <FaMapMarkerAlt /> {location || "Not Provided"}
              </span>
              {/* Note: I've removed the hardcoded languages and FaLanguage icon as it's not present in your data */}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <span className="bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 text-xs sm:text-sm font-medium px-3 py-1 rounded-full">
            Applied: {lastActive || "Recently"}
          </span>
          {!isSaved && (
            <button
              onClick={handleSaveClick}
              className="text-gray-500 text-sm hover:text-blue-500 transition flex items-center gap-1"
            >
              <MdPersonAdd /> Save Candidate
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 text-sm">
        {/* Skills */}
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
            <FaBriefcase className="text-gray-500" />
            Skills
          </h3>
          <div className="flex-1">
            <p className="text-gray-700">
              {Array.isArray(skills) && skills.length > 0
                ? skills.join(", ")
                : "Not Provided"}
            </p>
          </div>
        </div>

        {/* Experience */}
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
            <MdOutlineWorkOutline className="text-gray-500" />
            Work Experience
          </h3>
          <div className="flex-1">
            <p className="text-gray-700">
              {experience ? `${experience} years` : "Not Provided"}
            </p>
            {previousCompany && (
              <p className="text-gray-500 mt-1">at {previousCompany}</p>
            )}
          </div>
        </div>

        {/* Documents */}
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
            <FaFilePdf className="text-gray-500" />
            Documents
          </h3>
          <div className="flex flex-col space-y-2 flex-1">
            {resume ? (
              <a
                href={resume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <FaExternalLinkAlt className="w-3 h-3" /> Resume
              </a>
            ) : (
              <p className="text-gray-500">Resume Not Provided</p>
            )}
            {certificationlink ? (
              <a
                href={certificationlink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <FaExternalLinkAlt className="w-3 h-3" /> Certificates
              </a>
            ) : (
              <p className="text-gray-500">Certificates Not Provided</p>
            )}
          </div>
        </div>

        {/* Portfolio */}
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
            <FaLink className="text-gray-500" />
            Portfolio
          </h3>
          <div className="flex-1">
            {portfioliolink ? (
              <a
                href={portfioliolink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <FaExternalLinkAlt className="w-3 h-3" /> View Portfolio
              </a>
            ) : (
              <p className="text-gray-500">Not Provided</p>
            )}
          </div>
        </div>
      </div>

      {introvideo && (
        <div className="mt-6 flex flex-col items-center">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
            <FaPlayCircle className="text-red-500" />
            Video Intro
          </h3>
          <video
            src={introvideo}
            className="w-full max-w-md rounded-lg shadow-lg border-2 border-orange-300"
            controls
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 w-full">
        <button
          onClick={() => {
            setShowphonenumber(true);
            handleCall();
          }}
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-5 py-2.5 rounded-xl shadow transition w-full sm:w-auto"
        >
          <FaPhoneAlt /> {showphonenumber ? phonenumber : "View phone number"}
        </button>

        <button
          onClick={handleSMS}
          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm px-5 py-2.5 rounded-xl shadow transition w-full sm:w-auto"
        >
          <IoMdSend /> Send SMS
        </button>

        <button
          onClick={handleWhatsAppInvite}
          className="flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-600 text-sm px-5 py-2.5 rounded-xl border shadow transition w-full sm:w-auto"
        >
          <MdPersonAdd /> Invite for Interview
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;