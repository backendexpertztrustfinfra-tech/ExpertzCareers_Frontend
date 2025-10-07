// // "use client"

// // import { useState, useEffect } from "react"
// // import { useLocation } from "react-router-dom"
// // import FilterPanel from "../Components/JobBoard/FilterPanel"
// // import JobCard from "../Components/JobBoard/JobCard"
// // import { Search, Briefcase } from "lucide-react"
// // import Cookies from "js-cookie"
// // import { toast } from "react-toastify"
// // import 'react-toastify/dist/ReactToastify.css'
// // import { BASE_URL } from "../config";

// // const JobBoard = () => {
// //     const [jobs, setJobs] = useState([])
// //     const [filteredJobs, setFilteredJobs] = useState([])
// //     const [searchTerm, setSearchTerm] = useState("")
// //     const [filters, setFilters] = useState({
// //         type: [],
// //         qualification: [],
// //         experience: [],
// //         category: [],
// //         location: [],
// //         company: [],
// //         industry: [],
// //         workMode: [],
// //         datePosted: [],
// //         salary: { min: 0, max: 50 },
// //     })
// //     const [sortOption, setSortOption] = useState("recent")
// //     const [loading, setLoading] = useState(true)
// //     const [savedJobs, setSavedJobs] = useState([])
// //     const [appliedJobs, setAppliedJobs] = useState([])
// //     const [applyLoading, setApplyLoading] = useState([])
// //     const location = useLocation()
// //     const token = Cookies.get("userToken")

// //     // This effect runs only once on component mount to fetch all jobs
// //   useEffect(() => {
// //   const fetchJobs = async () => {
// //     setLoading(true)
// //     try {
// //       // Get token (make sure key name matches the one stored in Cookies)
// //       const token = Cookies.get("userToken") || Cookies.get("recruiterToken")
// //       console.log("Token used:", token)

// //       // If no token, show message but continue gracefully
// //       if (!token) {
// //         toast.error("Please log in to view live jobs")
// //         setLoading(false)
// //         return
// //       }

// //       const res = await fetch(`${BASE_URL}/jobseeker/getalllivejobs`, {
// //         method: "GET",
// //         headers: {
// //           "Authorization": `Bearer ${token}`,
// //           "Content-Type": "application/json"
// //         },
// //       })

// //       if (!res.ok) {
// //         const text = await res.text()
// //         console.error(`[JobBoard] ${res.status} error:`, text)
// //         toast.error(`Error ${res.status}: Unable to fetch jobs`)
// //         setJobs([])
// //         return
// //       }

// //       const data = await res.json()

// //       // Extract array from response
// //       const jobsArray = Array.isArray(data.liveJobs)
// //         ? data.liveJobs
// //         : Array.isArray(data.jobs)
// //         ? data.jobs
// //         : []

// //       // Transform for UI
// //       const transformed = jobsArray.map((j) => ({
// //         id: j._id,
// //         title: j.jobTitle || "Untitled",
// //         // company: j.jobCreatedby?.recruterCompany || "Company Name",
// //         company: j.jobCreatedby?.recruterCompany || j.companyName || "Company Name",
// //     companyLogo: j.companyLogo
// //         ? j.companyLogo.startsWith("http")
// //             ? j.companyLogo
// //             : `${BASE_URL}${j.companyLogo}`
// //         : "/default-logo.png",
// //         description: j.description || "No description",
// //         location: j.location || "Location not provided",
// //         salary: j.SalaryIncentive || "Not disclosed",
// //         experience: j.totalExperience || "Not specified",
// //         // skills: j.jobSkills
// //         //   ? j.jobSkills.split(",").map((s) => s.trim())
// //         //   : [],
// //         skills: j.Skill ? JSON.parse(j.Skill) : [],
// //         createdAt: j.createdAt,
// //         status: j.status || "live",
// //       }))

// //       setJobs(transformed)
// //     } catch (err) {
// //       console.error("[JobBoard] fetch error:", err)
// //       toast.error("Server error while fetching jobs")
// //       setJobs([])
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   fetchJobs()
// // }, [])



// //     // This effect handles URL parameters for initial filters
// //     useEffect(() => {
// //         const urlParams = new URLSearchParams(location.search)
// //         const category = urlParams.get("category")
// //         const type = urlParams.get("type")
// //         const qualification = urlParams.get("qualification")

// //         if (category) {
// //             setFilters((prev) => ({ ...prev, category: [category] }))
// //             setSearchTerm(category)
// //         }
// //         if (type) {
// //             setFilters((prev) => ({ ...prev, type: [type] }))
// //             setSearchTerm(type)
// //         }
// //         if (qualification) {
// //             setFilters((prev) => ({ ...prev, qualification: [qualification] }))
// //             setSearchTerm(qualification)
// //         }
// //     }, [location.search])

// //     // This effect handles fetching saved and applied job status, running only once if a token exists
// //     useEffect(() => {
// //         if (!token) return
// //         const fetchStatus = async () => {
// //             try {
// //                 const [savedRes, appliedRes] = await Promise.all([
// //                     fetch(`${BASE_URL}/jobseeker/getsavedJobs`, { headers: { Authorization: `Bearer ${token}` } }),
// //                     fetch(`${BASE_URL}/jobseeker/appliedjobs`, { headers: { Authorization: `Bearer ${token}` } })
// //                 ])
// //                 const savedData = savedRes.ok ? await savedRes.json() : { savedJobs: [] }
// //                 const appliedData = appliedRes.ok ? await appliedRes.json() : { appliedJobs: [] }
// //                 setSavedJobs((savedData.savedJobs || []).map(j => j._id || j.id))
// //                 setAppliedJobs((appliedData.appliedJobs || []).map(j => j._id || j.id))
// //             } catch (err) {
// //                 console.error("Fetch saved/applied jobs error:", err)
// //             }
// //         }
// //         fetchStatus()
// //     }, [token])

// //     // This effect handles filtering and sorting, running whenever jobs, search term, filters, or sort options change
// //     useEffect(() => {
// //         let filtered = [...jobs]

// //         if (searchTerm.trim() !== "") {
// //             const q = searchTerm.toLowerCase()
// //             filtered = filtered.filter(
// //                 (job) =>
// //                     job.title.toLowerCase().includes(q) ||
// //                     job.category.toLowerCase().includes(q) ||
// //                     job.location.toLowerCase().includes(q) ||
// //                     job.company.toLowerCase().includes(q) ||
// //                     job.skills.some((skill) => skill.toLowerCase().includes(q)),
// //             )
// //         }

