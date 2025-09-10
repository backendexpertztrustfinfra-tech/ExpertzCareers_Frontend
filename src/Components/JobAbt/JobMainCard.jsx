import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const JobMainCard = ({ job, setApplicationStatus }) => {
  const { user } = useContext(AuthContext);
  const [isApplied, setIsApplied] = useState(false);


  useEffect(() => {
    if (!user) return;
    const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || [];
    const already = appliedJobs.some(
      (j) => j.jobId === job.id && j.userId === user.uid
    );
    setIsApplied(already);
  }, [job.id, user]);

  const handleApply = () => {
    if (!user) {
      alert("⚠️ Please login to apply.");
      return;
    }

    const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || [];

    const already = appliedJobs.some(
      (j) => j.jobId === job.id && j.userId === user.uid
    );

    if (already) {
      setIsApplied(true);
      return;
    }

    // Add new application
    appliedJobs.push({
      ...job,
      jobId: job.id,
      userId: user.uid,
      appliedAt: new Date().toISOString(),
      status: "Pending",
    });

    localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));

    // ✅ Update both UI states
    setIsApplied(true);
    setApplicationStatus("Pending");

    alert("✅ You have successfully applied!");
  };

  return (
    <div className="border rounded-xl p-6 shadow-md space-y-4">
      <div>
        <h2 className="text-xl font-semibold">{job.title}</h2>
        <p className="text-gray-600">{job.company}</p>
        <p className="text-sm text-gray-700 mt-2">{job.location}</p>
        <p className="text-sm">
          {job.salary} • {job.type} in {job.category}
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleApply}
          disabled={isApplied}
          className={`px-6 py-2 rounded-full font-semibold ${
            isApplied
              ? "bg-white text-black border border-yellow-600"
              : "bg-yellow-600 text-white hover:bg-yellow-700"
          }`}
        >
          {isApplied ? "✓ Applied" : "Apply Now"}
        </button>

        <button className="border border-yellow-600 px-4 py-2 rounded-full">
          Share
        </button>
      </div>
    </div>
  );
};

export default JobMainCard;
