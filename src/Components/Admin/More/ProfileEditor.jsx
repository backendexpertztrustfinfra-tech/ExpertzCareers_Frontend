import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  FaTrash,
} from "react-icons/fa";
import {
  getRecruiterProfile,
  updateRecruiterProfile,
  getActiveSubscription,
} from "../../../services/apis";
import { BASE_URL } from "../../../config";

// --------------------------- Reusable UI Components ---------------------------
const Card = ({ title, children }) => (
  <div className="p-5 sm:p-7 bg-white rounded-xl shadow-md mb-6 border border-gray-100">
    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
      {title}
    </h3>
    {children}
  </div>
);

const InfoItem = ({ icon, label, value, isEditing, name, onChange }) => {
  if (!isEditing && (value === "" || value === null)) return null;

  const displayValue = Array.isArray(value) ? value.join(", ") : value;

  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
      <p className="flex items-center gap-2 text-gray-600 mb-1 sm:mb-0 text-sm font-medium sm:w-1/3">
        {icon} {label}:
      </p>
      {isEditing ? (
        <input
          name={name}
          value={displayValue || ""}
          onChange={onChange}
          placeholder={`Enter ${label}`}
          className="w-full sm:w-2/3 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
        />
      ) : (
        <p className="text-gray-800 text-sm sm:w-2/3">{displayValue || "—"}</p>
      )}
    </div>
  );
};

const InfoGrid = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{children}</div>
);

