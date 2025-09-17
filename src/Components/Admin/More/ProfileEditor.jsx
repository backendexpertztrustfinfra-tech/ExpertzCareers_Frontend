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
} from "react-icons/fa";

// Ensure BASE_URL is defined somewhere, e.g., in a config file or as an environment variable
// const BASE_URL = "https://your-api-base-url.com";

// --- API Services ---
// NOTE: I've corrected the duplicate function definitions and moved them out of the component.
// In a real project, these should be in a separate file, like `services/apis.js`
const getRecruiterProfile = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/recruiter/getRecruiterProfile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error ${response.status}: ${text}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

const updateRecruiterProfile = async (token, formData) => {
  if (!token) return null;

  try {
    const res = await fetch(`${BASE_URL}/recruiter/updateRecruiterProfile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errMsg = await res.text();
      throw new Error(errMsg || "Profile update failed");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Update Profile Error:", err.message);
    return null;
  }
};

// Mock API for demonstration
const getActiveSubscription = async (token) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    isActive: true,
    jobsPosted: 3,
    jobPostLimit: 10,
    dbPoints: 50,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  };
};

const getRecruiterPostedJobs = async (token) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    jobs: [
      { title: "Senior Software Engineer" },
      { title: "UI/UX Designer" },
      { title: "Marketing Manager" },
    ],
  };
};

// --- Reusable Components ---
const Card = ({ title, children }) => (
  <div className="p-5 sm:p-7 bg-white rounded-xl shadow-md mb-6 border border-gray-100">
    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
      {title}
    </h3>
    {children}
  </div>
);

const InfoItem = ({ icon, label, value, isEditing, name, onChange }) => {
  if (
    !isEditing &&
    (value === "" ||
      value === null ||
      (Array.isArray(value) && value.length === 0))
  ) {
    return null;
  }

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

// --- Credits Section Component ---
const CreditsSection = ({ navigate, token }) => {
  const [subscription, setSubscription] = useState(null);
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const subRes = await getActiveSubscription(token);
        if (subRes && subRes.isActive) {
          setSubscription(subRes);
          const jobsRes = await getRecruiterPostedJobs(token);
          if (jobsRes && jobsRes.jobs) {
            setPostedJobs(jobsRes.jobs);
          }
        } else {
          setSubscription(null);
          setPostedJobs([]);
        }
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        setSubscription(null);
        setPostedJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const handleBuyCredits = () => {
    navigate("/admin", { state: { tab: "Credits" } });
  };

  return (
    <Card title="Your Job Credits">
      {loading ? (
        <div className="text-center text-gray-500 py-8">
          Loading subscription data...
        </div>
      ) : (
        <>
          {subscription ? (
            <>
              <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between text-white shadow mb-6">
                <div className="flex items-center gap-2">
                  <FaCoins size={22} />
                  <span className="text-xl font-bold">
                    {subscription.jobsPosted} of {subscription.jobPostLimit}{" "}
                    Jobs Used
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
                      <strong>Start Date:</strong>{" "}
                      {formatTimestamp(subscription.startDate)}
                    </p>
                    <p>
                      <strong>End Date:</strong>{" "}
                      {formatTimestamp(subscription.endDate)}
                    </p>
                    <p>
                      <strong>Jobs Remaining:</strong>{" "}
                      {subscription.jobPostLimit - subscription.jobsPosted}
                    </p>
                    <p>
                      <strong>Database Points:</strong> {subscription.dbPoints}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-semibold text-lg text-gray-800 mb-2">
                    Posted Jobs
                  </h4>
                  {postedJobs.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {postedJobs.map((job, index) => (
                        <li key={index}>{job.title}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No jobs posted yet with this plan.
                    </p>
                  )}
                </div>
              </InfoGrid>
            </>
          ) : (
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
          )}
        </>
      )}
    </Card>
  );
};

// --- Main Profile Page Component ---
const ProfilePage = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("company");
  const logoInputRef = useRef(null);
  const docInputRef = useRef(null);
  const token = Cookies.get("userToken");
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return setFetching(false);
      try {
        const user = await getRecruiterProfile(token);
        if (user && user.user) {
          setFormData({
            username: user.user.username || "",
            useremail: user.user.useremail || "",
            recruterPhone: user.user.recruterPhone || "",
            designation: user.user.designation || "",
            profilphoto: user.user.profilphoto || "",
            recruterCompanyDoc: user.user.recruterCompanyDoc || "",
            recruterCompany: user.user.recruterCompany || "",
            recruterCompanyType: user.user.recruterCompanyType || "",
            recruterIndustry: user.user.recruterIndustry || "",
            recruterCompanyAddress: user.user.recruterCompanyAddress || "",
            recruterGstIn: user.user.recruterGstIn || "",
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setFetching(false);
      }
    };
    loadProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profilphoto: URL.createObjectURL(file),
        profilphotoFile: file,
      }));
    }
  };

  const handleDocUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        recruterCompanyDoc: URL.createObjectURL(file),
        recruterCompanyDocFile: file,
      }));
    }
  };

  const handleSave = async () => {
    if (!token) return;
    setLoading(true);

    const payload = new FormData();
    // Use a loop to append all form data keys
    for (const key in formData) {
      // Append non-file data
      if (
        formData[key] &&
        !["profilphotoFile", "recruterCompanyDocFile"].includes(key)
      ) {
        payload.append(key, formData[key]);
      }
    }

    // Append file data only if they exist
    if (formData.profilphotoFile) {
      payload.append("profilphoto", formData.profilphotoFile);
    }
    if (formData.recruterCompanyDocFile) {
      payload.append("recruterCompanyDoc", formData.recruterCompanyDocFile);
    }

    try {
      const response = await updateRecruiterProfile(token, payload);
      if (response && response.msg === "User Update Succssfully") {
        alert("✅ Profile updated successfully!");
        setIsEditing(false);
        // Re-fetch profile to ensure data is in sync with server
        const updatedUser = await getRecruiterProfile(token);
        if (updatedUser && updatedUser.user) {
          setFormData({
            username: updatedUser.user.username || "",
            useremail: updatedUser.user.useremail || "",
            recruterPhone: updatedUser.user.recruterPhone || "",
            designation: updatedUser.user.designation || "",
            profilphoto: updatedUser.user.profilphoto || "",
            recruterCompanyDoc: updatedUser.user.recruterCompanyDoc || "",
            recruterCompany: updatedUser.user.recruterCompany || "",
            recruterCompanyType: updatedUser.user.recruterCompanyType || "",
            recruterIndustry: updatedUser.user.recruterIndustry || "",
            recruterCompanyAddress: updatedUser.user.recruterCompanyAddress || "",
            recruterGstIn: updatedUser.user.recruterGstIn || "",
          });
        }
      } else {
        alert(response?.msg || "❌ Failed to update profile.");
      }
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
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
        <div className="relative flex-shrink-0 self-center sm:self-start">
          <img
            src={formData.profilphoto || "/default-logo.png"}
            alt="Profile"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-orange-400 object-cover shadow cursor-pointer"
            onClick={() => logoInputRef.current?.click()}
          />
          {isEditing && (
            <div
              onClick={() => logoInputRef.current?.click()}
              className="absolute bottom-2 right-2 bg-orange-500 text-white p-1.5 rounded-full cursor-pointer hover:bg-orange-600 transition"
            >
              <FaCamera size={14} />
            </div>
          )}
          <input
            type="file"
            ref={logoInputRef}
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
            {isEditing
              ? loading
                ? "Saving..."
                : "Save Changes"
              : "Edit Profile"}
          </button>
        </div>
      </div>

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
            {tabId === "company" ? "Company Info" : "Job Credits"}
          </button>
        ))}
      </div>

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
            <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <p className="flex items-center gap-2 text-gray-600 mb-1 sm:mb-0 text-sm font-medium sm:w-1/3">
                <FaFileInvoice /> Document:
              </p>
              {isEditing ? (
                <div className="w-full sm:w-2/3">
                  <button
                    onClick={() => docInputRef.current?.click()}
                    className="w-full sm:w-auto px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Select Document
                  </button>
                  <input
                    type="file"
                    ref={docInputRef}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg"
                    onChange={handleDocUpload}
                  />
                  {formData.recruterCompanyDocFile && (
                    <span className="ml-2 text-gray-500 text-sm">
                      {formData.recruterCompanyDocFile.name}
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-gray-800 text-sm sm:w-2/3">
                  {formData.recruterCompanyDoc ? (
                    <a
                      href={formData.recruterCompanyDoc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Document
                    </a>
                  ) : (
                    "—"
                  )}
                </p>
              )}
            </div>
          </InfoGrid>
        </Card>
      )}

      {activeTab === "credits" && (
        <CreditsSection navigate={navigate} token={token} />
      )}

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