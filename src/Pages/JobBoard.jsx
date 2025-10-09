import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import FilterPanel from "../Components/JobBoard/FilterPanel";
import JobCard from "../Components/JobBoard/JobCard";
import { Search, Briefcase } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../config";

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: [],
    qualification: [],
    experience: [],
    location: [],
    company: [],
    jobCategory: [],
    datePosted: [],
    salary: { min: 0, max: 50 },
  });
  const [sortOption, setSortOption] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [applyLoading, setApplyLoading] = useState([]);
  const location = useLocation();
  const token = Cookies.get("userToken");

  // Fetch all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("userToken") || Cookies.get("recruiterToken");

        if (!token) {
          toast.error("Please log in to view live jobs");
          setLoading(false);
          return;
        }

        const res = await fetch(`${BASE_URL}/jobseeker/getalllivejobs`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error(`[JobBoard] ${res.status} error:`, text);
          toast.error(`Error ${res.status}: Unable to fetch jobs`);
          setJobs([]);
          return;
        }

        const data = await res.json();
        const jobsArray = Array.isArray(data.liveJobs)
          ? data.liveJobs
          : Array.isArray(data.jobs)
          ? data.jobs
          : [];

        const transformed = jobsArray.map((j) => {
          const id = j._id || j.id || j.jobId || Math.random().toString(36).slice(2);
          const createdAt = j.createdAt || new Date().toISOString();
          const jobSkills = j.jobSkills || j.skills || j.keySkills || j.jobSkillsString || "";
          const skillsArray = Array.isArray(jobSkills)
            ? jobSkills
            : typeof jobSkills === "string"
            ? jobSkills
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s)
            : [];
          const company =
            j.jobCreatedby?.recruterCompany ||
            j.companyName ||
            j.company ||
            j.employerName ||
            "Company Name";

          return {
            id,
            title: j.jobTitle || j.title || "No Title",
            company,
            jobCategory: j.jobCategory || j.category || "General",
            location: j.location || "Location",
            address: j.address || "",
            type: j.jobType || j.type || "Full-time",
            qualification: j.qualification || j.Qualification || "Not specified",
            salary: j.salary || j.SalaryIncentive || "Not disclosed",
            experience: j.experience || j.totalExperience || j.relevantExperience || "Not specified",
            description: j.description || "No description available",
            createdAt,
            postedDate: j.createdAt || j.postedDate || new Date().toISOString(),
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
            applicants: j.candidatesApplied?.length || 0,
          };
        });

        setJobs(transformed);
      } catch (err) {
        console.error("[JobBoard] fetch error:", err);
        toast.error("Server error while fetching jobs");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Handle URL search parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const type = urlParams.get("type");
    const qualification = urlParams.get("qualification");
    const jobCategory = urlParams.get("jobCategory");

    if (jobCategory) setFilters((prev) => ({ ...prev, jobCategory: [jobCategory] }));
    if (type) setFilters((prev) => ({ ...prev, type: [type] }));
    if (qualification) setFilters((prev) => ({ ...prev, qualification: [qualification] }));
  }, [location.search]);

  // Fetch saved/applied jobs
  useEffect(() => {
    if (!token) return;
    const fetchStatus = async () => {
      try {
        const [savedRes, appliedRes] = await Promise.all([
          fetch(`${BASE_URL}/jobseeker/getsavedJobs`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_URL}/jobseeker/appliedjobs`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const savedData = savedRes.ok ? await savedRes.json() : { savedJobs: [] };
        const appliedData = appliedRes.ok ? await appliedRes.json() : { appliedJobs: [] };

        const savedIds = (savedData.savedJobs || [])
          .map((j) => j?.job?._id || j?.job?.id || j?._id || j?.id)
          .filter(Boolean);
        const appliedIds = (appliedData.appliedJobs || [])
          .map((j) => j?._id || j?.id)
          .filter(Boolean);

        setSavedJobs(savedIds);
        setAppliedJobs(appliedIds);
        window.__SAVED_IDS = savedIds;
        window.__APPLIED_IDS = appliedIds;
      } catch (err) {
        console.error("Fetch saved/applied jobs error:", err);
      }
    };
    fetchStatus();
  }, [token]);

  // Filtering and sorting
  useEffect(() => {
    let filtered = [...jobs];

    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(q) ||
          job.jobCategory.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.skills.some((skill) => skill.toLowerCase().includes(q))
      );
    }

    Object.entries(filters).forEach(([key, values]) => {
      if (!Array.isArray(values) || values.length === 0) return;

      if (key === "datePosted") {
        filtered = filtered.filter((job) => {
          const posted = new Date(job.postedDate);
          return values.some((val) => {
            const now = new Date();
            if (val === "Last 7 days") return now - posted <= 7 * 24 * 60 * 60 * 1000;
            if (val === "Last 10 days") return now - posted <= 10 * 24 * 60 * 60 * 1000;
            if (val === "Last 30 days") return now - posted <= 30 * 24 * 60 * 60 * 1000;
            return true;
          });
        });
      } else {
        filtered = filtered.filter((job) => {
          const jobValue = job[key];
          return values.some(
            (val) =>
              jobValue &&
              jobValue.toString().toLowerCase().includes(val.toString().toLowerCase())
          );
        });
      }
    });

    if (sortOption === "salaryHigh") {
      filtered.sort((a, b) => Number.parseInt(b.salary) - Number.parseInt(a.salary));
    } else if (sortOption === "salaryLow") {
      filtered.sort((a, b) => Number.parseInt(a.salary) - Number.parseInt(b.salary));
    } else if (sortOption === "company") {
      filtered.sort((a, b) => (a.company || "").localeCompare(b.company || ""));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredJobs(filtered);
  }, [searchTerm, filters, sortOption, jobs]);

  // Global updates
  useEffect(() => {
    const onSavedUpdated = () => setSavedJobs((window.__SAVED_IDS || []).filter(Boolean));
    const onAppliedUpdated = () => setAppliedJobs((window.__APPLIED_IDS || []).filter(Boolean));
    window.addEventListener("savedJobsUpdated", onSavedUpdated);
    window.addEventListener("appliedJobsUpdated", onAppliedUpdated);
    return () => {
      window.removeEventListener("savedJobsUpdated", onSavedUpdated);
      window.removeEventListener("appliedJobsUpdated", onAppliedUpdated);
    };
  }, []);

  // Save/Apply handlers
  const handleSaveJob = async (jobId) => {
    if (!token) return toast.error("Please log in to save jobs");
    if (appliedJobs.includes(jobId)) return toast.info("Already applied.");

    const isSaved = savedJobs.includes(jobId);
    try {
      const res = await fetch(`${BASE_URL}/jobseeker/${isSaved ? "removesavedjob" : "savejob"}/${jobId}`, {
        method: isSaved ? "DELETE" : "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to update saved jobs");

      const next = isSaved ? savedJobs.filter((id) => id !== jobId) : [...savedJobs, jobId];
      setSavedJobs(next);
      window.__SAVED_IDS = next;
      window.dispatchEvent(new Event("savedJobsUpdated"));

      toast.success(isSaved ? "Removed from saved" : "Saved successfully");
    } catch (err) {
      toast.error(err.message || "Error saving job");
    }
  };

  const handleApplyJob = async (jobId) => {
    if (!token) return toast.error("Please log in to apply");
    if (appliedJobs.includes(jobId)) return toast.info("Already applied");

    setApplyLoading((prev) => [...prev, jobId]);
    try {
      const res = await fetch(`${BASE_URL}/jobseeker/applyforjob/${jobId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error("Failed to apply");

      const nextApplied = [...appliedJobs, jobId];
      setAppliedJobs(nextApplied);
      window.__APPLIED_IDS = nextApplied;
      window.dispatchEvent(new Event("appliedJobsUpdated"));

      // Unsave if applied
      if (savedJobs.includes(jobId)) {
        const unsaveRes = await fetch(`${BASE_URL}/jobseeker/removesavedjob/${jobId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (unsaveRes.ok) {
          const nextSaved = savedJobs.filter((id) => id !== jobId);
          setSavedJobs(nextSaved);
          window.__SAVED_IDS = nextSaved;
          window.dispatchEvent(new Event("savedJobsUpdated"));
        }
      }

      toast.success("Application submitted successfully");
    } catch (err) {
      toast.error(err.message || "Error applying");
    } finally {
      setApplyLoading((prev) => prev.filter((id) => id !== jobId));
    }
  };

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
            <FilterPanel filters={filters} setFilters={setFilters} allJobs={jobs} />
          </div>

          {/* Jobs list */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg sm:text-xl font-bold">
                  {loading ? "Loading..." : `${filteredJobs.length} Jobs Found`}
                </h2>
                <p className="text-gray-500 text-sm">
                  {searchTerm
                    ? `Results for "${searchTerm}"`
                    : "Showing all available opportunities"}
                </p>
              </div>
            </div>

            {loading ? (
              <p className="text-center text-gray-500 py-8">Loading jobs...</p>
            ) : (() => {
              const visibleJobs = filteredJobs.filter(
                (job) => !savedJobs.includes(job.id) && !appliedJobs.includes(job.id)
              );
              return visibleJobs.length === 0 ? (
                <div className="text-center py-16">
                  <Briefcase size={36} className="text-[#caa057] mx-auto mb-3" />
                  <h3 className="text-base font-semibold">No Jobs Found</h3>
                  <p className="text-gray-500 text-sm">Try adjusting filters or search terms.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {visibleJobs.map((job) => (
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
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobBoard;
