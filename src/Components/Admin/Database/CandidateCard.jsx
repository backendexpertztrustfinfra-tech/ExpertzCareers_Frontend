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
  FaChevronDown, 
  FaChevronUp,  
} from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { MdPersonAdd, MdOutlineWorkOutline, MdClose } from "react-icons/md";
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

/* Parse array of JSON */
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

// --- CandidateCard Component (UPDATED) ---

const CandidateCard = ({
  candidate,
  onSave,
  onReject,
  isSaved,
  selectedJob,
  token,
}) => {
  const [showPhone, setShowPhone] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); 

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

  // Data Parsing (UNCHANGED)
  const skillsArray = safeParseSkills(candidate.skills ?? candidate.Skill);
  const qualificationsArray = Array.isArray(candidate.qualification)
    ? candidate.qualification
    : parseMultiObjectString(candidate.qualification);
  const experienceArray = Array.isArray(candidate.experience)
    ? candidate.experience
    : parseMultiObjectString(candidate.experience);

  // Helper function to format date (UNCHANGED)
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
  
  // Actions logic (UNCHANGED)
  const appliedRecently = isAppliedWithin24Hours(appliedDate);
  const appliedTimeText = formatAppliedDate(appliedDate);
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
  
  // Helper Component for Info Rows (for readability)
  const InfoRow = ({ Icon, title, content }) => (
    <div className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
      <Icon className="w-5 h-5 text-[#caa057] shrink-0 mt-1" />
      <div>
        <p className="text-xs text-gray-500 font-medium">{title}</p>
        <p className="text-sm font-semibold text-gray-800 break-words">{content || "Not Provided"}</p>
      </div>
    </div>
  );

  // Helper Component for Link Buttons (for readability)
  const LinkButton = ({ link, Icon, label, colorClass = "text-blue-600" }) => {
    if (!link) return null;
    const finalLink = link.startsWith('http') || link.startsWith('tel') || link.startsWith('mailto') ? link : `${BASE_URL}${link}`;
    
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
  
  // Helper to format complex array list items for expansion (COMPACTED)
  const renderListItems = (arr) => {
      if (!arr || arr.length === 0) return <p className="text-gray-400">Not Provided</p>;
      
      return arr.map((item, index) => {
          const mainTitle = item.position || item.degree || "N/A";
          const subTitle = item.companyName || item.institution || "N/A";
          
          return (
              <li key={index} className="leading-tight mb-2 p-1 border-b border-gray-100 last:border-b-0">
                  <strong className="text-gray-800 block text-sm">{mainTitle}</strong>
                  <div className="text-xs text-gray-600">{subTitle}</div>
                  {item.duration && <div className="text-xs text-gray-500 mt-1">{item.duration}</div>}
              </li>
          );
      });
  };
  
  // Get preview data for core info grid
  const previewQualification = qualificationsArray[0]?.degree || 'N/A';
  const previewExperience = experienceArray[0]?.position || 'N/A';


  return (
    // **KEY FIX: Added 'relative' to the main container and managed dynamic height**
    <div 
        className={`bg-white rounded-xl shadow-lg border-2 border-orange-100 p-5 w-full mx-auto hover:shadow-xl transition flex flex-col justify-between relative ${isExpanded ? 'h-auto' : 'h-[400px]'}`}
        style={!isExpanded ? { maxHeight: '400px' } : {}} 
    >
        
        {/* Main Content Container with conditional overflow */}
        <div className={`flex flex-col gap-4 flex-grow relative ${!isExpanded ? 'overflow-hidden' : ''}`}> 
            
            {/* User Info & Save Button */}
            <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                    <img
                        src={profilePhoto || profilphoto || "https://cdn-icons-png.flaticon.com/512/219/219969.png"}
                        alt={`${username}'s avatar`}
                        className="w-16 h-16 rounded-full border-2 border-[#caa057] object-cover"
                        onError={(e) => { e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/219/219969.png"; }}
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
                        <p className="text-xs text-gray-500 mt-1">Applied: {appliedTimeText}</p>
                    </div>
                </div>

                <button
                    onClick={handleSaveClick}
                    className={`p-2 rounded-full transition-colors shrink-0 ${isSaved ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500'}`}
                    title={isSaved ? "Unsave Candidate" : "Save Candidate"}
                >
                    <MdPersonAdd className="w-5 h-5" />
                </button>
            </div>

            {/* Core Info Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm border-y py-3">
                <InfoRow Icon={FaMapMarkerAlt} title="Location" content={location} />
                <InfoRow Icon={FaRupeeSign} title="Expected Salary" content={expectedSalary} />
                <InfoRow Icon={FaGraduationCap} title="Education" content={previewQualification} />
                <InfoRow Icon={MdOutlineWorkOutline} title="Last Role" content={previewExperience} />
            </div>

            {/* Skills Preview */}
            <div className="mt-2">
                <h3 className="text-xs font-semibold text-[#caa057] mb-1">Skills:</h3>
                <div className="flex flex-wrap gap-2">
                    {skillsArray.slice(0, 5).map((skill, index) => (
                        <span key={index} className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-md">
                            {skill}
                        </span>
                    ))}
                    {skillsArray.length === 0 && <span className="text-xs text-gray-400">Not Provided</span>}
                    {skillsArray.length > 5 && <span className="text-xs text-gray-500">+{skillsArray.length - 5} more</span>}
                </div>
            </div>
            
            {/* Document Links Preview */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs mt-3 border-t pt-3">
                <LinkButton link={resume} Icon={FaFilePdf} label="Resume" colorClass="text-red-600" />
                <LinkButton link={portfioliolink || portfoliolink} Icon={FaLink} label="Portfolio" />
                <LinkButton link={certificationlink} Icon={FaLink} label="Certificates" />
                {introvideo && <LinkButton link={introvideo} Icon={FaPlayCircle} label="Video Intro" colorClass="text-purple-600" />}
            </div>

            {/* Use conditional class for a smooth transition */}
            <div className={`transition-all duration-300 ${isExpanded ? 'mt-4 pt-4 border-t block' : 'h-0 overflow-hidden'}`}>
                <h3 className="text-md font-bold text-gray-700 mb-2">Detailed Profile</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold text-sm flex items-center mb-1"><MdOutlineWorkOutline className="w-4 h-4 mr-1" /> Work History:</h4>
                        <ul className="space-y-1 text-xs bg-gray-50 p-2 rounded max-h-[150px] overflow-y-auto">
                           {renderListItems(experienceArray)}
                        </ul>
                    </div>
                    <div>
                         <h4 className="font-semibold text-sm flex items-center mb-1"><FaGraduationCap className="w-4 h-4 mr-1" /> Qualifications:</h4>
                        <ul className="space-y-1 text-xs bg-gray-50 p-2 rounded max-h-[150px] overflow-y-auto">
                            {renderListItems(qualificationsArray)}
                        </ul>
                    </div>
                </div>
            </div>
            
            {/* FADE OVERLAY & TOGGLE BUTTON AREA (Always Visible in Compact Mode) */}
            {!isExpanded && (
                <div className="absolute inset-x-0 bottom-[56px] h-[40px] bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
            )}
        </div>
        
        {/* Footer Actions & Expand Toggle (Always fixed at the bottom of the card) */}
        <div className="pt-4 border-t border-gray-100 flex flex-col">
             <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full text-[#caa057] font-semibold py-2 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center text-sm mb-3 border border-[#caa057]"
            >
                {isExpanded ? (
                    <><FaChevronUp className="w-4 h-4 mr-2" /> View Less</>
                ) : (
                    <><FaChevronDown className="w-4 h-4 mr-2" /> View More Details</>
                )}
            </button>
            
            {/* Quick Contact Buttons */}
            <div className="flex justify-between gap-3">
                <button
                  onClick={() => {
                    setShowPhone(true);
                    handleCall();
                  }}
                  className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1.5 rounded-lg transition flex-1"
                >
                  <FaPhoneAlt />{" "}
                  {showPhone && phonenumber !== "Not Provided" ? phonenumber : "Call"}
                </button>

                <button
                  onClick={handleWhatsAppInvite}
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1.5 rounded-lg transition flex-1"
                >
                  <IoMdSend /> WhatsApp
                </button>

                {onReject && (
                  <button
                    onClick={() => onReject(_id)}
                    className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1.5 rounded-lg transition w-1/4"
                  >
                    <MdClose />
                  </button>
                )}
            </div>
        </div>
    </div>
  );
};

export default CandidateCard;