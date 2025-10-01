// // import React, { useEffect, useState, useContext } from "react";
// // import Cookies from "js-cookie";
// // import { AuthContext } from "../../../context/AuthContext";
// // import { getRecruiterProfile } from "../../../services/apis";
// // import { BASE_URL } from "../../../config";
// // import { SubscriptionContext } from "../../../context/SubscriptionContext";

// // const creditPlans = {
// //   "1 Month": [
// //     { name: "Free Plan", price: "Free", details: ["6 Jobs", "0 DB Points", "Job Live 15 days", "Validity 30 days"] },
// //     { name: "Basic", price: "Rs 599", details: ["1 Job", "50 DB Points", "Job Live 15 days", "Validity 30 days"] },
// //     { name: "Basic Plus", price: "Rs 799", details: ["2 Jobs", "90 DB Points", "Job Live 15 days", "Validity 30 days"] },
// //   ],
// //   "3 Month": [
// //     { name: "Standard", price: "Rs 2999", details: ["5 Jobs", "150 DB Points", "Job Live 15 days", "Validity 90 days"] },
// //     { name: "Standard Plus", price: "Rs 3999", details: ["7 Jobs", "200 DB Points", "Job Live 15 days", "Validity 90 days"] },
// //   ],
// //   "6 Month": [
// //     { name: "Premium", price: "Rs 4999", details: ["10 Jobs", "220 DB Points", "Job Live 15 days", "Validity 180 days"] },
// //     { name: "Premium Plus", price: "Rs 5999", details: ["13 Jobs", "250 DB Points", "Job Live 15 days", "Validity 180 days"] },
// //   ],
// //   "1 Year": [
// //     { name: "Platinum", price: "Rs 12999", details: ["25 Jobs", "500 DB Points", "Job Live 15 days", "Validity 365 days"] },
// //     { name: "Platinum Plus", price: "", details: ["Custom Plan"] },
// //   ],
// // };

// // const CreditPlanCard = () => {
// //   const { user } = useContext(AuthContext);
// //   const [userProfile, setUserProfile] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [activeTab, setActiveTab] = useState("1 Month");
// //   const [paymentLoading, setPaymentLoading] = useState(false);
// //   const token = Cookies.get("userToken");

// //   const { subscription, refreshSubscription } = useContext(SubscriptionContext);

// //   useEffect(() => {
// //     const loadProfile = async () => {
// //       if (!token) return setLoading(false);
// //       try {
// //         const profile = await getRecruiterProfile(token);
// //         setUserProfile(profile);
// //       } catch (err) {
// //         console.error("Error loading recruiter profile:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     loadProfile();
// //   }, [token]);

// //   const loadScript = (src) =>
// //     new Promise((resolve) => {
// //       if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
// //       const script = document.createElement("script");
// //       script.src = src;
// //       script.onload = () => resolve(true);
// //       script.onerror = () => resolve(false);
// //       document.body.appendChild(script);
// //     });

// //   const extractAmount = (price) => {
// //     const num = parseInt(price.replace(/\D/g, ""), 10);
// //     return isNaN(num) ? 0 : num;
// //   };

// //   const handleBuyNow = async (plan) => {
// //     if (paymentLoading) return;
// //     if (plan.price === "Free" || plan.price === "" || plan.details.includes("Custom")) {
// //       return alert("⚠️ Please contact support for this plan.");
// //     }

// //     setPaymentLoading(true);
// //     const sdkLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
// //     if (!sdkLoaded) {
// //       setPaymentLoading(false);
// //       return alert("❌ Razorpay SDK failed to load");
// //     }

// //     try {
// //       const amountInNumber = extractAmount(plan.price);
// //       if (amountInNumber <= 0) return alert("Invalid plan price.");

// //       const orderRes = await fetch(`${BASE_URL}/recruiter/create-order`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify({ amount: amountInNumber }),
// //       });

// //       const orderData = await orderRes.json();
// //       if (!orderData.order_id) return alert("Failed to create order");

