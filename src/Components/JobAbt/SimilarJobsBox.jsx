import React from "react";
import { Link } from "react-router-dom";

const SimilarJobsBox = ({ jobs = [] }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Similar jobs</h3>

      {jobs.length > 0 ? (
        jobs.slice(0, 4).map((job) => (
          <Link key={job.id} to={`/jobabt/${job.id}`} state={{ job }}>
            <div className="border rounded-xl p-4 shadow hover:bg-yellow-50 cursor-pointer">
              <h4 className="font-bold text-sm">{job.title}</h4>
              <p className="text-gray-600 text-sm">{job.location}</p>
              <p className="text-gray-700 text-sm">{job.salary}</p>
            </div>
          </Link>
        ))
      ) : (
        <p className="text-sm text-gray-500">No similar jobs available.</p>
      )}

      <div className="bg-yellow-100 rounded-xl p-4 mt-4">
        <p className="text-sm font-medium mb-2">
          Get jobs matching your profile
        </p>
        <button className="bg-yellow-600 text-white w-full py-2 rounded-full text-sm">
          Create Your Profile for Free
        </button>
      </div>
    </div>
  );
};

export default SimilarJobsBox;