// //         Object.entries(filters).forEach(([key, values]) => {
// //             if (Array.isArray(values) && values.length > 0) {
// //                 filtered = filtered.filter((job) => {
// //                     const jobValue = job[key]
// //                     return values.some((val) => jobValue && jobValue.toLowerCase().includes(val.toLowerCase()))
// //                 })
// //             }
// //         })

// //         if (sortOption === "salaryHigh") {
// //             filtered.sort((a, b) => Number.parseInt(b.salary) - Number.parseInt(a.salary))
// //         } else if (sortOption === "salaryLow") {
// //             filtered.sort((a, b) => Number.parseInt(a.salary) - Number.parseInt(b.salary))
// //         } else if (sortOption === "company") {
// //             filtered.sort((a, b) => (a.company || "").localeCompare(b.company || ""))
// //         } else {
// //             filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
// //         }

// //         setFilteredJobs(filtered)
// //     }, [searchTerm, filters, sortOption, jobs])

// //     const handleSaveJob = async (jobId) => {
// //         if (!token) {
// //             return toast.error("Please log in to save jobs")
// //         }
// //         const isSaved = savedJobs.includes(jobId)
// //         try {
// //             const res = await fetch(`${BASE_URL}/jobseeker/${isSaved ? 'removesavedjob' : 'savejob'}/${jobId}`, {
// //                 method: isSaved ? "DELETE" : "POST",
// //                 headers: { Authorization: `Bearer ${token}` }
// //             })
// //             if (!res.ok) {
// //                 throw new Error("Failed to update saved jobs")
// //             }
// //             setSavedJobs(prev => isSaved ? prev.filter(id => id !== jobId) : [...prev, jobId])
// //             toast.success(isSaved ? "Job removed from saved" : "Job saved successfully")
// //         } catch (err) {
// //             toast.error(err.message || "Error saving job")
// //         }
// //     }

// //     const handleApplyJob = async (jobId) => {
// //         if (!token) {
// //             return toast.error("Please log in to apply")
// //         }
// //         if (appliedJobs.includes(jobId)) {
// //             return toast.info("You've already applied")
// //         }
// //         setApplyLoading(prev => [...prev, jobId])
// //         try {
// //             const res = await fetch(`${BASE_URL}/jobseeker/applyforjob/${jobId}`, {
// //                 method: "POST",
// //                 headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
// //                 body: JSON.stringify({})
// //             })
// //             if (!res.ok) {
// //                 throw new Error("Failed to apply")
// //             }
// //             setAppliedJobs(prev => [...prev, jobId])
// //             toast.success("Application submitted successfully")
// //         } catch (err) {
// //             toast.error(err.message || "Error applying")
// //         } finally {
// //             setApplyLoading(prev => prev.filter(id => id !== jobId))
// //         }
// //     }

// //     return (
// //         <div className="min-h-screen bg-gradient-to-br from-[#fff1ed] via-[#fff1ed] to-white">
// //             {/* Hero */}
// //             <div className="relative bg-gradient-to-r from-[#fff1ed] via-[#fff1ed] to-white">
// //                 <div className="container mx-auto px-4 py-8 sm:py-12 text-center">
// //                     <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
// //                         Find Your{" "}
// //                         <span className="bg-gradient-to-r from-[#caa057] to-[#caa057] bg-clip-text text-transparent">
// //                             Dream Job
// //                         </span>
// //                     </h1>
// //                     <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
// //                         Discover amazing job opportunities from top companies across all industries
// //                     </p>
// //                     <div className="max-w-2xl mx-auto">
// //                         <div className="flex items-center bg-white rounded-xl shadow-md overflow-hidden">
// //                             <div className="flex items-center px-4 py-2 flex-1">
// //                                 <Search size={20} className="text-[#caa057] mr-2" />
// //                                 <input
// //                                     type="text"
// //                                     placeholder="Search jobs, companies, locations..."
// //                                     value={searchTerm}
// //                                     onChange={(e) => setSearchTerm(e.target.value)}
// //                                     className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm sm:text-base"
// //                                 />
// //                             </div>
// //                             <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#caa057] to-[#caa057] text-white font-semibold">
// //                                 Search
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Main */}
// //             <div className="container mx-auto px-4 py-8">
// //                 <div className="flex flex-col lg:flex-row gap-6">
// //                     {/* Filters */}
// //                     <div className="lg:w-1/4">
// //                         <FilterPanel filters={filters} setFilters={setFilters} />
// //                     </div>

// //                     {/* Jobs list */}
// //                     <div className="flex-1">
// //                         <div className="flex items-center justify-between mb-5">
// //                             <div>
// //                                 <h2 className="text-lg sm:text-xl font-bold">
// //                                     {loading ? "Loading..." : `${filteredJobs.length} Jobs Found`}
// //                                 </h2>
// //                                 <p className="text-gray-500 text-sm">
// //                                     {searchTerm ? `Results for "${searchTerm}"` : "Showing all available opportunities"}
// //                                 </p>
// //                             </div>
// //                         </div>

// //                         {/* Jobs */}
// //                         {loading ? (
// //                             <p className="text-center text-gray-500 py-8">Loading jobs...</p>
// //                         ) : filteredJobs.length === 0 ? (
// //                             <div className="text-center py-16">
// //                                 <Briefcase size={36} className="text-[#caa057] mx-auto mb-3" />
// //                                 <h3 className="text-base font-semibold">No Jobs Found</h3>
// //                                 <p className="text-gray-500 text-sm">Try adjusting filters or search terms.</p>
// //                             </div>
// //                         ) : (
// //                             <div className="space-y-4">
// //                                 {filteredJobs.map((job) => (
// //                                     <JobCard
// //                                         key={job.id}
// //                                         job={job}
// //                                         showActions={true}
// //                                         isSaved={savedJobs.includes(job.id)}
// //                                         isApplied={appliedJobs.includes(job.id)}
// //                                         applyLoading={applyLoading.includes(job.id)}
// //                                         onSave={() => handleSaveJob(job.id)}
// //                                         onApply={() => handleApplyJob(job.id)}
// //                                     />
// //                                 ))}
// //                             </div>
// //                         )}
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     )
// // }

// // export default JobBoard

// // main code change 
// //   useEffect(() => {
// //   const fetchJobs = async () => {
// //     setLoading(true)
// //     try {
// //       // Get token (make sure key name matches the one stored in Cookies)
// //       const token = Cookies.get("userToken") || Cookies.get("recruiterToken")
// //       console.log("Token used:", token)

