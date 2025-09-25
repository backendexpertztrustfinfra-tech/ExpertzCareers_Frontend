"use client"

import { useState } from "react"
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
} from "react-icons/fa"
import { IoMdSend } from "react-icons/io";
import { sendNotification } from "../../../services/apis";
import { MdPersonAdd, MdOutlineWorkOutline } from "react-icons/md"

const CandidateCard = ({candidate, onSave, onReject, onShortlist, isSaved, selectedJob, token }) => {
  const [showPhone, setShowPhone] = useState(false)
  const {
    _id,
    username,
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
  } = candidate || {}

  const recruiterCompany = "Expertz Trust Finfra Pvt Ltd"
  const inviteMessage = `Hello ${username}, this side ${recruiterCompany}. You are selected for the interview. Please contact us for further details.`

  const handleCall = () => {
    if (phonenumber) {
      window.open(`tel:${phonenumber}`, "_self")
    }
  }

  const handleSMS = () => {
    if (phonenumber) {
      window.open(`sms:${phonenumber}?body=Hello ${username}, you are shortlisted for the interview.`, "_self")
    }
  }

  // const handleWhatsAppInvite = () => {
  //   if (phonenumber) {
  //     const encodedMessage = encodeURIComponent(inviteMessage)
  //     window.open(`https://wa.me/${phonenumber}?text=${encodedMessage}`)
  //   }
  // }

const handleWhatsAppInvite = async () => {
    if (phonenumber) {
      const encodedMessage = encodeURIComponent(inviteMessage)
      window.open(`https://wa.me/${phonenumber}?text=${encodedMessage}`)

      // ✅ Send "Shortlisted" notification to jobseeker
      if (token && selectedJob) {
        try {
          await sendNotification({
            token,
            title: "Shortlisted 🎉",
            description: `You have been shortlisted for ${selectedJob.title || "the job"}!`,
            type: "SHORTLISTED",
            isRead: false,
            userId: _id,
            jobId: selectedJob.id || selectedJob._id,
          })
          console.log("✅ Shortlist notification sent")
        } catch (err) {
          console.error("❌ Failed to send shortlist notification:", err)
        }}}}

  const handleSaveClick = (e) => { 
    e.stopPropagation()
    onSave(_id)
  }

  const isAppliedToday = (dateStr) => {
    if (!dateStr) return false
    const today = new Date()
    const date = new Date(dateStr)
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const appliedToday = isAppliedToday(appliedDate)

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 w-full max-w-5xl mx-auto hover:shadow-lg transition">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-5">
        <div className="flex items-start gap-4 w-full">
          <img
            src={profilePhoto || "https://cdn-icons-png.flaticon.com/512/219/219969.png"}
            alt={`${username || "Candidate"}'s avatar`}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{username || "Unknown"}</h2>
              {appliedToday && (
                <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">NEW</span>
              )}
              {isSaved && (
                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">Saved</span>
              )}
            </div>
            <div className="flex flex-wrap gap-4 mt-2 text-gray-600 text-sm">
              <span className="flex items-center gap-1">
                <FaRupeeSign /> {expectedSalary || "N/A"}
              </span>
              <span className="flex items-center gap-1">
                <FaGraduationCap /> {qualification || "Not Provided"}
              </span>
              <span className="flex items-center gap-1">
                <FaMapMarkerAlt /> {location || "Not Provided"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Applied: {lastActive || "Recently"}
          </span>
          {!isSaved && (
            <button onClick={handleSaveClick} className="text-blue-600 text-sm hover:underline flex items-center gap-1">
              <MdPersonAdd /> Save
            </button>
          )}
        </div>
      </div>

      {/* Grid Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 text-sm">
        {/* Skills */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
            <FaBriefcase className="text-gray-500" />
            Skills
          </h3>
          <p className="text-gray-600">
            {Array.isArray(skills) && skills.length > 0 ? skills.join(", ") : "Not Provided"}
          </p>
        </div>

        {/* Experience */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
            <MdOutlineWorkOutline className="text-gray-500" />
            Experience
          </h3>
          <p className="text-gray-600">{experience ? `${experience} years` : "Not Provided"}</p>
          {previousCompany && <p className="text-gray-500 text-xs mt-1">at {previousCompany}</p>}
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

        {/* Portfolio */}
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

      {/* Intro Video */}
      {introvideo && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
            <FaPlayCircle className="text-red-500" />
            Video Intro
          </h3>
          <video src={introvideo} className="w-full max-w-lg rounded-lg shadow-sm border" controls />
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
        <button
          onClick={() => {
            setShowPhone(true)
            handleCall()
          }}
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-5 py-2.5 rounded-lg transition w-full sm:w-auto"
        >
          <FaPhoneAlt /> {showPhone ? phonenumber : "View Phone"}
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
        <button
    onClick={() => onReject(_id)}
    className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm px-5 py-2.5 rounded-lg transition w-full sm:w-auto"
  >
    ❌ Reject
  </button>
      </div>
    </div>
  )
}

export default CandidateCard
