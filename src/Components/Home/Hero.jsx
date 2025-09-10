"use client";

import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useContext,
  useEffect,
} from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";
import { signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { auth, googleProvider } from "../../firebase-config";
import { AuthContext } from "../../context/AuthContext";
import SuccessfullyLogin from "../../assets/animation/succesfulllogin";

const Hero = forwardRef(({ onlogin }, ref) => {
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const { login } = useContext(AuthContext);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const loginSectionRef = React.useRef(null);

  // ✨ New state for loading
  const [loading, setLoading] = useState(false);

  const [signupData, setSignupData] = useState({
    username: "",
    useremail: "",
    password: "",
    usertype: "jobseeker",
  });

  useEffect(() => {
    const token = Cookies.get("userToken");
    setTokenChecked(!!token);
  }, []);

  useImperativeHandle(ref, () => ({
    scrollToLogin: () => {
      loginSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    },
  }));

  const saveTokenInCookie = (token, usertype) => {
    Cookies.set("userToken", token, {
      expires: 15,
      secure: true,
      sameSite: "Lax",
    });
    Cookies.set("usertype", usertype || "");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ useremail: email, password }),
      });

      if (!res.ok) throw new Error("Login failed");
      const { token, usertype } = await res.json();

      if (token && usertype) {
        saveTokenInCookie(token, usertype);
        login(token);
        setShowSuccessAnimation(true);

        setTimeout(() => {
          setShowSuccessAnimation(false);
          onlogin?.();
          navigate(
            usertype === "jobseeker"
              ? "/jobs"
              : usertype === "recruter"
              ? "/admin"
              : "/"
          );
        }, 2000);
      }

      // console.log("token:", token);
    } catch (err) {
      alert(err.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(signupData),
      });

      if (!res.ok) throw new Error("Signup failed");
      const { token } = await res.json();

      if (token) {
        saveTokenInCookie(token, signupData.usertype);
        login(token);
        onlogin?.();
        navigate(signupData.usertype === "jobseeker" ? "/reg" : "/rec");
      }
    } catch (err) {
      alert(err.message || "Signup error");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await fetch(`${BASE_URL}/user/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) throw new Error("Google login failed");
      const { token } = await res.json();

      if (token) {
        saveTokenInCookie(token);
        login(token);
        alert(`Welcome ${user.displayName}`);
        onlogin?.();
        navigate("/signup-choice");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return alert("Please enter your email.");
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Reset email sent!");
    } catch (err) {
      alert("Reset failed: " + err.message);
    }
  };

  if (showSuccessAnimation) return <SuccessfullyLogin />;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-orange-50 to-yellow-100 overflow-hidden">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999]">
          <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-700 font-medium">Processing...</p>
          </div>
        </div>
      )}

         <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-yellow-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-2xl animate-pulse-slow"></div>
      </div>

      <div className="relative  flex flex-col lg:flex-row items-center justify-between px-8 py-12 max-w-7xl mx-auto">
        {/* Left Content */}
        <div className="flex-1 lg:pr-12 mb-12 lg:mb-0">
      <div className="space-y-6">
        <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 text-sm font-medium text-gray-700">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          10,000+ Active Job Listings
        </div>

        <h1 className="text-5xl lg:text-7xl font-heading font-black leading-tight">
          <span className="text-gray-800">Discover Your</span>
          <br />
          <span className="text-gradient">Next Opportunity</span>
        </h1>

        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
          Connect with top companies, explore exciting roles, and take the next
          step in your career journey. Your dream job is just one click away.
        </p>

        {/* 🚀 Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={() => navigate("/jobs")}
            className="group px-8 py-4 bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-indigo-500/25 transform hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center justify-center">
              Start Your Journey
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </button>

          <button
            onClick={() => navigate("/jobs")}
            className="px-12 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl font-semibold text-lg border border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-300"
          >
            Explore Jobs
            <svg
              className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>

            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">50K+</div>
                <div className="text-sm text-gray-600">Job Seekers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">2K+</div>
                <div className="text-sm text-gray-600">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">95%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Login/Signup Form */}
        {!tokenChecked && (
          <div className="flex-shrink-0 w-full lg:w-96 relative z-50">
            <div
              ref={loginSectionRef}
              className="glass-effect rounded-3xl p-8 shadow-2xl border border-white/30 relative z-50 bg-white/80 backdrop-blur-xl"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-heading font-bold text-gray-800 mb-2">
                  {isSignup ? "Join CareerHub" : "Welcome Back"}
                </h2>
                <p className="text-gray-600">
                  {isSignup
                    ? "Create your account to get started"
                    : "Sign in to continue your journey"}
                </p>
              </div>

              {isSignup ? (
                <form onSubmit={handleSignup} className="space-y-5">
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-500 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      value={signupData.username}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          username: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-500 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      value={signupData.useremail}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          useremail: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      placeholder="Create Password"
                      className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-500 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <select
                      className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm text-gray-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      value={signupData.usertype}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          usertype: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="jobseeker">Job Seeker</option>
                      <option value="recruter">Recruiter</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-indigo-500/25 transform hover:scale-[1.02] transition-all duration-300"
                  >
                    Create Account
                  </button>

                  <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignup(false)}
                      className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                    >
                      Sign In
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-500 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-500 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-sm text-orange-600 hover:text-yellow-700 font-medium transition-colors"
                      onClick={handleForgotPassword}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-indigo-500/25 transform hover:scale-[1.02] transition-all duration-300"
                  >
                    Sign In
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">
                        or continue with
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:shadow-md transition-all duration-300"
                    onClick={loginWithGoogle}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </button>

                  <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignup(true)}
                      className="text-orange-600 font-semibold hover:text-yellow-700 transition-colors"
                    >
                      Sign Up
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <div className="flex items-center space-x-2 text-gray-600">
          <span className="text-sm">Scroll to explore opportunities</span>
          <svg
            className="w-4 h-4 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
});

export default Hero;