// //       // If no token, show message but continue gracefully
// //       if (!token) {
// //         toast.error("Please log in to view live jobs")
// //         setLoading(false)
// //         return
// //       }

// //       const res = await fetch(`${BASE_URL}/jobseeker/getalllivejobs`, {
// //         method: "GET",
// //         headers: {
// //           "Authorization": `Bearer ${token}`,
// //           "Content-Type": "application/json"
// //         },
// //       })

// //       if (!res.ok) {
// //         const text = await res.text()
// //         console.error(`[JobBoard] ${res.status} error:`, text)
// //         toast.error(`Error ${res.status}: Unable to fetch jobs`)
// //         setJobs([])
// //         return
// //       }

// //       const data = await res.json()

// //       // Extract array from response
// //       const jobsArray = Array.isArray(data.liveJobs)
// //         ? data.liveJobs
// //         : Array.isArray(data.jobs)
// //         ? data.jobs
// //         : []

// //       // Transform for UI
// //       const transformed = jobsArray.map((j) => ({
// //         id: j._id,
// //         title: j.jobTitle || "Untitled",
// //         // company: j.jobCreatedby?.recruterCompany || "Company Name",
// //         company: j.jobCreatedby?.recruterCompany || j.companyName || "Company Name",
// //     companyLogo: j.companyLogo
// //         ? j.companyLogo.startsWith("http")
// //             ? j.companyLogo
// //             : `${BASE_URL}${j.companyLogo}`
// //         : "/default-logo.png",
// //         description: j.description || "No description",
// //         location: j.location || "Location not provided",
// //         salary: j.SalaryIncentive || "Not disclosed",
// //         experience: j.totalExperience || "Not specified",
// //         // skills: j.jobSkills
// //         //   ? j.jobSkills.split(",").map((s) => s.trim())
// //         //   : [],
// //         skills: j.Skill ? JSON.parse(j.Skill) : [],
// //         createdAt: j.createdAt,
// //         status: j.status || "live",
// //       }))

// //       setJobs(transformed)
// //     } catch (err) {
// //       console.error("[JobBoard] fetch error:", err)
// //       toast.error("Server error while fetching jobs")
// //       setJobs([])
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   fetchJobs()
// // }, [])





// // old code with get all jobs 
// "use client"

// import { useState, useEffect } from "react"
// import { useLocation } from "react-router-dom"
// import FilterPanel from "../Components/JobBoard/FilterPanel"
// import JobCard from "../Components/JobBoard/JobCard"
// import { Search, Briefcase } from "lucide-react"
// import Cookies from "js-cookie"
// import { toast } from "react-toastify"
// import 'react-toastify/dist/ReactToastify.css'
// import { BASE_URL } from "../config";

// const JobBoard = () => {
//     const [jobs, setJobs] = useState([])
//     const [filteredJobs, setFilteredJobs] = useState([])
//     const [searchTerm, setSearchTerm] = useState("")
//     const [filters, setFilters] = useState({
//         type: [],
//         qualification: [],
//         experience: [],
//         category: [],
//         location: [],
//         company: [],
//         industry: [],
//         workMode: [],
//         datePosted: [],
//         salary: { min: 0, max: 50 },
//     })
//     const [sortOption, setSortOption] = useState("recent")
//     const [loading, setLoading] = useState(true)
//     const [savedJobs, setSavedJobs] = useState([])
//     const [appliedJobs, setAppliedJobs] = useState([])
//     const [applyLoading, setApplyLoading] = useState([])
//     const location = useLocation()
//     const token = Cookies.get("userToken")

//     // This effect runs only once on component mount to fetch all jobs
//     useEffect(() => {
//   const fetchJobs = async () => {
//     setLoading(true)
//     try {
//       // Get token (make sure key name matches the one stored in Cookies)
//       const token = Cookies.get("userToken") || Cookies.get("recruiterToken")
//       console.log("Token used:", token)

//       // If no token, show message but continue gracefully
//       if (!token) {
//         toast.error("Please log in to view live jobs")
//         setLoading(false)
//         return
//       }

//       const res = await fetch(`${BASE_URL}/jobseeker/getalllivejobs`, {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//       })

//       if (!res.ok) {
//         const text = await res.text()
//         console.error(`[JobBoard] ${res.status} error:`, text)
//         toast.error(`Error ${res.status}: Unable to fetch jobs`)
//         setJobs([])
//         return
//       }

//       const data = await res.json()

//       // Extract array from response
//       const jobsArray = Array.isArray(data.liveJobs)
//         ? data.liveJobs
//         : Array.isArray(data.jobs)
//         ? data.jobs
//         : []

//       // Transform for UI
//       const transformed = jobsArray.map((j) => {
//                     const id = j._id || j.id || j.jobId || Math.random().toString(36).slice(2)
//                     const createdAt = j.createdAt || new Date().toISOString()
//                     const jobSkills = j.jobSkills || j.skills || j.keySkills || j.jobSkillsString || ""
//                     const skillsArray = Array.isArray(jobSkills)
//                         ? jobSkills
//                         : typeof jobSkills === "string"
//                             ? jobSkills
//                                 .split(",")
//                                 .map((s) => s.trim())
//                                 .filter((s) => s)
//                             : []
//                     const company =
//                         j.jobCreatedby?.recruterCompany ||
//                         j.companyName ||
//                         j.company ||
//                         j.employerName ||
//                         "Company Name"

//                     return {
//                         id,
//                         title: j.jobTitle || j.title || "No Title",
//                         company,
//                         location: j.location || "Location",
//                         address: j.address || "",
//                         type: j.jobType || j.type || "Full-time",
//                         qualification: j.qualification || j.Qualification || "Not specified",
//                         salary: j.salary || j.SalaryIncentive || "Not disclosed",
//                         category: j.category || j.jobCategory || "General",
//                         experience: j.experience || j.totalExperience || j.relevantExperience || "Not specified",
//                         description: j.description || "No description available",
//                         createdAt,
//                         logo: j.companyLogo || "/placeholder.svg",
//                         skills: skillsArray,
//                         openings: j.openings || j.noofOpening || "1",
//                         gender: j.gender || "Any",
//                         benefits: j.benefits || j.jobBenefits || "",
//                         documents: j.documents || j.documentRequired || "",
//                         timing: j.timing || "",
//                         shift: j.shift || "",
//                         workingDays: j.workingDays || "",
//                         workingDaysFrom: j.workingDaysFrom || "",
//                         workingDaysTo: j.workingDaysTo || "",
//                         weekend: j.weekend || "",
//                         startTime: j.startTime || "",
//                         endTime: j.endTime || "",
//                         status: j.status || "live",
//                         expiryDate: j.expiryDate || "",
//                         postedDate: j.createdAt || j.postedDate || new Date().toISOString(),
//                         applicants: j.candidatesApplied?.length || 0,
//                     }
//                 })

