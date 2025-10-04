"use client";

import { useState, useEffect } from "react";
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
  Calendar,
  FileText,
  Award,
  Target,
  Settings,
  UserCheck,
  Gift,
  Code,
  CheckCircle,
} from "lucide-react";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
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
  const { id } = useParams();
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

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
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data.message || "Failed to apply");

      // Update cache & state (no localStorage)
      window.__APPLIED_IDS = window.__APPLIED_IDS || [];
      if (!window.__APPLIED_IDS.includes(job.id))
        window.__APPLIED_IDS.push(job.id);
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
        if (!window.__SAVED_IDS.includes(job.id))
          window.__SAVED_IDS.push(job.id);
        setSaved(true);
        window.dispatchEvent(new Event("savedJobsUpdated"));
        alert("⭐ Job saved!");
      } else {
        const resp = await fetch(
          `${BASE_URL}/jobseeker/removesavedjob/${job.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) throw new Error(data.message || "Failed to unsave");
        window.__SAVED_IDS = (window.__SAVED_IDS || []).filter(
          (id) => id !== job.id
        );
        setSaved(false);
        window.dispatchEvent(new Event("savedJobsUpdated"));
        alert("❌ Removed from saved jobs");
      }
    } catch (err) {
      console.error(err);
      alert("❌ " + (err.message || "Failed"));
    }
  };

  const handleRelatedJobClick = (relatedJob) => {
    navigate("/job-details", {
      state: { job: relatedJob },
      replace: false,
    });
  };

  const renderDescription = () => {
    if (!job.description)
      return (
        <p className="text-sm text-gray-500">No job description provided.</p>
      );
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
    return (
      <div
        className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: cleaned }}
      />
    );
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`${BASE_URL}/jobseeker/job/${id}`);
        const data = await res.json();
        setJob(data.job);
      } catch (err) {
        console.error("Failed to fetch job:", err);
      }
    };

    fetchJob();
  }, [id]);

  const renderJobInfo = () => {
    const jobInfo = [
      {
        icon: <MapPin size={16} />,
        label: "Location",
        value: job.location || job.address,
      },
      {
        icon: <Briefcase size={16} />,
        label: "Job Type",
        value: job.type || job.jobType,
      },
      {
        icon: <GraduationCap size={16} />,
        label: "Qualification",
        value: job.qualification || job.Qualification,
      },
      {
        icon: <IndianRupee size={16} />,
        label: "Salary",
        value: job.salary || job.SalaryIncentive,
      },
      {
        icon: <Users size={16} />,
        label: "Openings",
        value: job.openings || job.noofOpening,
      },
      {
        icon: <Target size={16} />,
        label: "Experience",
        value: job.experience || job.totalExperience || job.relevantExperience,
      },
      {
        icon: <UserCheck size={16} />,
        label: "Gender",
        value: job.gender || "Any",
      },
      { icon: <Settings size={16} />, label: "Shift", value: job.shift },
      {
        icon: <Calendar size={16} />,
        label: "Working Days",
        value:
          job.workingDays || `${job.workingDaysFrom} - ${job.workingDaysTo}`,
      },
      {
        icon: <Clock size={16} />,
        label: "Timing",
        value: job.timing || `${job.startTime} - ${job.endTime}`,
      },
      { icon: <Calendar size={16} />, label: "Weekend", value: job.weekend },
    ].filter((item) => item.value && item.value !== "undefined - undefined");

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {jobInfo.map((item, index) => (
          <Detail
            key={index}
            icon={item.icon}
            label={item.label}
            text={item.value}
          />
        ))}
      </div>
    );
  };

  const renderSkills = () => {
    const skills = job.skills || job.jobSkills;
    if (!skills) return null;

    const skillsArray = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
      ? skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s)
      : [];

    if (skillsArray.length === 0) return null;

    return (
      <Section
        title="Required Skills"
        icon={<Code size={18} className="text-[#caa057]" />}
      >
        <div className="flex flex-wrap gap-2">
          {skillsArray.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-[#fff1ed] text-[#caa057] rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </Section>
    );
  };

  const renderBenefits = () => {
    const benefits = job.benefits || job.jobBenefits;
    if (!benefits) return null;

    const benefitsArray = Array.isArray(benefits)
      ? benefits
      : typeof benefits === "string"
      ? benefits
          .split(",")
          .map((b) => b.trim())
          .filter((b) => b)
      : [];

    if (benefitsArray.length === 0) return null;

    return (
      <Section
        title="Job Benefits"
        icon={<Gift size={18} className="text-green-500" />}
      >
        <div className="space-y-2">
          {benefitsArray.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
      </Section>
    );
  };

  const renderDocuments = () => {
    const documents = job.documents || job.documentRequired;
    if (!documents) return null;

    const documentsArray = Array.isArray(documents)
      ? documents
      : typeof documents === "string"
      ? documents
          .split(",")
          .map((d) => d.trim())
          .filter((d) => d)
      : [];

    if (documentsArray.length === 0) return null;

    return (
      <Section
        title="Documents Required"
        icon={<FileText size={18} className="text-blue-500" />}
      >
        <div className="space-y-2">
          {documentsArray.map((doc, index) => (
            <div key={index} className="flex items-center gap-2">
              <FileText size={16} className="text-blue-500" />
              <span className="text-gray-700">{doc}</span>
            </div>
          ))}
        </div>
      </Section>
    );
  };

  const getCompanyName = (jobData) => {
    return (
      jobData.jobCreatedby?.recruterCompany ||
      jobData.company ||
      jobData.companyName ||
      jobData.raw?.jobCreatedby?.recruterCompany ||
      jobData.jobCreatedby?.company ||
      jobData.jobCreatedby?.name ||
      jobData.raw?.companyName ||
      jobData.raw?.company ||
      jobData.raw?.jobCreatedby?.company ||
      jobData.raw?.jobCreatedby?.name ||
      "Company Name"
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fff1ed] via-[#fff1ed] to-[#fff1ed]">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-[#fff1ed] text-[#caa057] hover:bg-[#fff1ed] shadow transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Job Details</h1>
        </div>

        {/* Hero Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-[#fff1ed] mb-6 hover:shadow-2xl transition">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white border border-[#fff1ed] shadow-sm">
                <img
                  src={job.logo || "/placeholder.svg"}
                  alt={getCompanyName(job)}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {job.title || job.jobTitle}
                </h2>
                <p className="text-sm text-gray-600">{getCompanyName(job)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {job.category || job.jobCategory}
                </p>
              </div>
            </div>

            {/* Apply + Save */}
            {/* <div className="flex gap-2">
              <button
                onClick={handleApply}
                disabled={loading || applied}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all ${
                  applied
                    ? "bg-green-500 text-white"
                    : "bg-gradient-to-r from-[#caa057] to-[#caa057] text-white hover:opacity-90"
                }`}
              >
                {loading ? "Applying..." : applied ? "✅ Applied" : "Apply Now"}
              </button>
              <button
                onClick={handleSave}
                className={`px-4 py-2 rounded-xl font-semibold text-sm border transition shadow-sm ${
                  saved
                    ? "border-[#caa057] text-[#caa057] bg-[#fff1ed]"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {saved ? "⭐ Saved" : <Bookmark size={18} />}
              </button>
            </div> */}

            <div className="flex gap-2">
              {!applied ? (
                <button
                  onClick={handleApply}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all bg-gradient-to-r from-[#caa057] to-[#caa057] text-white hover:opacity-90"
                >
                  {loading ? "Applying..." : "Apply Now"}
                </button>
              ) : (
                <button
                  disabled
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all ${
                    applicationStatus === "REJECTED"
                      ? "bg-red-500 text-white"
                      : applicationStatus === "SHORTLISTED"
                      ? "bg-blue-500 text-white"
                      : applicationStatus === "VIEWED"
                      ? "bg-yellow-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {applicationStatus === "VIEWED"
                    ? "Application Viewed"
                    : applicationStatus === "SHORTLISTED"
                    ? "Shortlisted"
                    : applicationStatus === "REJECTED"
                    ? "Rejected"
                    : "Applied"}
                </button>
              )}

              {/* Save button */}
              <button
                onClick={handleSave}
                className={`px-4 py-2 rounded-xl font-semibold text-sm border transition shadow-sm ${
                  saved
                    ? "border-[#caa057] text-[#caa057] bg-[#fff1ed]"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {saved ? "⭐ Saved" : <Bookmark size={18} />}
              </button>
            </div>
          </div>

          {/* Enhanced Job Info Grid */}
          <div className="mt-6">{renderJobInfo()}</div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Job Info */}
          <div className="lg:col-span-2 space-y-6">
            <Section title="Job Description">{renderDescription()}</Section>

            {renderSkills()}

            {renderBenefits()}

            {renderDocuments()}

            {/* Related Jobs section */}
            {relatedJobs.length > 0 && (
              <Section
                title="Related Jobs"
                icon={<Briefcase size={18} className="text-purple-500" />}
              >
                {loadingRelated ? (
                  <p className="text-gray-500">Loading related jobs...</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedJobs.map((relatedJob) => (
                      <div
                        key={relatedJob.id}
                        onClick={() => handleRelatedJobClick(relatedJob)}
                        className="cursor-pointer bg-white/90 backdrop-blur rounded-xl p-4 border border-gray-100 
                                      hover:border-orange-300 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={relatedJob.logo || "/placeholder.svg"}
                            alt={relatedJob.company}
                            className="w-10 h-10 object-contain rounded-lg bg-gray-50 p-1"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm truncate">
                              {relatedJob.title}
                            </h4>
                            <p className="text-xs text-gray-600 truncate">
                              {relatedJob.company}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <MapPin size={12} />
                              <span className="truncate">
                                {relatedJob.location}
                              </span>
                              <span>•</span>
                              <span>{relatedJob.type}</span>
                            </div>
                            {relatedJob.salary !== "Not disclosed" && (
                              <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
                                <IndianRupee size={12} />
                                <span>{relatedJob.salary}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            )}
          </div>

          {/* Right: Company Info */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 size={18} className="text-[#caa057]" /> Company Info
              </h3>
              <div className="space-y-3">
                <InfoItem label="Company" value={getCompanyName(job)} />
                <InfoItem label="Location" value={job.location} />
                <InfoItem label="Address" value={job.address} />
                <InfoItem
                  label="Industry"
                  value={job.industry || job.recruterIndustry}
                />
                {job.website && (
                  <div>
                    <span className="font-medium text-gray-700">Website:</span>{" "}
                    <a
                      href={job.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#caa057] underline hover:text-[#b4924c]"
                    >
                      {job.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Award size={18} className="text-blue-500" /> Job Statistics
              </h3>
              <div className="space-y-3">
                <InfoItem
                  label="Posted"
                  value={
                    job.postedDate || job.createdAt
                      ? new Date(
                          job.postedDate || job.createdAt
                        ).toLocaleDateString()
                      : "Recently"
                  }
                />
                <InfoItem
                  label="Applicants"
                  value={`${job.applicants || 0} applied`}
                />
                <InfoItem label="Status" value={job.status || "Active"} />
                {job.expiryDate && (
                  <InfoItem
                    label="Expires"
                    value={new Date(job.expiryDate).toLocaleDateString()}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Apply Bar */}
      <div className="lg:hidden fixed bottom-4 left-3 right-3 bg-white/95 backdrop-blur-md border shadow-xl rounded-2xl p-3 flex gap-3 items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-[#fff1ed] text-[#caa057] hover:bg-[#fff1ed] shadow transition"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={handleApply}
          disabled={loading || applied}
          className={`flex-1 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all ${
            applied
              ? "bg-green-500 text-white"
              : "bg-gradient-to-r from-[#caa057] to-[#caa057] text-white hover:opacity-90"
          }`}
        >
          {loading ? "Applying..." : applied ? "✅ Applied" : "Apply Now"}
        </button>
        <button
          onClick={handleSave}
          className={`px-4 py-2 rounded-xl font-semibold text-sm border transition shadow-sm ${
            saved
              ? "border-[#caa057] text-[#caa057] bg-[#fff1ed]"
              : "border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {saved ? "⭐ Saved" : <Bookmark size={18} />}
        </button>
      </div>
    </div>
  );
};

const Section = ({ title, children, icon }) => (
  <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-[#fff1ed] hover:shadow-2xl transition">
    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
      {icon} {title}
    </h3>
    {children}
  </div>
);

const Detail = ({ icon, label, text }) => (
  <div className="flex items-center gap-2 p-3 bg-white/90 backdrop-blur rounded-xl border text-gray-700 shadow hover:shadow-md transition">
    <span className="p-1 bg-[#fff1ed] rounded text-[#caa057]">{icon}</span>
    <div className="flex-1 min-w-0">
      <div className="text-xs text-gray-500 font-medium">{label}</div>
      <div className="text-sm font-semibold truncate">{text}</div>
    </div>
  </div>
);

const InfoItem = ({ label, value }) =>
  value ? (
    <div className="text-sm">
      <span className="font-medium text-gray-700">{label}:</span>{" "}
      <span className="text-gray-600">{value}</span>
    </div>
  ) : null;

export default JobDetails;
