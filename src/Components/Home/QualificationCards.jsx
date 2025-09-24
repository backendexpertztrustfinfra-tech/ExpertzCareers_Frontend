"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

const qualifications = [
  {
    level: "Below 12th",
    vacancies: "8,10,000+",
    image: "https://cdn-icons-png.flaticon.com/512/2620/2620452.png",
  },
  {
    level: "12th Pass",
    vacancies: "6,50,000+",
    image: "https://cdn-icons-png.flaticon.com/512/16534/16534394.png",
  },
  {
    level: "UG / Graduate",
    vacancies: "7,80,000+",
    image: "https://cdn-icons-png.flaticon.com/512/2997/2997322.png",
  },
  {
    level: "Post Graduate",
    vacancies: "4,20,000+",
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135755.png",
  },
  {
    level: "PhD",
    vacancies: "1,10,000+",
    image: "https://cdn-icons-png.flaticon.com/512/3755/3755294.png",
  },
]

const QualificationCards = () => {
  const navigate = useNavigate()
  const [showNoJobsMsg, setShowNoJobsMsg] = useState(false)

  const handleClick = (qualification) => {
    const encoded = encodeURIComponent(qualification)
    navigate(`/jobs?qualification=${encoded}`)
  }

  return (
    <section className="py-14 px-4 sm:px-6 bg-gradient-to-br from-[#fff1ed] via-white to-[#fff1ed] relative">
      {/* Jobs Not Found Popup */}
      {showNoJobsMsg && (
        <div className="fixed top-40 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow z-50">
          Jobs Not Found
        </div>
      )}

      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 mb-10 tracking-tight">
          What is your <span className="text-[#caa057]">Qualification?</span>
        </h2>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
          {qualifications.map((item, index) => (
            <div
              key={index}
              onClick={() => handleClick(item.level)}
              className="cursor-pointer group bg-white rounded-2xl shadow-md border border-gray-100 
                          p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 
                          hover:border-[#caa057] flex flex-col items-center text-center"
            >
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.level}
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain mb-4 transition-transform 
                           duration-300 group-hover:scale-110"
              />

              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 group-hover:text-[#caa057]">
                {item.level}
              </h3>

              <p className="text-xs sm:text-sm text-gray-600">
                View <span className="text-[#caa057] font-bold">{item.vacancies}</span> Vacancies
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default QualificationCards