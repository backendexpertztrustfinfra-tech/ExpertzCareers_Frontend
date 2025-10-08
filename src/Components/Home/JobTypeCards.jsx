"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

const jobTypes = [
  {
    title: "Work from Home",
    vacancies: "70,000+ Vacancies",
    icon: "https://cdn-icons-png.flaticon.com/512/553/553416.png",
  },
  {
    title: "Work from Office",
    vacancies: "18,000+ Vacancies",
    icon: "https://cdn-icons-png.flaticon.com/512/3374/3374185.png",
  },
  {
    title: "Part Time",
    vacancies: "80,000+ Vacancies",
    icon: "https://cdn-icons-png.flaticon.com/512/7870/7870924.png",
  },
  {
    title: "Freelancer",
    vacancies: "45,000+ Vacancies",
    icon: "https://cdn-icons-png.flaticon.com/512/5900/5900782.png",
  },
  {
    title: "Contractual / Temporary",
    vacancies: "45,000+ Vacancies",
    icon: "https://cdn-icons-png.flaticon.com/512/14959/14959782.png",
  },
]

const JobTypeCards = () => {
  const navigate = useNavigate()
  const [showNoJobsMsg, setShowNoJobsMsg] = useState(false)

  const handleTypeClick = (type) => {
    navigate(`/jobs?type=${encodeURIComponent(type)}`)
  }

  return (
    <div className="py-16 px-6 max-w-7xl mx-auto relative">
      {/* Jobs Not Found Popup */}
      {showNoJobsMsg && (
        <div className="fixed top-40 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow z-50">
          Jobs Not Found
        </div>
      )}

      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Choose Your <span className="text-[#caa057]">Job Type</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {jobTypes.map((job, index) => (
          <div
            key={index}
            onClick={() => handleTypeClick(job.title)}
            className="cursor-pointer bg-white/90 backdrop-blur-md rounded-2xl shadow-md border border-gray-100 hover:border-[#caa057] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 p-6 flex flex-col items-center text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#caa057]"
            tabIndex={0}
            role="button"
            aria-label={`View ${job.title} jobs`}
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#fff1ed] mb-4">
              <img src={job.icon || "/placeholder.svg"} alt={job.title} className="w-10 h-10 object-contain" />
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-1">{job.title}</h3>
            <p className="text-sm text-gray-500">{job.vacancies}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default JobTypeCards
