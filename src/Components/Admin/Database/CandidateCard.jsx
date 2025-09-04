import React from "react";
import {
  FaRupeeSign,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaLanguage,
  FaPhoneAlt,
} from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { MdPersonAdd } from "react-icons/md";

const CandidateCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 w-full max-w-5xl mx-auto">
      {/* Top Section */}
      <div className="flex justify-between items-start">
        {/* Left - Avatar + Details */}
        <div className="flex items-start gap-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/219/219969.png"
            alt="avatar"
            className="w-16 h-16 rounded-full"
          />
          <div>
            {/* Name + NEW Badge */}
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Komal</h2>
              <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded">
                NEW
              </span>
            </div>
            {/* Salary, Graduate, Language, Location */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-gray-600 text-sm">
              <span className="flex items-center gap-1">
                <FaRupeeSign /> 20,000/month
              </span>
              <span className="flex items-center gap-1">
                <FaGraduationCap /> Graduate
              </span>
              <span className="flex items-center gap-1">
                <FaLanguage /> Speaks Hindi
              </span>
              <span className="flex items-center gap-1">
                <FaMapMarkerAlt /> Sector 91, Faridabad
              </span>
            </div>
          </div>
        </div>

        {/* Right - Applied Today */}
        <div>
          <span className="bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 text-sm font-medium px-3 py-1 rounded-full">
            Applied Today
          </span>
        </div>
      </div>

      {/* Middle Section - Skills, Assets, Docs, Exp */}
      <div className="grid grid-cols-4 gap-6 mt-6 text-sm">
        {/* Skills */}
        <div>
          <h3 className="font-semibold mb-2">Skills</h3>
          <p className="text-gray-700">Social Media</p>
          <p className="text-gray-700">Google Analytics</p>
          <button className="text-blue-600 text-xs mt-1">3 more ▼</button>
        </div>

        {/* Assets */}
        <div>
          <h3 className="font-semibold mb-2">Assets</h3>
          <p className="text-gray-700">Smartphone</p>
          <p className="text-gray-700">Internet Connection</p>
        </div>

        {/* Documents */}
        <div>
          <h3 className="font-semibold mb-2">Documents</h3>
          <p className="text-gray-700">Bank Account</p>
          <p className="text-gray-700">Aadhar Card</p>
          <button className="text-blue-600 text-xs mt-1">1 more ▼</button>
        </div>

        {/* Work Experience */}
        <div>
          <h3 className="font-semibold mb-2">Work Experience</h3>
          <p className="text-gray-700">
            • <span className="font-semibold">1 Year & 5 Months</span> <br />
            in Digital Marketing at Ua
          </p>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex justify-between items-center mt-6">
        {/* Left - Empty Placeholder */}
        <div></div>

        {/* Right - Action Buttons */}
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-full shadow-sm">
            <FaPhoneAlt /> View Number
          </button>
          <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-full shadow-sm">
            <IoMdSend /> Send Message
          </button>
          <button className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-600 text-sm px-4 py-2 rounded-full shadow-sm">
            <MdPersonAdd /> Invite for Interview
          </button>
        </div>
      </div>

      {/* Remove Option */}
      <div className="flex justify-end mt-3">
        <button className="text-gray-500 text-sm hover:text-red-500">
          🗑 Remove
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;