import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PostJobForm from "../Job/PostJobForm";

const PostJobPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || "/my-jobs";
  const initialData = location.state?.initialData || null;

  const handleSubmitted = (job) => {
    try {
      localStorage.setItem("latest_posted_job", JSON.stringify(job));
    } catch (e) {
      console.error("Could not write latest_posted_job", e);
    }

    if (typeof returnTo === "string") {
      navigate(returnTo);
    } else {
      navigate("/admin", { state: returnTo });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center px-3 sm:px-6 py-6 sm:py-10">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg sm:rounded-2xl p-4 sm:p-6 md:p-10">
        {/* Back Button */}
        <button
          onClick={() =>
            typeof returnTo === "string"
              ? navigate(returnTo)
              : navigate("/admin", { state: returnTo })
          }
          className="mb-6 inline-flex items-center justify-center gap-2 
             px-4 py-2 rounded-full 
             text-sm sm:text-base font-medium 
             text-[#D4AF37] border border-[#D4AF37] 
             hover:bg-[#D4AF37] hover:text-white 
             focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none
             transition-all duration-300"
        >
          <span className="text-base sm:text-lg">←</span>
          <span>Back</span>
        </button>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Post a <span className="text-[#D4AF37]">New Job</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-md mx-auto">
            Fill out the details below to publish your job listing.
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full">
          <PostJobForm
            onSubmit={handleSubmitted}
            onClose={() =>
              typeof returnTo === "string"
                ? navigate(returnTo)
                : navigate("/admin", { state: returnTo })
            }
            initialData={initialData}
          />
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;
