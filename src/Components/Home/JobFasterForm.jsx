import React from "react";
import { Link } from "react-router-dom";

const JobFasterForm = () => {
  return (
    <div className="bg-[#fff1ed] py-10 px-8 flex flex-col lg:flex-row items-center justify-between rounded-xl shadow-xl mx-auto">
      {/* Left Content */}
      <div className="flex-1 mb-6 px-30 lg:mb-0">
        <h2 className="text-5xl font-bold text-gray-900 mb-4">
          Get A Job Faster
        </h2>

        <form className="flex items-center gap-2">
          <span className="bg-gray-200 text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
            +91
          </span>
          <input
            type="tel"
            placeholder="Enter your mobile"
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#caa057] w-full max-w-xs"
          />
          <Link to="/">
            <button
              type="submit"
              className="bg-[#caa057] hover:bg-[#b4924c] text-white px-6 py-2 rounded-md font-semibold transition-all"
            >
              Submit
            </button>
          </Link>
        </form>
      </div>

      {/* Right Image */}
      <div className="flex-1 text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
          alt="Interview Illustration"
          className="w-72 mx-auto"
        />
      </div>
    </div>
  );
};

export default JobFasterForm;