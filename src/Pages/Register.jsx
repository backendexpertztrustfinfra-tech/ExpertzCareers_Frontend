import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Plus,
  Trash2,
  Upload,
  FileText,
  ImageIcon,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const monthYearFormat = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleString("default", { month: "long", year: "numeric" });
};
const useFilePreview = (file) => {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const newUrl = URL.createObjectURL(file);
    setUrl(newUrl);

    return () => {
      URL.revokeObjectURL(newUrl);
    };
  }, [file]);

  return url;
};
const accentColor = "#caa057";
const accentColorHover = "#b4924c";
const InputField = ({ icon: Icon, label, className = "", ...props }) => (
  <div className={`w-full ${className}`}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      )}
      <input
        {...props}
        className={`w-full border border-gray-300 ${
          Icon ? "pl-10" : "pl-4"
        } pr-4 py-3 rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-[${accentColor}] focus:border-[${accentColor}] placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed`}
      />
    </div>
  </div>
);
const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="flex items-start space-x-3 pb-3 mb-4 border-b-2 border-gray-100">
    <Icon className={`w-6 h-6 text-[${accentColor}] mt-1 flex-shrink-0`} />
    <div>
      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  </div>
);
const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  const baseClasses =
    "fixed bottom-5 right-5 p-4 rounded-xl shadow-2xl z-50 flex items-center space-x-3 max-w-sm transition-opacity duration-300";
  const typeClasses = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
  };
  const Icon = type === "success" ? CheckCircle : AlertTriangle;

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <Icon className="w-6 h-6" />
      <p className="font-medium flex-grow">{message}</p>
      <button
        onClick={onClose}
        className="text-white opacity-75 hover:opacity-100 font-bold"
      >
        &times;
      </button>
    </div>
  );
};
const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const signupData = location.state || {};
  const [formData, setFormData] = useState({
    username: "",
    useremail: signupData.useremail || "",
    phonenumber: "",
    designation: "",
    profilphoto: null,
    resume: null,
    Skill: [""],
  });

  const [qualifications, setQualifications] = useState([
    {
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      fieldOfStudy: "",
      pursuing: false,
    },
  ]);

  const [experienceType, setExperienceType] = useState("Fresher");

  const [Experience, setExperience] = useState([
    {
      companyName: "",
      position: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
    },
  ]);

  const [notification, setNotification] = useState({ message: "", type: "" });
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  };

  useEffect(() => {
    setFormData((prev) => {
      const nameCookie = Cookies.get("prefillName") || Cookies.get("userName");
      const emailCookie =
        Cookies.get("prefillEmail") || Cookies.get("userEmail");
      if ((!prev.username && nameCookie) || (!prev.useremail && emailCookie)) {
        return {
          ...prev,
          username: prev.username || nameCookie || "",
          useremail: prev.useremail || emailCookie || "",
        };
      }
      return prev;
    });
  }, []);

  const handleMainFormChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...formData.Skill];
    updatedSkills[index] = value;
    setFormData((prev) => ({ ...prev, Skill: updatedSkills }));
  };

  const handleAddSkill = () =>
    setFormData((prev) => ({ ...prev, Skill: [...prev.Skill, ""] }));
  const handleRemoveSkill = (index) => {
    const updatedSkills = [...formData.Skill];
    updatedSkills.splice(index, 1);
    setFormData((prev) => ({ ...prev, Skill: updatedSkills }));
  };

  const handleQualificationChange = (index, e) => {
    const { name, value, checked, type } = e.target;
    const updatedQualifications = [...qualifications];
    updatedQualifications[index][name] = type === "checkbox" ? checked : value;
    if (name === "pursuing" && checked)
      updatedQualifications[index].endDate = "";
    setQualifications(updatedQualifications);
  };

  const handleAddQualification = () =>
    setQualifications((prev) => [
      ...prev,
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
        fieldOfStudy: "",
        pursuing: false,
      },
    ]);

  const handleRemoveQualification = (index) => {
    const updatedQualifications = [...qualifications];
    updatedQualifications.splice(index, 1);
    setQualifications(updatedQualifications);
  };

  const handleExperienceChange = (index, e) => {
    const { name, value, checked, type } = e.target;
    const updatedExperience = [...Experience];
    updatedExperience[index][name] = type === "checkbox" ? checked : value;
    if (name === "currentlyWorking" && checked)
      updatedExperience[index].endDate = "";
    setExperience(updatedExperience);
  };

  const handleAddExperience = () =>
    setExperience((prev) => [
      ...prev,
      {
        companyName: "",
        position: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
      },
    ]);

  const handleRemoveExperience = (index) => {
    const updatedExperience = [...Experience];
    updatedExperience.splice(index, 1);
    setExperience(updatedExperience);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("userToken");
    if (!token) {
      showNotification(
        "Authentication required. Please log in again.",
        "error"
      );
      return;
    }

    const payload = new FormData();

    payload.append("username", formData.username);
    payload.append("phonenumber", formData.phonenumber);
    payload.append("designation", formData.designation);

    // Skills
    if (formData.Skill.length)
      payload.append("Skill", formData.Skill.join(", "));

// Qualifications
if (qualifications.length) {
  const qualString = qualifications
    .map((q) => {
      const start = monthYearFormat(q.startDate);
      const end = q.pursuing ? "Present" : monthYearFormat(q.endDate);
      return JSON.stringify({
        degree: q.degree,
        institution: q.institution,
        fieldOfStudy: q.fieldOfStudy,
        duration: `${start} - ${end}`,
      });
    })
    .join("@"); 
  payload.append("qualification", qualString);
}

// Experience
if (experienceType !== "Fresher" && Experience.length) {
  const expString = Experience.map((exp) => {
    const start = monthYearFormat(exp.startDate);
    const end = exp.currentlyWorking ? "Present" : monthYearFormat(exp.endDate);
    return JSON.stringify({
      companyName: exp.companyName,
      position: exp.position,
      duration: `${start} - ${end}`,
    });
  }).join("@");
  payload.append("Experience", expString);
} else {
  payload.append("Experience", "");
}


    // Files
    if (formData.profilphoto)
      payload.append("profilphoto", formData.profilphoto);
    if (formData.resume) payload.append("resume", formData.resume);

    try {
      const res = await fetch(
        "https://expertzcareers-backend.onrender.com/jobseeker/updateProfile",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: payload,
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      showNotification("Profile updated successfully!", "success");
      setTimeout(() => navigate("/jobs"), 1500);
    } catch (err) {
      console.error("Profile update failed:", err);
      showNotification("Update failed: " + err.message, "error");
    }
  };

  const photoPreviewUrl = useFilePreview(formData.profilphoto);
  const resumePreviewUrl = useFilePreview(formData.resume);

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 p-4 sm:p-6 md:p-10 font-sans">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900">
          Complete Your{" "}
          <span className={`text-[${accentColor}]`}> Profile</span>
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl space-y-8 border border-gray-100"
        >
          {/* 1. Basic Information */}
          <section className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <SectionHeader
              icon={User}
              title="Basic Information"
              description="Personal details and your targeted role."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <InputField
                icon={User}
                type="text"
                name="username"
                value={formData.username}
                onChange={handleMainFormChange}
                placeholder="Full Name"
                required
              />
              <InputField
                icon={Mail}
                type="email"
                name="useremail"
                value={formData.useremail}
                onChange={handleMainFormChange}
                placeholder="Email Address"
                required
                readOnly
                disabled
              />
              <InputField
                icon={Phone}
                type="tel"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleMainFormChange}
                placeholder="Phone Number"
                required
              />
              <InputField
                icon={Briefcase}
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleMainFormChange}
                placeholder="Current/Targeted designation"
                required
              />
            </div>
          </section>

          {/* 2. Skills */}
          <section className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <SectionHeader
              icon={Briefcase}
              title="Skills"
              description="List your core technical and professional skills."
            />
            <div className="space-y-3">
              {formData.Skill.map((skill, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    className={`w-full border border-gray-300 px-4 py-3 rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-[${accentColor}] focus:border-[${accentColor}] placeholder-gray-500`}
                    placeholder={`Skill #${
                      index + 1
                    } (e.g., React, Java, Marketing)`}
                    required={index === 0}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="text-red-500 hover:text-red-700 transition duration-200 p-2 rounded-full hover:bg-red-50 flex-shrink-0"
                      title="Remove Skill"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSkill}
                className={`flex items-center font-semibold text-[${accentColor}] hover:text-[${accentColorHover}] transition duration-200 mt-4 text-sm`}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Another Skill
              </button>
            </div>
          </section>

          {/* 3. Qualifications / Education */}
          <section className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <SectionHeader
              icon={GraduationCap}
              title="Education & Qualifications"
              description="Your academic background and certifications."
            />
            <div className="space-y-6">
              {qualifications.map((q, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3 relative"
                >
                  <h4 className="font-bold text-base text-gray-700">
                    Qualification #{index + 1}
                  </h4>

                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQualification(index)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition duration-200 p-2 rounded-full hover:bg-red-50"
                      title="Remove Qualification"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}

                  <InputField
                    type="text"
                    name="degree"
                    value={q.degree}
                    onChange={(e) => handleQualificationChange(index, e)}
                    placeholder="Diploma / Degree"
                    required
                  />
                  <InputField
                    type="text"
                    name="fieldOfStudy"
                    value={q.fieldOfStudy}
                    onChange={(e) => handleQualificationChange(index, e)}
                    placeholder="Field of Study"
                    required
                  />
                  <InputField
                    type="text"
                    name="institution"
                    value={q.institution}
                    onChange={(e) => handleQualificationChange(index, e)}
                    placeholder="Institution / University Name"
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      label="Start Date"
                      type="date"
                      name="startDate"
                      value={q.startDate}
                      onChange={(e) => handleQualificationChange(index, e)}
                      required
                    />
                    <InputField
                      label="End Date (or Expected)"
                      type="date"
                      name="endDate"
                      value={q.endDate}
                      onChange={(e) => handleQualificationChange(index, e)}
                      disabled={q.pursuing}
                      required={!q.pursuing}
                    />
                  </div>

                  <label className="flex items-center gap-2 mt-2 text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      name="pursuing"
                      checked={q.pursuing}
                      onChange={(e) => handleQualificationChange(index, e)}
                      className={`h-4 w-4 rounded border-gray-300 text-[${accentColor}] focus:ring-[${accentColor}]`}
                    />
                    Currently Pursuing
                  </label>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddQualification}
                className={`flex items-center font-semibold text-[${accentColor}] hover:text-[${accentColorHover}] transition duration-200 mt-4 text-sm`}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Another Qualification
              </button>
            </div>
          </section>

          {/* 4. Experience */}
          <section className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <SectionHeader
              icon={Briefcase}
              title="Work Experience"
              description="Your professional history details."
            />

            <div className="mb-6">
              <label
                htmlFor="experienceType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Total Experience Level
              </label>
              <select
                id="experienceType"
                value={experienceType}
                onChange={(e) => setExperienceType(e.target.value)}
                className={`w-full border border-gray-300 px-4 py-3 rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-[${accentColor}] focus:border-[${accentColor}] bg-white`}
              >
                <option value="Fresher">
                  Fresher (No professional experience)
                </option>
                <option value="0-1 year">0-1 year</option>
                <option value="1-5 years">1-5 years</option>
                <option value="5-10 years">5-10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
            </div>

            {experienceType !== "Fresher" && (
              <div className="space-y-6">
                {Experience.map((exp, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3 relative"
                  >
                    <h4 className="font-bold text-base text-gray-700">
                      Job Role #{index + 1}
                    </h4>

                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveExperience(index)}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition duration-200 p-2 rounded-full hover:bg-red-50"
                        title="Remove Experience"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}

                    <InputField
                      type="text"
                      name="companyName"
                      value={exp.companyNameName}
                      onChange={(e) => handleExperienceChange(index, e)}
                      placeholder="companyName Name"
                      required
                    />

                    <InputField
                      type="text"
                      name="position"
                      value={exp.position}
                      onChange={(e) => handleExperienceChange(index, e)}
                      placeholder="Job Role / position"
                      required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        label="Start Date"
                        type="date"
                        name="startDate"
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(index, e)}
                        required
                      />
                      <InputField
                        label="End Date"
                        type="date"
                        name="endDate"
                        value={exp.endDate}
                        onChange={(e) => handleExperienceChange(index, e)}
                        disabled={exp.currentlyWorking}
                        required={!exp.currentlyWorking}
                      />
                    </div>

                    <label className="flex items-center gap-2 mt-2 text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        name="currentlyWorking"
                        checked={exp.currentlyWorking}
                        onChange={(e) => handleExperienceChange(index, e)}
                        className={`h-4 w-4 rounded border-gray-300 text-[${accentColor}] focus:ring-[${accentColor}]`}
                      />
                      Currently Working Here
                    </label>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddExperience}
                  className={`flex items-center font-semibold text-[${accentColor}] hover:text-[${accentColorHover}] transition duration-200 mt-4 text-sm`}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Another Job Role
                </button>
              </div>
            )}
          </section>

          {/* 5. File Uploads (Photo & Resume) */}
          <section className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <SectionHeader
              icon={Upload}
              title="Documents & Photo"
              description="Upload your professional photo and most recent resume."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <ImageIcon className="w-4 h-4 mr-1 text-gray-500" /> Profile
                  Photo (Image: JPG, PNG)
                </label>
                <input
                  type="file"
                  name="profilphoto"
                  onChange={handleMainFormChange}
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-[${accentColor}] hover:file:bg-gray-200 cursor-pointer"
                />
                {photoPreviewUrl ? (
                  <div className="mt-4 flex items-center space-x-4">
                    <img
                      src={photoPreviewUrl || "/placeholder.svg"}
                      alt="Profile Preview"
                      className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-lg"
                    />
                    <p className="text-xs text-gray-500">Photo selected.</p>
                  </div>
                ) : (
                  <div className="mt-4 text-sm text-gray-500 p-3 border border-dashed rounded-lg flex items-center justify-center h-20 bg-gray-50">
                    No photo selected.
                  </div>
                )}
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-1 text-gray-500" /> Resume /
                  CV (.pdf, .doc, .docx)
                </label>
                <input
                  type="file"
                  name="resume"
                  onChange={handleMainFormChange}
                  accept=".pdf,.doc,.docx"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-[${accentColor}] hover:file:bg-gray-200 cursor-pointer"
                />
                {formData.resume ? (
                  <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between shadow-sm">
                    <span className="text-sm font-medium text-gray-800 truncate max-w-[60%] flex items-center">
                      <FileText
                        className={`w-5 h-5 mr-2 text-[${accentColor}]`}
                      />
                      {formData.resume.name}
                    </span>
                    <a
                      href={resumePreviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs px-3 py-1 rounded-full border border-[${accentColor}] text-[${accentColor}] hover:bg-[${accentColor}] hover:text-white transition duration-200 flex-shrink-0`}
                      title="Open Resume in new tab"
                    >
                      Preview
                    </a>
                  </div>
                ) : (
                  <div className="mt-4 text-sm text-gray-500 p-3 border border-dashed rounded-lg flex items-center justify-center h-20 bg-gray-50">
                    No resume file selected.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Submission Button */}
          <button
            type="submit"
            className={`w-full bg-[${accentColor}] hover:bg-[${accentColorHover}] text-white font-bold text-lg tracking-wide px-4 py-4 rounded-xl transition duration-300 shadow-lg shadow-[${accentColor}]/50 hover:shadow-xl`}
          >
            Save and Complete Profile
          </button>
        </form>
      </div>

      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
    </div>
  );
};

export default Register;