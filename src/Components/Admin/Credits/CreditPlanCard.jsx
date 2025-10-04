import React, { useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";
import { AuthContext } from "../../../context/AuthContext";
import { getRecruiterProfile } from "../../../services/apis";
import { BASE_URL } from "../../../config";
import { SubscriptionContext } from "../../../context/SubscriptionContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const creditPlans = {
  "1 Month": [
    { planId: "68d8def03b752e5019d8ec65", name: "Free Plan", price: "Free", details: ["6 Jobs", "0 DB Points", "Job Live 15 days", "Validity 30 days"] },
    { planId: "68d8df373b752e5019d8ec67", name: "Basic", price: "Rs 599", details: ["1 Job", "50 DB Points", "Job Live 15 days", "Validity 30 days"] },
    { planId: "68d8df753b752e5019d8ec69", name: "Basic Plus", price: "Rs 799", details: ["2 Jobs", "90 DB Points", "Job Live 15 days", "Validity 30 days"] },
  ],
  "3 Month": [
    { planId: "68d8dfd33b752e5019d8ec6b", name: "Standard", price: "Rs 2999", details: ["5 Jobs", "150 DB Points", "Job Live 15 days", "Validity 90 days"] },
    { planId: "68d8e00a3b752e5019d8ec6d", name: "Standard Plus", price: "Rs 3999", details: ["7 Jobs", "200 DB Points", "Job Live 15 days", "Validity 90 days"] },
  ],
  "6 Month": [
    { planId: "68d8e05f3b752e5019d8ec6f", name: "Premium", price: "Rs 4999", details: ["10 Jobs", "220 DB Points", "Job Live 15 days", "Validity 180 days"] },
    { planId: "68d8e0823b752e5019d8ec71", name: "Premium Plus", price: "Rs 5999", details: ["13 Jobs", "250 DB Points", "Job Live 15 days", "Validity 180 days"] },
  ],
  "1 Year": [
    { planId: "68d8e0fc3b752e5019d8ec73", name: "Platinum", price: "Rs 12999", details: ["25 Jobs", "500 DB Points", "Job Live 15 days", "Validity 365 days"] },
    { planId: "", name: "Platinum Plus", price: "", details: ["Custom Plan"] },
  ],
};