//       setJobs(transformed)
//     } catch (err) {
//       console.error("[JobBoard] fetch error:", err)
//       toast.error("Server error while fetching jobs")
//       setJobs([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   fetchJobs()
// }, [])

//     // This effect handles URL parameters for initial filters
//     useEffect(() => {
//         const urlParams = new URLSearchParams(location.search)
//         const category = urlParams.get("category")
//         const type = urlParams.get("type")
//         const qualification = urlParams.get("qualification")

//         if (category) {
//             setFilters((prev) => ({ ...prev, category: [category] }))
//             setSearchTerm(category)
//         }
//         if (type) {
//             setFilters((prev) => ({ ...prev, type: [type] }))
//             setSearchTerm(type)
//         }
//         if (qualification) {
//             setFilters((prev) => ({ ...prev, qualification: [qualification] }))
//             setSearchTerm(qualification)
//         }
//     }, [location.search])

//     // This effect handles fetching saved and applied job status, running only once if a token exists
//     useEffect(() => {
//         if (!token) return
//         const fetchStatus = async () => {
//             try {
//                 const [savedRes, appliedRes] = await Promise.all([
//                     fetch(`${BASE_URL}/jobseeker/getsavedJobs`, { headers: { Authorization: `Bearer ${token}` } }),
//                     fetch(`${BASE_URL}/jobseeker/appliedjobs`, { headers: { Authorization: `Bearer ${token}` } })
//                 ])
//                 const savedData = savedRes.ok ? await savedRes.json() : { savedJobs: [] }
//                 const appliedData = appliedRes.ok ? await appliedRes.json() : { appliedJobs: [] }
//                 setSavedJobs((savedData.savedJobs || []).map(j => j._id || j.id))
//                 setAppliedJobs((appliedData.appliedJobs || []).map(j => j._id || j.id))
//             } catch (err) {
//                 console.error("Fetch saved/applied jobs error:", err)
//             }
//         }
//         fetchStatus()
//     }, [token])

//     // This effect handles filtering and sorting, running whenever jobs, search term, filters, or sort options change
//     useEffect(() => {
//         let filtered = [...jobs]

//         if (searchTerm.trim() !== "") {
//             const q = searchTerm.toLowerCase()
//             filtered = filtered.filter(
//                 (job) =>
//                     job.title.toLowerCase().includes(q) ||
//                     job.category.toLowerCase().includes(q) ||
//                     job.location.toLowerCase().includes(q) ||
//                     job.company.toLowerCase().includes(q) ||
//                     job.skills.some((skill) => skill.toLowerCase().includes(q)),
//             )
//         }

//         Object.entries(filters).forEach(([key, values]) => {
//             if (Array.isArray(values) && values.length > 0) {
//                 filtered = filtered.filter((job) => {
//                     const jobValue = job[key]
//                     return values.some((val) => jobValue && jobValue.toLowerCase().includes(val.toLowerCase()))
//                 })
//             }
//         })

//         if (sortOption === "salaryHigh") {
//             filtered.sort((a, b) => Number.parseInt(b.salary) - Number.parseInt(a.salary))
//         } else if (sortOption === "salaryLow") {
//             filtered.sort((a, b) => Number.parseInt(a.salary) - Number.parseInt(b.salary))
//         } else if (sortOption === "company") {
//             filtered.sort((a, b) => (a.company || "").localeCompare(b.company || ""))
//         } else {
//             filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//         }

//         setFilteredJobs(filtered)
//     }, [searchTerm, filters, sortOption, jobs])

//     const handleSaveJob = async (jobId) => {
//         if (!token) {
//             return toast.error("Please log in to save jobs")
//         }
//         const isSaved = savedJobs.includes(jobId)
//         try {
//             const res = await fetch(`${BASE_URL}/jobseeker/${isSaved ? 'removesavedjob' : 'savejob'}/${jobId}`, {
//                 method: isSaved ? "DELETE" : "POST",
//                 headers: { Authorization: `Bearer ${token}` }
//             })
//             if (!res.ok) {
//                 throw new Error("Failed to update saved jobs")
//             }
//             setSavedJobs(prev => isSaved ? prev.filter(id => id !== jobId) : [...prev, jobId])
//             toast.success(isSaved ? "Job removed from saved" : "Job saved successfully")
//         } catch (err) {
//             toast.error(err.message || "Error saving job")
//         }
//     }

//     const handleApplyJob = async (jobId) => {
//         if (!token) {
//             return toast.error("Please log in to apply")
//         }
//         if (appliedJobs.includes(jobId)) {
//             return toast.info("You've already applied")
//         }
//         setApplyLoading(prev => [...prev, jobId])
//         try {
//             const res = await fetch(`${BASE_URL}/jobseeker/applyforjob/${jobId}`, {
//                 method: "POST",
//                 headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//                 body: JSON.stringify({})
//             })
//             if (!res.ok) {
//                 throw new Error("Failed to apply")
//             }
//             setAppliedJobs(prev => [...prev, jobId])
//             toast.success("Application submitted successfully")
//         } catch (err) {
//             toast.error(err.message || "Error applying")
//         } finally {
//             setApplyLoading(prev => prev.filter(id => id !== jobId))
//         }
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-[#fff1ed] via-[#fff1ed] to-white">
//             {/* Hero */}
//             <div className="relative bg-gradient-to-r from-[#fff1ed] via-[#fff1ed] to-white">
//                 <div className="container mx-auto px-4 py-8 sm:py-12 text-center">
//                     <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
//                         Find Your{" "}
//                         <span className="bg-gradient-to-r from-[#caa057] to-[#caa057] bg-clip-text text-transparent">
//                             Dream Job
//                         </span>
//                     </h1>
//                     <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
//                         Discover amazing job opportunities from top companies across all industries
//                     </p>
//                     <div className="max-w-2xl mx-auto">
//                         <div className="flex items-center bg-white rounded-xl shadow-md overflow-hidden">
//                             <div className="flex items-center px-4 py-2 flex-1">
//                                 <Search size={20} className="text-[#caa057] mr-2" />
//                                 <input
//                                     type="text"
//                                     placeholder="Search jobs, companies, locations..."
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm sm:text-base"
//                                 />
//                             </div>
//                             <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#caa057] to-[#caa057] text-white font-semibold">
//                                 Search
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Main */}
//             <div className="container mx-auto px-4 py-8">
//                 <div className="flex flex-col lg:flex-row gap-6">
//                     {/* Filters */}
//                     <div className="lg:w-1/4">
//                         <FilterPanel filters={filters} setFilters={setFilters} />
//                     </div>

