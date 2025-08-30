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
        console.warn("JWT token missing");
        return;
      }

      try {
        const profile = await getRecruiterProfile(token);
        if (!profile) throw new Error("Failed to fetch profile");

        setAppliedCount(
          Array.isArray(profile.applied) ? profile.applied.length : 0
        );
        setSavedCount(Array.isArray(profile.saved) ? profile.saved.length : 0);
        setUnviewedCount(
          Array.isArray(profile.unviewed) ? profile.unviewed.length : 0
        );
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
      icon: <Users size={22} className="text-orange-500" />,
    },
    {
      title: "Saved",
      value: savedCount,
      icon: <Bookmark size={22} className="text-orange-500" />,
    },
    {
      title: "Unviewed",
      value: unviewedCount,
      icon: <EyeOff size={22} className="text-orange-500" />,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Database Quick Access
      </h3>
      <div className="flex flex-col space-y-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition"
          >
            {/* Progress Bar */}
            <div className="relative w-2 h-12 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="bg-orange-500 w-full absolute bottom-0 transition-all duration-700"
                style={{
                  height: loading ? "0%" : `${Math.min(item.value * 10, 100)}%`, // Scaled bar height
                }}
              />
            </div>

            {/* Icon (color applied directly) */}
            <div>{item.icon}</div>

            {/* Text & Count */}
            <div className="flex justify-between w-full items-center">
              <span className="font-medium text-gray-700">{item.title}</span>
              <span className="text-xl font-bold text-gray-900">
                {loading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  `${item.value}+`
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatabaseQuickBox;
