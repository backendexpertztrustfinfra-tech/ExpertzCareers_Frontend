"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import candidateService from "../api/candidateService"

const CandidateDetail = () => {
  const { id } = useParams()
  const [candidate, setCandidate] = useState(null)

  useEffect(() => {
    candidateService.getCandidateById(id).then((data) => {
      setCandidate(data)
    })
  }, [id])

  if (!candidate) return <p className="text-center text-gray-500 py-10">Loading...</p>

  return (
    <div className="bg-[#fff1ed] p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 max-w-4xl mx-auto my-10 text-gray-800">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={candidate.photoUrl || "https://cdn-icons-png.flaticon.com/512/219/219969.png"}
          alt={`${candidate.name}'s profile`}
          className="w-24 h-24 rounded-full object-cover border-2 border-[#caa057]"
        />
        <div>
          <h1 className="text-3xl font-bold text-[#caa057]">{candidate.name}</h1>
          <p className="text-gray-600 mt-1">{candidate.designation || "Not specified"}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <p className="text-lg">
          <strong className="font-semibold text-gray-900">Email:</strong> {candidate.email}
        </p>
        <p className="text-lg">
          <strong className="font-semibold text-gray-900">Phone:</strong> {candidate.phone}
        </p>
        <p className="text-lg">
          <strong className="font-semibold text-gray-900">Skills:</strong>{" "}
          {candidate.skills && candidate.skills.length > 0 ? candidate.skills.join(", ") : "Not provided"}
        </p>

        {candidate.resumeUrl && (
          <a
            href={candidate.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#caa057] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#b4924c] transition-colors"
          >
            Download Resume
          </a>
        )}
      </div>

      {/* You can create subcomponents for experience, education, etc. */}
    </div>
  )
}

export default CandidateDetail