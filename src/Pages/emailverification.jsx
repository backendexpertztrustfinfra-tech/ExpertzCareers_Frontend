
// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { sendOtp, verifyOtp } from "../services/auth";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
// import { Cookie } from "lucide-react";
// import { useEffect } from "react";

// const EmailVerification = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const token = Cookies.get("userToken");

//   // Pre-fill email if passed from signup
//   useEffect(() => {
//     if (location.state?.signupData?.useremail) {
//       setEmail(location.state.signupData.useremail);
//     }
//   }, [location.state]);


//   const handleSendOtp = async () => {
//     try {
//       setLoading(true);
//       const res = await sendOtp(email);
//       alert(res.message || "OTP sent!");
//       setOtpSent(true);
//     } catch (err) {
//       alert(err.message || "Failed to send OTP.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     try {
//       setLoading(true);
//       const res = await verifyOtp(email, otp);

//       if (res.success) {
//         alert("✅ Email verified successfully!");

//         // 👇 set cookie properly
//         Cookies.set("isVerified", "true", { expires: 7 });

//         console.log("isVerified cookie:", Cookies.get("isVerified"));

//         if (!token) {
//           alert("No token found. Please login again.");
//           navigate("/login");
//           return;
//         }

//         // ✅ Redirect based on usertype
//         let usertype = Cookies.get("usertype");
//         if (!usertype) {
//           try {
//             const decoded = jwtDecode(token);
//             usertype = decoded?.usertype;
//           } catch (err) {
//             console.error("Failed to decode token", err);
//           }
//         }

//         if (usertype === "jobseeker") {
//           navigate("/reg", {
//             state: {
//               signupData: {
//                 username: location.state?.signupData?.username,
//                 useremail: email
//               },
//               verifiedEmail: email
//             }
//           });
//         } else if (usertype === "recruiter") {
//           navigate("/rec", {
//             state: {
//               signupData: {
//                 username: location.state?.signupData?.username,
//                 useremail: email
//               },
//               verifiedEmail: email
//             }
//           });
//         }

//       } else {
//         alert(res.msg || "Invalid OTP.");
//       }
//     } catch (err) {
//       alert(err.message || "Failed to verify OTP.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#fff1ed] px-4">
//       <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
//         <h2 className="text-2xl font-bold text-[#caa057] text-center mb-4">
//           Verify Your Email
//         </h2>
//         <p className="text-gray-600 text-center mb-6">
//           Enter your email and verify it with OTP before continuing registration.
//         </p>

//         {!otpSent ? (
//           <>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//             />
//             <button
//               type="button"
//               onClick={handleSendOtp}
//               disabled={loading || !email}
//               className="w-full bg-[#caa057] hover:bg-[#b4924c] text-white font-semibold py-2 rounded-lg transition"
//             >
//               {loading ? "Sending..." : "Send OTP"}
//             </button>
//           </>
//         ) : (
//           <>
//             <input
//               type="text"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               placeholder="Enter OTP"
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//             />
//             <button
//               type="button"
//               onClick={handleVerifyOtp}
//               disabled={loading}
//               className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmailVerification;









// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { sendOtp, verifyOtp } from "../services/auth";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
// import { AuthContext } from "../context/AuthContext";

// const EmailVerification = () => {
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext); // 👈 get user from context
//   const [email, setEmail] = useState(user?.useremail || "");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const token = Cookies.get("userToken");

//   // In case user.email loads a bit later
//   useEffect(() => {
//     if (user?.useremail) {
//       setEmail(user.useremail);
//     }
//   }, [user]);

//   const handleSendOtp = async () => {
//     try {
//       setLoading(true);
//       const res = await sendOtp(email);
//       alert(res.message || "OTP sent!");
//       setOtpSent(true);
//     } catch (err) {
//       alert(err.message || "Failed to send OTP.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     try {
//       setLoading(true);
//       const res = await verifyOtp(email, otp);

//       if (res.success) {
//         alert("✅ Email verified successfully!");
//         Cookies.set("isVerified", "true", { expires: 7 });

//         if (!token) {
//           alert("No token found. Please login again.");
//           navigate("/login");
//           return;
//         }

//         let usertype = Cookies.get("usertype");
//         if (!usertype) {
//           try {
//             const decoded = jwtDecode(token);
//             usertype = decoded?.usertype;
//           } catch (err) {
//             console.error("Failed to decode token", err);
//           }
//         }

//         // ✅ No location.state needed anymore
//         if (usertype === "jobseeker") {
//           navigate("/reg");
//         } else if (usertype === "recruiter") {
//           navigate("/rec");
//         }
//       } else {
//         alert(res.msg || "Invalid OTP.");
//       }
//     } catch (err) {
//       alert(err.message || "Failed to verify OTP.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#fff1ed] px-4">
//       <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
//         <h2 className="text-2xl font-bold text-[#caa057] text-center mb-4">
//           Verify Your Email
//         </h2>
//         <p className="text-gray-600 text-center mb-6">
//           Enter your email and verify it with OTP before continuing registration.
//         </p>

//         {!otpSent ? (
//           <>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//             />
//             <button
//               type="button"
//               onClick={handleSendOtp}
//               disabled={loading || !email}
//               className="w-full bg-[#caa057] hover:bg-[#b4924c] text-white font-semibold py-2 rounded-lg transition"
//             >
//               {loading ? "Sending..." : "Send OTP"}
//             </button>
//           </>
//         ) : (
//           <>
//             <input
//               type="text"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               placeholder="Enter OTP"
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//             />
//             <button
//               type="button"
//               onClick={handleVerifyOtp}
//               disabled={loading}
//               className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmailVerification;







import Cookies from "js-cookie"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext";
import { sendOtp, verifyOtp } from "../services/auth"
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom"

const EmailVerification = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const token = Cookies.get("userToken")

  useEffect(() => {
    // ✅ Prefer user context, fallback to prefill cookie
    const storedEmail = user?.useremail || Cookies.get("prefillEmail") || ""
    setEmail(storedEmail)
  }, [user])

  const handleSendOtp = async () => {
    try {
      setLoading(true)
      const res = await sendOtp(email)
      alert(res.message || "OTP sent!")
      setOtpSent(true)
    } catch (err) {
      alert(err.message || "Failed to send OTP.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    try {
      setLoading(true)
      const res = await verifyOtp(email, otp)
      if (res.success) {
        alert("✅ Email verified successfully!")
        Cookies.set("isVerified", "true", { expires: 7 })
        const usertype = Cookies.get("usertype")

        navigate(usertype === "recruiter" ? "/rec" : "/reg")
      } else {
        alert(res.msg || "Invalid OTP.")
      }
    } catch (err) {
      alert(err.message || "Failed to verify OTP.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff1ed] px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-[#caa057] text-center mb-4">
          Verify Your Email
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Please verify your email before continuing registration.
        </p>

        {!otpSent ? (
          <>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-[#caa057] hover:bg-[#b4924c] text-white font-semibold py-2 rounded-lg transition"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-[#caa057]"
            />
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
export default EmailVerification
