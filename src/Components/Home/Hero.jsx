"use client"

import React, { useState, forwardRef, useImperativeHandle, useContext, useEffect } from "react"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../../config"
import { signInWithPopup } from "firebase/auth"
import { auth } from "../../firebase-config"
import { AuthContext } from "../../context/AuthContext"
import SuccessfullyLogin from "../../assets/animation/succesfulllogin"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { GoogleAuthProvider } from "firebase/auth"
import MessageModal from "../UserProfile/message"

const Hero = forwardRef(({ onlogin }, ref) => {
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const { login, user } = useContext(AuthContext)
  const [tokenChecked, setTokenChecked] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const loginSectionRef = React.useRef(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

  const [signupData, setSignupData] = useState({
    username: "",
    useremail: "",
    password: "",
    confirmPassword: "",
    usertype: "jobseeker",
  })

  useEffect(() => {
    const checkToken = () => {
      const token = Cookies.get("userToken")
      setTokenChecked(!!token)
    }

    checkToken()
    window.addEventListener("tokenChange", checkToken)

    return () => {
      window.removeEventListener("tokenChange", checkToken)
    }
  }, [])

  useEffect(() => {
    if (user && user.usertype) {
      setTokenChecked(true)
    }
  }, [user])

  useImperativeHandle(ref, () => ({
    scrollToLogin: () => {
      loginSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    },
  }))

  const saveTokenInCookie = (token, usertype) => {
    Cookies.set("userToken", token, {
      expires: 15,
      secure: true,
      sameSite: "Lax",
    })
    Cookies.set("usertype", usertype || "")
  }

  const validateEmail = (email) => {
    const trimmedEmail = email.trim()
    if (trimmedEmail.length === 0) {
      return false
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(trimmedEmail)
  }

  const validatePassword = (password) => {
    const trimmedPassword = password.trim()
    const hasLettersAndNumbers = /[a-zA-Z]/.test(trimmedPassword) && /[0-9]/.test(trimmedPassword)
    return trimmedPassword.length >= 6 && hasLettersAndNumbers
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    const trimmedEmail = email.trim()
    if (!validateEmail(trimmedEmail)) {
      setEmailError("Please enter a valid email address.")
      return
    }
    setEmailError("")

    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ useremail: trimmedEmail, password }),
      })

      const data = await res.json()
      console.log(data)
      if (!res.ok) {
        setModalMessage("Login failed: Invalid email or password")
        setModalOpen(true)
        return
      }

      // 👇 backend sends varification, not isVerified
      const { token, usertype, varification, username, useremail } = data
      // console.log("User Token:", token);

      if (token && usertype) {
        login(token, usertype, varification)

        setShowSuccessAnimation(true)
        setTimeout(() => {
          setShowSuccessAnimation(false)
          if (usertype === "recruiter") {
            navigate("/admin", { replace: true })
          } else if (usertype === "jobseeker") {
            navigate("/jobs", { replace: true })
          }

          onlogin?.()
        }, 2000)
      }
    } catch (err) {
      setModalMessage(err.message || "Login error")
      setModalOpen(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()

    const trimmedEmail = signupData.useremail.trim()
    if (!validateEmail(trimmedEmail)) {
      setEmailError("Please enter a valid email address.")
      return
    }
    setEmailError("")

    const trimmedPassword = signupData.password.trim()
    if (!validatePassword(trimmedPassword)) {
      setPasswordError("Password must be at least 6 characters long and contain both letters and numbers.")
      return
    }
    setPasswordError("")

    const trimmedConfirmPassword = signupData.confirmPassword.trim()
    if (trimmedPassword !== trimmedConfirmPassword) {
      setConfirmPasswordError("Passwords do not match.")
      return
    }
    setConfirmPasswordError("")

    setLoading(true)
    try {
      const { confirmPassword, ...dataToSend } = signupData
      dataToSend.useremail = trimmedEmail
      dataToSend.password = trimmedPassword

      const res = await fetch(`${BASE_URL}/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(dataToSend),
      })
      console.log(res)
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Signup failed")
      }
      const { token } = await res.json()

      if (token) {
        saveTokenInCookie(token, signupData.usertype)
        login(token, signupData.usertype, true, signupData.username, signupData.useremail)

        Cookies.set("prefillName", signupData.username || "", { expires: 7 })
        Cookies.set("prefillEmail", signupData.useremail || "", { expires: 7 })

        onlogin?.()
        navigate("/emailverification", { state: { signupData } })
      }
    } catch (err) {
      alert(err.message || "Signup error")
    } finally {
      setLoading(false)
    }
  }

  const googleProvider = new GoogleAuthProvider()
  googleProvider.addScope("email")
  googleProvider.addScope("profile")

  // const loginWithGoogle = async () => {
  //   setLoading(true)
  //   try {
  //     const result = await signInWithPopup(auth, googleProvider)
  //     const user = result.user

  //     const useremail = user.email || user.providerData[0]?.email
  //     const password = user.uid

  //     if (!useremail) {
  //       alert("Cannot fetch email from Google. Please use another login method.")
  //       return
  //     }

  //     const checkRes = await fetch(`${BASE_URL}/user/finduser/${encodeURIComponent(useremail)}`)
  //     const checkData = await checkRes.json()
  //     // console.log("User check result:", checkData);

  //     if (checkData.userFound) {
  //       const loginRes = await fetch(`${BASE_URL}/user/login`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ useremail, password }),
  //       })

  //       if (loginRes.ok) {
  //         const loginData = await loginRes.json()
  //         if (loginData?.token) {
  //           saveTokenInCookie(loginData.token, loginData.usertype)
  //           login(loginData.token)
  //           onlogin?.()
  //           navigate(
  //             loginData.usertype === "jobseeker" ? "/jobs" : loginData.usertype === "recruiter" ? "/admin" : "/signup",
  //           )
  //         } else {
  //           alert("Credentials are wrong")
  //         }
  //       } else {
  //         alert("Credentials are wrong")
  //       }
  //     } else {
  //       Cookies.set("userEmail", useremail, { expires: 7 })
  //       Cookies.set("userPassword", password, { expires: 7 })
  //       Cookies.set("userName", user.displayName || "Google User", { expires: 7 })

  //       navigate("/signup", {
  //         state: {
  //           useremail,
  //           password,
  //           username: user.displayName || "Google User",
  //         },
  //       })
  //     }
  //   } catch (err) {
  //     console.error(err)
  //     alert(err.message || "Google login failed")
  //   } finally {
  //     setLoading(false)
  //   }
  // }
const loginWithGoogle = async () => {
  setLoading(true);
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const useremail = user.email || user.providerData[0]?.email;
    const password = user.uid;
    const username = user.displayName || "Google User";

    if (!useremail) {
      alert("Cannot fetch email from Google. Please use another login method.");
      return;
    }

    const checkRes = await fetch(`${BASE_URL}/user/finduser/${encodeURIComponent(useremail)}`);
    const checkData = await checkRes.json();

    if (checkData.userFound) {
      const loginRes = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useremail, password }),
      });

      if (loginRes.ok) {
        const loginData = await loginRes.json();
        if (loginData?.token) {
          const { token, usertype, varification } = loginData;
          saveTokenInCookie(token, usertype);
          login(token, usertype, varification);

          navigate(
            usertype === "jobseeker"
              ? "/jobs"
              : usertype === "recruiter"
              ? "/admin"
              : "/signup"
          );
        } else {
          alert("Credentials are wrong");
        }
      }
    } else {
      // ✅ fixed this section
      Cookies.set("userEmail", useremail, { expires: 7 });
      Cookies.set("userPassword", password, { expires: 7 });
      Cookies.set("userName", username, { expires: 7 });
      Cookies.set("prefillName", username, { expires: 7 });
      Cookies.set("prefillEmail", useremail, { expires: 7 });

      navigate("/signup", {
        state: {
          useremail,
          password,
          username,
        },
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message || "Google login failed");
  } finally {
    setLoading(false);
  }
};


  if (showSuccessAnimation) return <SuccessfullyLogin />
  const isverified = Cookies.get("isVerified")
  // console.log(isverified)

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fff1ed] via-[#fff1ed] to-[#fff1ed] overflow-hidden">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999]">
          <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl">
            <div className="w-10 h-10 border-4 border-[#caa057] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-700 font-medium">Processing...</p>
          </div>
        </div>
      )}

      <div className="relative flex flex-col lg:flex-row items-center justify-between px-8 py-12 max-w-7xl mx-auto">
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
              Connect with top companies, explore exciting roles, and take the next step in your career journey. Your
              dream job is just one click away.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {/* Primary Button */}
              <button
                onClick={() => navigate("/companies")}
                className="group px-8 sm:px-10 py-4 bg-gradient-to-r from-[#caa057] to-[#caa057] text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-[#caa057]/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                Start Your Journey
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              {/* Secondary Button */}
              <button
                onClick={() => navigate("/jobs")}
                className="px-8 sm:px-10 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl font-semibold text-lg border border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              >
                Explore Jobs
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
                  {isSignup ? "Create your account to get started" : "Sign in to continue your journey"}
                </p>
              </div>

              {isSignup ? (
                <form onSubmit={handleSignup} className="space-y-5">
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-500 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#caa057] focus:border-transparent outline-none transition-all"
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
                      className={`w-full px-4 py-4 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-500 border rounded-xl focus:ring-2 focus:ring-[#caa057] focus:border-transparent outline-none transition-all ${emailError ? "border-red-500" : "border-gray-200"}`}
                      value={signupData.useremail}
                      onChange={(e) => {
                        setSignupData({
                          ...signupData,
                          useremail: e.target.value,
                        })
                        setEmailError("")
                      }}
                      required
                    />
                    {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create Password"
                      className={`w-full px-4 py-4 pr-12 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-500 border rounded-xl focus:ring-2 focus:ring-[#caa057] focus:border-transparent outline-none transition-all ${passwordError ? "border-red-500" : "border-gray-200"}`}
                      value={signupData.password}
                      onChange={(e) => {
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                        setPasswordError("")
                      }}
                      required
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                    {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                  </div>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className={`w-full px-4 py-4 pr-12 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-500 border rounded-xl focus:ring-2 focus:ring-[#caa057] focus:border-transparent outline-none transition-all ${confirmPasswordError ? "border-red-500" : "border-gray-200"}`}
                      value={signupData.confirmPassword}
                      onChange={(e) => {
                        setSignupData({
                          ...signupData,
                          confirmPassword: e.target.value,
                        })
                        setConfirmPasswordError("")
                      }}
                      required
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 cursor-pointer"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                    {confirmPasswordError && <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>}
                  </div>

                  <div>
                    <select
                      className="w-full px-4 py-4 bg-white/70 backdrop-blur-sm text-gray-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#caa057] focus:border-transparent outline-none transition-all"
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
                      <option value="recruiter">Recruiter</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-[#caa057] to-[#caa057] text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-[#caa057]/25 transform hover:scale-[1.02] transition-all duration-300"
                  >
                    Create Account
                  </button>

                  <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignup(false)
                        setEmailError("")
                        setPasswordError("")
                        setConfirmPasswordError("")
                      }}
                      className="text-[#caa057] font-semibold hover:text-[#b4924c] transition-colors"
                    >
                      Login
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className={`w-full px-4 py-4 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-500 border rounded-xl focus:ring-2 focus:ring-[#caa057] focus:border-transparent outline-none transition-all ${emailError ? "border-red-500" : "border-gray-200"}`}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setEmailError("")
                      }}
                      required
                    />
                    {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full px-4 py-4 pr-12 bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-500 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#caa057] focus:border-transparent outline-none transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>

                  <p className="text-sm text-right mt-2">
                    <a href="/reset-password" className="text-blue-600 hover:underline">
                      Forgot Password?
                    </a>
                  </p>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-[#caa057] to-[#caa057] text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-[#caa057]/25 transform hover:scale-[1.02] transition-all duration-300"
                  >
                    Login
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">or continue with</span>
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
                      onClick={() => {
                        setIsSignup(true)
                        setEmailError("")
                      }}
                      className="text-[#caa057] font-semibold hover:text-[#b4924c] transition-colors"
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

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <div className="flex items-center space-x-2 text-gray-600">
          <span className="text-sm">Scroll to explore opportunities</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
      <MessageModal
        open={modalOpen}
        title="Login Failed"
        message="Invalid Email or Password"
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
})

export default Hero
