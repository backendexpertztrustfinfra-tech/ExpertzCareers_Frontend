"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FaEllipsisV,
  FaMapMarkerAlt,
  FaBriefcase,
  FaUsers,
  FaRupeeSign,
} from "react-icons/fa";
import Cookies from "js-cookie";
import { deleteJob } from "../../../services/apis";
import { BASE_URL } from "../../../config";

const DashboardJobCard = ({
  job,
  onDeleteSuccess,
  onEditClick,
  onJobClick,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const menuRef = useRef(null);

  // ---------- Time Ago Helper ----------
  const getTimeAgo = (date) => {
    if (!date) return "Just now";
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    const years = Math.floor(months / 12);
    return `${years}y ago`;
  };

  // ---------- Close Menu on Outside Click ----------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------- Delete Job ----------
  const handleDelete = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const token = Cookies.get("userToken");
      await deleteJob(job._id, token);
      if (onDeleteSuccess) onDeleteSuccess(job._id);
    } catch (error) {
      console.error("Delete job failed:", error);
      alert(error.message || "Failed to delete job");
    } finally {
      setLoading(false);
      setMenuOpen(false);
    }
  };

  // ---------- Get Company Logo URL ----------
  const getCompanyLogo = () => {
    if (!job.companyLogo) return null;
    if (job.companyLogo.startsWith("http")) return job.companyLogo;
    return `${BASE_URL.replace(/\/$/, "")}${job.companyLogo}`;
  };

  const logoUrl = getCompanyLogo();
  const showImage = logoUrl && !imageError;

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm 
                 hover:shadow-md hover:scale-[1.01] transition-all duration-200 
                 cursor-pointer flex flex-col gap-3"
      onClick={() => onJobClick && onJobClick(job)}
    >
      {/* ---------- Top Section ---------- */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {/* Company Logo or First Letter Fallback */}
          {showImage ? (
            <img
              src={logoUrl}
              alt={job.company || "Company Logo"}
              className="w-10 h-10 rounded-md border object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center rounded-md bg-[#fff1ed] border border-[#caa057]">
              <span className="text-sm font-bold text-[#caa057]">
                {job.company?.[0]?.toUpperCase() || "C"}
              </span>
            </div>
          )}

          {/* Company Info */}
          <div className="max-w-[160px]">
            <h3 className="font-semibold text-sm md:text-base text-gray-800 truncate">
              {job.jobTitle}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {job.company || "Company Name"}
            </p>
            <span
              className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full ${
                job.status === "Active"
                  ? "bg-green-100 text-green-600"
                  : job.status === "Closed"
                  ? "bg-red-100 text-red-600"
                  : job.status === "Pending"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {job.status}
            </span>
          </div>
        </div>

        {/* ---------- Menu ---------- */}
        <div className="flex items-center gap-1 relative" ref={menuRef}>
          <span className="text-[11px] text-gray-400">
            {getTimeAgo(job.createdAt)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-1 rounded-full hover:bg-gray-100 transition"
          >
            <FaEllipsisV size={14} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-6 w-32 bg-white border rounded-md shadow-lg z-50 text-sm">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditClick(job);
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50"
              >
                ✏️ Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "🗑 Delete"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ---------- Job Info ---------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mt-1">
        <div className="flex items-center gap-1 text-gray-700">
          <FaBriefcase className="text-[#caa057]" size={12} />{" "}
          {job.jobType || "N/A"}
        </div>
        <div className="flex items-center gap-1 text-gray-700">
          <FaUsers className="text-[#caa057]" size={12} />{" "}
          {job.noofOpening || 0} Openings
        </div>
        <div className="flex items-center gap-1 text-gray-700">
          <FaRupeeSign className="text-[#caa057]" size={12} />{" "}
          {job.SalaryIncentive || "Not Disclosed"}
        </div>
        <div className="flex items-center gap-1 text-gray-700">
          <FaMapMarkerAlt className="text-[#caa057]" size={12} />{" "}
          {job.location || "Remote"}
        </div>
      </div>

      {/* ---------- Candidate Stats ---------- */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <button
          className="py-1.5 text-xs font-medium rounded-md border border-blue-200 bg-blue-50 
                     hover:bg-blue-100 text-blue-700 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            onJobClick && onJobClick(job);
          }}
        >
          👥 {job.appliedCount ?? 0} Candidates
        </button>
        <button
          className="py-1.5 text-xs font-medium rounded-md border border-green-200 bg-green-50 
                     hover:bg-green-100 text-green-700"
          onClick={(e) => e.stopPropagation()}
        >
          📞 {job.contactedCount ?? 0} Contacted
        </button>
      </div>
    </div>
  );
};

export default DashboardJobCard;