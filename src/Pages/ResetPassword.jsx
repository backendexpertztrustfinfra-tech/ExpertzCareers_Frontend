"use client"
import React, { useState } from "react"
import { sendOtp, verifyOtp, resetPassword } from "../services/auth"
import { motion } from "framer-motion"
import { Mail, ShieldCheck, KeyRound, Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"

const ResetPassword = () => {
  const [step, setStep] = useState(1)
  const [useremail, setUseremail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      if (!useremail.includes("@")) {
        setError("Please enter a valid email address.")
        return
      }
      const res = await sendOtp(useremail)
      setMessage(res.message || "OTP sent to your email!")
      setStep(2)
    } catch (err) {
      setError(err.message || "Failed to send OTP. Try again.")
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      if (otp.length < 4) {
        setError("OTP must be at least 4 digits.")
        return
      }
      const res = await verifyOtp(useremail, otp)
      setMessage(res.message || "OTP verified successfully!")
      setStep(3)
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      if (newPassword.length < 6) {
        setError("Password must be at least 6 characters.")
        return
      }
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.")
        return
      }
      const res = await resetPassword(useremail, newPassword)
      setMessage(res.message || "Password reset successful! Redirecting...")
      setTimeout(() => {
        navigate("/") // ✅ React Router redirect
      }, 1500)
    } catch (err) {
      setError(err.message || "Failed to reset password. Try again.")
    } finally {
      setLoading(false)
    }
  }

  // Stepper UI
  const steps = [
    { id: 1, label: "Email", icon: <Mail className="w-5 h-5" /> },
    { id: 2, label: "OTP", icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 3, label: "Password", icon: <KeyRound className="w-5 h-5" /> },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        {/* Stepper */}
        <div className="flex justify-between mb-6">
          {steps.map((s) => (
            <div
              key={s.id}
              className={`flex flex-col items-center text-sm font-medium ${
                step >= s.id ? "text-[#caa057]" : "text-gray-400"
              }`}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= s.id
                    ? "border-[#caa057] bg-[#caa057] text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {s.icon}
              </div>
              <span className="mt-2">{s.label}</span>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {step === 1 && "Verify Your Email"}
          {step === 2 && "Enter OTP"}
          {step === 3 && "Reset Your Password"}
        </h2>

        {error && (
          <p className="text-sm mb-3 text-center font-medium text-red-600">
            {error}
          </p>
        )}
        {message && !error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm mb-3 text-center font-medium text-[#caa057]"
          >
            {message}
          </motion.p>
        )}

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caa057]"
              value={useremail}
              onChange={(e) => setUseremail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-[#caa057] text-white py-3 rounded-lg hover:bg-[#b4924c] transition font-semibold"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caa057]"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-[#caa057] text-white py-3 rounded-lg hover:bg-[#b4924c] transition font-semibold"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
  <form onSubmit={handleResetPassword} className="space-y-4">
    {/* New Password */}
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="New Password"
        className="w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caa057]"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>

    {/* Confirm New Password */}
    <div className="relative">
      <input
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Confirm New Password"
        className="w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caa057]"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button
        type="button"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
      >
        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>

    {/* Reset Button */}
    <button
      type="submit"
      className="w-full bg-[#caa057] text-white py-3 rounded-lg hover:bg-[#b4924c] transition font-semibold"
      disabled={loading}
    >
      {loading ? "Resetting..." : "Reset Password"}
    </button>
  </form>
)}
      </motion.div>
    </div>
  )
}

export default ResetPassword
