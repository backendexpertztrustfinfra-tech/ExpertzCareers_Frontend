"use client";

import React, { useState, useEffect } from "react";
import FilterPanel from "../Components/JobBoard/FilterPanel";
import JobCard from "../Components/JobBoard/JobCard";
import { Search, Briefcase } from "lucide-react";

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: [],
    qualification: [],
    experience: [],
    category: [],
    location: [],
  });
  const [sortOption, setSortOption] = useState("recent");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://expertzcareers-backend.onrender.com/jobseeker/getalllivejobs");
        const data = await res.json();
        console.log("[API Response]", data);

        let jobsArray = [];
        if (Array.isArray(data)) jobsArray = data;
        else if (data?.liveJobs && Array.isArray(data.liveJobs)) jobsArray = data.liveJobs;
        else if (data?.jobs && Array.isArray(data.jobs)) jobsArray = data.jobs;
        else if (data?.data && Array.isArray(data.data)) jobsArray = data.data;
        else if (data && typeof data === "object") {
          const possibleArrays = Object.values(data).filter(Array.isArray);
          if (possibleArrays.length > 0) jobsArray = possibleArrays[0];
        }

        if (!jobsArray || jobsArray.length === 0) {
          console.warn("[JobBoard] no jobs found");
          setJobs([]);
          setFilteredJobs([]);
          return;
        }

        // Normalize each job to UI-friendly shape (map backend fields to front-end names)
        const transformed = jobsArray.map((j) => {
          const id = j._id || j.id || j.jobId || Math.random().toString(36).slice(2);
          const createdAt = j.createdAt || j.datePosted || j.postedDate || new Date().toISOString();
          const jobSkills = j.jobSkills || j.skills || j.keySkills || j.jobSkillsString || null;
          const skillsArray = Array.isArray(jobSkills) ? jobSkills : (typeof jobSkills === "string" && jobSkills ? jobSkills.split(",").map(s => s.trim()) : []);

          // company may be coming separately from recruiter info — try multiple fallbacks
          const company =
            j.companyName ||
            j.company ||
            j.employerName ||
            (j.jobCreatedby && (j.jobCreatedby.company || j.jobCreatedby.name)) ||
            (j.recruiter && (j.recruiter.company || j.recruiter.name)) ||
            "Company Name";

          return {
            _id: id,
            id,
            title: j.jobTitle || j.title || "No Title",
            jobTitle: j.jobTitle || j.title || "No Title",
            company,
            location: j.location || j.jobLocation || j.address || "Location",
            type: j.jobType || j.type || "Full-time",
            qualification: j.Qualification || j.qualification || j.education || "Not specified",
            salary: j.SalaryIncentive || j.salary || j.salaryRange || "Not disclosed",
            SalaryIncentive: j.SalaryIncentive || j.salaryRange || "0",
            category: j.jobCategory || j.category || (skillsArray.length > 0 ? skillsArray.join(", ") : "General"),
            jobCategory: j.jobCategory || j.category || "General",
            experience: j.totalExperience || j.relevantExperience || j.experience || "Not specified",
            description: j.description || j.jobDescription || "No description available",
            createdAt,
            postedDate: j.postedDate || createdAt,
            logo: j.companyLogo || j.logo || "/placeholder.svg",
            featured: j.featured || false,
            applicants: (Array.isArray(j.candidatesApplied) ? j.candidatesApplied.length : (j.applicants || undefined)),
            skills: skillsArray,
            raw: j, // keep full raw backend object if needed
          };
        });

        setJobs(transformed);
        setFilteredJobs(transformed);
      } catch (err) {
        console.error("[JobBoard] fetch error:", err);
        setJobs([]);
        setFilteredJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = [...jobs];

    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          (job.jobTitle || job.title || "").toLowerCase().includes(q) ||
          (job.jobCategory || job.category || "").toLowerCase().includes(q) ||
          (job.location || "").toLowerCase().includes(q) ||
          (job.company || "").toLowerCase().includes(q)
      );
    }

    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) {
        filtered = filtered.filter((job) => {
          const jobValue = job[key];
          return values.some((val) => jobValue && jobValue.toLowerCase().includes(val.toLowerCase()));
        });
      }
    });

    if (sortOption === "salaryHigh") {
      filtered.sort((a, b) => (parseInt(b.SalaryIncentive) || 0) - (parseInt(a.SalaryIncentive) || 0));
    } else if (sortOption === "salaryLow") {
      filtered.sort((a, b) => (parseInt(a.SalaryIncentive) || 0) - (parseInt(b.SalaryIncentive) || 0));
    } else if (sortOption === "company") {
      filtered.sort((a, b) => (a.company || "").localeCompare(b.company || ""));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredJobs(filtered);
  }, [searchTerm, filters, sortOption, jobs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-white">
      {/* Hero */}
      <div className="relative min-h-[50vh] overflow-hidden">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
            Find Your <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Dream Job</span>
          </h1>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center bg-white/80 rounded-2xl shadow-lg overflow-hidden">
              <div className="flex items-center px-4 py-3 flex-1">
                <Search size={22} className="text-yellow-500 mr-3" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent text-gray-800 placeholder-gray-500 outline-none text-base sm:text-lg"
                />
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className="lg:w-1/4 bg-white/70 rounded-2xl shadow-lg p-6">
            <FilterPanel filters={filters} setFilters={setFilters} />
          </div>

          {/* Jobs list */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">{loading ? "Loading..." : `${filteredJobs.length} Jobs Found`}</h2>
                <p className="text-gray-600 mt-1 text-sm">{searchTerm ? `Results for "${searchTerm}"` : ""}</p>
              </div>

              <div>
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="px-4 py-2 bg-white border rounded-lg">
                  <option value="recent">Most Recent</option>
                  <option value="salaryHigh">Salary High → Low</option>
                  <option value="salaryLow">Salary Low → High</option>
                  <option value="company">Company Name</option>
                </select>
              </div>
            </div>

            {loading ? (
              <p className="text-center text-gray-500 py-10">Loading jobs...</p>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-20">
                <Briefcase size={40} className="text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No Jobs Found</h3>
                <p className="text-gray-500">Try adjusting filters or search.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} showActions={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobBoard;