//                     {/* Jobs list */}
//                     <div className="flex-1">
//                         <div className="flex items-center justify-between mb-5">
//                             <div>
//                                 <h2 className="text-lg sm:text-xl font-bold">
//                                     {loading ? "Loading..." : `${filteredJobs.length} Jobs Found`}
//                                 </h2>
//                                 <p className="text-gray-500 text-sm">
//                                     {searchTerm ? `Results for "${searchTerm}"` : "Showing all available opportunities"}
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Jobs */}
//                         {loading ? (
//                             <p className="text-center text-gray-500 py-8">Loading jobs...</p>
//                         ) : filteredJobs.length === 0 ? (
//                             <div className="text-center py-16">
//                                 <Briefcase size={36} className="text-[#caa057] mx-auto mb-3" />
//                                 <h3 className="text-base font-semibold">No Jobs Found</h3>
//                                 <p className="text-gray-500 text-sm">Try adjusting filters or search terms.</p>
//                             </div>
//                         ) : (
//                             <div className="space-y-4">
//                                 {filteredJobs.map((job) => (
//                                     <JobCard
//                                         key={job.id}
//                                         job={job}
//                                         showActions={true}
//                                         isSaved={savedJobs.includes(job.id)}
//                                         isApplied={appliedJobs.includes(job.id)}
//                                         applyLoading={applyLoading.includes(job.id)}
//                                         onSave={() => handleSaveJob(job.id)}
//                                         onApply={() => handleApplyJob(job.id)}
//                                     />
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default JobBoard


















// "use client"

// import { useState, useEffect } from "react"
// import { useLocation } from "react-router-dom"
// import FilterPanel from "../Components/JobBoard/FilterPanel"
// import JobCard from "../Components/JobBoard/JobCard"
// import { Search, Briefcase } from "lucide-react"
// import Cookies from "js-cookie"
// import { toast } from "react-toastify"
// import 'react-toastify/dist/ReactToastify.css'
// import { BASE_URL } from "../config";

// const JobBoard = () => {
//     const [jobs, setJobs] = useState([])
//     const [filteredJobs, setFilteredJobs] = useState([])
//     const [searchTerm, setSearchTerm] = useState("")
//     const [filters, setFilters] = useState({
//         type: [],
//         qualification: [],
//         experience: [],
//         category: [],
//         location: [],
//         company: [],
//         industry: [],
//         workMode: [],
//         datePosted: [],
//         salary: { min: 0, max: 50 },
//     })
//     const [sortOption, setSortOption] = useState("recent")
//     const [loading, setLoading] = useState(true)
//     const [savedJobs, setSavedJobs] = useState([])
//     const [appliedJobs, setAppliedJobs] = useState([])
//     const [applyLoading, setApplyLoading] = useState([])
//     const location = useLocation()
//     const token = Cookies.get("userToken")

//     // This effect runs only once on component mount to fetch all jobs
//   useEffect(() => {
//   const fetchJobs = async () => {
//     setLoading(true)
//     try {
//       // Get token (make sure key name matches the one stored in Cookies)
//       const token = Cookies.get("userToken") || Cookies.get("recruiterToken")
//       console.log("Token used:", token)

//       // If no token, show message but continue gracefully
//       if (!token) {
//         toast.error("Please log in to view live jobs")
//         setLoading(false)
//         return
//       }

//       const res = await fetch(`${BASE_URL}/jobseeker/getalllivejobs`, {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//       })

//       if (!res.ok) {
//         const text = await res.text()
//         console.error(`[JobBoard] ${res.status} error:`, text)
//         toast.error(`Error ${res.status}: Unable to fetch jobs`)
//         setJobs([])
//         return
//       }

//       const data = await res.json()

//       // Extract array from response
//       const jobsArray = Array.isArray(data.liveJobs)
//         ? data.liveJobs
//         : Array.isArray(data.jobs)
//         ? data.jobs
//         : []

//       // Transform for UI
//       const transformed = jobsArray.map((j) => ({
//         id: j._id,
//         title: j.jobTitle || "Untitled",
//         // company: j.jobCreatedby?.recruterCompany || "Company Name",
//         company: j.jobCreatedby?.recruterCompany || j.companyName || "Company Name",
//     companyLogo: j.companyLogo
//         ? j.companyLogo.startsWith("http")
//             ? j.companyLogo
//             : `${BASE_URL}${j.companyLogo}`
//         : "/default-logo.png",
//         description: j.description || "No description",
//         location: j.location || "Location not provided",
//         salary: j.SalaryIncentive || "Not disclosed",
//         experience: j.totalExperience || "Not specified",
//         // skills: j.jobSkills
//         //   ? j.jobSkills.split(",").map((s) => s.trim())
//         //   : [],
//         skills: j.Skill ? JSON.parse(j.Skill) : [],
//         createdAt: j.createdAt,
//         status: j.status || "live",
//       }))

//       setJobs(transformed)
//     } catch (err) {
//       console.error("[JobBoard] fetch error:", err)
//       toast.error("Server error while fetching jobs")
//       setJobs([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   fetchJobs()
// }, [])



//     // This effect handles URL parameters for initial filters
//     useEffect(() => {
//         const urlParams = new URLSearchParams(location.search)
//         const category = urlParams.get("category")
//         const type = urlParams.get("type")
//         const qualification = urlParams.get("qualification")

//         if (category) {
//             setFilters((prev) => ({ ...prev, category: [category] }))
//             setSearchTerm(category)
//         }
//         if (type) {
//             setFilters((prev) => ({ ...prev, type: [type] }))
//             setSearchTerm(type)
//         }
//         if (qualification) {
//             setFilters((prev) => ({ ...prev, qualification: [qualification] }))
//             setSearchTerm(qualification)
//         }
//     }, [location.search])

