



// // updated 
// "use client"

// import { motion } from "framer-motion"
// import { BookmarkIcon, Clock, Users, TrendingUp } from "lucide-react"
// import { useNavigate } from "react-router-dom"

// const JobCard = ({ job, showActions = true, isSaved, isApplied, onSave, onApply, applyLoading }) => {
//   const navigate = useNavigate()

//   const handleViewDetails = (e) => { e?.stopPropagation(); navigate(`/jobs/${job.id}`, { state: { job } }) }

//   return (
//     <div
//       onClick={handleViewDetails}
//       className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-6 mb-5 cursor-pointer border border-[#fff1ed]"
//     >
//       <div className="flex justify-between items-start mb-3">
//         <div className="flex gap-3 items-center">
//           <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-[#fff1ed] flex items-center justify-center border border-[#fff1ed]">
//             <img src={job.logo || "/placeholder.svg"} alt={job.company} className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
//           </div>
//           <div>
//             <h3 className="text-lg sm:text-xl font-semibold text-gray-800 line-clamp-1">{job.title}</h3>
//             <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
//               <TrendingUp size={14} className="text-[#caa057]" />
//               <span className="line-clamp-1">{job.company}</span>
//             </div>
//           </div>
//         </div>
//         <div className="flex gap-2 relative">
//           <motion.button
//             onClick={(e) => { e.stopPropagation(); onSave() }}
//             whileTap={{ scale: 0.8 }}
//             animate={{ scale: isSaved ? [1, 1.3, 1] : 1 }}
//             transition={{ duration: 0.3 }}
//             className="p-1.5 rounded-lg relative"
//           >
//             <BookmarkIcon size={18} className={isSaved ? "text-[#caa057] fill-[#caa057]" : "text-gray-500"} />
//           </motion.button>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2 mb-3 text-xs sm:text-sm">
//         <Detail icon={<Clock size={12} className="text-[#caa057]" />} text={job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "—"} />
//         <Detail icon={<Users size={12} className="text-[#caa057]" />} text={job.applicants || "—"} />
//       </div>

//       {showActions && (
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-[#fff1ed]">
//           <button
//             onClick={(e) => { e.stopPropagation(); onApply() }}
//             disabled={isApplied || applyLoading}
//             className={`px-4 py-2 rounded-lg font-medium text-xs sm:text-sm w-full sm:w-auto flex justify-center items-center gap-2 ${
//               isApplied ? "bg-green-500 text-white cursor-not-allowed" : "bg-gradient-to-r from-[#caa057] to-[#caa057] text-white"
//             }`}
//           >
//             {applyLoading ? <span className="loader border-white border-t-2 w-4 h-4 rounded-full animate-spin"></span> :
//              isApplied ? "✅ Applied" : "Apply Now"}
//           </button>
//           <button
//             onClick={handleViewDetails}
//             className="px-4 py-2 rounded-lg font-medium text-xs sm:text-sm border border-[#caa057] text-[#caa057] w-full sm:w-auto"
//           >
//             View Details
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }

// const Detail = ({ icon, text }) => (
//   <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 p-1.5 rounded bg-[#fff1ed]">
//     <div className="p-1 rounded bg-white shadow-sm">{icon}</div>
//     <span className="truncate">{text || "—"}</span>
//   </div>
// )

// export default JobCard




// updated

// "use client"

// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import { BookmarkIcon, Clock, Users, TrendingUp } from "lucide-react"
// import { useNavigate } from "react-router-dom"
// import Cookies from "js-cookie"
// import { BASE_URL } from "../../config"

// const JobCard = ({ job, showActions = true, onUpdate }) => {
//   const navigate = useNavigate()
//   const token = Cookies.get("userToken")

//   const [isSaved, setIsSaved] = useState(false)
//   const [isApplied, setIsApplied] = useState(false)
//   const [applyLoading, setApplyLoading] = useState(false)

//   // Initialize saved/applied status
//   useEffect(() => {
//     const fetchStatus = async () => {
//       if (!token) return
//       try {
//         const savedResp = await fetch(`${BASE_URL}/jobseeker/getsavedJobs`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         const savedData = await savedResp.json()
//         setIsSaved(savedData.savedJobs?.some((j) => j._id === job.id || j.id === job.id))