// --------------------------- Credits Section ---------------------------
const CreditsSection = ({ navigate, token }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      setLoading(true);
      try {
        if (!token) return setLoading(false);
        const sub = await getActiveSubscription(token);
        setSubscription(sub && sub.isActive ? sub : null);
      } catch (err) {
        console.error("❌ Error fetching subscription:", err);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscription();
  }, [token]);

  const remainingJobs =
    (subscription?.jobPostLimit || 0) - (subscription?.jobsPosted || 0);

  const handleBuyCredits = () =>
    navigate("/admin?tab=Credits", { state: { tab: "Credits" } });

  if (loading)
    return (
      <Card title="Your Job Credits">
        <div className="text-center text-gray-500 py-8">
          Loading subscription data...
        </div>
      </Card>
    );

  if (!subscription)
    return (
      <Card title="Your Job Credits">
        <div className="bg-gray-100 rounded-xl p-6 text-center shadow">
          <p className="text-gray-600 mb-4">
            You do not have an active subscription. Buy a plan to post jobs.
          </p>
          <button
            onClick={handleBuyCredits}
            className="w-full sm:w-auto px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg shadow hover:bg-orange-700 transition"
          >
            Buy Credits
          </button>
        </div>
      </Card>
    );

  return (
    <Card title="Your Job Credits">
      <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between text-white shadow mb-6">
        <div className="flex items-center gap-2">
          <FaCoins size={22} />
          <span className="text-xl font-bold">
            {subscription.jobsPosted} of {subscription.jobPostLimit} Jobs Used
          </span>
        </div>
        <button
          onClick={handleBuyCredits}
          className="mt-3 sm:mt-0 w-full sm:w-auto px-6 py-2 bg-white text-orange-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
        >
          Buy More Credits
        </button>
      </div>

      <InfoGrid>
        <div className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-lg text-gray-800 mb-2">
            Plan Details
          </h4>
          <div className="text-sm space-y-2 text-gray-700">
            <p>
              <strong>Plan ID:</strong> {subscription.planId}
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {new Date(subscription.startDate).toLocaleDateString()}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {new Date(subscription.endDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Jobs Remaining:</strong> {remainingJobs}
            </p>
            <p>
              <strong>Database Points:</strong> {subscription.dbPoints}
            </p>
          </div>
        </div>
      </InfoGrid>
    </Card>
  );
};

// --------------------------- Main Profile Page ---------------------------
const ProfilePage = ({ onUpdate }) => {
  const [formData, setFormData] = useState({
    username: "",
    useremail: "",
    recruterPhone: "",
    designation: "",
    profilphotoUrl: "",
    profilphotoFile: null,
    recruterCompany: "",
    recruterCompanyType: "",
    recruterIndustry: "",
    recruterCompanyAddress: "",
    recruterGstIn: "",
    companyWebsite: "",
    companyLinkedIn: "",
    recruterCompanyDoc: "",
    recruterCompanyDocFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("company");
  const photoInputRef = useRef(null);
  const docInputRef = useRef(null);
  const token = Cookies.get("userToken");
  const navigate = useNavigate();

  // Fetch profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return setFetching(false);
      try {
        const user = await getRecruiterProfile(token);
        if (user && user.user) {
          setFormData((prev) => ({
            ...prev,
            username: user.user.username || "",
            useremail: user.user.useremail || "",
            recruterPhone: user.user.recruterPhone || "",
            designation: user.user.designation || "",
            profilphotoUrl: user.user.profilphoto || "",
            recruterCompany: user.user.recruterCompany || "",
            recruterCompanyType: user.user.recruterCompanyType || "",
            recruterIndustry: user.user.recruterIndustry || "",
            recruterCompanyAddress: user.user.recruterCompanyAddress || "",
            recruterGstIn: user.user.recruterGstIn || "",
            companyWebsite: user.user.companyWebsite || "",
            companyLinkedIn: user.user.companyLinkedIn || "",
            recruterCompanyDoc: user.user.recruterCompanyDoc || "",
          }));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setFetching(false);
      }
    };
    loadProfile();
  }, [token]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Photo upload
  const handleLogoClick = () => photoInputRef.current?.click();
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profilphotoFile: file,
        profilphotoUrl: URL.createObjectURL(file),
      }));
    }
  };
  const handleDeletePhoto = () =>
    setFormData((prev) => ({ ...prev, profilphotoFile: null, profilphotoUrl: "" }));

  // Document upload
  const handleDocClick = () => docInputRef.current?.click();
  const handleDocUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        recruterCompanyDocFile: file,
        recruterCompanyDoc: file.name,
      }));
    }
  };
  const handleDeleteDoc = () =>
    setFormData((prev) => ({ ...prev, recruterCompanyDocFile: null, recruterCompanyDoc: "" }));

  // Save
  const handleSave = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = new FormData();

      // text fields
      for (const key in formData) {
        if (
          !["profilphotoFile", "profilphotoUrl", "recruterCompanyDocFile"].includes(
            key
          )
        ) {
          data.append(key, formData[key]);
        }
      }

      // files
      if (formData.profilphotoFile) {
        data.append("profilphoto", formData.profilphotoFile);
      }
      if (formData.recruterCompanyDocFile) {
        data.append("recruterCompanyDoc", formData.recruterCompanyDocFile);
      }

      await updateRecruiterProfile(token, data);
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
        <div className="relative flex-shrink-0 self-center sm:self-start">
          <img
            src={
              formData.profilphotoFile
                ? formData.profilphotoUrl
                : formData.profilphotoUrl
                ? `${BASE_URL}${formData.profilphotoUrl}`
                : "/default-logo.png"
            }
            alt="Profile"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-orange-400 object-cover shadow cursor-pointer"
            onClick={isEditing ? handleLogoClick : undefined}
          />
          {isEditing && (
            <>
              <div
                onClick={handleLogoClick}
                className="absolute bottom-2 right-2 bg-orange-500 text-white p-1.5 rounded-full cursor-pointer hover:bg-orange-600 transition"
              >
                <FaCamera size={14} />
              </div>
              {formData.profilphotoUrl && (
                <div
                  onClick={handleDeletePhoto}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full cursor-pointer hover:bg-red-600 transition"
                >
                  <FaTrash size={14} />
                </div>
              )}
            </>
          )}
          <input
            type="file"
            ref={photoInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleLogoUpload}
          />
        </div>

        <div className="flex-1 space-y-2 w-full">
          <InfoItem
            icon={<FaUser />}
            label="Name"
            name="username"
            value={formData.username}
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
          <InfoItem
            icon={<FaPhone />}
            label="Phone"
            name="recruterPhone"
            value={formData.recruterPhone}
            isEditing={isEditing}
            onChange={handleChange}
          />
          <InfoItem
            icon={<FaEnvelope />}
            label="Email"
            name="useremail"
            value={formData.useremail}
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
        </div>

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
        {["company", "credits"].map((tabId) => (
          <button
            key={tabId}
            onClick={() => setActiveTab(tabId)}
            className={`px-3 sm:px-4 py-2 font-medium transition border-b-2 whitespace-nowrap ${
              activeTab === tabId
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-orange-600"
            }`}
          >
            {tabId === "company" && "Company Info"}
            {tabId === "credits" && "Job Credits"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "company" && (
        <Card title="Company Information">
          <InfoGrid>
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
              label="Company Type"
              name="recruterCompanyType"
              value={formData.recruterCompanyType}
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

            {/* Document Upload */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-gray-600 mb-1 sm:mb-0 text-sm font-medium sm:w-1/3">
                <FaFileInvoice /> Document:
              </p>
              <div className="sm:w-2/3 flex items-center gap-2">
                {formData.recruterCompanyDoc ? (
                  <a
                    href={`${BASE_URL}${formData.recruterCompanyDoc}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    {formData.recruterCompanyDocFile
                      ? formData.recruterCompanyDocFile.name
                      : "View Document"}
                  </a>
                ) : (
                  <p className="text-gray-400 text-sm">No document uploaded</p>
                )}
                {isEditing && (
                  <>
                    <button
                      onClick={handleDocClick}
                      className="bg-orange-500 text-white px-3 py-1 text-xs rounded-lg hover:bg-orange-600 transition"
                    >
                      Upload
                    </button>
                    {formData.recruterCompanyDoc && (
                      <button
                        onClick={handleDeleteDoc}
                        className="bg-red-500 text-white px-3 py-1 text-xs rounded-lg hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    )}
                  </>
                )}
                <input
                  type="file"
                  ref={docInputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={handleDocUpload}
                />
              </div>
            </div>
          </InfoGrid>
        </Card>
      )}

      {activeTab === "credits" && (
        <CreditsSection navigate={navigate} token={token} />
      )}

      {/* Mobile Save Button */}
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

export default ProfilePage;