// //       const options = {
// //         key: import.meta.env.VITE_RAZORPAY_KEY,
// //         amount: orderData.amount,
// //         currency: orderData.currency,
// //         name: orderData.userDetails?.name || "Guest User",
// //         order_id: orderData.order_id,
// //         handler: async function (response) {
// //           try {
// //             const verifyRes = await fetch(`${BASE_URL}/recruiter/payment-success`, {
// //               method: "POST",
// //               headers: {
// //                 "Content-Type": "application/json",
// //                 Authorization: `Bearer ${token}`,
// //               },
// //               body: JSON.stringify({
// //                 payment_id: response.razorpay_payment_id,
// //                 order_id: response.razorpay_order_id,
// //                 signature: response.razorpay_signature,
// //                 planName: plan.name,
// //                 amount: orderData.amount,
// //               }),
// //             });

// //             const verifyData = await verifyRes.json();
// //             if (verifyData.success) {
// //               alert("✅ Payment Successful! Subscription Activated.");
// //               refreshSubscription();
// //             } else {
// //               alert("❌ Payment Failed: " + (verifyData.message || "Unknown error"));
// //             }
// //           } catch (err) {
// //             console.error("Payment verification error:", err);
// //             alert("❌ Payment verification failed.");
// //           }
// //         },
// //         prefill: {
// //           name: orderData.userDetails?.name || "Guest User",
// //           email: orderData.userDetails?.email || "guest@example.com",
// //           contact: orderData.userDetails?.contact || "9999999999",
// //         },
// //         theme: { color: "#caa057" },
// //       };

// //       const rzp = new window.Razorpay(options);
// //       rzp.open();
// //     } catch (err) {
// //       console.error("BuyNow error:", err);
// //       alert("Something went wrong while processing payment.");
// //     } finally {
// //       setPaymentLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen py-4 px-4 sm:px-6 lg:px-4">
// //       <h2 className="text-3xl font-extrabold text-gray-800 mb-3 text-center sm:text-left">
// //         🎉 Buy Job Credits
// //       </h2>
// //       <p className="text-lg font-medium text-gray-600 mb-2 text-center sm:text-left">
// //         {loading
// //           ? "Loading profile..."
// //           : `Welcome back, ${userProfile?.user?.username || user?.username || "User"}`}
// //       </p>

// //       {subscription || !userProfile ? (
// //         <p className="text-green-600 font-medium text-center sm:text-left mb-4">
// //           ✅ Active plan: {subscription?.planId?.planName || "Free Plan"} (valid till{" "}
// //           {subscription?.endDate ? new Date(subscription.endDate).toLocaleDateString() : "N/A"})
// //         </p>
// //       ) : (
// //         <p className="text-sm text-gray-500 mb-8 text-center sm:text-left">
// //           Get Premium Employees With Expertz Careers
// //         </p>
// //       )}

// //       {/* Tabs */}
// //       <div className="flex gap-4 mb-6 flex-wrap">
// //         {Object.keys(creditPlans).map((tab) => (
// //           <button
// //             key={tab}
// //             onClick={() => setActiveTab(tab)}
// //             className={`px-4 py-2 rounded-full font-semibold ${activeTab === tab
// //                 ? "bg-[#caa057] text-white shadow-lg"
// //                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
// //               } transition`}
// //           >
// //             {tab}
// //           </button>
// //         ))}
// //       </div>