//         const appliedResp = await fetch(`${BASE_URL}/jobseeker/appliedjobs`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         const appliedData = await appliedResp.json()
//         setIsApplied(appliedData.appliedJobs?.some((j) => j._id === job.id || j.id === job.id))
//       } catch (err) {
//         console.error("Status fetch error:", err)
//       }
//     }
//     fetchStatus()
//   }, [job.id, token])

//   // Save / Unsave
//   const handleSave = async (e) => {
//     e.stopPropagation()
//     if (!token) return alert("❌ Please log in to save jobs.")

//     try {
//       if (!isSaved) {
//         const resp = await fetch(`${BASE_URL}/jobseeker/savejob/${job.id}`, {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         if (!resp.ok) throw new Error("Failed to save job")
//         setIsSaved(true)
//       } else {
//         const resp = await fetch(`${BASE_URL}/jobseeker/removesavedjob/${job.id}`, {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         if (!resp.ok) throw new Error("Failed to remove job")
//         setIsSaved(false)
//       }
//       if (onUpdate) onUpdate()
//     } catch (err) {
//       console.error(err)
//       alert("❌ " + err.message)
//     }
//   }

//   // Apply
//   const handleApply = async (e) => {
//     e.stopPropagation()
//     if (!token) return alert("❌ Please log in to apply.")
//     if (isApplied) return alert("✅ Already applied.")
//     setApplyLoading(true)

//     try {
//       const resp = await fetch(`${BASE_URL}/jobseeker/applyforjob/${job.id}`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         body: JSON.stringify({}),
//       })
//       if (!resp.ok) throw new Error("Failed to apply")
//       setIsApplied(true)
//       if (onUpdate) onUpdate()
//       alert("✅ Application submitted!")
//     } catch (err) {
//       console.error(err)
//       alert("❌ " + err.message)
//     } finally {
//       setApplyLoading(false)
//     }
//   }

//   const handleViewDetails = (e) => {
//     e?.stopPropagation()
//     navigate(`/jobs/${job.id}`, { state: { job } })
//   }

//   return (
//     <div
//       onClick={handleViewDetails}
//       className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-6 mb-5 cursor-pointer border border-[#fff1ed]"
//     >
//       <div className="flex justify-between items-start mb-3">
//         <div className="flex gap-3 items-center">
//           <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-[#fff1ed] flex items-center justify-center border border-[#fff1ed]">
//             <img src={job.logo || "/placeholder.svg"} alt={job.company} className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
//           </div>
//           <div>
//             <h3 className="text-lg sm:text-xl font-semibold text-gray-800 line-clamp-1">{job.title}</h3>
//             <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
//               <TrendingUp size={14} className="text-[#caa057]" />
//               <span className="line-clamp-1">{job.company}</span>
//             </div>
//           </div>
//         </div>
//         <div className="flex gap-2 relative">
//           <motion.button
//             onClick={handleSave}
//             whileTap={{ scale: 0.8 }}
//             animate={{ scale: isSaved ? [1, 1.3, 1] : 1 }}
//             transition={{ duration: 0.3 }}
//             className="p-1.5 rounded-lg relative"
//           >
//             <BookmarkIcon size={18} className={isSaved ? "text-[#caa057] fill-[#caa057]" : "text-gray-500"} />
//           </motion.button>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2 mb-3 text-xs sm:text-sm">
//         <Detail icon={<Clock size={12} className="text-[#caa057]" />} text={job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "—"} />
//         <Detail icon={<Users size={12} className="text-[#caa057]" />} text={job.applicants || "—"} />
//       </div>

//       {showActions && (
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-[#fff1ed]">
//           <button
//             onClick={handleApply}
//             disabled={isApplied || applyLoading}
//             className={`px-4 py-2 rounded-lg font-medium text-xs sm:text-sm w-full sm:w-auto flex justify-center items-center gap-2 ${
//               isApplied ? "bg-green-500 text-white cursor-not-allowed" : "bg-gradient-to-r from-[#caa057] to-[#caa057] text-white"
//             }`}
//           >
//             {applyLoading ? <span className="loader border-white border-t-2 w-4 h-4 rounded-full animate-spin"></span> :
//              isApplied ? "✅ Applied" : "Apply Now"}
//           </button>
//           <button
//             onClick={handleViewDetails}
//             className="px-4 py-2 rounded-lg font-medium text-xs sm:text-sm border border-[#caa057] text-[#caa057] w-full sm:w-auto"
//           >
//             View Details
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }

// const Detail = ({ icon, text }) => (
//   <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 p-1.5 rounded bg-[#fff1ed]">
//     <div className="p-1 rounded bg-white shadow-sm">{icon}</div>
//     <span className="truncate">{text || "—"}</span>
//   </div>
// )

// export default JobCard
//





// // updated with kachra 
// "use client"

// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import { BookmarkIcon, Clock, Users, TrendingUp } from "lucide-react"
// import { useNavigate } from "react-router-dom"
// import Cookies from "js-cookie"
// import { BASE_URL } from "../../config"
// import { toast } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"

// const JobCard = ({ job, showActions = true, onUpdate }) => {
//   const navigate = useNavigate()
//   const token = Cookies.get("userToken")

//   const [isSaved, setIsSaved] = useState(false)
//   const [isApplied, setIsApplied] = useState(false)
//   const [applyLoading, setApplyLoading] = useState(false)

//   // Initialize saved/applied status
//   useEffect(() => {
//     const fetchStatus = async () => {
//       if (!token) return
//       try {
//         const savedResp = await fetch(`${BASE_URL}/jobseeker/getsavedJobs`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         const savedData = await savedResp.json()
//         setIsSaved(savedData.savedJobs?.some((j) => j._id === job.id || j.id === job.id))

//         const appliedResp = await fetch(`${BASE_URL}/jobseeker/appliedjobs`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         const appliedData = await appliedResp.json()
//         setIsApplied(appliedData.appliedJobs?.some((j) => j._id === job.id || j.id === job.id))
//       } catch (err) {
//         console.error("Status fetch error:", err)
//       }
//     }
//     fetchStatus()
//   }, [job.id, token])

//   // Save / Unsave
//   const handleSave = async (e) => {
//     e.stopPropagation()
//     if (!token) return toast.error("❌ Please log in to save jobs.")

//     try {
//       if (!isSaved) {
//         const resp = await fetch(`${BASE_URL}/jobseeker/savejob/${job.id}`, {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         if (!resp.ok) throw new Error("Failed to save job")
//         setIsSaved(true)
//         toast.success("✅ Job saved!")
//       } else {
//         const resp = await fetch(`${BASE_URL}/jobseeker/removesavedjob/${job.id}`, {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         if (!resp.ok) throw new Error("Failed to remove job")
//         setIsSaved(false)
//         toast.info("🗑️ Job removed from saved")
//       }
//       if (onUpdate) onUpdate()
//     } catch (err) {
//       console.error(err)
//       toast.error("❌ " + err.message)
//     }
//   }

//   // Apply
//   const handleApply = async (e) => {
//     e.stopPropagation()
//     if (!token) return toast.error("❌ Please log in to apply.")
//     if (isApplied) return toast.info("✅ Already applied.")
//     setApplyLoading(true)

//     try {
//       const resp = await fetch(`${BASE_URL}/jobseeker/applyforjob/${job.id}`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         body: JSON.stringify({}),
//       })
//       if (!resp.ok) throw new Error("Failed to apply")
//       setIsApplied(true)
//       if (onUpdate) onUpdate()
//       toast.success("✅ Application submitted!")
//     } catch (err) {
//       console.error(err)
//       toast.error("❌ " + err.message)
//     } finally {
//       setApplyLoading(false)
//     }
//   }

//   const handleViewDetails = (e) => {
//     e?.stopPropagation()
//     navigate(`/jobs/${job.id}`, { state: { job } })
//   }

//   return (
//     <div
//       onClick={handleViewDetails}
//       className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-6 mb-5 cursor-pointer border border-[#fff1ed]"
//     >
//       <div className="flex justify-between items-start mb-3">
//         <div className="flex gap-3 items-center">
//           <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-[#fff1ed] flex items-center justify-center border border-[#fff1ed]">
//             <img src={job.logo || "/placeholder.svg"} alt={job.company} className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
//           </div>
//           <div>
//             <h3 className="text-lg sm:text-xl font-semibold text-gray-800 line-clamp-1">{job.title}</h3>
//             <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
//               <TrendingUp size={14} className="text-[#caa057]" />
//               <span className="line-clamp-1">{job.company}</span>
//             </div>
//           </div>
//         </div>
//         <div className="flex gap-2 relative">
//           <motion.button
//             onClick={handleSave}
//             whileTap={{ scale: 0.8 }}
//             animate={{ scale: isSaved ? [1, 1.3, 1] : 1 }}
//             transition={{ duration: 0.3 }}
//             className="p-1.5 rounded-lg relative"
//           >
//             <BookmarkIcon size={18} className={isSaved ? "text-[#caa057] fill-[#caa057]" : "text-gray-500"} />
//           </motion.button>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2 mb-3 text-xs sm:text-sm">
//         <Detail icon={<Clock size={12} className="text-[#caa057]" />} text={job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "—"} />
//         <Detail icon={<Users size={12} className="text-[#caa057]" />} text={job.applicants || "—"} />
//       </div>

