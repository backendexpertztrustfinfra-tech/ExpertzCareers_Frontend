"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  IndianRupee,
  Clock,
  Users,
  TrendingUp,
  Sparkles,
  Award,
  BookmarkIcon,
  Share2,
} from "lucide-react";
import Cookies from "js-cookie";

const JobCard = ({ job, showActions = true, onJobClick }) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("userToken");

  const normalized = {
    id: job.id || job._id || job.raw?._id || job.jobId,
    title: job.title || job.jobTitle || (job.raw && (job.raw.jobTitle || job.raw.title)),
    company: job.company || job.companyName || (job.raw && (job.raw.companyName || job.raw.company)),
    location: job.location || job.jobLocation || job.address || (job.raw && job.raw.location),
    type: job.type || job.jobType,
    qualification: job.qualification || job.Qualification,
    salary: job.salary || job.SalaryIncentive || job.salaryRange,
    description: job.description || job.jobDescription || (job.raw && (job.raw.description || job.raw.jobDescription)),
    category: job.category || job.jobCategory || (job.skills ? job.skills.join(", ") : job.jobSkills),
    experience: job.experience || job.totalExperience || job.relevantExperience,
    postedDate: job.postedDate || job.createdAt || (job.raw && job.raw.createdAt),
    applicants: job.applicants || (job.candidatesApplied ? (Array.isArray(job.candidatesApplied) ? job.candidatesApplied.length : job.candidatesApplied) : undefined),
    logo: job.logo || job.companyLogo || "/placeholder.svg",
    featured: job.featured || false,
    skills: job.skills || (job.raw && job.raw.jobSkills ? (Array.isArray(job.raw.jobSkills) ? job.raw.jobSkills : (typeof job.raw.jobSkills === "string" ? job.raw.jobSkills.split(",").map(s=>s.trim()) : [])) : []),
    raw: job.raw || job,
  };

  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    setSaved(savedJobs.some((s) => s.id === normalized.id || s._id === normalized.id));

    const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
    setApplied(appliedJobs.some((a) => a.id === normalized.id || a._id === normalized.id));
  }, [normalized.id]);

  const handleSave = (e) => {
    e?.stopPropagation();
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    if (!savedJobs.some((s) => s.id === normalized.id || s._id === normalized.id)) {
      savedJobs.push(normalized);
      localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
      setSaved(true);
    }
  };

  const handleApply = async (e) => {
    e.stopPropagation();
    if (applied) {
      alert("✅ You've already applied");
      return;
    }
    setLoading(true);
    try {
      if (!token) {
        alert("❌ Please log in to apply for jobs.");
        setLoading(false);
        return;
      }
      // POST application
      const resp = await fetch(`https://expertzcareers-backend.onrender.com/jobseeker/applyforjob/${normalized.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || `Apply failed: ${resp.status}`);
      // save locally
      const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
      appliedJobs.push({ ...normalized, appliedAt: new Date().toISOString() });
      localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));
      setApplied(true);
      alert("✅ Application submitted!");
    } catch (err) {
      console.error("apply error:", err);
      alert("❌ " + (err.message || "Failed to apply"));
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (e) => {
    e?.stopPropagation();
    if (typeof onJobClick === "function") {
      onJobClick(normalized);
    } else {
      navigate(`/jobs/${normalized.id}`, { state: { job: normalized } });
    }
  };

  return (
    <div
      onClick={handleViewDetails}
      className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-6 mb-6 cursor-pointer group border border-orange-200"
    >
      <div className="absolute top-4 right-4 w-3 h-3 bg-orange-500 rounded-full animate-pulse" />

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4 items-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-xl bg-orange-50 flex items-center justify-center border-2 border-orange-200">
              <img src={normalized.logo} alt={normalized.company} className="w-10 h-10 object-contain" />
            </div>
            {normalized.featured && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles size={8} className="text-white" />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800">{normalized.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <TrendingUp size={14} className="text-orange-500" />
              <span>{normalized.company}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={(e) => e.stopPropagation()} className="p-2 rounded-lg">
            <Share2 size={18} className="text-gray-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSave(e);
            }}
            className="p-2 rounded-lg"
          >
            <BookmarkIcon size={18} className={saved ? "text-orange-500" : "text-gray-500"} />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <Detail icon={<MapPin size={14} />} text={normalized.location} />
        <Detail icon={<Briefcase size={14} />} text={normalized.type} />
        <Detail icon={<GraduationCap size={14} />} text={normalized.qualification} />
        <Detail icon={<IndianRupee size={14} />} text={normalized.salary} />
      </div>

      <div className="mb-4 p-3 rounded-lg bg-orange-50 border border-orange-200 text-sm text-gray-700 line-clamp-2">
        {Array.isArray(normalized.description) ? normalized.description.join(" ") : normalized.description}
      </div>

      {normalized.category && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <span className="px-3 py-1.5 text-xs font-semibold bg-orange-100 rounded-full">{normalized.category}</span>
          {normalized.experience && <span className="px-3 py-1.5 text-xs font-semibold bg-yellow-100 rounded-full">{normalized.experience}</span>}
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-orange-200">
        <div className="flex gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Clock size={12} className="text-orange-500" />
            <span className="font-medium">{normalized.postedDate ? new Date(normalized.postedDate).toLocaleDateString() : "—"}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={12} className="text-yellow-600" />
            <span className="font-medium">{normalized.applicants || "—"}</span>
          </span>
        </div>

        {showActions && (
          <div className="flex gap-3">
            <button onClick={handleApply} disabled={loading || applied} className={`px-5 py-2.5 rounded-lg font-semibold text-sm ${applied ? "bg-green-500 text-white" : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"}`}>
              {loading ? "Applying..." : applied ? "✅ Applied" : "Apply Now"}
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleViewDetails(e); }} className="px-5 py-2.5 rounded-lg font-semibold text-sm border border-orange-300 text-orange-600">
              View Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Detail = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-sm text-gray-600 p-2 rounded-lg bg-orange-50">
    <div className="p-1.5 rounded-lg bg-white shadow-sm">{icon}</div>
    <span className="font-medium">{text || "—"}</span>
  </div>
);

export default JobCard;
