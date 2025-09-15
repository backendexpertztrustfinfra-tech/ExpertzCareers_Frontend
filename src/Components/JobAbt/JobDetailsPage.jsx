"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import Cookies from "js-cookie";
import { BASE_URL } from "../../config";

/**
 * Sanitize job description HTML
 */
function sanitizeHtml(dirty) {
  if (!dirty) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(dirty, "text/html");

  const whitelist = {
    P: [],
    BR: [],
    STRONG: [],
    B: [],
    EM: [],
    I: [],
    U: [],
    UL: [],
    OL: [],
    LI: [],
    A: ["href"],
  };

  function cleanNode(node) {
    if (node.nodeType === Node.TEXT_NODE)
      return document.createTextNode(node.textContent);
    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const tag = node.tagName.toUpperCase();
    if (!whitelist[tag]) {
      const frag = document.createDocumentFragment();
      node.childNodes.forEach((child) => {
        const cleaned = cleanNode(child);
        if (cleaned) frag.appendChild(cleaned);
      });
      return frag;
    }

    const el = document.createElement(tag.toLowerCase());
    if (tag === "A") {
      const href = node.getAttribute("href");
      if (href && /^(https?:|mailto:|tel:)/i.test(href)) {
        el.setAttribute("href", href);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
      }
    }
    node.childNodes.forEach((child) => {
      const cleaned = cleanNode(child);
      if (cleaned) el.appendChild(cleaned);
    });
    return el;
  }

  const frag = document.createDocumentFragment();
  doc.body.childNodes.forEach((child) => {
    const c = cleanNode(child);
    if (c) frag.appendChild(c);
  });

  const container = document.createElement("div");
  container.appendChild(frag);
  return container.innerHTML;
}

const JobDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { job } = location.state || {};
  const token = Cookies.get("userToken");

  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Check if job already saved/applied on mount
  useEffect(() => {
    if (!job || !token) return;

    const fetchStatus = async () => {
      try {
        // saved
        const savedResp = await fetch(`${BASE_URL}/jobseeker/getsavedJobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (savedResp.ok) {
          const d = await savedResp.json();
          const ids = (d.savedJobs || []).map((j) => j._id || j.id);
          setSaved(ids.includes(job.id));
          // cache
          window.__SAVED_IDS = ids;
        } else {
          setSaved(false);
          window.__SAVED_IDS = window.__SAVED_IDS || [];
        }

        // applied
        const appliedResp = await fetch(`${BASE_URL}/jobseeker/appliedjobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (appliedResp.ok) {
          const d2 = await appliedResp.json();
          const ids2 = (d2.appliedJobs || []).map((j) => j._id || j.id);
          setApplied(ids2.includes(job.id));
          window.__APPLIED_IDS = ids2;
        } else {
          setApplied(false);
          window.__APPLIED_IDS = window.__APPLIED_IDS || [];
        }
      } catch (err) {
        console.error("fetchStatus:", err);
      }
    };

    fetchStatus();
  }, [job, token]);

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
      const resp = await fetch(`${BASE_URL}/jobseeker/applyforjob/${job.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data.message || "Failed to apply");

      // Update cache & state (no localStorage)
      window.__APPLIED_IDS = window.__APPLIED_IDS || [];
      if (!window.__APPLIED_IDS.includes(job.id)) window.__APPLIED_IDS.push(job.id);
      setApplied(true);

      window.dispatchEvent(new Event("appliedJobsUpdated"));
      alert("✅ Application submitted!");
    } catch (err) {
      console.error(err);
      alert("❌ " + (err.message || "Failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!token) {
      alert("❌ Please log in to save jobs.");
      return;
    }
    try {
      if (!saved) {
        const resp = await fetch(`${BASE_URL}/jobseeker/savejob/${job.id}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) throw new Error(data.message || "Failed to save");
        window.__SAVED_IDS = window.__SAVED_IDS || [];
        if (!window.__SAVED_IDS.includes(job.id)) window.__SAVED_IDS.push(job.id);
        setSaved(true);
        window.dispatchEvent(new Event("savedJobsUpdated"));
        alert("⭐ Job saved!");
      } else {
        const resp = await fetch(`${BASE_URL}/jobseeker/removesavedjob/${job.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) throw new Error(data.message || "Failed to unsave");
        window.__SAVED_IDS = (window.__SAVED_IDS || []).filter((id) => id !== job.id);
        setSaved(false);
        window.dispatchEvent(new Event("savedJobsUpdated"));
        alert("❌ Removed from saved jobs");
      }
    } catch (err) {
      console.error(err);
      alert("❌ " + (err.message || "Failed"));
    }
  };

  const renderDescription = () => {
    if (!job.description) return <p className="text-sm text-gray-500">No job description provided.</p>;
    if (Array.isArray(job.description)) {
      return (
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          {job.description.map((d, idx) => (
            <li key={idx}>{d}</li>
          ))}
        </ul>
      );
    }
    const cleaned = sanitizeHtml(job.description);
    return <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: cleaned }} />;
  };
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <div className="max-w-6xl mx-auto px-4 py-6">
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
            <Detail
              icon={<GraduationCap size={16} />}
              text={job.qualification}
            />
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
            <Section title="Job Description">{renderDescription()}</Section>
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
