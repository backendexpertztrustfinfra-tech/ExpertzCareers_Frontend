"use client"

import { useState, useEffect } from "react"
import { X, Download, Eye } from "lucide-react"
import generateResume from "../utils/generateResume"

const ResumePreview = ({ profileData, isOpen, onClose }) => {
  const [previewData, setPreviewData] = useState(null)

  useEffect(() => {
    if (profileData && isOpen) {
      setPreviewData(profileData)
    }
  }, [profileData, isOpen])

  if (!isOpen || !previewData) return null

  const {
    name = "",
    designation = "",
    email = "",
    phone = "",
    location = "",
    experience = "",
    bio = "",
    summary = "",
    Skills = "",
    skills = "",
    qualification = "",
    projects = "",
    certificationlink = "",
    currentSalary = "",
    expectedSalary = "",
    preferredLocation = "",
    previousCompany = "",
    portfioliolink = "",
    image = "",
  } = previewData

  const skillsData = Skills || skills || ""
  const summaryData = summary || bio || ""

  const handleDownloadPDF = () => {
    generateResume(previewData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <Eye className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Resume Preview</h2>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Header Section */}
            <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-blue-50 border-b-4 border-blue-600 rounded-t-lg">
              {image && (
                <img
                  src={image || "/placeholder.svg"}
                  alt={name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-blue-600"
                />
              )}
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{name || "Your Name"}</h1>
              {designation && (
                <p className="text-xl text-blue-600 font-semibold mb-4 uppercase tracking-wide">{designation}</p>
              )}
              <div className="flex flex-wrap justify-center gap-4 text-gray-600">
                {email && <span className="bg-white px-3 py-1 rounded-full border">📧 {email}</span>}
                {phone && <span className="bg-white px-3 py-1 rounded-full border">📱 {phone}</span>}
                {location && <span className="bg-white px-3 py-1 rounded-full border">📍 {location}</span>}
                {experience && (
                  <span className="bg-white px-3 py-1 rounded-full border">💼 {experience} Experience</span>
                )}
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Professional Summary */}
              {summaryData && (
                <div>
                  <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2 mb-4 uppercase tracking-wide">
                    Professional Summary
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{summaryData}</p>
                </div>
              )}

              {/* Skills */}
              {skillsData && (
                <div>
                  <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2 mb-4 uppercase tracking-wide">
                    Core Skills & Expertise
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {skillsData.split(",").map((skill, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2 rounded-full text-center font-medium border border-blue-200"
                      >
                        {skill.trim()}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Professional Experience */}
              {(previousCompany || experience) && (
                <div>
                  <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2 mb-4 uppercase tracking-wide">
                    Professional Experience
                  </h2>
                  <div className="space-y-3">
                    {previousCompany && (
                      <p className="text-gray-700">
                        <strong className="text-gray-800">Previous Company:</strong> {previousCompany}
                      </p>
                    )}
                    {experience && (
                      <p className="text-gray-700">
                        <strong className="text-gray-800">Years of Experience:</strong> {experience}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Education */}
              {qualification && (
                <div>
                  <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2 mb-4 uppercase tracking-wide">
                    Education & Qualifications
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{qualification}</p>
                </div>
              )}

              {/* Projects & Portfolio */}
              {(projects || portfioliolink) && (
                <div>
                  <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2 mb-4 uppercase tracking-wide">
                    Projects & Portfolio
                  </h2>
                  <div className="space-y-3">
                    {projects && (
                      <p className="text-gray-700">
                        <strong className="text-gray-800">Projects:</strong> {projects}
                      </p>
                    )}
                    {portfioliolink && (
                      <p className="text-gray-700">
                        <strong className="text-gray-800">Portfolio:</strong>{" "}
                        <a
                          href={portfioliolink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {portfioliolink}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {certificationlink && (
                <div>
                  <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2 mb-4 uppercase tracking-wide">
                    Certifications & Achievements
                  </h2>
                  <p className="text-gray-700">
                    <a
                      href={certificationlink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View Certifications →
                    </a>
                  </p>
                </div>
              )}

              {/* Salary & Preferences */}
              {(currentSalary || expectedSalary || preferredLocation) && (
                <div>
                  <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2 mb-4 uppercase tracking-wide">
                    Compensation & Preferences
                  </h2>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    {currentSalary && (
                      <p className="text-gray-700">
                        <strong className="text-gray-800">Current Salary:</strong> {currentSalary}
                      </p>
                    )}
                    {expectedSalary && (
                      <p className="text-gray-700">
                        <strong className="text-gray-800">Expected Salary:</strong> {expectedSalary}
                      </p>
                    )}
                    {preferredLocation && (
                      <p className="text-gray-700">
                        <strong className="text-gray-800">Preferred Location:</strong> {preferredLocation}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumePreview
