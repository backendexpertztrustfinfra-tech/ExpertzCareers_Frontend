"use client";

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  IndianRupee,
  Clock,
  Users,
  Bookmark,
  Building2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import Cookies from "js-cookie";

const JobDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { job } = location.state || {};
  const token = Cookies.get("userToken");

  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!job) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>⚠️ Job details not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:shadow-md transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleApply = async () => {
    if (applied) return alert("✅ Already applied!");
    if (!token) {
      alert("❌ Please log in to apply.");
      return;
    }
    setLoading(true);
    try {
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
      if (!resp.ok) throw new Error(data.message || "Failed");

      setApplied(true);
      alert("✅ Application submitted!");
    } catch (err) {
      console.error(err);
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    if (!saved) {
      savedJobs.push(job);
      localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
      setSaved(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Top Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-200 shadow transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Job Details</h1>
        </div>

        {/* Hero Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-orange-100 mb-6 hover:shadow-2xl transition">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white border border-orange-200 shadow-sm">
                <img
                  src={job.logo || "/placeholder.svg"}
                  alt={job.company}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {job.title}
                </h2>
                <p className="text-sm text-gray-600">{job.company}</p>
              </div>
            </div>

            {/* Apply + Save */}
            <div className="flex gap-2">
              <button
                onClick={handleApply}
                disabled={loading || applied}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all ${
                  applied
                    ? "bg-green-500 text-white"
                    : "bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:opacity-90"
                }`}
              >
                {loading ? "Applying..." : applied ? "✅ Applied" : "Apply Now"}
              </button>
              <button
                onClick={handleSave}
                className={`px-4 py-2 rounded-xl font-semibold text-sm border transition shadow-sm ${
                  saved
                    ? "border-orange-400 text-orange-600 bg-orange-50"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {saved ? "⭐ Saved" : <Bookmark size={18} />}
              </button>
            </div>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-6 text-sm">
            <Detail icon={<MapPin size={16} />} text={job.location} />
            <Detail icon={<Briefcase size={16} />} text={job.type} />
            <Detail icon={<GraduationCap size={16} />} text={job.qualification} />
            <Detail icon={<IndianRupee size={16} />} text={job.salary} />
            <Detail
              icon={<Users size={16} />}
              text={`${job.applicants || 0} Applicants`}
            />
            <Detail
              icon={<Clock size={16} />}
              text={
                job.postedDate
                  ? new Date(job.postedDate).toLocaleDateString()
                  : "—"
              }
            />
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Job Info */}
          <div className="lg:col-span-2 space-y-6">
            <Section title="Job Description">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {Array.isArray(job.description)
                  ? job.description.join(" ")
                  : job.description}
              </p>
            </Section>

            {job.responsibilities?.length > 0 && (
              <Section title="Responsibilities">
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {job.responsibilities.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </Section>
            )}

            {job.skills?.length > 0 && (
              <Section title="Skills Required">
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs font-medium bg-orange-100 rounded-full text-gray-700 hover:bg-orange-200 transition"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {job.benefits?.length > 0 && (
              <Section title="Benefits">
                <div className="grid sm:grid-cols-2 gap-3">
                  {job.benefits.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-3 bg-green-50 rounded-xl text-sm text-gray-700 hover:bg-green-100 transition"
                    >
                      <CheckCircle2 className="text-green-500" size={18} />
                      {b}
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* Right: Company Info */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 size={18} className="text-orange-500" /> Company Info
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Name:</span> {job.company}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Location:</span> {job.location}
              </p>
              {job.website && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Website:</span>{" "}
                  <a
                    href={job.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-600 underline hover:text-orange-700"
                  >
                    {job.website}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Apply Bar */}
      <div className="lg:hidden fixed bottom-4 left-3 right-3 bg-white/95 backdrop-blur-md border shadow-xl rounded-2xl p-3 flex gap-3 items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-200 shadow transition"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={handleApply}
          disabled={loading || applied}
          className={`flex-1 py-2.5 rounded-xl font-semibold text-sm shadow-md transition ${
            applied
              ? "bg-green-500 text-white"
              : "bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:opacity-90"
          }`}
        >
          {loading ? "Applying..." : applied ? "✅ Applied" : "Apply Now"}
        </button>
        <button
          onClick={handleSave}
          className={`px-4 rounded-xl font-semibold text-sm border shadow-sm transition ${
            saved
              ? "border-orange-400 text-orange-600 bg-orange-50"
              : "border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {saved ? "⭐" : <Bookmark size={18} />}
        </button>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition">
    <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
    {children}
  </div>
);

const Detail = ({ icon, text }) => (
  <div className="flex items-center gap-2 p-2 bg-white/90 backdrop-blur rounded-xl border text-gray-700 shadow hover:shadow-md transition">
    <span className="p-1 bg-orange-50 rounded">{icon}</span>
    <span className="font-medium">{text}</span>
  </div>
);

export default JobDetails;