//       {showActions && (
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-[#fff1ed]">
//           <button
//             onClick={handleApply}
//             disabled={isApplied || applyLoading}
//             className={`px-4 py-2 rounded-lg font-medium text-xs sm:text-sm w-full sm:w-auto flex justify-center items-center gap-2 ${
//               isApplied ? "bg-green-500 text-white cursor-not-allowed" : "bg-gradient-to-r from-[#caa057] to-[#caa057] text-white"
//             }`}
//           >
//             {applyLoading ? <span className="loader border-white border-t-2 w-4 h-4 rounded-full animate-spin"></span> :
//              isApplied ? "✅ Applied" : "Apply Now"}
//           </button>
//           <button
//             onClick={handleViewDetails}
//             className="px-4 py-2 rounded-lg font-medium text-xs sm:text-sm border border-[#caa057] text-[#caa057] w-full sm:w-auto"
//           >
//             View Details
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }

// const Detail = ({ icon, text }) => (
//   <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 p-1.5 rounded bg-[#fff1ed]">
//     <div className="p-1 rounded bg-white shadow-sm">{icon}</div>
//     <span className="truncate">{text || "—"}</span>
//   </div>
// )

// export default JobCard




// naya 
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { MapPin, Briefcase, GraduationCap, IndianRupee, Clock, Users, TrendingUp, BookmarkIcon } from "lucide-react"
import Cookies from "js-cookie"
import { motion } from "framer-motion"
import { BASE_URL } from "../../config"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const JobCard = ({ job, showActions = true, onUpdate }) => {
  const navigate = useNavigate()
  const token = Cookies.get("userToken")

  const [isSaved, setIsSaved] = useState(false)
  const [isApplied, setIsApplied] = useState(false)
  const [applyLoading, setApplyLoading] = useState(false)

  // Normalize job fields like in your new UI code
  const normalized = {
    id: job.id || job._id || job.jobId,
    title: job.title || job.jobTitle,
    company: job.company || job.companyName || "Company Name",
    location: job.location || job.address,
    type: job.type || job.jobType,
    qualification: job.qualification || job.Qualification,
    salary: job.salary || job.SalaryIncentive || job.salaryRange,
    description: job.description || job.jobDescription,
    category: job.category || (job.skills ? job.skills.join(", ") : ""),
    experience: job.experience || job.totalExperience,
    postedDate: job.createdAt || job.postedDate,
    applicants: job.applicants || job.candidatesApplied?.length || "—",
    logo: job.logo || job.companyLogo || "/placeholder.svg",
  }

  // Initialize saved/applied status
  useEffect(() => {
    const fetchStatus = async () => {
      if (!token) return
      try {
        const savedResp = await fetch(`${BASE_URL}/jobseeker/getsavedJobs`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const savedData = await savedResp.json()
        setIsSaved(savedData.savedJobs?.some((j) => j._id === normalized.id || j.id === normalized.id))

        const appliedResp = await fetch(`${BASE_URL}/jobseeker/appliedjobs`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const appliedData = await appliedResp.json()
        setIsApplied(appliedData.appliedJobs?.some((j) => j._id === normalized.id || j.id === normalized.id))
      } catch (err) {
        console.error("Status fetch error:", err)
      }
    }
    fetchStatus()
  }, [normalized.id, token])

  // Save / Unsave
  const handleSave = async (e) => {
    e.stopPropagation()
    if (!token) return toast.error("❌ Please log in to save jobs.")

    try {
      if (!isSaved) {
        const resp = await fetch(`${BASE_URL}/jobseeker/savejob/${normalized.id}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!resp.ok) throw new Error("Failed to save job")
        setIsSaved(true)
        toast.success("✅ Job saved!")
      } else {
        const resp = await fetch(`${BASE_URL}/jobseeker/removesavedjob/${normalized.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!resp.ok) throw new Error("Failed to remove job")
        setIsSaved(false)
        toast.info("🗑️ Job removed from saved")
      }
      if (onUpdate) onUpdate()
    } catch (err) {
      console.error(err)
      toast.error("❌ " + err.message)
    }
  }

  // Apply
  const handleApply = async (e) => {
    e.stopPropagation()
    if (!token) return toast.error("❌ Please log in to apply.")
    if (isApplied) return toast.info("✅ Already applied.")
    setApplyLoading(true)

    try {
      const resp = await fetch(`${BASE_URL}/jobseeker/applyforjob/${normalized.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
      if (!resp.ok) throw new Error("Failed to apply")
      setIsApplied(true)
      if (onUpdate) onUpdate()
      toast.success("✅ Application submitted!")
    } catch (err) {
      console.error(err)
      toast.error("❌ " + err.message)
    } finally {
      setApplyLoading(false)
    }
  }

  const handleViewDetails = (e) => {
    e?.stopPropagation()
    navigate(`/jobs/${normalized.id}`, { state: { job: normalized } })
  }

  return (
    <div
      onClick={handleViewDetails}
      className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-6 mb-5 cursor-pointer border border-[#fff1ed]"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-[#fff1ed] flex items-center justify-center border border-[#fff1ed]">
            <img src={normalized.logo} alt={normalized.company} className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 line-clamp-1">{normalized.title}</h3>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
              <TrendingUp size={14} className="text-[#caa057]" />
              <span className="line-clamp-1">{normalized.company}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 relative">
          <motion.button
            onClick={handleSave}
            whileTap={{ scale: 0.8 }}
            animate={{ scale: isSaved ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.3 }}
            className="p-1.5 rounded-lg relative"
          >
            <BookmarkIcon size={18} className={isSaved ? "text-[#caa057] fill-[#caa057]" : "text-gray-500"} />
          </motion.button>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs sm:text-sm">
        <Detail icon={<MapPin size={13} />} text={normalized.location} />
        <Detail icon={<Briefcase size={13} />} text={normalized.type} />
        <Detail icon={<GraduationCap size={13} />} text={normalized.qualification} />
        <Detail icon={<IndianRupee size={13} />} text={normalized.salary} />
      </div>

      {/* Description */}
      {normalized.description && (
        <div
          className="mb-3 p-2 rounded-lg bg-[#fff1ed] border border-[#fff1ed] text-xs sm:text-sm text-gray-700 line-clamp-2 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: Array.isArray(normalized.description) ? normalized.description.join(" ") : normalized.description }}
        />
      )}

      {/* Skills / Category */}
      {normalized.category && (
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className="px-2 py-1 text-[11px] sm:text-xs font-semibold bg-[#fff1ed] rounded-full">{normalized.category}</span>
          {normalized.experience && (
            <span className="px-2 py-1 text-[11px] sm:text-xs font-semibold bg-[#fff1ed] rounded-full">{normalized.experience}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-[#fff1ed]">
        <div className="flex gap-3 text-[11px] sm:text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Clock size={12} className="text-[#caa057]" />
            <span>{normalized.postedDate ? new Date(normalized.postedDate).toLocaleDateString() : "—"}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={12} className="text-[#caa057]" />
            <span>{normalized.applicants}</span>
          </span>
        </div>

        {showActions && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={handleApply}
              disabled={applyLoading || isApplied}
              className={`px-4 py-2 rounded-lg font-medium text-xs sm:text-sm w-full sm:w-auto ${
                isApplied ? "bg-green-500 text-white cursor-not-allowed" : "bg-gradient-to-r from-[#caa057] to-[#caa057] text-white"
              }`}
            >
              {applyLoading ? "Applying..." : isApplied ? "✅ Applied" : "Apply Now"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleViewDetails(e)
              }}
              className="px-4 py-2 rounded-lg font-medium text-xs sm:text-sm border border-[#caa057] text-[#caa057] w-full sm:w-auto"
            >
              View Details
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const Detail = ({ icon, text }) => (
  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 p-1.5 rounded bg-[#fff1ed]">
    <div className="p-1 rounded bg-white shadow-sm">{icon}</div>
    <span className="truncate">{text || "—"}</span>
  </div>
)

export default JobCard

