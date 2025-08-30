import React, { useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";
import { AuthContext } from "../../../context/AuthContext";
import { getRecruiterProfile } from "../../../services/apis";

const creditPlans = [
  {
    name: "1XPremium Job",
    price: "INR 499",
    details: [
      "3 Jobs Credits",
      "Use These Credits In 30 Days",
      "Job Active 7 days",
      "5 Advance Filter",
      "Whatsapp & call based Management System",
    ],
  },
  {
    name: "5XPremium Job",
    price: "INR 999",
    details: [
      "5 Jobs Credits",
      "Use These Credits In 90 Days",
      "Job Active 14 days",
      "8+Advance Filter",
      "Whatsapp & call based Management System",
    ],
  },
  {
    name: "10XPremium Job",
    price: "INR 2499",
    details: [
      "15 Jobs Credits",
      "Use These Credits In 180 Days",
      "Job Active 20 days",
      "12+Advance Filter",
      "Whatsapp & call based Management System",
    ],
    recommended: true,
  },
  {
    name: "25XPremium Job",
    price: "INR 4999",
    details: [
      "40 Jobs Credits",
      "Use These Credits In 360 Days",
      "Job Active 45 days",
      "15+Advance Filter",
      "Whatsapp & call based Management System",
    ],
  },
  {
    name: "Create Your Own",
    price: "Lets Talk",
    details: [
      "Dedicated account manager",
      "Use These Credits Accordingly",
      "Multiple Logins & Reports",
      "Customised Filter",
      "Whatsapp & call based Management System",
    ],
  },
];

const CreditPlanCard = () => {
  const { user } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("userToken");

  // ✅ Fetch user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const profile = await getRecruiterProfile(token);
        setUserProfile(profile);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [token]);

  const handleBuyNow = (planName) => {
    alert(`You selected: ${planName}`);
  };

  return (
    <div className="w-full min-h-screen bg-[#fffff]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-3">
          🎉 Buy Job Credits
        </h2>
        <p className="text-lg font-medium text-gray-600 mb-2">
          {loading
            ? "Loading profile..."
            : `Welcome back, ${
                userProfile?.user?.username || user?.username || "User"
              }`}
        </p>
        <p className="text-sm text-gray-500 mb-10">
          Get Premium Employees With Expertz Careers
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {creditPlans.map((plan) => (
            <div
              key={plan.name} // ✅ stable unique key
              className={`relative bg-white/90 backdrop-blur-lg rounded-2xl border p-8 shadow-lg hover:shadow-2xl hover:scale-105 transform transition duration-300 ${
                plan.recommended
                  ? " text-white ring-2 ring-yellow-400 shadow-yellow-100"
                  : "border-gray-200"
              }`}
            >
              {/* Recommended Badge */}
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white text-xs font-bold px-5 py-1 rounded-full shadow-md">
                  ⭐ Recommended
                </div>
              )}

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center mt-4">
                {plan.name}
              </h3>

              {/* Price */}
              <p className="text-xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent tracking-wide text-center">
                {plan.price}
              </p>

              {/* Features */}
              <ul className="text-sm text-gray-700 space-y-3 mb-8">
                {plan.details.map((line, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-5 h-5 flex items-center justify-center bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white rounded-full text-xs font-bold">
                      ✓
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              {/* Buy Now */}
              <button
                onClick={() => handleBuyNow(plan.name)}
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-md hover:shadow-lg transition"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreditPlanCard;