// //       {/* Plans */}
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {(creditPlans[activeTab] || []).map((plan) => {
// //           const isActivePlan =
// //             subscription?.planId?.planName === plan.name ||
// //             (!subscription && plan.name === "Free Plan");

// //           return (
// //             <div
// //               key={plan.name}
// //               className={`relative bg-white rounded-2xl border p-5 shadow-md hover:shadow-xl hover:scale-105 transition ${
// //                 isActivePlan ? "border-green-500" : ""
// //               }`}
// //             >
// //               <div className="mb-4 text-center">
// //                 <h3 className="text-2xl font-extrabold bg-gradient-to-r from-[#caa057] via-[#caa057] to-[#caa057] bg-clip-text text-transparent">
// //                   {plan.name}
// //                 </h3>
// //                 <p className="mt-2 text-2xl font-bold bg-gradient-to-r from-[#caa057] to-[#caa057] bg-clip-text text-transparent">
// //                   {plan.price}
// //                 </p>
// //               </div>
// //               <ul className="flex-1 flex flex-col gap-3 mb-6">
// //                 {plan.details.map((line, i) => (
// //                   <li key={i} className="flex items-center gap-3">
// //                     <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gradient-to-r from-[#caa057] via-[#caa057] to-[#caa057] text-white rounded-full text-sm font-bold">
// //                       ✓
// //                     </span>
// //                     <span className="text-gray-700 font-medium text-sm">{line}</span>
// //                   </li>
// //                 ))}
// //               </ul>

// //               {isActivePlan ? (
// //                 <button
// //                   disabled
// //                   className="w-full py-3 rounded-xl font-semibold text-white bg-green-500 cursor-not-allowed shadow-md"
// //                 >
// //                   {plan.price === "Free" ? "Free Plan Active" : "Active Plan"}
// //                 </button>
// //               ) : (
// //                 <button
// //                   onClick={() => handleBuyNow(plan)}
// //                   disabled={paymentLoading}
// //                   className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#caa057] via-[#caa057] to-[#caa057] hover:from-[#b4924c] hover:to-[#b4924c] shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
// //                 >
// //                   {paymentLoading ? "Processing..." : "Buy Now"}
// //                 </button>
// //               )}
// //             </div>
// //           );
// //         })}
// //       </div>
// //     </div>
// //   );
// // };

// // export default CreditPlanCard;







// import React, { useEffect, useState, useContext } from "react";
// import Cookies from "js-cookie";
// import { AuthContext } from "../../../context/AuthContext";
// import { getRecruiterProfile } from "../../../services/apis";
// import { BASE_URL } from "../../../config";
// import { SubscriptionContext } from "../../../context/SubscriptionContext";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const creditPlans = {
//   "1 Month": [
//     { name: "Free Plan", price: "Free", details: ["6 Jobs", "0 DB Points", "Job Live 15 days", "Validity 30 days"] },
//     { name: "Basic", price: "Rs 599", details: ["1 Job", "50 DB Points", "Job Live 15 days", "Validity 30 days"] },
//     { name: "Basic Plus", price: "Rs 799", details: ["2 Jobs", "90 DB Points", "Job Live 15 days", "Validity 30 days"] },
//   ],
//   "3 Month": [
//     { name: "Standard", price: "Rs 2999", details: ["5 Jobs", "150 DB Points", "Job Live 15 days", "Validity 90 days"] },
//     { name: "Standard Plus", price: "Rs 3999", details: ["7 Jobs", "200 DB Points", "Job Live 15 days", "Validity 90 days"] },
//   ],
//   "6 Month": [
//     { name: "Premium", price: "Rs 4999", details: ["10 Jobs", "220 DB Points", "Job Live 15 days", "Validity 180 days"] },
//     { name: "Premium Plus", price: "Rs 5999", details: ["13 Jobs", "250 DB Points", "Job Live 15 days", "Validity 180 days"] },
//   ],
//   "1 Year": [
//     { name: "Platinum", price: "Rs 12999", details: ["25 Jobs", "500 DB Points", "Job Live 15 days", "Validity 365 days"] },
//     { name: "Platinum Plus", price: "", details: ["Custom Plan"] },
//   ],
// };

// const CreditPlanCard = () => {
//   const { user } = useContext(AuthContext);
//   const [userProfile, setUserProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("1 Month");
//   const [paymentLoading, setPaymentLoading] = useState(false);
//   const [activePlan, setActivePlan] = useState(null);
//   const token = Cookies.get("userToken");

//   const { subscription, setSubscription, refreshSubscription } = useContext(SubscriptionContext);

//   // Load user profile
//   useEffect(() => {
//     const loadProfile = async () => {
//       if (!token) return setLoading(false);
//       try {
//         const profile = await getRecruiterProfile(token);
//         setUserProfile(profile);
//         if (profile.subscription && profile.subscription.planId?.planName) {
//           setActivePlan(profile.subscription.planId.planName);
//         } else {
//           setActivePlan("Free Plan");
//         }
//       } catch (err) {
//         toast.error("Error loading profile");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadProfile();
//   }, [token]);

//   const loadScript = (src) =>
//     new Promise((resolve) => {
//       if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
//       const script = document.createElement("script");
//       script.src = src;
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });

//   const extractAmount = (price) => {
//     const num = parseInt(price.replace(/\D/g, ""), 10);
//     return isNaN(num) ? 0 : num;
//   };

//   const handleBuyNow = async (plan) => {
//     if (paymentLoading) return;
//     if (plan.price === "Free" || plan.price === "" || plan.details.includes("Custom")) {
//       return toast.info("⚠️ Please contact support for this plan.");
//     }

//     setPaymentLoading(true);
//     const sdkLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
//     if (!sdkLoaded) {
//       setPaymentLoading(false);
//       return toast.error("❌ Razorpay SDK failed to load");
//     }

//     try {
//       const amountInNumber = extractAmount(plan.price);
//       if (amountInNumber <= 0) return toast.error("Invalid plan price.");

//       const orderRes = await fetch(`${BASE_URL}/recruiter/create-order`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ amount: amountInNumber }),
//       });

//       const orderData = await orderRes.json();
//       if (!orderData.order_id) return toast.error("Failed to create order");

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY,
//         amount: orderData.amount,
//         currency: orderData.currency,
//         name: orderData.userDetails?.name || "Guest User",
//         order_id: orderData.order_id,
//         handler: async function (response) {
//           try {
//             const verifyRes = await fetch(`${BASE_URL}/recruiter/payment-success`, {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//               },
//               body: JSON.stringify({
//                 payment_id: response.razorpay_payment_id,
//                 order_id: response.razorpay_order_id,
//                 signature: response.razorpay_signature,
//                 planName: plan.name,
//                 amount: orderData.amount,
//               }),
//             });

//             const verifyData = await verifyRes.json();
//             if (verifyData.success) {
//               toast.success("✅ Payment Successful! Subscription Activated.");

//               // FETCH updated subscription from backend
//               const updatedProfile = await getRecruiterProfile(token);
//               const newSubscription = updatedProfile.subscription;

//               if (newSubscription && setSubscription) {
//                 setSubscription(newSubscription);
//                 setActivePlan(newSubscription.planId.planName);
//               } else {
//                 setActivePlan(plan.name); // fallback
//               }
//             } else {
//               toast.error("❌ Payment Failed: " + (verifyData.message || "Unknown error"));
//             }
//           } catch (err) {
//             console.error("Payment verification error:", err);
//             toast.error("❌ Payment verification failed.");
//           }
//         },
//         prefill: {
//           name: orderData.userDetails?.name || "Guest User",
//           email: orderData.userDetails?.email || "guest@example.com",
//           contact: orderData.userDetails?.contact || "9999999999",
//         },
//         theme: { color: "#caa057" },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       console.error("BuyNow error:", err);
//       toast.error("Something went wrong while processing payment.");
//     } finally {
//       setPaymentLoading(false);
//     }
//   };

//   const freePlanEndDate = new Date();
//   freePlanEndDate.setDate(freePlanEndDate.getDate() + 30);

//   return (
//     <div className="min-h-screen py-4 px-4 sm:px-6 lg:px-4">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <h2 className="text-3xl font-extrabold text-gray-800 mb-3 text-center sm:text-left">
//         🎉 Buy Job Credits
//       </h2>
//       <p className="text-lg font-medium text-gray-600 mb-2 text-center sm:text-left">
//         {loading
//           ? "Loading profile..."
//           : `Welcome back, ${userProfile?.user?.username || user?.username || "User"}`}
//       </p>

//       {/* Active Plan Info */}
//       <p className="text-green-600 font-medium text-center sm:text-left mb-4">
//         ✅ Active plan: {activePlan} (valid till{" "}
//         {subscription?.endDate
//           ? new Date(subscription.endDate).toLocaleDateString()
//           : freePlanEndDate.toLocaleDateString()}
//         )
//       </p>

//       {/* Tabs */}
//       <div className="flex gap-4 mb-6 flex-wrap">
//         {Object.keys(creditPlans).map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 rounded-full font-semibold ${activeTab === tab
//                 ? "bg-[#caa057] text-white shadow-lg"
//                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               } transition`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Plans */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {(creditPlans[activeTab] || []).map((plan) => {
//           const isActivePlan = activePlan === plan.name;
//           const planExpired =
//             subscription &&
//             subscription.planId?.planName === plan.name &&
//             new Date(subscription.endDate) < new Date();

//           return (
//             <div
//               key={plan.name}
//               className={`relative bg-white rounded-2xl border p-5 shadow-md hover:shadow-xl hover:scale-105 transition ${
//                 isActivePlan ? "border-green-500 ring-2 ring-green-400 ring-opacity-50" : ""
//               }`}
//             >
//               {/* Active Badge */}
//               {isActivePlan && !planExpired && (
//                 <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-md">
//                   ACTIVE
//                 </div>
//               )}

//               <div className="mb-4 text-center">
//                 <h3 className="text-2xl font-extrabold bg-gradient-to-r from-[#caa057] via-[#caa057] to-[#caa057] bg-clip-text text-transparent">
//                   {plan.name}
//                 </h3>
//                 <p className="mt-2 text-2xl font-bold bg-gradient-to-r from-[#caa057] to-[#caa057] bg-clip-text text-transparent">
//                   {plan.price}
//                 </p>
//               </div>
//               <ul className="flex-1 flex flex-col gap-3 mb-6">
//                 {plan.details.map((line, i) => (
//                   <li key={i} className="flex items-center gap-3">
//                     <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gradient-to-r from-[#caa057] via-[#caa057] to-[#caa057] text-white rounded-full text-sm font-bold">
//                       ✓
//                     </span>
//                     <span className="text-gray-700 font-medium text-sm">{line}</span>
//                   </li>
//                 ))}
//               </ul>

//               {/* Button Logic */}
//               {isActivePlan && !planExpired ? (
//                 <button
//                   disabled
//                   className="w-full py-3 rounded-xl font-semibold text-white bg-green-500 cursor-not-allowed shadow-md"
//                 >
//                   {plan.price === "Free" ? "Free Plan Active" : "Active Plan"}
//                 </button>
//               ) : !isActivePlan && plan.price !== "Free" && !plan.details.includes("Custom") ? (
//                 <button
//                   onClick={() => handleBuyNow(plan)}
//                   disabled={paymentLoading}
//                   className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#caa057] via-[#caa057] to-[#caa057] hover:from-[#b4924c] hover:to-[#b4924c] shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {paymentLoading ? "Processing..." : "Buy Now"}
//                 </button>
//               ) : null}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default CreditPlanCard;










// new with everything
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
    { name: "Free Plan", price: "Free", details: ["6 Jobs", "0 DB Points", "Job Live 15 days", "Validity 30 days"] },
    { name: "Basic", price: "Rs 599", details: ["1 Job", "50 DB Points", "Job Live 15 days", "Validity 30 days"] },
    { name: "Basic Plus", price: "Rs 799", details: ["2 Jobs", "90 DB Points", "Job Live 15 days", "Validity 30 days"] },
  ],
  "3 Month": [
    { name: "Standard", price: "Rs 2999", details: ["5 Jobs", "150 DB Points", "Job Live 15 days", "Validity 90 days"] },
    { name: "Standard Plus", price: "Rs 3999", details: ["7 Jobs", "200 DB Points", "Job Live 15 days", "Validity 90 days"] },
  ],
  "6 Month": [
    { name: "Premium", price: "Rs 4999", details: ["10 Jobs", "220 DB Points", "Job Live 15 days", "Validity 180 days"] },
    { name: "Premium Plus", price: "Rs 5999", details: ["13 Jobs", "250 DB Points", "Job Live 15 days", "Validity 180 days"] },
  ],
  "1 Year": [
    { name: "Platinum", price: "Rs 12999", details: ["25 Jobs", "500 DB Points", "Job Live 15 days", "Validity 365 days"] },
    { name: "Platinum Plus", price: "", details: ["Custom Plan"] },
  ],
};

