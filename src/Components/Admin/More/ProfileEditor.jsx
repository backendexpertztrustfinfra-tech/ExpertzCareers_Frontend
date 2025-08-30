import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaMapMarkerAlt, FaIndustry, FaFileInvoice } from "react-icons/fa";
import { getRecruiterProfile, updateRecruiterProfile } from "../../../services/apis";

const ProfilePage = ({ onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    recruterCompany: "",
    recruterCompanyAddress: "",
    recruterGstIn: "",
    recruterIndustry: "",
    logo: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const token = Cookies.get("userToken");

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return setFetching(false);
      const user = await getRecruiterProfile(token);
      if (user && user.user) {
        setFormData({
          name: user.user.username || "",
          email: user.user.useremail || "",
          phone: user.user.recruterPhone || "",
          recruterCompany: user.user.recruterCompany || "",
          recruterCompanyAddress: user.user.recruterCompanyAddress || "",
          recruterGstIn: user.user.recruterGstIn || "",
          recruterIndustry: user.user.recruterIndustry || "",
          logo: user.user.recruterLogo || "",
        });
      }
      setFetching(false);
    };
    loadProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    if (!token) return;
    setLoading(true);

    const payload = {
      username: formData.name,
      useremail: formData.email,
      recruterPhone: formData.phone,
      recruterCompany: formData.recruterCompany,
      recruterCompanyAddress: formData.recruterCompanyAddress,
      recruterGstIn: formData.recruterGstIn,
      recruterIndustry: formData.recruterIndustry,
      recruterLogo: formData.logo,
    };

    try {
      await updateRecruiterProfile(token, payload, (newToken) =>
        Cookies.set("userToken", newToken, { expires: 7 })
      );
      alert("✅ Profile updated successfully!");
      setIsEditing(false);
      if (onUpdate) onUpdate(formData);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("❌ Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="w-full flex justify-center items-center p-10">
        <p className="text-gray-400 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-16 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          disabled={loading}
        >
          {isEditing ? (loading ? "Saving..." : "Save") : "Edit"}
        </button>
      </div>

      {/* Profile Image */}
      <div className="flex justify-center mb-8 relative">
        <img
          src={formData.logo || "/default-logo.png"}
          alt="Company Logo"
          className="w-32 h-32 rounded-full border-4 border-yellow-400 object-cover shadow-lg"
        />
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            className="absolute bottom-0 right-0 w-10 h-10 opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => setFormData({ ...formData, logo: reader.result });
                reader.readAsDataURL(file);
              }
            }}
          />
        )}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="p-6 bg-gray-50 rounded-2xl shadow-md space-y-3">
          <h3 className="text-xl font-semibold text-gray-700">Personal Information</h3>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <FaUser className="text-yellow-500" />
              {isEditing ? (
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              ) : (
                formData.name
              )}
            </p>
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-yellow-500" />
              {isEditing ? (
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              ) : (
                formData.email
              )}
            </p>
            <p className="flex items-center gap-2">
              <FaPhone className="text-yellow-500" />
              {isEditing ? (
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              ) : (
                formData.phone
              )}
            </p>
          </div>
        </div>

        {/* Company Info */}
        <div className="p-6 bg-gray-50 rounded-2xl shadow-md space-y-3">
          <h3 className="text-xl font-semibold text-gray-700">Company Information</h3>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <FaBuilding className="text-yellow-500" />
              {isEditing ? (
                <input
                  name="recruterCompany"
                  value={formData.recruterCompany}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              ) : (
                formData.recruterCompany
              )}
            </p>
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-yellow-500" />
              {isEditing ? (
                <input
                  name="recruterCompanyAddress"
                  value={formData.recruterCompanyAddress}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              ) : (
                formData.recruterCompanyAddress
              )}
            </p>
            <p className="flex items-center gap-2">
              <FaFileInvoice className="text-yellow-500" />
              {isEditing ? (
                <input
                  name="recruterGstIn"
                  value={formData.recruterGstIn}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              ) : (
                formData.recruterGstIn
              )}
            </p>
            <p className="flex items-center gap-2">
              <FaIndustry className="text-yellow-500" />
              {isEditing ? (
                <input
                  name="recruterIndustry"
                  value={formData.recruterIndustry}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              ) : (
                formData.recruterIndustry
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
