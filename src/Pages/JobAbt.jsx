// import React, { useEffect, useState, useContext } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import JobMainCard from "../Components/JobAbt/JobMainCard";
// import JobDescriptionBox from "../Components/JobAbt/JobDescriptionBox";
// import JobRequirementsBox from "../Components/JobAbt/JobRequirementsBox";
// import CompanyInfoBox from "../Components/JobAbt/CompanyInfoBox";
// import ContactCardBox from "../Components/JobAbt/ContactCardBox";
// import SimilarJobsBox from "../Components/JobAbt/SimilarJobsBox";
// import image from "../assets/Image/image.png";
// import { AuthContext } from "../context/AuthContext";

// const JobAbt = () => {
//   const location = useLocation();
//   const { id } = useParams();
//   const { user } = useContext(AuthContext);
//   const [applicationStatus, setApplicationStatus] = useState(null);

//   const jobFromState = location.state?.job;
//   const selectedJob =
//     jobFromState || JobsData.find((job) => job.id === parseInt(id));

//   const similarJobs = JobsData.filter(
//     (job) =>
//       job.id !== selectedJob?.id &&
//       job.category?.toLowerCase() === selectedJob?.category?.toLowerCase()
//   );

//   useEffect(() => {
//     if (!user || !selectedJob) return;

//     const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || [];
//     const matchedJob = appliedJobs.find(
//       (job) => job.userId === user.uid && job.jobId === selectedJob.id
//     );

//     if (matchedJob) {
//       setApplicationStatus(matchedJob.status);
//     }
//   }, [selectedJob, user]);

//   if (!selectedJob) {
//     return (
//       <div className="text-center text-xl text-red-600 font-semibold">
//         ❌ Job not found
//       </div>
//     );
//   }

//   // Steps definition
//   const steps = ["Applied", "Pending", "Viewed", "Selected", "Rejected"];
//   const currentIndex = steps.findIndex(
//     (step) => step.toLowerCase() === applicationStatus?.toLowerCase()
//   );

//   const renderStatusTracker = () => (
//     <div className="mt-6">
//       <h2 className="text-lg font-bold text-gray-700 mb-3">
//         {" "}
//         Application Status
//       </h2>
//       <div className="relative pl-6 border-l-4 border-yellow-400 space-y-4">
//         {steps.map((step, index) => {
//           const isActive = index <= currentIndex;
//           const isFinal = step === "Rejected" || step === "Selected";

//           return (
//             <div key={step} className="flex items-start gap-3">
//               <div
//                 className={`w-4 h-4 rounded-full mt-1 ${
//                   isActive
//                     ? isFinal
//                       ? step === "Rejected"
//                         ? "bg-red-500"
//                         : "bg-green-600"
//                       : "bg-yellow-500"
//                     : "bg-gray-300"
//                 }`}
//               />
//               <span
//                 className={`text-sm font-medium ${
//                   isActive ? "text-gray-800" : "text-gray-400"
//                 }`}
//               >
//                 {step}
//               </span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );

//   return (
//     <div className="font-sans bg-white text-gray-900">
//       <div
//         className="bg-cover bg-center w-full h-80 text-4xl flex justify-center items-center"
//         style={{ backgroundImage: `url(${image})` }}
//       >
//         About The Company
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-4 gap-6">
//         {/* LEFT SECTION */}
//         <div className="md:col-span-3 space-y-6">
//           <JobMainCard
//             job={selectedJob}
//             setApplicationStatus={setApplicationStatus}
//           />
//           <JobDescriptionBox job={selectedJob} />
//           <JobRequirementsBox job={selectedJob} />
//           <CompanyInfoBox job={selectedJob} />
//           <ContactCardBox job={selectedJob} />
//         </div>

//         {/* RIGHT SECTION */}
//         <div className="space-y-6">
//           {/* ✅ Status Tracker moved here */}
//           {applicationStatus ? (
//             renderStatusTracker()
//           ) : (
//             <p className="text-yellow-600 font-semibold">Not applied yet.</p>
//           )}

//           <SimilarJobsBox jobs={similarJobs} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobAbt;
