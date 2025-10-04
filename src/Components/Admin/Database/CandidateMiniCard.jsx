"use client";

// Helper function to safely parse skills from a JSON string or comma-separated string
const safeParseSkills = (skills) => {
  if (Array.isArray(skills)) {
    return skills;
  }
  if (typeof skills === "string" && skills.trim()) {
    try {
      return JSON.parse(skills);
    } catch (e) {
      return skills.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

const CandidateMiniCard = ({ candidate, onClick }) => {
  if (!candidate) return null;

  const {
    username = "Unknown User",
    skills = [], 
    profilePhoto,
    qualification = "Not Specified",
    appliedDate,
  } = candidate;

  // Use the helper function to get a clean skills array
  const skillsArray = safeParseSkills(skills);

  // Date formatting
  const formatAppliedDate = (dateStr) => {
    if (!dateStr) return "Recently Applied";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      if (diffInHours < 1) return "Just now";
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 48) return "Yesterday";
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return "Recently Applied";
    }
  };

  const appliedTimeText = formatAppliedDate(appliedDate);
  const isRecent = appliedTimeText.includes("ago") || appliedTimeText === "Just now" || appliedTimeText === "Yesterday";

  return (
    <div
      onClick={() => onClick(candidate)}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-5 flex items-center gap-5 cursor-pointer hover:shadow-2xl hover:scale-[1.03] transition-transform duration-200 ease-in-out w-full"
    >
      <div className="relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[2px] bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-500 hover:from-blue-500 hover:to-purple-600 transition-all">
          <img
            src={profilePhoto || "https://cdn-icons-png.flaticon.com/512/219/219969.png"}
            alt={username}
            className="w-full h-full rounded-full object-cover border-2 border-white shadow-sm hover:shadow-md transition"
            onError={(e) => {
              e.target.src = "https://cdn-icons-png.flaticon.com/512/219/219969.png";
            }}
          />
        </div>
        {isRecent && (
          <span className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full border border-white shadow-md">
            Active
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-lg truncate max-w-[160px] sm:max-w-[200px]">
            {username}
          </h3>
          {isRecent && (
            <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
              {appliedTimeText}
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm mt-0.5">{qualification}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {skillsArray.length > 0 ? (
            skillsArray.slice(0, 5).map((skill, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium shadow-sm"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs">No skills listed</span>
          )}
          {skillsArray.length > 5 && (
            <span className="text-gray-500 text-xs font-medium">
              +{skillsArray.length - 5} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateMiniCard;