import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaKickstarterK, FaSearch } from "react-icons/fa";

const JobSearchBar = () => {
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [department, setDepartment] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");

  const navigate = useNavigate();

  const locations = [
    "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
    "Kanpur", "Nagpur", "Indore", "Bhopal", "Patna", "Ludhiana", "Agra", "Nashik", "Vadodara", "Varanasi",
    "Meerut", "Rajkot", "Kochi", "Coimbatore", "Thiruvananthapuram", "Visakhapatnam", "Surat", "Ranchi",
    "Jamshedpur", "Noida", "Gurgaon", "Faridabad", "Ghaziabad", "Chandigarh", "Amritsar", "Dehradun",
    "Guwahati", "Shimla", "Manali", "Udaipur", "Ajmer", "Jodhpur", "Gwalior", "Raipur", "Bilaspur", "Siliguri",
    "Hubli", "Belgaum", "Dhanbad", "Mangalore", "Jabalpur", "Panaji", "Pondicherry", "Madurai", "Salem",
    "Tiruchirappalli", "Tirunelveli", "Warangal", "Nellore", "Kurnool", "Tirupati", "Anantapur", "Karimnagar",
    "Shillong", "Imphal", "Aizawl", "Itanagar", "Kohima", "Agartala", "Remote", "Work from Home"
  ];

  const industries = [
    "Information Technology", "Finance & Banking", "Healthcare", "Education", "E-Commerce", "Manufacturing",
    "Construction", "Hospitality", "Real Estate", "Retail", "Transportation & Logistics", "Media & Entertainment",
    "Telecommunications", "Automobile", "Legal Services", "Consulting", "Aerospace & Aviation", "Pharmaceuticals",
    "FMCG", "Agriculture", "Textile & Apparel", "BPO / KPO", "Chemical", "Mining & Metals", "Energy / Oil / Gas",
    "Public Sector", "Insurance", "NGO / Non-Profit", "Event Management", "Art & Design", "Gaming", "Jewellery",
    "Printing & Packaging", "Sports", "Marine", "Architecture & Planning", "Environment", "Space Research",
    "Handicrafts", "Tourism", "Beauty & Wellness", "Petroleum", "Food & Beverages", "Cybersecurity",
    "Robotics", "Artificial Intelligence", "Blockchain", "EdTech", "HealthTech", "AgriTech", "CleanTech",
    "SpaceTech", "FinTech", "BioTech", "LogTech", "LegalTech", "PropTech", "TravelTech"
  ];

  const departments = [
    "Engineering", "IT & Software Development", "Human Resources", "Sales", "Marketing", "Finance & Accounts",
    "Design & Creative", "Customer Support", "Business Development", "Operations", "Product Management",
    "Legal & Compliance", "Research & Development", "Administrative", "Healthcare & Nursing", "Teaching & Education",
    "Procurement & Supply Chain", "Quality Assurance", "Content Writing & Editing", "Data Analysis & Data Science",
    "UX/UI Design", "Digital Marketing", "Public Relations", "Security & Facility", "Technical Support",
    "Event Management", "Translation & Language Services", "Travel & Hospitality", "Merchandising", "Animation & VFX",
    "Photography & Videography"
  ];

  const handleSearch = () => {
    const queryParams = new URLSearchParams({
      role,
      industry,
      department,
      experience,
      location,
    }).toString();
    navigate(`/jobs?${queryParams}`);
  };

  return (
    <div className="text-center px-4 mt-20">
      <h2 className="text-2xl md:text-3xl font-semibold mb-8">
        What Kind of a Role Do You Want?
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex flex-col lg:flex-row flex-wrap gap-4 bg-white px-6 py-6 mx-auto max-w-7xl justify-between items-center"
      >
        {/* Role */}
        <div className="flex items-center border border-[#caa057] py-2 px-2 rounded-full gap-2 w-full lg:flex-1 min-w-[180px]">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Enter skills / designations / companies"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full text-sm outline-none placeholder-gray-500 bg-transparent"
          />
        </div>

        {/* Industry */}
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="bg-transparent border-l border border-[#caa057] py-2 rounded-full text-sm outline-none text-gray-800 w-full lg:flex-1 min-w-[180px] px-2"
        >
          <option value="">Select Industry</option>
          {industries.map((ind, idx) => (
            <option key={idx} value={ind}>{ind}</option>
          ))}
        </select>

        {/* Department */}
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="bg-transparent border-l border border-[#caa057] py-2 rounded-full text-sm outline-none text-gray-800 w-full lg:flex-1 min-w-[180px] px-2"
        >
          <option value="">Select Department</option>
          {departments.map((dep, idx) => (
            <option key={idx} value={dep}>{dep}</option>
          ))}
        </select>

        {/* Experience */}
        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="bg-transparent border-l text-sm outline-none text-gray-800 w-full lg:flex-1 min-w-[180px] px-2 border border-[#caa057] py-2 rounded-full"
        >
          <option value="">Select Experience</option>
          <option value="0-1">0-1 Years</option>
          <option value="1-3">1-3 Years</option>
          <option value="3-5">3-5 Years</option>
          <option value="5+">5+ Years</option>
        </select>

        {/* Location Input + Datalist */}
        <div className="w-full lg:flex-1 min-w-[180px] relative ">
          <input
            type="text"
            placeholder="Enter or select location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-white text-gray-800 px-4 py-2 w-full border border-[#caa057] rounded-full outline-none"
          />
          {location && (
            <ul className="absolute z-10 bg-white border border-[#caa057] mt-1 w-full max-h-60 overflow-auto rounded-lg shadow-lg text-left text-sm">
              {locations
                .filter((loc) =>
                  loc.toLowerCase().includes(location.toLowerCase())
                )
                .map((loc, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 hover:bg-[#fff1ed] cursor-pointer"
                    onClick={() => setLocation(loc)}
                  >
                    {loc}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="bg-[#caa057] hover:bg-[#b4924c] text-white font-semibold text-sm px-6 py-2 rounded-full transition-all w-full sm:w-auto"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default JobSearchBar;