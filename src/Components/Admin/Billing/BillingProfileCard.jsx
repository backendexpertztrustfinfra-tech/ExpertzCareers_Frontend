"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getRecruiterProfile } from "../../../services/apis";
import { BASE_URL } from "../../../config";

const statusTabs = ["All", "Success", "Pending", "Failed"];

const SELLER = {
  name: "Expertz Career",
  companyName: "Exper Trust Finfra Pvt Ltd",
  address: "Sector-19, Faridabad",
  gstin: "22AAAAA0000A1Z5",
  email: "expertzcareer@gmail.com",
  phone: "+91-99999-99999",
};

const BillingProfileCard = () => {
  const [billingData, setBillingData] = useState([]);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Invoice preview state
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

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
          email: userData.email || "N/A",
          phone: userData.phone || "N/A",
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setProfile({
          name: "N/A",
          gstin: "N/A",
          companyName: "N/A",
          address: "N/A",
          email: "N/A",
          phone: "N/A",
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

  const openInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoice(true);
  };

  const downloadInvoice = (invoice) => {
    const win = window.open("", "_blank", "width=800,height=900");
    const dateStr = new Date(invoice.paymentDate).toLocaleString();
    const statusLabel =
      invoice.status === "completed"
        ? "Success"
        : invoice.status?.charAt(0).toUpperCase() + invoice.status?.slice(1);

    const planName =
      invoice.subscriptionId?.planId?.planName ||
      invoice.subscriptionId?.planId ||
      "Plan";

    const invoiceHtml = `
      <html>
        <head>
          <title>Invoice - ${invoice.transactionId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
            .brand { font-weight: 700; font-size: 20px; color: #caa057; }
            .muted { color: #6b7280; }
            .box { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
            .row { display: flex; justify-content: space-between; gap: 24px; margin: 8px 0; }
            .col { flex: 1; }
            .tag { padding: 4px 10px; border-radius: 9999px; font-size: 12px; display: inline-block; }
            .success { background: #ecfdf5; color: #065f46; }
            .pending { background: #fff7ed; color: #92400e; }
            .failed { background: #fee2e2; color: #991b1b; }
            .total { font-size: 18px; font-weight: 700; }
            .foot { margin-top: 24px; font-size: 12px; color: #6b7280; }
            .table { width: 100%; border-collapse: collapse; }
            .table th, .table td { border-bottom: 1px solid #e5e7eb; padding: 8px; text-align: left; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">Invoice</div>
            <div class="muted">Txn ID: ${invoice.transactionId}</div>
          </div>

          <div class="box">
            <div class="row">
              <div class="col">
                <div><strong>Seller</strong></div>
                <div>${SELLER.name}</div>
                <div>${SELLER.companyName}</div>
                <div class="muted">${SELLER.address}</div>
                <div class="muted">GSTIN: ${SELLER.gstin}</div>
                <div class="muted">Email: ${SELLER.email}</div>
                <div class="muted">Phone: ${SELLER.phone}</div>
              </div>
              <div class="col">
                <div><strong>Billed To</strong></div>
                <div>${profile?.name || "-"}</div>
                <div>${profile?.companyName || "-"}</div>
                <div class="muted">${profile?.address || "-"}</div>
                <div class="muted">GSTIN: ${profile?.gstin || "-"}</div>
                <div class="muted">Email: ${profile?.email || "-"}</div>
                <div class="muted">Phone: ${profile?.phone || "-"}</div>
              </div>
              <div class="col">
                <div><strong>Date</strong></div>
                <div>${dateStr}</div>
                <div><strong>Status</strong></div>
                <div class="tag ${
                  invoice.status === "completed"
                    ? "success"
                    : invoice.status === "pending"
                    ? "pending"
                    : "failed"
                }">${statusLabel}</div>
              </div>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Plan</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Recruiter Subscription</td>
                <td>${planName}</td>
                <td>₹${invoice.amount}</td>
              </tr>
            </tbody>
          </table>

          <div class="row" style="margin-top:16px;">
            <div></div>
            <div class="total">Total: ₹${invoice.amount}</div>
          </div>

          <div class="foot">
            This is a system-generated invoice. For queries, contact support.
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    win.document.open();
    win.document.write(invoiceHtml);
    win.document.close();
  };

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
            <table className="w-full min-w-[800px] text-sm sm:text-base text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#caa057] via-[#caa057] to-[#caa057] text-gray-800 text-sm sm:text-base">
                  <th className="p-3 border-b">Date</th>
                  <th className="p-3 border-b">Plan</th>
                  <th className="p-3 border-b">Expires</th>
                  <th className="p-3 border-b">Amount</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Txn ID</th>
                  <th className="p-3 border-b">Actions</th>
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
                          ? item.subscriptionId?.planId?.planName
                            ? item.subscriptionId?.planId?.planName
                            : `Plan ${String(item.subscriptionId.planId).slice(
                                0,
                                6
                              )}...`
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
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openInvoice(item)}
                            className="px-3 py-1 rounded-lg text-white bg-[#caa057] hover:brightness-95"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => downloadInvoice(item)}
                            className="px-3 py-1 rounded-lg border border-[#caa057] text-[#caa057] hover:bg-[#fff1ed]"
                          >
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-6 text-center text-gray-400">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {showInvoice && selectedInvoice && (
          <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={() => setShowInvoice(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Invoice Preview
                </h3>
                <button
                  onClick={() => setShowInvoice(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <p className="font-semibold">Seller</p>
                    <p>{SELLER.name}</p>
                    <p>{SELLER.companyName}</p>
                    <p className="text-gray-500 text-sm">{SELLER.address}</p>
                    <p className="text-gray-500 text-sm">
                      GSTIN: {SELLER.gstin}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Email: {SELLER.email}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Phone: {SELLER.phone}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Billed To</p>
                    <p>{profile?.name}</p>
                    <p>{profile?.companyName}</p>
                    <p className="text-gray-500 text-sm">{profile?.address}</p>
                    <p className="text-gray-500 text-sm">
                      GSTIN: {profile?.gstin}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Email: {profile?.email}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Phone: {profile?.phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Txn ID</p>
                    <p className="font-semibold">
                      {selectedInvoice.transactionId}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Date</p>
                    <p className="font-medium">
                      {new Date(selectedInvoice.paymentDate).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Status</p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                        selectedInvoice.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : selectedInvoice.status === "pending"
                          ? "bg-[#fff1ed] text-[#caa057]"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {selectedInvoice.status === "completed"
                        ? "Success"
                        : selectedInvoice.status}
                    </span>
                  </div>
                </div>

                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-[#fff1ed]">
                      <tr>
                        <th className="text-left p-3">Description</th>
                        <th className="text-left p-3">Plan</th>
                        <th className="text-left p-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-3">Recruiter Subscription</td>
                        <td className="p-3">
                          {selectedInvoice.subscriptionId?.planId?.planName ||
                            selectedInvoice.subscriptionId?.planId ||
                            "Plan"}
                        </td>
                        <td className="p-3">₹{selectedInvoice.amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-end">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-bold">
                      ₹{selectedInvoice.amount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => downloadInvoice(selectedInvoice)}
                    className="px-4 py-2 rounded-lg bg-[#caa057] text-white"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => setShowInvoice(false)}
                    className="px-4 py-2 rounded-lg border"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingProfileCard;