export const getActiveSubscription = async () => {
  try {
    const token = Cookies.get("userToken");
    if (!token) throw new Error("Authentication token not found.");

    const res = await fetch(`${BASE_URL}/recruiter/getActiveSubscription`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    // console.log("Active Subscription:", data); 
    if (!res.ok) throw new Error(data.message || "Failed to fetch active subscription");

    return data.subscription || null;
  } catch (err) {
    console.error("❌ getActiveSubscription API Error:", err.message);
    return null;
  }
};

const CreditPlanCard = () => {
  const { user } = useContext(AuthContext);
  const { subscription, setSubscription } = useContext(SubscriptionContext);
  const [userProfile, setUserProfile] = useState(null);
  const [activePlan, setActivePlan] = useState("Free Plan");
  const [activeTab, setActiveTab] = useState("1 Month");
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const token = Cookies.get("userToken");

  // Load profile and active subscription
  useEffect(() => {
    const loadProfileAndSubscription = async () => {
      if (!token) return setLoading(false);
      try {
        // 1️⃣ Load profile
        const profile = await getRecruiterProfile(token);
        setUserProfile(profile);

        // 2️⃣ Load active subscription separately
        const activeSub = await getActiveSubscription();
        if (activeSub && activeSub.planId) {
          // Find plan name in creditPlans by planId
          let foundPlanName = "Free Plan";
          Object.values(creditPlans).forEach((plansArray) => {
            plansArray.forEach((plan) => {
              if (plan.planId === activeSub.planId) {
                foundPlanName = plan.name;
              }
            });
          });

          setActivePlan(foundPlanName);
          if (setSubscription) setSubscription(activeSub);
        } else {
          setActivePlan("Free Plan");
        }
      } catch (err) {
        console.error("Error loading profile or subscription:", err);
        toast.error("Failed to load profile/subscription");
      } finally {
        setLoading(false);
      }
    };

    loadProfileAndSubscription();
  }, [token, setSubscription]);

  // Razorpay script loader
  const loadScript = (src) =>
    new Promise((resolve) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const extractAmount = (price) => {
    const num = parseInt(price.replace(/\D/g, ""), 10);
    return isNaN(num) ? 0 : num;
  };

  // Buy Now handler
  const handleBuyNow = async (plan) => {
    if (paymentLoading) return;
    if (plan.price === "Free" || plan.price === "" || plan.details.includes("Custom")) {
      return toast.info("⚠️ Please contact support for this plan.");
    }

    setPaymentLoading(true);
    const sdkLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!sdkLoaded) {
      setPaymentLoading(false);
      return toast.error("❌ Razorpay SDK failed to load");
    }

    try {
      const amountInNumber = extractAmount(plan.price);
      if (amountInNumber <= 0) return toast.error("Invalid plan price.");

      const orderRes = await fetch(`${BASE_URL}/recruiter/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: amountInNumber }),
      });

      const orderData = await orderRes.json();
      if (!orderData.order_id) return toast.error("Failed to create order");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: orderData.amount,
        currency: orderData.currency,
        name: orderData.userDetails?.name || "Guest User",
        order_id: orderData.order_id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${BASE_URL}/recruiter/payment-success`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                signature: response.razorpay_signature,
                planName: plan.name,
                amount: orderData.amount,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              toast.success("✅ Payment Successful! Subscription Activated.");

              const updatedSub = await getActiveSubscription();
              if (updatedSub && setSubscription) {
                setSubscription(updatedSub);
                let foundPlanName = "Free Plan";
                Object.values(creditPlans).forEach((plansArray) => {
                  plansArray.forEach((p) => {
                    if (p.planId === updatedSub.planId?._id) foundPlanName = p.name;
                  });
                });
                setActivePlan(foundPlanName);
              } else {
                setActivePlan(plan.name);
              }
            } else {
              toast.error("❌ Payment Failed: " + (verifyData.message || "Unknown error"));
            }
          } catch (err) {
            toast.error("❌ Payment verification failed.");
          }
        },
        prefill: {
          name: orderData.userDetails?.name || "Guest User",
          email: orderData.userDetails?.email || "guest@example.com",
          contact: orderData.userDetails?.contact || "9999999999",
        },
        theme: { color: "#caa057" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Something went wrong while processing payment.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const freePlanEndDate = new Date();
  freePlanEndDate.setDate(freePlanEndDate.getDate() + 30);

  return (
    <div className="min-h-screen py-4 px-4 sm:px-6 lg:px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-extrabold text-gray-800 mb-3 text-center sm:text-left">🎉 Buy Job Credits</h2>
      <p className="text-lg font-medium text-gray-600 mb-2 text-center sm:text-left">
        {loading ? "Loading profile..." : `Welcome back, ${userProfile?.user?.username || user?.username || "User"}`}
      </p>

      {/* Active Plan Info */}
      <p className="text-green-600 font-medium text-center sm:text-left mb-4">
        ✅ Active plan: {activePlan} (valid till{" "}
        {subscription?.endDate ? new Date(subscription.endDate).toLocaleDateString() : freePlanEndDate.toLocaleDateString()}
        )
      </p>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {Object.keys(creditPlans).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-semibold ${
              activeTab === tab
                ? "bg-[#caa057] text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(creditPlans[activeTab] || []).map((plan) => {
          const isActivePlan = activePlan === plan.name;
          const planExpired = subscription && subscription.planId?.planName === plan.name && new Date(subscription.endDate) < new Date();

          return (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl border p-5 shadow-md hover:shadow-xl hover:scale-105 transition ${
                isActivePlan ? "border-green-500 ring-2 ring-green-400 ring-opacity-50" : ""
              }`}
            >
              {isActivePlan && !planExpired && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-md">
                  ACTIVE
                </div>
              )}

              <div className="mb-4 text-center">
                <h3 className="text-2xl font-extrabold bg-gradient-to-r from-[#caa057] via-[#caa057] to-[#caa057] bg-clip-text text-transparent">{plan.name}</h3>
                <p className="mt-2 text-2xl font-bold bg-gradient-to-r from-[#caa057] to-[#caa057] bg-clip-text text-transparent">{plan.price}</p>
              </div>

              <ul className="flex-1 flex flex-col gap-3 mb-6">
                {plan.details.map((line, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gradient-to-r from-[#caa057] via-[#caa057] to-[#caa057] text-white rounded-full text-sm font-bold">✓</span>
                    <span className="text-gray-700 font-medium text-sm">{line}</span>
                  </li>
                ))}
              </ul>

              {/* BUTTON LOGIC */}
              {isActivePlan && !planExpired ? (
                <button disabled className="w-full py-3 rounded-xl font-semibold text-white bg-green-500 cursor-not-allowed shadow-md">
                  {plan.price === "Free" ? "Free Plan Active" : "Active Plan"}
                </button>
              ) : !isActivePlan && !planExpired && plan.price !== "Free" && !plan.details.includes("Custom") ? (
                <button
                  onClick={() => handleBuyNow(plan)}
                  disabled={paymentLoading}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#caa057] via-[#caa057] to-[#caa057] hover:from-[#b4924c] hover:to-[#b4924c] shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentLoading ? "Processing..." : "Buy Now"}
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreditPlanCard;
