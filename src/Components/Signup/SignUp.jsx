// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import { updateRecruiterProfile } from "../../services/apis";
// import { AuthContext } from "../../context/AuthContext";

// const SignUp = () => {
//   const [role, setRole] = useState("");
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);

//   // Handle role selection and update backend immediately
//   const handleRoleSelect = async (selectedRole) => {
//     setRole(selectedRole);

//     const token = Cookies.get("userToken");
//     if (!token) {
//       alert("User not logged in");
//       return;
//     }

//     try {
//       const payload = {
//         usertype: selectedRole === "Job Seeker" ? "jobseeker" : "recruiter",
//       };

//       const response = await updateRecruiterProfile(token, payload, login);

//       if (response?.msg === "User Update Succssfully") {
//         Cookies.set("usertype", response.UpdatedData.usertype, { expires: 7 });
//         login(token); // refresh AuthContext
//         console.log("✅ Role updated:", response.UpdatedData);
//       }
//     } catch (error) {
//       console.error("❌ Error updating user type:", error);
//     }
//   };

//   // Handle final SignUp (redirect)
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!role) {
//       alert("Please select a role first");
//       return;
//     }

//     if (role === "Job Seeker") navigate("/jobs");
//     else if (role === "Recruiter") navigate("/admin");
//   };

//   return (
//     <div className="min-h-screen bg-[#ffffff] flex items-center justify-center px-4">
//       <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md border-2 border-[#D4AF37]">
//         <h1 className="text-2xl font-bold text-center text-[#D4AF37] mb-4">
//           Sign up to EXPERTZ CAREER
//         </h1>

//         <div className="flex justify-center gap-4 mb-6">
//           <button
//             type="button"
//             onClick={() => handleRoleSelect("Job Seeker")}
//             className={`px-4 py-2 rounded font-medium transition ${
//               role === "Job Seeker"
//                 ? "bg-[#D4AF37] text-white shadow"
//                 : "bg-white text-[#D4AF37] shadow"
//             }`}
//           >
//             Job Seeker
//           </button>
//           <button
//             type="button"
//             onClick={() => handleRoleSelect("Recruiter")}
//             className={`px-4 py-2 rounded font-medium transition ${
//               role === "Recruiter"
//                 ? "bg-[#D4AF37] text-white shadow"
//                 : "bg-white text-[#D4AF37] shadow"
//             }`}
//           >
//             Recruiter
//           </button>
//         </div>

//         {role && (
//           <form onSubmit={handleSubmit} className="space-y-4 text-black">
//             <button
//               type="submit"
//               className="w-full bg-[#D4AF37] text-white py-2 rounded hover:opacity-90"
//             >
//               Sign Up as {role}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SignUp;






import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../config";
import { saveTokenInCookie } from "../Signup/saveTokenInCookie ";

const SignUp = () => {
  const [role, setRole] = useState(""); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  // ✅ Read userinfo from Google login (or fallback to cookies)
  const useremailFromState = location.state?.useremail || Cookies.get("userEmail");
  const passwordFromState = location.state?.password || Cookies.get("userPassword"); // Google UID
  const usernameFromState = location.state?.username || Cookies.get("userName") || "Google User";

  // ✅ Print data in console immediately when page loads
  useEffect(() => {
    console.log("📌 Google Signup Data:", {
      useremail: useremailFromState,
      username: usernameFromState,
      password: passwordFromState
    });
  }, []);

  const handleSignUp = async () => {
    if (!role) {
      alert("Please select a role first");
      return;
    }

    if (!useremailFromState || !passwordFromState) {
      alert("User info not found. Please login again.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username: usernameFromState,
        useremail: useremailFromState,
        password: passwordFromState,
        usertype: role === "jobseeker" ? "jobseeker" : "recruiter",
      };

      console.log("📦 Signup Payload before API:", payload);

      const res = await fetch(`${BASE_URL}/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("❌ Backend Error:", data);
        throw new Error(data.message || "Signup failed");
      }

      if (data.token) {
        saveTokenInCookie(data.token, payload.usertype);
        login(data.token);
        Cookies.set("usertype", payload.usertype, { expires: 7 });
        alert("Signup successful!");
        navigate(payload.usertype === "jobseeker" ? "/reg" : "/rec");
      }
    } catch (err) {
      console.error("❌ Signup error:", err);
      alert(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md border-2 border-[#D4AF37]">
        <h1 className="text-2xl font-bold text-center text-[#D4AF37] mb-4">
          Sign up to EXPERTZ CAREER
        </h1>

        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => setRole("jobseeker")}
            className={`px-4 py-2 rounded font-medium transition ${role === "jobseeker"
              ? "bg-[#D4AF37] text-white shadow"
              : "bg-white text-[#D4AF37] shadow"
              }`}
            disabled={loading}
          >
            Job Seeker
          </button>
          <button
            type="button"
            onClick={() => setRole("recruiter")}
            className={`px-4 py-2 rounded font-medium transition ${role === "recruiter"
              ? "bg-[#D4AF37] text-white shadow"
              : "bg-white text-[#D4AF37] shadow"
              }`}
            disabled={loading}
          >
            Recruiter
          </button>
        </div>

        <button
          type="button"
          onClick={handleSignUp}
          className="w-full bg-[#D4AF37] text-white py-2 rounded hover:opacity-90"
          disabled={loading || !role}
        >
          {loading ? "Signing Up..." :` Sign Up as ${role || ""}`}
        </button>
      </div>
    </div>
  );
};

export default SignUp;