const CreditPlanCard = () => {
  const { user } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1 Month");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const token = Cookies.get("userToken");

  const { subscription, setSubscription, refreshSubscription } = useContext(SubscriptionContext);

  // Load user profile and active plan
  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return setLoading(false);
      try {
        const profile = await getRecruiterProfile(token);
        setUserProfile(profile);

        // Prefer SubscriptionContext first
        if (subscription && subscription.planId?.planName) {
          setActivePlan(subscription.planId.planName);
        } else if (profile.subscription && profile.subscription.planId?.planName) {
          setActivePlan(profile.subscription.planId.planName);
        } else {
          setActivePlan("Free Plan");
        }
      } catch (err) {
        toast.error("Error loading profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [token, subscription]);

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

              // FETCH updated subscription from backend
              const updatedProfile = await getRecruiterProfile(token);
              const newSubscription = updatedProfile.subscription;

              if (newSubscription && setSubscription) {
                setSubscription(newSubscription);
                setActivePlan(newSubscription.planId.planName);
              } else {
                setActivePlan(plan.name); // fallback
              }
            } else {
              toast.error("❌ Payment Failed: " + (verifyData.message || "Unknown error"));
            }
          } catch (err) {
            console.error("Payment verification error:", err);
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
      console.error("BuyNow error:", err);
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
      <h2 className="text-3xl font-extrabold text-gray-800 mb-3 text-center sm:text-left">
        🎉 Buy Job Credits
      </h2>
      <p className="text-lg font-medium text-gray-600 mb-2 text-center sm:text-left">
        {loading
          ? "Loading profile..."
          : `Welcome back, ${userProfile?.user?.username || user?.username || "User"}`}
      </p>

      {/* Active Plan Info */}
      <p className="text-green-600 font-medium text-center sm:text-left mb-4">
        ✅ Active plan: {activePlan} (valid till{" "}
        {subscription?.endDate
          ? new Date(subscription.endDate).toLocaleDateString()
          : freePlanEndDate.toLocaleDateString()}
        )
      </p>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {Object.keys(creditPlans).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-semibold ${activeTab === tab
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
          const planExpired =
            subscription &&
            subscription.planId?.planName === plan.name &&
            new Date(subscription.endDate) < new Date();

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
                <h3 className="text-2xl font-extrabold bg-gradient-to-r from-[#caa057] via-[#caa057] to-[#caa057] bg-clip-text text-transparent">
                  {plan.name}
                </h3>
                <p className="mt-2 text-2xl font-bold bg-gradient-to-r from-[#caa057] to-[#caa057] bg-clip-text text-transparent">
                  {plan.price}
                </p>
              </div>

              <ul className="flex-1 flex flex-col gap-3 mb-6">
                {plan.details.map((line, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gradient-to-r from-[#caa057] via-[#caa057] to-[#caa057] text-white rounded-full text-sm font-bold">
                      ✓
                    </span>
                    <span className="text-gray-700 font-medium text-sm">{line}</span>
                  </li>
                ))}
              </ul>

              {/* BUTTON LOGIC */}
              {isActivePlan && !planExpired ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl font-semibold text-white bg-green-500 cursor-not-allowed shadow-md"
                >
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
              ) : null /* expired plan, no button */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreditPlanCard;
 