//     // This effect handles fetching saved and applied job status, running only once if a token exists
//     useEffect(() => {
//         if (!token) return
//         const fetchStatus = async () => {
//             try {
//                 const [savedRes, appliedRes] = await Promise.all([
//                     fetch(`${BASE_URL}/jobseeker/getsavedJobs`, { headers: { Authorization: `Bearer ${token}` } }),
//                     fetch(`${BASE_URL}/jobseeker/appliedjobs`, { headers: { Authorization: `Bearer ${token}` } })
//                 ])
//                 const savedData = savedRes.ok ? await savedRes.json() : { savedJobs: [] }
//                 const appliedData = appliedRes.ok ? await appliedRes.json() : { appliedJobs: [] }
//                 setSavedJobs((savedData.savedJobs || []).map(j => j._id || j.id))
//                 setAppliedJobs((appliedData.appliedJobs || []).map(j => j._id || j.id))
//             } catch (err) {
//                 console.error("Fetch saved/applied jobs error:", err)
//             }
//         }
//         fetchStatus()
//     }, [token])

//     // This effect handles filtering and sorting, running whenever jobs, search term, filters, or sort options change
//     useEffect(() => {
//         let filtered = [...jobs]

//         if (searchTerm.trim() !== "") {
//             const q = searchTerm.toLowerCase()
//             filtered = filtered.filter(
//                 (job) =>
//                     job.title.toLowerCase().includes(q) ||
//                     job.category.toLowerCase().includes(q) ||
//                     job.location.toLowerCase().includes(q) ||
//                     job.company.toLowerCase().includes(q) ||
//                     job.skills.some((skill) => skill.toLowerCase().includes(q)),
//             )
//         }

//         Object.entries(filters).forEach(([key, values]) => {
//             if (Array.isArray(values) && values.length > 0) {
//                 filtered = filtered.filter((job) => {
//                     const jobValue = job[key]
//                     return values.some((val) => jobValue && jobValue.toLowerCase().includes(val.toLowerCase()))
//                 })
//             }
//         })

//         if (sortOption === "salaryHigh") {
//             filtered.sort((a, b) => Number.parseInt(b.salary) - Number.parseInt(a.salary))
//         } else if (sortOption === "salaryLow") {
//             filtered.sort((a, b) => Number.parseInt(a.salary) - Number.parseInt(b.salary))
//         } else if (sortOption === "company") {
//             filtered.sort((a, b) => (a.company || "").localeCompare(b.company || ""))
//         } else {
//             filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//         }

//         setFilteredJobs(filtered)
//     }, [searchTerm, filters, sortOption, jobs])

//     const handleSaveJob = async (jobId) => {
//         if (!token) {
//             return toast.error("Please log in to save jobs")
//         }
//         const isSaved = savedJobs.includes(jobId)
//         try {
//             const res = await fetch(`${BASE_URL}/jobseeker/${isSaved ? 'removesavedjob' : 'savejob'}/${jobId}`, {
//                 method: isSaved ? "DELETE" : "POST",
//                 headers: { Authorization: `Bearer ${token}` }
//             })
//             if (!res.ok) {
//                 throw new Error("Failed to update saved jobs")
//             }
//             setSavedJobs(prev => isSaved ? prev.filter(id => id !== jobId) : [...prev, jobId])
//             toast.success(isSaved ? "Job removed from saved" : "Job saved successfully")
//         } catch (err) {
//             toast.error(err.message || "Error saving job")
//         }
//     }

//     const handleApplyJob = async (jobId) => {
//         if (!token) {
//             return toast.error("Please log in to apply")
//         }
//         if (appliedJobs.includes(jobId)) {
//             return toast.info("You've already applied")
//         }
//         setApplyLoading(prev => [...prev, jobId])
//         try {
//             const res = await fetch(`${BASE_URL}/jobseeker/applyforjob/${jobId}`, {
//                 method: "POST",
//                 headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//                 body: JSON.stringify({})
//             })
//             if (!res.ok) {
//                 throw new Error("Failed to apply")
//             }
//             setAppliedJobs(prev => [...prev, jobId])
//             toast.success("Application submitted successfully")
//         } catch (err) {
//             toast.error(err.message || "Error applying")
//         } finally {
//             setApplyLoading(prev => prev.filter(id => id !== jobId))
//         }
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-[#fff1ed] via-[#fff1ed] to-white">
//             {/* Hero */}
//             <div className="relative bg-gradient-to-r from-[#fff1ed] via-[#fff1ed] to-white">
//                 <div className="container mx-auto px-4 py-8 sm:py-12 text-center">
//                     <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
//                         Find Your{" "}
//                         <span className="bg-gradient-to-r from-[#caa057] to-[#caa057] bg-clip-text text-transparent">
//                             Dream Job
//                         </span>
//                     </h1>
//                     <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
//                         Discover amazing job opportunities from top companies across all industries
//                     </p>
//                     <div className="max-w-2xl mx-auto">
//                         <div className="flex items-center bg-white rounded-xl shadow-md overflow-hidden">
//                             <div className="flex items-center px-4 py-2 flex-1">
//                                 <Search size={20} className="text-[#caa057] mr-2" />
//                                 <input
//                                     type="text"
//                                     placeholder="Search jobs, companies, locations..."
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm sm:text-base"
//                                 />
//                             </div>
//                             <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#caa057] to-[#caa057] text-white font-semibold">
//                                 Search
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Main */}
//             <div className="container mx-auto px-4 py-8">
//                 <div className="flex flex-col lg:flex-row gap-6">
//                     {/* Filters */}
//                     <div className="lg:w-1/4">
//                         <FilterPanel filters={filters} setFilters={setFilters} />
//                     </div>

//                     {/* Jobs list */}
//                     <div className="flex-1">
//                         <div className="flex items-center justify-between mb-5">
//                             <div>
//                                 <h2 className="text-lg sm:text-xl font-bold">
//                                     {loading ? "Loading..." : `${filteredJobs.length} Jobs Found`}
//                                 </h2>
//                                 <p className="text-gray-500 text-sm">
//                                     {searchTerm ? `Results for "${searchTerm}"` : "Showing all available opportunities"}
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Jobs */}
//                         {loading ? (
//                             <p className="text-center text-gray-500 py-8">Loading jobs...</p>
//                         ) : filteredJobs.length === 0 ? (
//                             <div className="text-center py-16">
//                                 <Briefcase size={36} className="text-[#caa057] mx-auto mb-3" />
//                                 <h3 className="text-base font-semibold">No Jobs Found</h3>
//                                 <p className="text-gray-500 text-sm">Try adjusting filters or search terms.</p>
//                             </div>
//                         ) : (
//                             <div className="space-y-4">
//                                 {filteredJobs.map((job) => (
//                                     <JobCard
//                                         key={job.id}
//                                         job={job}
//                                         showActions={true}
//                                         isSaved={savedJobs.includes(job.id)}
//                                         isApplied={appliedJobs.includes(job.id)}
//                                         applyLoading={applyLoading.includes(job.id)}
//                                         onSave={() => handleSaveJob(job.id)}
//                                         onApply={() => handleApplyJob(job.id)}
//                                     />
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default JobBoard

