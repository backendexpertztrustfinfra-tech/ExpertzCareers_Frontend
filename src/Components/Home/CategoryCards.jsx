"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

const jobCategories = [
  { title: "Delivery", vacancies: "8,10,000+", image: "https://cdn-icons-png.flaticon.com/512/3465/3465848.png" },
  {
    title: "Web Development",
    vacancies: "8,10,000+",
    image: "https://cdn-icons-png.flaticon.com/512/1055/1055687.png",
  },
  {
    title: "Digital Marketing",
    vacancies: "8,10,000+",
    image: "https://cdn-icons-png.flaticon.com/512/4149/4149654.png",
  },
  { title: "Graphic Design", vacancies: "8,10,000+", image: "https://cdn-icons-png.flaticon.com/512/1821/1821064.png" },
  { title: "Security Guard", vacancies: "8,10,000+", image: "https://cdn-icons-png.flaticon.com/512/3144/3144436.png" },
  { title: "Driver", vacancies: "8,10,000+", image: "https://cdn-icons-png.flaticon.com/512/3300/3300786.png" },
  { title: "Accountant", vacancies: "8,10,000+", image: "https://cdn-icons-png.flaticon.com/512/2164/2164713.png" },
  { title: "HR Executive", vacancies: "8,10,000+", image: "https://cdn-icons-png.flaticon.com/512/3048/3048396.png" },
  { title: "Receptionist", vacancies: "8,10,000+", image: "https://cdn-icons-png.flaticon.com/512/2620/2620984.png" },
  { title: "Office Assistant", vacancies: "8,10,000+", image: "https://cdn-icons-png.flaticon.com/512/174/174881.png" },
  {
    title: "Customer Support",
    vacancies: "8,10,000+",
    image: "https://cdn-icons-png.flaticon.com/512/1180/1180998.png",
  },
  { title: "Electrician", vacancies: "8,10,000+", image: "https://cdn-icons-png.flaticon.com/512/3242/3242257.png" },
]

const CategoryCards = () => {
  const [visibleCount, setVisibleCount] = useState(8)
  const [showNoJobsMsg, setShowNoJobsMsg] = useState(false)
  const navigate = useNavigate()

  const handleShowMore = () => setVisibleCount((prev) => prev + 4)

  const handleClick = (title) => {
    navigate(`/jobs?category=${encodeURIComponent(title)}`)
  }

  const visibleCategories = jobCategories.slice(0, visibleCount)
  const hasMore = visibleCount < jobCategories.length

  return (
    <section className="relative py-12 sm:py-16 px-4 sm:px-8 bg-gradient-to-br from-[#fff1ed] via-white to-[#fff1ed]">
      {/* Jobs Not Found Alert */}
      {showNoJobsMsg && (
        <div className="fixed top-40 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow z-50">
          Jobs Not Found
        </div>
      )}

      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 drop-shadow-sm">
          Explore Popular Job Categories
        </h2>
        <p className="text-gray-600 mt-3 text-sm sm:text-lg max-w-2xl mx-auto">
          Browse opportunities across multiple industries and find your ideal career with{" "}
          <span className="font-semibold text-[#caa057]">millions of active listings</span>.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7 lg:gap-10 max-w-7xl mx-auto">
        {visibleCategories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleClick(category.title)}
            className="group relative bg-white/60 backdrop-blur-xl rounded-2xl shadow-md 
                         hover:shadow-2xl transition-all duration-500 cursor-pointer 
                         border border-gray-100 p-6 sm:p-7 flex flex-col items-center text-center"
          >
            <div
              className="absolute inset-0 rounded-2xl border-2 border-transparent 
                                 group-hover:border-[#caa057] transition-all duration-500"
            ></div>

            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#fff1ed] via-[#fff1ed] to-[#fff1ed] 
                                 flex items-center justify-center shadow-inner mb-4 group-hover:scale-105 transition"
            >
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.title}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-[#caa057] transition">
              {category.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              <span className="text-blue-600 font-semibold">{category.vacancies}</span> vacancies
            </p>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={handleShowMore}
            className="bg-gradient-to-r from-[#caa057] to-[#caa057] hover:from-[#b4924c] hover:to-[#b4924c] 
                         text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg 
                         transition-transform transform hover:scale-105 duration-300 text-sm sm:text-base"
          >
            Show More
          </button>
        </div>
      )}
    </section>
  )
}

export default CategoryCards