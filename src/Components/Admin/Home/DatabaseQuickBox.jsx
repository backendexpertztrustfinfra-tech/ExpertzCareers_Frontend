import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getRecruiterProfile } from "../../../services/apis";
import { Users, Bookmark, EyeOff } from "lucide-react";

const DatabaseQuickBox = () => {
  const [appliedCount, setAppliedCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [unviewedCount, setUnviewedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("userToken");

  useEffect(() => {
    const loadCandidateData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getRecruiterProfile(token);
        if (!profile) throw new Error("Failed to fetch profile");

        setAppliedCount(Array.isArray(profile.applied) ? profile.applied.length : 0);
        setSavedCount(Array.isArray(profile.saved) ? profile.saved.length : 0);
        setUnviewedCount(Array.isArray(profile.unviewed) ? profile.unviewed.length : 0);
      } catch (err) {
        console.error("Error loading candidate data:", err);
        setAppliedCount(0);
        setSavedCount(0);
        setUnviewedCount(0);
      } finally {
        setLoading(false);
      }
    };

    loadCandidateData();
  }, [token]);

  const stats = [
    {
      title: "Applied",
      value: appliedCount,
      icon: Users,
      color: "from-orange-400 to-red-500",
    },
    {
      title: "Saved",
      value: savedCount,
      icon: Bookmark,
      color: "from-blue-400 to-indigo-500",
    },
    {
      title: "Unviewed",
      value: unviewedCount,
      icon: EyeOff,
      color: "from-green-400 to-emerald-500",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">
        Database Overview
      </h3>

      {/* Horizontal Scroll Wrapper for Mobile */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-3 gap-4 sm:gap-6 min-w-[600px]">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 bg-white hover:shadow-md hover:scale-[1.02] transition-all duration-300"
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-gradient-to-r ${item.color} mb-3 shadow-md`}
                >
                  <Icon size={22} className="text-white" />
                </div>

                {/* Title */}
                <span className="text-gray-600 font-medium text-sm sm:text-base text-center">
                  {item.title}
                </span>

                {/* Count */}
                <span className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
                  {loading ? <span className="animate-pulse">...</span> : item.value}
                </span>

                {/* Progress bar */}
                <div className="w-full h-1.5 mt-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} transition-all duration-700`}
                    style={{
                      width: loading ? "0%" : `${Math.min(item.value * 10, 100)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DatabaseQuickBox;
