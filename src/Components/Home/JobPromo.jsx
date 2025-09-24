import React from "react";
import { Briefcase, MapPin, PhoneCall, Search } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    id: 1,
    title: "Verified Jobs Only",
    desc: "Every opportunity is carefully screened for authenticity.",
    icon: <Briefcase className="w-7 h-7 text-[#caa057]" />,
  },
  {
    id: 2,
    title: "Jobs Near You",
    desc: "Find trusted openings in your preferred location.",
    icon: <MapPin className="w-7 h-7 text-[#caa057]" />,
  },
  {
    id: 3,
    title: "Direct HR Connect",
    desc: "Call recruiters directly & fast-track your interviews.",
    icon: <PhoneCall className="w-7 h-7 text-[#caa057]" />,
  },
];

const JobPromo = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#fff1ed] via-[#fff1ed] to-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug">
            Find Your <span className="text-[#caa057]">Dream Job</span> with{" "}
            <span className="text-[#caa057]">Expertz Career</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Explore verified opportunities, connect with top recruiters, and
            grow your career faster than ever.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-10 bg-white shadow-xl rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center max-w-4xl mx-auto">
          <div className="flex items-center w-full sm:flex-1 bg-gray-50 px-3 py-3 rounded-xl">
            <Briefcase className="w-5 h-5 text-gray-500 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Job title or keyword..."
              className="bg-transparent w-full outline-none text-gray-700 text-sm sm:text-base"
            />
          </div>
          <div className="flex items-center w-full sm:w-1/3 bg-gray-50 px-3 py-3 rounded-xl">
            <MapPin className="w-5 h-5 text-gray-500 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Location..."
              className="bg-transparent w-full outline-none text-gray-700 text-sm sm:text-base"
            />
          </div>
          <Link to="/jobs">
            <button className="flex items-center justify-center gap-2 bg-[#caa057] hover:bg-[#b4924c] text-white px-6 py-3 rounded-xl font-semibold transition transform hover:scale-105 shadow-md text-sm sm:text-base w-full sm:w-auto">
              <Search size={18} /> Search
            </button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {features.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 hover:border-[#caa057] transition rounded-2xl p-8 shadow-lg flex flex-col items-center text-center h-full"
            >
              <div className="bg-[#fff1ed] p-4 rounded-full mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/jobs"
            className="w-full sm:w-auto bg-[#caa057] hover:bg-[#b4924c] text-white font-medium px-8 py-4 rounded-xl shadow-md transition transform hover:scale-105 text-center text-sm sm:text-base"
          >
            Browse Jobs
          </Link>
          <Link
            to="/companies"
            className="w-full sm:w-auto border border-[#caa057] text-[#caa057] hover:bg-[#fff1ed] px-8 py-4 rounded-xl font-medium transition transform hover:scale-105 text-center text-sm sm:text-base"
          >
            Explore Industries
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JobPromo;