import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  GraduationCap,
  IndianRupee,
  CalendarDays,
  Clock,
  Share2,
  BookmarkPlus,
  ArrowLeft,
  UserCircle2,
  Sparkles,
  Building2,
} from "lucide-react";

function normalizeJob(raw) {
  if (!raw) return null;
  const jobSkills =
    raw.jobSkills || raw.skills || raw.keySkills || raw.skillsString;
  const skillsArray = Array.isArray(jobSkills)
    ? jobSkills
    : typeof jobSkills === "string"
    ? jobSkills.split(",").map((s) => s.trim())
    : [];

  return {
    id: raw.id || raw._id || raw.jobId,
    title: raw.jobTitle || raw.title || "Untitled Job",
    company:
      raw.companyName ||
      raw.company ||
      (raw.jobCreatedby && raw.jobCreatedby.name) ||
      "Company Name",
    location: raw.location || raw.jobLocation || raw.address || "Not specified",
    type: raw.jobType || raw.type || "Not specified",
    qualification: raw.Qualification || raw.qualification || "Not specified",
    salary:
      raw.SalaryIncentive || raw.salary || raw.salaryRange || "Not disclosed",
    description:
      raw.description || raw.jobDescription || "No description available",
    skills: skillsArray,
    createdAt: raw.createdAt || raw.datePosted || raw.postedDate,
    postedDate: raw.postedDate || raw.createdAt || raw.datePosted,
    applicants: Array.isArray(raw.candidatesApplied)
      ? raw.candidatesApplied.length
      : raw.applicants || 0,
    logo: raw.companyLogo || raw.logo || "/placeholder.svg",
    featured: raw.featured || false,
    shift: raw.shift || "Day",
    workingDays: raw.workingDays || "Mon-Fri",
    timing: raw.timing || "9:00 AM - 6:00 PM",
    benefits: raw.jobBenefits || "Not specified",
    recruiter: raw.jobCreatedby || null,
    raw,
  };
}

export default function JobDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  const initialFromState = location.state?.job
    ? normalizeJob(location.state.job)
    : null;

  const [job, setJob] = useState(initialFromState);
  const [loading, setLoading] = useState(!initialFromState);
  const [error, setError] = useState(null);

  // ✅ Apply states
  const [applyLoading, setApplyLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (job) return;
    const fetchJob = async () => {
      try {
        let res = await fetch(
          `https://expertzcareers-backend.onrender.com/jobseeker/getjob/${id}`
        );
        const data = await res.json();
        const candidate = data?.job || data?.data || data;
        if (candidate) setJob(normalizeJob(candidate));
      } catch (err) {
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJob();
  }, [id]);

  // ✅ Apply handler
  const handleApply = async (e) => {
    e.stopPropagation();
    if (applied) {
      alert("✅ You've already applied");
      return;
    }
    setApplyLoading(true);
    try {
      if (!token) {
        alert("❌ Please log in to apply for jobs.");
        setApplyLoading(false);
        return;
      }
      const resp = await fetch(
        `https://expertzcareers-backend.onrender.com/jobseeker/applyforjob/${job.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }
      );
      const data = await resp.json();
      if (!resp.ok)
        throw new Error(data.message || `Apply failed: ${resp.status}`);

      // save locally
      const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
      appliedJobs.push({ ...job, appliedAt: new Date().toISOString() });
      localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));

      setApplied(true);
      alert("✅ Application submitted!");
    } catch (err) {
      console.error("apply error:", err);
      alert("❌ " + (err.message || "Failed to apply"));
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) return <p className="py-8 text-center">Loading job…</p>;
  if (error)
    return <p className="text-center text-red-500 mt-6">Error: {error}</p>;
  if (!job) return <p className="text-center mt-6">Job not found</p>;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-orange-50 to-yellow-100">
      {/* floating gradient backdrop */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-orange-200/30 via-orange-200/30 to-yellow-200/30 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-3 px-6 py-3 
          bg-gradient-to-r from-orange-500 via-orange-500 to-yellow-600
          text-white font-semibold rounded-full 
          shadow-lg hover:scale-105 hover:shadow-2xl 
          transition-all duration-300 text-lg"
        >
          <ArrowLeft size={22} /> Back to Jobs
        </button>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Job main info */}
          <div className="md:col-span-2 space-y-8">
            {/* Card: Job Header */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border bg-white/80 backdrop-blur-xl">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 via-orange-500 to-yellow-600"></div>
              <div className="p-10 flex gap-8 items-center">
                <img
                  src={job.logo}
                  alt={job.company}
                  className="w-28 h-28 object-contain rounded-2xl border shadow-md bg-white"
                />
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
                    {job.title}
                    {job.featured && (
                      <Sparkles className="text-orange-500 w-7 h-7 animate-pulse" />
                    )}
                  </h1>
                  <p className="text-lg text-gray-600 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-orange-500" />
                    {job.company}
                  </p>
                  <div className="flex gap-6 text-gray-500 mt-4 text-sm flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase size={16} /> {job.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays size={16} />{" "}
                      {job.postedDate
                        ? new Date(job.postedDate).toLocaleDateString()
                        : "Recently"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Highlights */}
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  label: "Salary",
                  value: job.salary,
                  icon: <IndianRupee className="text-orange-600" />,
                },
                {
                  label: "Qualification",
                  value: job.qualification,
                  icon: <GraduationCap className="text-orange-600" />,
                },
                {
                  label: "Shift",
                  value: `${job.shift} (${job.timing})`,
                  icon: <Clock className="text-yellow-600" />,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border 
                  hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] 
                  transition-all duration-300"
                >
                  <div className="mb-2">{item.icon}</div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="font-semibold text-gray-800">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 border">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                Job Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Skills */}
            {job.skills?.length > 0 && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 border">
                <h3 className="font-semibold mb-5 text-gray-900 text-xl">
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-3">
                  {job.skills.map((s, i) => (
                    <span
                      key={i}
                      className="px-4 py-1.5 rounded-full 
                      bg-gradient-to-r from-orange-400 via-orange-400 to-yellow-500 
                      text-white font-medium text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 border">
                <h3 className="font-semibold mb-4 text-gray-900 text-xl">
                  Perks & Benefits
                </h3>
                <p className="text-gray-700">{job.benefits}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Apply box */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/90 to-orange-50/80 shadow-2xl rounded-2xl p-8 border border-orange-200">
              <h3 className="font-semibold mb-5 text-gray-900 text-lg">
                Interested in this job?
              </h3>
              <button
                onClick={handleApply}
                disabled={applyLoading || applied}
                className={`w-full mb-4 px-6 py-3 rounded-xl font-semibold text-lg shadow-lg transition-all ${
                  applied
                    ? "bg-green-500 text-white"
                    : "bg-gradient-to-r from-orange-500 via-orange-500 to-yellow-600 text-white"
                }`}
              >
                {applyLoading ? "Applying..." : applied ? "✅ Applied" : "Apply Now"}
              </button>
              <div className="flex justify-between text-gray-500 text-sm">
                <button className="flex items-center gap-1 hover:text-orange-600">
                  <BookmarkPlus size={16} /> Save
                </button>
                <button className="flex items-center gap-1 hover:text-orange-600">
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>

            {/* Recruiter info */}
            {job.recruiter && (
              <div className="bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl p-7 border">
                <h3 className="font-semibold mb-4 text-gray-900">Posted By</h3>
                <div className="flex items-center gap-4">
                  <UserCircle2 className="w-12 h-12 text-gray-400" />
                  <div>
                    <p className="font-medium">
                      {job.recruiter.name || "Recruiter"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {job.recruiter.email || "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Applicants count */}
            <div className="bg-gradient-to-r from-orange-100 via-orange-100 to-yellow-100 shadow-lg rounded-2xl p-8 border text-center">
              <p className="text-5xl font-bold text-orange-600">
                {job.applicants}
              </p>
              <p className="text-gray-600">Applicants</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Apply Button (Mobile) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%]">
        <button
          onClick={handleApply}
          disabled={applyLoading || applied}
          className={`w-full py-4 rounded-full font-semibold text-lg shadow-xl transition-all ${
            applied
              ? "bg-green-500 text-white"
              : "bg-gradient-to-r from-orange-500 via-orange-500 to-yellow-600 text-white"
          }`}
        >
          {applyLoading ? "Applying..." : applied ? "✅ Applied" : "Apply Now"}
        </button>
      </div>
    </div>
  );
}
