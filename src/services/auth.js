import { BASE_URL } from "../config";

// ✅ Send OTP
export const sendOtp = async (useremail) => {
  try {
    const res = await fetch(`${BASE_URL}/user/send-otp`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ useremail }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to send OTP");
    return data; 
  } catch (err) {
    console.error("❌ sendOtp Error:", err.message);
    throw err;
  }
};

// ✅ Verify OTP
export const verifyOtp = async (useremail, otp) => {
  try {
    const res = await fetch(`${BASE_URL}/user/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ useremail, otp }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to verify OTP");
    return data; 
  } catch (err) {
    console.error("❌ verifyOtp Error:", err.message);
    throw err;
  }
};

// ✅ Reset Password
export const resetPassword = async (useremail, newPassword) => {
  try {
    const res = await fetch(`${BASE_URL}/user/reset-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ useremail, newPassword }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to reset password");
    return data;
  } catch (err) {
    console.error("❌ resetPassword Error:", err.message);
    throw err;
  }
};
