// Fully editable ProfilePage
import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaMapMarkerAlt,
  FaIndustry,
  FaFileInvoice,
  FaGlobe,
  FaLinkedin,
  FaUsers,
  FaBriefcase,
  FaCoins,
  FaCamera,
} from "react-icons/fa";
import {
  getRecruiterProfile,
  updateRecruiterProfile,
} from "../../../services/apis";

const ProfilePage = ({ onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("company");
  const fileInputRef = useRef(null);

  const token = Cookies.get("userToken");

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return setFetching(false);
      try {
        const user = await getRecruiterProfile(token);
        if (user && user.user) {
          setFormData({
            name: user.user.username || "",
            email: user.user.useremail || "",
            phone: user.user.recruterPhone || "",
            designation: user.user.designation || "",
            logo: user.user.recruterLogo || "",
            recruterCompany: user.user.recruterCompany || "",
            recruterCompanySize: user.user.recruterCompanySize || "",
            recruterIndustry: user.user.recruterIndustry || "",
            recruterCompanyAddress: user.user.recruterCompanyAddress || "",
            recruterGstIn: user.user.recruterGstIn || "",
            companyWebsite: user.user.companyWebsite || "",
            companyLinkedIn: user.user.companyLinkedIn || "",
            hiringRoles: user.user.hiringRoles || [],
            hiringLocations: user.user.hiringLocations || [],
            hiringExperienceLevels: user.user.hiringExperienceLevels || [],
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
      setFetching(false);
    };
    loadProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleArrayChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value.split(",").map((v) => v.trim()),
    }));
  };

  const handleLogoClick = () => fileInputRef.current?.click();

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!token) return;
    setLoading(true);
    try {
      await updateRecruiterProfile(token, formData, (newToken) =>
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
        <p className="text-gray-500 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto mt-4 sm:mt-8 p-4 sm:p-6 bg-white rounded-2xl shadow-lg">
      {/* Header with Avatar & Editable Info */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
        {/* Logo */}
        <div className="relative flex-shrink-0 self-center sm:self-start">
          <img
            src={formData.logo || "/default-logo.png"}
            alt="Company Logo"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-orange-400 object-cover shadow cursor-pointer"
            onClick={handleLogoClick}
          />
          <div
            onClick={handleLogoClick}
            className="absolute bottom-2 right-2 bg-orange-500 text-white p-1.5 rounded-full cursor-pointer hover:bg-orange-600 transition"
          >
            <FaCamera size={14} />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleLogoUpload}
          />
        </div>

        {/* Editable Info */}
        <div className="flex-1 space-y-2 w-full">
          <InfoItem
            icon={<FaUser />}
            label="Name"
            name="name"
            value={formData.name}
            isEditing={isEditing}
            onChange={handleChange}
          />
          <InfoItem
            icon={<FaBriefcase />}
            label="Designation"
            name="designation"
            value={formData.designation}
            isEditing={isEditing}
            onChange={handleChange}
          />
          <InfoItem
            icon={<FaBuilding />}
            label="Company"
            name="recruterCompany"
            value={formData.recruterCompany}
            isEditing={isEditing}
            onChange={handleChange}
          />
          <div className="flex flex-wrap gap-3 mt-2">
            <InfoItem
              icon={<FaPhone />}
              label="Phone"
              name="phone"
              value={formData.phone}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <InfoItem
              icon={<FaEnvelope />}
              label="Email"
              name="email"
              value={formData.email}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <InfoItem
              icon={<FaMapMarkerAlt />}
              label="Address"
              name="recruterCompanyAddress"
              value={formData.recruterCompanyAddress}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <InfoItem
              icon={<FaIndustry />}
              label="Industry"
              name="recruterIndustry"
              value={formData.recruterIndustry}
              isEditing={isEditing}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Edit/Save button */}
        <div className="hidden sm:block">
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={loading}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:opacity-90 text-white px-5 py-2 rounded-lg font-semibold shadow transition"
          >
            {isEditing ? (loading ? "Saving..." : "Save Changes") : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b mb-6 overflow-x-auto scrollbar-hide text-sm sm:text-base">
        {[
          { id: "company", label: "Company Info" },
          { id: "hiring", label: "Hiring Preferences" },
          { id: "credits", label: "Job Credits" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 sm:px-4 py-2 font-medium transition border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-orange-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Company Tab */}
      {activeTab === "company" && (
        <Card title="Company Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoItem
              icon={<FaBuilding />}
              label="Company"
              name="recruterCompany"
              value={formData.recruterCompany}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <InfoItem
              icon={<FaUsers />}
              label="Company Size"
              name="recruterCompanySize"
              value={formData.recruterCompanySize}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <InfoItem
              icon={<FaIndustry />}
              label="Industry"
              name="recruterIndustry"
              value={formData.recruterIndustry}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <InfoItem
              icon={<FaFileInvoice />}
              label="GSTIN"
              name="recruterGstIn"
              value={formData.recruterGstIn}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <InfoItem
              icon={<FaGlobe />}
              label="Website"
              name="companyWebsite"
              value={formData.companyWebsite}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <InfoItem
              icon={<FaLinkedin />}
              label="LinkedIn"
              name="companyLinkedIn"
              value={formData.companyLinkedIn}
              isEditing={isEditing}
              onChange={handleChange}
            />
          </div>
        </Card>
      )}

      {/* Hiring Tab */}
      {activeTab === "hiring" && (
        <Card title="Hiring Preferences">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoItem
              icon={<FaBriefcase />}
              label="Roles"
              name="hiringRoles"
              value={formData.hiringRoles.join(", ")}
              isEditing={isEditing}
              onChange={(e) => handleArrayChange("hiringRoles", e.target.value)}
            />
            <InfoItem
              icon={<FaUsers />}
              label="Experience Levels"
              name="hiringExperienceLevels"
              value={formData.hiringExperienceLevels.join(", ")}
              isEditing={isEditing}
              onChange={(e) => handleArrayChange("hiringExperienceLevels", e.target.value)}
            />
            <InfoItem
              icon={<FaMapMarkerAlt />}
              label="Locations"
              name="hiringLocations"
              value={formData.hiringLocations.join(", ")}
              isEditing={isEditing}
              onChange={(e) => handleArrayChange("hiringLocations", e.target.value)}
            />
          </div>
        </Card>
      )}

      {/* Credits Tab */}
      {activeTab === "credits" && (
        <Card title="Your Job Credits">
          <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between text-white shadow">
            <div className="flex items-center gap-2">
              <FaCoins size={22} />
              <span className="text-xl font-bold">0 Credits</span>
            </div>
            <button className="mt-3 sm:mt-0 w-full sm:w-auto px-6 py-2 bg-white text-orange-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition">
              Buy Credits
            </button>
          </div>
        </Card>
      )}

      {/* Mobile Floating Save */}
      <div className="sm:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          disabled={loading}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-5 py-3 rounded-full font-semibold shadow-lg transition"
        >
          {isEditing ? (loading ? "..." : "Save") : "Edit"}
        </button>
      </div>
    </div>
  );
};

const Card = ({ title, children }) => (
  <div className="p-5 sm:p-7 bg-white rounded-xl shadow-md mb-6 border border-gray-100">
    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

const InfoItem = ({ icon, label, value, isEditing, name, onChange }) => (
  <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
    <p className="flex items-center gap-2 text-gray-600 mb-1 sm:mb-0 text-sm font-medium sm:w-1/3">
      {icon} {label}:
    </p>
    {isEditing ? (
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label}`}
        className="w-full sm:w-2/3 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
      />
    ) : (
      <p className="text-gray-800 text-sm sm:w-2/3">{value || "—"}</p>
    )}
  </div>
);

export default ProfilePage;
