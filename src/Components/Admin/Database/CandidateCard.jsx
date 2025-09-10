import React, { useState } from "react";
import {
  FaRupeeSign,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaLanguage,
  FaPhoneAlt,
} from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { MdPersonAdd } from "react-icons/md";

const CandidateCard = ({ candidate }) => {
  const [showphonenumber, setShowphonenumber] = useState(false);

  const {
    username,
    qualification,
    Skill,
    salaryExpectation,
    yearsofExperience,
    previousCompany,
    phonenumber,
  } = candidate || {};

  const inviteMessage = `Hello ${username}, this side Expertz Trust Finfra Pvt Ltd. You are selected for the interview. Please contact us for further details.`;

  const handleCall = () => {
    if (phonenumber) {
      window.open(`tel:${phonenumber}`, "_self");
    } else {
      alert("Candidate phonenumber is not available");
    }
  };

  const handleSMS = () => {
    if (phonenumber) {
      window.open(
        `sms:${phonenumber}?body=Hello ${username}, you are shortlisted for the interview.`,
        "_self"
      );
    } else {
      alert("Candidate phonenumber is not available");
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
      alert("Candidate phonenumber is not available");
    }
  };



  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 sm:p-8 w-full max-w-5xl mx-auto transition-transform hover:scale-[1.01]">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-5">
        {/* Left - Avatar + Details */}
        <div className="flex items-start gap-4 w-full">
          <img
            src="https://cdn-icons-png.flaticon.com/512/219/219969.png"
            alt="avatar"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border shadow-sm"
          />
          <div className="flex-1">
            {/* Name + NEW Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                {username || "Unknown"}
              </h2>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                NEW
              </span>
            </div>
            {/* Salary, Graduate, Language, Location */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-gray-600 text-sm">
              <span className="flex items-center gap-1">
                <FaRupeeSign /> {salaryExpectation || "N/A"}
              </span>
              <span className="flex items-center gap-1">
                <FaGraduationCap /> {qualification || "Not Provided"}
              </span>
              <span className="flex items-center gap-1">
                <FaLanguage /> Speaks Hindi
              </span>
              <span className="flex items-center gap-1">
                <FaMapMarkerAlt /> {previousCompany || "Not Provided"}
              </span>
            </div>
          </div>
        </div>

        {/* Right - Applied Today */}
        <div>
          <span className="bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 text-xs sm:text-sm font-medium px-3 py-1 rounded-full">
            Applied Today
          </span>
        </div>
      </div>

      {/* Middle Section - Skills, Assets, Docs, Exp */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6 text-sm">
        {/* Skills */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Skills</h3>
          <p className="text-gray-700">{Skill || "Not Provided"}</p>
        </div>

        {/* Assets */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Assets</h3>
          <p className="text-gray-700">Smartphone</p>
          <p className="text-gray-700">Internet Connection</p>
        </div>

        {/* Documents */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Documents</h3>
          <p className="text-gray-700">Bank Account</p>
          <p className="text-gray-700">Aadhar Card</p>
        </div>

        {/* Work Experience */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Work Experience</h3>
          <p className="text-gray-700">
            • <span className="font-semibold">{yearsofExperience || "0"}</span>{" "}
            yrs
            <br />
            at {previousCompany || "Not Provided"}
          </p>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 w-full">
        {/* View phonenumber / Call */}
        <button
          onClick={() => {
            if (phonenumber) {
              setShowphonenumber(true);
              handleCall();
            } else {
              alert("Candidate phonenumber is not available");
            }
          }}
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-5 py-2.5 rounded-xl shadow transition w-full sm:w-auto"
        >
          <FaPhoneAlt /> {showphonenumber ? phonenumber : "View phonenumber"}
        </button>

        {/* Send SMS */}
        <button
          onClick={handleSMS}
          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm px-5 py-2.5 rounded-xl shadow transition w-full sm:w-auto"
        >
          <IoMdSend /> Send SMS
        </button>

        {/* WhatsApp Invite */}
        <button
          onClick={handleWhatsAppInvite}
          className="flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-600 text-sm px-5 py-2.5 rounded-xl border shadow transition w-full sm:w-auto"
        >
          <MdPersonAdd /> Invite for Interview
        </button>
      </div>

      {/* Remove Option */}
      <div className="flex justify-end mt-5">
        <button className="text-gray-500 text-sm hover:text-red-500 transition">
          🗑 Remove
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;