// main code change 
//   useEffect(() => {
//   const fetchJobs = async () => {
//     setLoading(true)
//     try {
//       // Get token (make sure key name matches the one stored in Cookies)
//       const token = Cookies.get("userToken") || Cookies.get("recruiterToken")
//       console.log("Token used:", token)

//       // If no token, show message but continue gracefully
//       if (!token) {
//         toast.error("Please log in to view live jobs")
//         setLoading(false)
//         return
//       }

//       const res = await fetch(`${BASE_URL}/jobseeker/getalllivejobs`, {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//       })

//       if (!res.ok) {
//         const text = await res.text()
//         console.error(`[JobBoard] ${res.status} error:`, text)
//         toast.error(`Error ${res.status}: Unable to fetch jobs`)
//         setJobs([])
//         return
//       }

//       const data = await res.json()

//       // Extract array from response
//       const jobsArray = Array.isArray(data.liveJobs)
//         ? data.liveJobs
//         : Array.isArray(data.jobs)
//         ? data.jobs
//         : []

//       // Transform for UI
//       const transformed = jobsArray.map((j) => ({
//         id: j._id,
//         title: j.jobTitle || "Untitled",
//         // company: j.jobCreatedby?.recruterCompany || "Company Name",
//         company: j.jobCreatedby?.recruterCompany || j.companyName || "Company Name",
//     companyLogo: j.companyLogo
//         ? j.companyLogo.startsWith("http")
//             ? j.companyLogo
//             : `${BASE_URL}${j.companyLogo}`
//         : "/default-logo.png",
//         description: j.description || "No description",
//         location: j.location || "Location not provided",
//         salary: j.SalaryIncentive || "Not disclosed",
//         experience: j.totalExperience || "Not specified",
//         // skills: j.jobSkills
//         //   ? j.jobSkills.split(",").map((s) => s.trim())
//         //   : [],
//         skills: j.Skill ? JSON.parse(j.Skill) : [],
//         createdAt: j.createdAt,
//         status: j.status || "live",
//       }))

//       setJobs(transformed)
//     } catch (err) {
//       console.error("[JobBoard] fetch error:", err)
//       toast.error("Server error while fetching jobs")
//       setJobs([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   fetchJobs()
// }, [])





// old code with get all jobs 
"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import FilterPanel from "../Components/JobBoard/FilterPanel"
import JobCard from "../Components/JobBoard/JobCard"
import { Search, Briefcase } from "lucide-react"
import Cookies from "js-cookie"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { BASE_URL } from "../config";

