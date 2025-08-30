import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { BASE_URL } from "../../../config";
import { getRecruiterProfile } from "../../../services/apis";

const statusTabs = ["All", "Success", "Pending", "Failed"];

const BillingProfileCard = () => {
  const [billingData, setBillingData] = useState([]);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("userToken");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getRecruiterProfile(token);
        const userData = data.user || {};

        setProfile({
          name: userData.username || "N/A",
          gstin: userData.recruterGstIn || "N/A",
          companyName: userData.recruterCompany || "N/A",
          address: userData.recruterCompanyAddress || "N/A",
        });

        setBillingData(data.billing || []);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setProfile({
          name: "N/A",
          gstin: "N/A",
          companyName: "N/A",
          address: "N/A",
        });
        setBillingData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  const filteredData =
    activeTab === "All"
      ? billingData
      : billingData.filter((b) => b.status === activeTab);

  return (
    <div className="w-full min-h-screen bg-[#fffef5]  ">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Billing Profile
        </h2>

        {/* Billing Profile */}
        {loading ? (
          <p className="text-gray-400 mb-6">Loading profile...</p>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-md  mb-8">
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Name: </span>{" "}
                {profile.name}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Company: </span>{" "}
                {profile.companyName}
              </p>
              <p>
                <span className="font-semibold text-gray-900">GSTIN:</span>{" "}
                {profile.gstin}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Address:</span>{" "}
                {profile.address}
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all border shadow-sm ${
                activeTab === tab
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-500 shadow-md scale-105"
                  : "bg-white text-gray-700 bg-gradient-to-r hover:from-yellow-300 hover:to-orange-400 border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Billing Table */}
        <div className="overflow-x-auto rounded-xl shadow-md bg-white">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-yellow-300 via-amber-500 to-orange-500 text-gray-700 text-sm">
                <th className="p-3 border-b">Date</th>
                <th className="p-3 border-b">Plan</th>
                <th className="p-3 border-b">Expires</th>
                <th className="p-3 border-b">Amount</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 hover:bg-yellow-50 transition"
                  >
                    <td className="p-3">
                      {item.date || "-"} <br />
                      <span className="text-xs text-gray-500">
                        {item.time || ""}
                      </span>
                    </td>
                    <td className="p-3">{item.plan || "-"}</td>
                    <td className="p-3">{item.expires || "-"}</td>
                    <td className="p-3 font-medium text-gray-800">
                      ₹{item.amount || "-"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === "Success"
                            ? "bg-green-100 text-green-700"
                            : item.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.status || "N/A"}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button className="text-yellow-600 font-semibold cursor-pointer hover:underline">
                        📥 Download
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-400">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillingProfileCard;
