"use client"
import React from "react"

const CandidateMiniCard = ({ candidate, onClick }) => {
  const { username, skills, profilePhoto, qualification } = candidate
  return (
    <div
      onClick={() => onClick(candidate)}
      className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4 cursor-pointer hover:shadow-lg transition"
    >
      <img
        src={profilePhoto || "https://cdn-icons-png.flaticon.com/512/219/219969.png"}
        alt={username}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div>
        <h3 className="font-semibold text-gray-800">{username}</h3>
        <p className="text-gray-500 text-sm">{qualification}</p>
        <p className="text-gray-600 text-xs">{skills?.join(", ") || "No skills listed"}</p>
      </div>
    </div>
  )
}

export default CandidateMiniCard
