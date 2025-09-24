import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getRecruiterProfile } from "../../../services/apis";
import { BASE_URL } from "../../../config";

const statusTabs = ["All", "Success", "Pending", "Failed"];

const BillingProfileCard = () => {
  const [billingData, setBillingData] = useState([]);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const token = Cookies.get("userToken");

  // Fetch Recruiter Profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return setLoading(false);

      try {
        const data = await getRecruiterProfile(token);
        const userData = data.user || {};

        setProfile({
          name: userData.username || "N/A",
          gstin: userData.recruterGstIn || "N/A",
          companyName: userData.recruterCompany || "N/A",
          address: userData.recruterCompanyAddress || "N/A",
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setProfile({
          name: "N/A",
          gstin: "N/A",
          companyName: "N/A",
          address: "N/A",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  // Fetch Payment History
  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) return setLoadingHistory(false);

      try {
        const res = await fetch(`${BASE_URL}/recruiter/getPaymentHistory`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch payment history");

        const data = await res.json();
        setBillingData(data.payments || []);
      } catch (err) {
        console.error("Error fetching payment history:", err);
        setBillingData([]);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [token]);

  const filteredData =
    activeTab === "All"
      ? billingData
      : billingData.filter((b) =>
          activeTab === "Success"
            ? b.status === "completed"
            : b.status.toLowerCase() === activeTab.toLowerCase()
        );

  return (
    <div className="w-full min-h-screen bg-[#fff1ed] p-4 pt-0 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
          Billing Profile
        </h2>

        {/* Billing Profile */}
        {loading ? (
          <p className="text-gray-400 mb-6">Loading profile...</p>
        ) : (
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Name: </span>
                {profile?.name}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Company: </span>
                {profile?.companyName}
              </p>
              <p>
                <span className="font-semibold text-gray-900">GSTIN: </span>
                {profile?.gstin}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Address: </span>
                {profile?.address}
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 justify-center">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-all border shadow-sm ${
                activeTab === tab
                  ? "bg-gradient-to-r from-[#caa057] to-[#caa057] text-white border-[#caa057] shadow-md scale-105"
                  : "bg-white text-gray-700 hover:bg-[#fff1ed] border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Billing Table */}
        <div className="overflow-x-auto rounded-xl shadow-md bg-white">
          {loadingHistory ? (
            <p className="p-6 text-center text-gray-400">Loading history...</p>
          ) : (
            <table className="w-full min-w-[650px] text-sm sm:text-base text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#caa057] via-[#caa057] to-[#caa057] text-gray-800 text-sm sm:text-base">
                  <th className="p-3 border-b">Date</th>
                  <th className="p-3 border-b">Plan</th>
                  <th className="p-3 border-b">Expires</th>
                  <th className="p-3 border-b">Amount</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Txn ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-200 hover:bg-[#fff1ed] transition"
                    >
                      <td className="p-3">
                        {new Date(item.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        {item.subscriptionId?.planId
                          ? `Plan ${item.subscriptionId.planId.slice(0, 6)}...`
                          : "-"}
                      </td>
                      <td className="p-3">
                        {item.subscriptionId?.endDate
                          ? new Date(
                              item.subscriptionId.endDate
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="p-3 font-medium text-gray-800">
                        ₹{item.amount}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : item.status === "pending"
                              ? "bg-[#fff1ed] text-[#caa057]"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {item.status === "completed"
                            ? "Success"
                            : item.status}
                        </span>
                      </td>
                      <td className="p-3">{item.transactionId}</td>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingProfileCard;