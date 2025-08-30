import React, { useState, useRef, useEffect } from "react";
import {
  FaEllipsisV,
  FaMapMarkerAlt,
  FaBriefcase,
  FaUsers,
  FaRupeeSign,
} from "react-icons/fa";
import { deleteJob } from "../../../services/apis";
import Cookies from "js-cookie";

const DashboardJobCard = ({  job,  onDeleteSuccess,  onEditClick,  onJobClick}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);

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


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const handleDelete = async (e) => {
  e.stopPropagation();
  setLoading(true);
  try {
    const token = Cookies.get("userToken"); // ✅ use same token key everywhere
    await deleteJob(job._id, token);

    // ✅ Trigger parent state update so job disappears immediately
    if (onDeleteSuccess) onDeleteSuccess(job._id); 
  } catch (error) {
    console.error("Delete job failed:", error);
    alert(error.message || "Failed to delete job");
  } finally {
    setLoading(false);
    setMenuOpen(false);
  }
};

  return (
    <div
      className="bg-gradient-to-br from-white via-orange-50 to-amber-50 
                 rounded-xl border border-amber-200 
                 p-5 shadow-md hover:shadow-2xl transition cursor-pointer"
      onClick={() => onJobClick && onJobClick(job)}
    >
      <div className="flex justify-between items-start">
        {/* Left Section */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-amber-100 border border-amber-300">
            <span className="text-lg font-bold text-amber-700">
              {job.jobCategory?.[0] || "C"}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg text-gray-800">
                {job.jobTitle}
              </h3>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
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
            <p className="text-sm text-gray-500">{job.jobCategory}</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-row items-center gap-2" ref={menuRef}>
          <span className="text-xs text-gray-500">
  {getTimeAgo(job.createdAt)}
</span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <FaEllipsisV />
          </button>

          {menuOpen && (
            <div className="absolute right-5 mt-8 w-36 bg-white border rounded-md shadow-lg z-50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditClick(job);
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Middle Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mt-4">
        <div className="flex items-center gap-2 text-amber-700 font-medium">
          <FaBriefcase className="text-amber-500" /> {job.jobType || "N/A"}
        </div>
        <div className="flex items-center gap-2 text-amber-700 font-medium">
          <FaUsers className="text-amber-500" /> {job.noofOpening || ""} Openings
        </div>
        <div className="flex items-center gap-2 text-amber-700 font-medium">
          <FaRupeeSign className="text-amber-500" />{" "}
          {job.SalaryIncentive || "Not Disclosed"}
        </div>
        <div className="flex items-center gap-2 text-amber-700 font-medium">
          <FaMapMarkerAlt className="text-amber-500" />{" "}
          {job.location || "Remote"}
        </div>
      </div>

      {/* Bottom Buttons */}
<div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
  <button
    className="relative py-2 text-sm font-medium rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center justify-center gap-2"
    onClick={(e) => {
      e.stopPropagation();
      onJobClick && onJobClick(job);
    }}
  >
    All Candidates:{job.appliedCount}
    
  </button>

  <button
    className="py-2 text-sm font-medium rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 text-green-700"
    onClick={(e) => e.stopPropagation()}
  >
    Contacted:{" "}
    <span className="font-semibold">{job.contactedCount ?? 0}</span>
  </button>

  <button
    className="py-2 text-sm font-medium rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700"
    onClick={(e) => e.stopPropagation()}
  >
    Review: <span className="font-semibold">{job.reviewCount ?? 0}</span>
  </button>
</div>


      {/* Upgrade Button */}
      <div className="mt-4">
        <button
          className="w-full flex items-center justify-center gap-2 py-3 text-sm md:text-base font-semibold rounded-lg 
                     bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 
                     text-white shadow-lg 
                     hover:from-amber-500 hover:via-orange-600 hover:to-red-600 
                     hover:shadow-xl hover:scale-[1.03] 
                     transition-all duration-300 ease-in-out"
          onClick={(e) => e.stopPropagation()}
        >
          🚀 Unlock More Candidates – <span>Upgrade Now</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardJobCard;