const JobBoard = () => {
    const [jobs, setJobs] = useState([])
    const [filteredJobs, setFilteredJobs] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState({
        type: [],
        qualification: [],
        experience: [],
        category: [],
        location: [],
        company: [],
        industry: [],
        workMode: [],
        datePosted: [],
        salary: { min: 0, max: 50 },
    })
    const [sortOption, setSortOption] = useState("recent")
    const [loading, setLoading] = useState(true)
    const [savedJobs, setSavedJobs] = useState([])
    const [appliedJobs, setAppliedJobs] = useState([])
    const [applyLoading, setApplyLoading] = useState([])
    const location = useLocation()
    const token = Cookies.get("userToken")

    // This effect runs only once on component mount to fetch all jobs
    useEffect(() => {
  const fetchJobs = async () => {
    setLoading(true)
    try {
      // Get token (make sure key name matches the one stored in Cookies)
      const token = Cookies.get("userToken") || Cookies.get("recruiterToken")
      console.log("Token used:", token)

      // If no token, show message but continue gracefully
      if (!token) {
        toast.error("Please log in to view live jobs")
        setLoading(false)
        return
      }

      const res = await fetch(`${BASE_URL}/jobseeker/getalllivejobs`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      })

      if (!res.ok) {
        const text = await res.text()
        console.error(`[JobBoard] ${res.status} error:`, text)
        toast.error(`Error ${res.status}: Unable to fetch jobs`)
        setJobs([])
        return
      }

      const data = await res.json()

      // Extract array from response
      const jobsArray = Array.isArray(data.liveJobs)
        ? data.liveJobs
        : Array.isArray(data.jobs)
        ? data.jobs
        : []

      // Transform for UI
      const transformed = jobsArray.map((j) => {
                    const id = j._id || j.id || j.jobId || Math.random().toString(36).slice(2)
                    const createdAt = j.createdAt || new Date().toISOString()
                    const jobSkills = j.jobSkills || j.skills || j.keySkills || j.jobSkillsString || ""
                    const skillsArray = Array.isArray(jobSkills)
                        ? jobSkills
                        : typeof jobSkills === "string"
                            ? jobSkills
                                .split(",")
                                .map((s) => s.trim())
                                .filter((s) => s)
                            : []
                    const company =
                        j.jobCreatedby?.recruterCompany ||
                        j.companyName ||
                        j.company ||
                        j.employerName ||
                        "Company Name"

                    return {
                        id,
                        title: j.jobTitle || j.title || "No Title",
                        company,
                        location: j.location || "Location",
                        address: j.address || "",
                        type: j.jobType || j.type || "Full-time",
                        qualification: j.qualification || j.Qualification || "Not specified",
                        salary: j.salary || j.SalaryIncentive || "Not disclosed",
                        category: j.category || j.jobCategory || "General",
                        experience: j.experience || j.totalExperience || j.relevantExperience || "Not specified",
                        description: j.description || "No description available",
                        createdAt,
                        logo: j.companyLogo || "/placeholder.svg",
                        skills: skillsArray,
                        openings: j.openings || j.noofOpening || "1",
                        gender: j.gender || "Any",
                        benefits: j.benefits || j.jobBenefits || "",
                        documents: j.documents || j.documentRequired || "",
                        timing: j.timing || "",
                        shift: j.shift || "",
                        workingDays: j.workingDays || "",
                        workingDaysFrom: j.workingDaysFrom || "",
                        workingDaysTo: j.workingDaysTo || "",
                        weekend: j.weekend || "",
                        startTime: j.startTime || "",
                        endTime: j.endTime || "",
                        status: j.status || "live",
                        expiryDate: j.expiryDate || "",
                        postedDate: j.createdAt || j.postedDate || new Date().toISOString(),
                        applicants: j.candidatesApplied?.length || 0,
                    }
                })

      setJobs(transformed)
    } catch (err) {
      console.error("[JobBoard] fetch error:", err)
      toast.error("Server error while fetching jobs")
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  fetchJobs()
}, [])

    // This effect handles URL parameters for initial filters
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const category = urlParams.get("category")
        const type = urlParams.get("type")
        const qualification = urlParams.get("qualification")

        if (category) {
            setFilters((prev) => ({ ...prev, category: [category] }))
            setSearchTerm(category)
        }
        if (type) {
            setFilters((prev) => ({ ...prev, type: [type] }))
            setSearchTerm(type)
        }
        if (qualification) {
            setFilters((prev) => ({ ...prev, qualification: [qualification] }))
            setSearchTerm(qualification)
        }
    }, [location.search])

    // This effect handles fetching saved and applied job status, running only once if a token exists
    useEffect(() => {
        if (!token) return
        const fetchStatus = async () => {
            try {
                const [savedRes, appliedRes] = await Promise.all([
                    fetch(`${BASE_URL}/jobseeker/getsavedJobs`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${BASE_URL}/jobseeker/appliedjobs`, { headers: { Authorization: `Bearer ${token}` } })
                ])
                const savedData = savedRes.ok ? await savedRes.json() : { savedJobs: [] }
                const appliedData = appliedRes.ok ? await appliedRes.json() : { appliedJobs: [] }
                setSavedJobs((savedData.savedJobs || []).map(j => j._id || j.id))
                setAppliedJobs((appliedData.appliedJobs || []).map(j => j._id || j.id))
            } catch (err) {
                console.error("Fetch saved/applied jobs error:", err)
            }
        }
        fetchStatus()
    }, [token])

    // This effect handles filtering and sorting, running whenever jobs, search term, filters, or sort options change
    useEffect(() => {
        let filtered = [...jobs]

        if (searchTerm.trim() !== "") {
            const q = searchTerm.toLowerCase()
            filtered = filtered.filter(
                (job) =>
                    job.title.toLowerCase().includes(q) ||
                    job.category.toLowerCase().includes(q) ||
                    job.location.toLowerCase().includes(q) ||
                    job.company.toLowerCase().includes(q) ||
                    job.skills.some((skill) => skill.toLowerCase().includes(q)),
            )
        }

        Object.entries(filters).forEach(([key, values]) => {
            if (Array.isArray(values) && values.length > 0) {
                filtered = filtered.filter((job) => {
                    const jobValue = job[key]
                    return values.some((val) => jobValue && jobValue.toLowerCase().includes(val.toLowerCase()))
                })
            }
        })

        if (sortOption === "salaryHigh") {
            filtered.sort((a, b) => Number.parseInt(b.salary) - Number.parseInt(a.salary))
        } else if (sortOption === "salaryLow") {
            filtered.sort((a, b) => Number.parseInt(a.salary) - Number.parseInt(b.salary))
        } else if (sortOption === "company") {
            filtered.sort((a, b) => (a.company || "").localeCompare(b.company || ""))
        } else {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        }

        setFilteredJobs(filtered)
    }, [searchTerm, filters, sortOption, jobs])

    const handleSaveJob = async (jobId) => {
        if (!token) {
            return toast.error("Please log in to save jobs")
        }
        const isSaved = savedJobs.includes(jobId)
        try {
            const res = await fetch(`${BASE_URL}/jobseeker/${isSaved ? 'removesavedjob' : 'savejob'}/${jobId}`, {
                method: isSaved ? "DELETE" : "POST",
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!res.ok) {
                throw new Error("Failed to update saved jobs")
            }
            setSavedJobs(prev => isSaved ? prev.filter(id => id !== jobId) : [...prev, jobId])
            toast.success(isSaved ? "Job removed from saved" : "Job saved successfully")
        } catch (err) {
            toast.error(err.message || "Error saving job")
        }
    }

    const handleApplyJob = async (jobId) => {
        if (!token) {
            return toast.error("Please log in to apply")
        }
        if (appliedJobs.includes(jobId)) {
            return toast.info("You've already applied")
        }
        setApplyLoading(prev => [...prev, jobId])
        try {
            const res = await fetch(`${BASE_URL}/jobseeker/applyforjob/${jobId}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({})
            })
            if (!res.ok) {
                throw new Error("Failed to apply")
            }
            setAppliedJobs(prev => [...prev, jobId])
            toast.success("Application submitted successfully")
        } catch (err) {
            toast.error(err.message || "Error applying")
        } finally {
            setApplyLoading(prev => prev.filter(id => id !== jobId))
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff1ed] via-[#fff1ed] to-white">
            {/* Hero */}
            <div className="relative bg-gradient-to-r from-[#fff1ed] via-[#fff1ed] to-white">
                <div className="container mx-auto px-4 py-8 sm:py-12 text-center">
                    <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
                        Find Your{" "}
                        <span className="bg-gradient-to-r from-[#caa057] to-[#caa057] bg-clip-text text-transparent">
                            Dream Job
                        </span>
                    </h1>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Discover amazing job opportunities from top companies across all industries
                    </p>
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-center bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="flex items-center px-4 py-2 flex-1">
                                <Search size={20} className="text-[#caa057] mr-2" />
                                <input
                                    type="text"
                                    placeholder="Search jobs, companies, locations..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm sm:text-base"
                                />
                            </div>
                            <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#caa057] to-[#caa057] text-white font-semibold">
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Filters */}
                    <div className="lg:w-1/4">
                        <FilterPanel filters={filters} setFilters={setFilters} />
                    </div>

                    {/* Jobs list */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold">
                                    {loading ? "Loading..." : `${filteredJobs.length} Jobs Found`}
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    {searchTerm ? `Results for "${searchTerm}"` : "Showing all available opportunities"}
                                </p>
                            </div>
                        </div>

                        {/* Jobs */}
                        {loading ? (
                            <p className="text-center text-gray-500 py-8">Loading jobs...</p>
                        ) : filteredJobs.length === 0 ? (
                            <div className="text-center py-16">
                                <Briefcase size={36} className="text-[#caa057] mx-auto mb-3" />
                                <h3 className="text-base font-semibold">No Jobs Found</h3>
                                <p className="text-gray-500 text-sm">Try adjusting filters or search terms.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredJobs.map((job) => (
                                    <JobCard
                                        key={job.id}
                                        job={job}
                                        showActions={true}
                                        isSaved={savedJobs.includes(job.id)}
                                        isApplied={appliedJobs.includes(job.id)}
                                        applyLoading={applyLoading.includes(job.id)}
                                        onSave={() => handleSaveJob(job.id)}
                                        onApply={() => handleApplyJob(job.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobBoard