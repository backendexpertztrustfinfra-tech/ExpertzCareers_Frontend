"use client";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Badge } from "../Components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../Components/ui/avatar";
import { Progress } from "../Components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../Components/ui/tabs";

// ✅ Icons from lucide-react
import {
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  Star,
  TrendingUp,
  Award,
  Target,
  Brain,
  Zap,
  Users,
  Eye,
  Video,
  Upload,
  Edit3,
  CheckCircle,
  Trophy,
  Rocket,
  Camera,
  Play,
  Download,
  ExternalLink,
  ChevronRight,
  BarChart3,
  DollarSign,
  GraduationCap,
  Lightbulb,
  FileText,
  Bot,
  Flame,
  Crown,
  Compass,
  Bell,
  X,
  Heart,
} from "lucide-react";
// import generateResumeHtml from "../Components/UserProfile/generateResume";
// import ResumePreview from "./ResumePreview"
import generateResume from "../utils/generateResume";
// import ShareMenu from "../Components/UserProfile/ShareMenu";
import { BASE_URL } from "../config";

// ✅ ----------------- Reusable Component for Editable Fields -----------------
const EditableField = ({
  field,
  value,
  isEditing,
  tempValue,
  onEdit,
  onSave,
  onCancel,
  onTempChange,
  className = "",
  multiline = false,
}) => {
  if (isEditing) {
    return (
      <div className="space-y-2">
        {multiline ? (
          <textarea
            value={tempValue}
            onChange={(e) => onTempChange(e.target.value)}
            className={`w-full p-3 border border-[#caa057] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#fff1ed] ${className}`}
            rows={multiline === true ? 3 : multiline}
          />
        ) : (
          <input
            value={tempValue}
            onChange={(e) => onTempChange(e.target.value)}
            className={`bg-transparent border-b-2 border-[#caa057] outline-none ${className}`}
          />
        )}
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={onSave}
            className="bg-[#caa057] hover:bg-[#b4924c]"
          >
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
            className="border-[#caa057] text-[#caa057] hover:bg-[#fff1ed] bg-transparent"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <span
      className={`cursor-pointer hover:text-[#caa057] transition-colors ${
        !value ? "text-gray-400" : "text-gray-900"
      } ${className}`}
      onClick={() => onEdit(field, value)}
    >
      {value || `Enter your ${field}`}
    </span>
  );
};

// ✅ ----------------- Reusable Component for Stat Cards -----------------
const StatCard = ({ label, value, icon: Icon, color, bg, trend }) => (
  <div
    className={`text-center p-4 ${bg} rounded-xl hover:scale-105 transition-transform duration-300 border border-[#fff1ed]`}
  >
    <Icon className={`w-8 h-8 mx-auto mb-2 ${color}`} />
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
    {trend && <div className="text-xs text-green-600 mt-1">{trend}</div>}
  </div>
);

// ✅ ----------------- Main Profile Page Component -----------------
const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    location: "",
    phone: "",
    email: "",
    experience: "",
    // availability: "",
    image: "",
    designation: "",
    bio: "",
    profileViews: 0,
    profileStrength: 0,
    responseRate: 0,
    videoIntro: null,
    summary: "",
    currentSalary: "",
    expectedSalary: "",
    preferredLocation: "",
    Skills: "",
    projects: "",
    qualification: "",
    certificationlink: "",
    previousCompany: "",
    portfioliolink: "",
    resume: "",
    recruterPhone: "",
    recruterCompany: "",
    recruterCompanyType: "",
    recruterGstIn: "",
    recruterCompanyAddress: "",
    recruterIndustry: "",
  });

  const nevigate = useNavigate();
  const goToServices = () => {
    nevigate("/services");
  };

  const [jobStats, setJobStats] = useState({
    applied: 0,
    saved: 0,
    // interviews: 0,
  });

  const fetchJobStats = async () => {
    const token = Cookies.get("userToken");
    if (!token) return;

    try {
      // Fetch applied jobs
      const appliedRes = await fetch(`${BASE_URL}/jobseeker/appliedjobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const appliedData = appliedRes.ok
        ? await appliedRes.json()
        : { appliedJobs: [] };

      // Fetch saved jobs
      const savedRes = await fetch(`${BASE_URL}/jobseeker/getsavedJobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const savedData = savedRes.ok ? await savedRes.json() : { savedJobs: [] };

      // Update counts
      setJobStats({
        applied: appliedData.appliedJobs?.length || 0,
        saved: savedData.savedJobs?.length || 0,
        // interviews: 0,
      });
    } catch (err) {
      console.error("fetchJobStats error:", err);
      setJobStats({ applied: 0, saved: 0 });
    }
  };

  useEffect(() => {
    fetchJobStats();

    // Add event listeners to update job stats
    const updateStatsHandler = () => {
      fetchJobStats();
    };

    window.addEventListener("savedJobsUpdated", updateStatsHandler);
    window.addEventListener("appliedJobsUpdated", updateStatsHandler);

    return () => {
      window.removeEventListener("savedJobsUpdated", updateStatsHandler);
      window.removeEventListener("appliedJobsUpdated", updateStatsHandler);
    };
  }, []);

  const [SkillAssessments, setSkillAssessments] = useState([]);
  const [editingField, setEditingField] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // New state variables for on-page input fields
  const [newSkillName, setNewSkillName] = useState("");
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newPortfolioLink, setNewPortfolioLink] = useState("");
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
  const [newCertLink, setNewCertLink] = useState("");
  const [isAddingCert, setIsAddingCert] = useState(false);

  // ----------------- SKILLS HELPERS & HANDLERS ----------------- //
  function parseSkillsStringToAssessments(SkillString) {
    if (!SkillString) return [];
    return SkillString.split(",").map((s) => ({
      Skill: s.trim(),
      level: 60,
      verified: false,
      trending: false,
      endorsements: 0,
    }));
  }

  function assessmentsToSkillString(assessments) {
    return assessments
      .map((a) => a.Skill.trim())
      .filter(Boolean)
      .join(", ");
  }

  function syncProfileSkillsFromAssessments(assessments) {
    const SkillString = assessmentsToSkillString(assessments);
    setProfile((prev) => ({ ...prev, Skills: SkillString }));
  }

  async function saveSkillsToBackend(assessments) {
    try {
      const token = Cookies.get("userToken");
      if (!token) throw new Error("No auth token");
      const formData = new FormData();
      formData.append("Skill", assessmentsToSkillString(assessments));
      const res = await fetch(
        "https://expertzcareers-backend.onrender.com/jobseeker/updateProfile",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save Skills");
      if (data.user && data.user.Skill) {
        setProfile((prev) => ({ ...prev, Skills: data.user.Skill }));
        setSkillAssessments(parseSkillsStringToAssessments(data.user.Skill));
      } else {
        syncProfileSkillsFromAssessments(assessments);
      }
      return data;
    } catch (err) {
      console.error("saveSkillsToBackend error:", err);
      throw err;
    }
  }

  // UPDATED: Use on-page input instead of prompt
  const handleAddSkill = async () => {
    if (!newSkillName) {
      setModalMessage("Skill name cannot be empty.");
      setShowModal(true);
      return;
    }
    const newSkill = {
      Skill: newSkillName.trim(),
      level: 60,
      verified: false,
      trending: false,
      endorsements: 0,
    };
    const next = [...SkillAssessments, newSkill];
    setSkillAssessments(next);
    syncProfileSkillsFromAssessments(next);
    try {
      await saveSkillsToBackend(next);
      setModalMessage("Skill added and saved!");
      setShowModal(true);
      setNewSkillName(""); // Clear the input field
      setIsAddingSkill(false); // Hide the input
    } catch {
      setModalMessage("Failed to save new Skill.");
      setShowModal(true);
    }
  };

  // UPDATED: Uses the new on-page EditableField component
  const handleEditSkill = async (index) => {
    const current = SkillAssessments[index];
    if (!current) return;
    const next = SkillAssessments.map((s, i) =>
      i === index ? { ...s, Skill: tempValue.trim() } : s
    );
    setSkillAssessments(next);
    syncProfileSkillsFromAssessments(next);
    try {
      await saveSkillsToBackend(next);
      setModalMessage("Skill updated!");
      setShowModal(true);
      setEditingField("");
      setTempValue("");
    } catch {
      setModalMessage("Failed to update Skill.");
      setShowModal(true);
    }
  };

  // UPDATED: Uses on-page confirm logic (can be a simple modal later)
  const handleRemoveSkill = async (index) => {
    if (!window.confirm("Are you sure you want to remove this skill?")) {
      return;
    }
    const next = SkillAssessments.filter((_, i) => i !== index);
    setSkillAssessments(next);
    syncProfileSkillsFromAssessments(next);
    try {
      await saveSkillsToBackend(next);
      setModalMessage("Skill removed and saved!");
      setShowModal(true);
    } catch {
      setModalMessage("Failed to remove Skill.");
      setShowModal(true);
    }
  };

  useEffect(() => {
    syncProfileSkillsFromAssessments(SkillAssessments);
  }, [SkillAssessments]);

  // ✅ ----------------- API and Data Handling ----------------- //
  const uiToBackendMap = {
    name: "username",
    email: "useremail",
    phone: "phonenumber",
    designation: "designation",
    location: "location",
    image: "profilphoto",
    videoIntro: "introvideo",
    experience: "yearsofExperience",
    currentSalary: "previousSalary",
    expectedSalary: "salaryExpectation",
    previousCompany: "previousCompany",
    Skills: "Skill",
    qualification: "qualification",
    certificationlink: "certificationlink",
    projects: "projectlink",
    portfioliolink: "portfioliolink",
    resume: "resume",
    preferredLocation: "preferredLocation",
    // availability: "availability",
    bio: "bio",
    recruterPhone: "recruterPhone",
    recruterCompany: "recruterCompany",
    recruterCompanyType: "recruterCompanyType",
    recruterGstIn: "recruterGstIn",
    recruterCompanyAddress: "recruterCompanyAddress",
    recruterIndustry: "recruterIndustry",
  };

  function buildBackendPayload(p) {
    const payload = {};
    for (const [uiKey, beKey] of Object.entries(uiToBackendMap)) {
      const val = p?.[uiKey];
      if (val !== undefined && val !== null && val !== "") {
        payload[beKey] = val;
      }
    }
    return payload;
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("userToken");
        if (!token) {
          console.error("No token found in cookies");
          return;
        }

        const response = await fetch(
          "https://expertzcareers-backend.onrender.com/jobseeker/getjobseekerprofile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch profile");
        }

        const u = data?.user || {};
        setProfile((prev) => ({
          ...prev,
          name: u.username || "",
          email: u.useremail || "",
          phone: u.phonenumber || "",
          designation: u.designation || "",
          location: u.location || "",
          image: u.profilphoto || "",
          videoIntro: u.introvideo || null,
          experience: u.yearsofExperience || "",
          currentSalary: u.previousSalary || "",
          expectedSalary: u.salaryExpectation || "",
          previousCompany: u.previousCompany || "",
          Skills: u.Skill || "",
          qualification: u.qualification || "",
          certificationlink: u.certificationlink || "",
          projects: u.projectlink || "",
          portfioliolink: u.portfioliolink || "",
          resume: u.resume || "",
          preferredLocation: u.preferredLocation || "",
          // availability: u.availability || "",
          bio: u.bio || "",
          recruterPhone: u.recruterPhone || "",
          recruterCompany: u.recruterCompany || "",
          recruterCompanyType: u.recruterCompanyType || "",
          recruterGstIn: u.recruterGstIn || "",
          recruterCompanyAddress: u.recruterCompanyAddress || "",
          recruterIndustry: u.recruterIndustry || "",
        }));

        setSkillAssessments(parseSkillsStringToAssessments(u.Skill));
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = (field, value) => {
    setEditingField(field);
    setTempValue(value || "");
  };

  const handleSave = async () => {
    const updatedBackendPayload = buildBackendPayload(profile);
    const fieldToUpdate = uiToBackendMap[editingField];

    if (fieldToUpdate) {
      updatedBackendPayload[fieldToUpdate] = tempValue;
    } else {
      console.warn(
        `Attempted to save an unmapped UI field: ${editingField}. Data might not persist.`
      );
    }

    try {
      const token = Cookies.get("userToken");
      const formData = new FormData();
      Object.entries(updatedBackendPayload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      const response = await fetch(
        "https://expertzcareers-backend.onrender.com/jobseeker/updateProfile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to update profile");

      setProfile((prevProfile) => ({
        ...prevProfile,
        [editingField]: tempValue,
      }));

      setModalMessage("Profile updated successfully!");
      setShowModal(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      setModalMessage("Failed to update profile");
      setShowModal(true);
    }

    setEditingField("");
    setTempValue("");
  };

  const handleCancel = () => {
    setEditingField("");
    setTempValue("");
  };

  const handleSaveAll = async () => {
    try {
      const token = Cookies.get("userToken");
      if (!token) {
        console.error("No token found in cookies");
        setModalMessage("Authentication error: token missing.");
        setShowModal(true);
        return;
      }

      const payload = buildBackendPayload(profile);
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      const response = await fetch(
        "https://expertzcareers-backend.onrender.com/jobseeker/updateProfile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      if (data.user) {
        const u = data.user;
        setProfile((prev) => ({
          ...prev,
          name: u.username || "",
          email: u.useremail || "",
          phone: u.phonenumber || "",
          designation: u.designation || "",
          location: u.location || "",
          experience: u.yearsofExperience || "",
          // availability: u.availability || "",
          bio: u.bio || "",
          profileStrength: u.profileStrength || 0,
          responseRate: u.responseRate || 0,
          currentSalary: u.previousSalary || "",
          expectedSalary: u.salaryExpectation || "",
          preferredLocation: u.preferredLocation || "",
          Skills: u.Skill || "",
          projects: u.projectlink || "",
          qualification: u.qualification || "",
          certificationlink: u.certificationlink || "",
          image: u.profilphoto || "",
          videoIntro: u.introvideo || null,
          summary: u.qualification || "",
          previousCompany: u.previousCompany || "",
          portfioliolink: u.portfioliolink || "",
          resume: u.resume || "",
          recruterPhone: u.recruterPhone || "",
          recruterCompany: u.recruterCompany || "",
          recruterCompanyType: u.recruterCompanyType || "",
          recruterGstIn: u.recruterGstIn || "",
          recruterCompanyAddress: u.recruterCompanyAddress || "",
          recruterIndustry: u.recruterIndustry || "",
        }));

        setSkillAssessments(parseSkillsStringToAssessments(u.Skill));
      }

      setModalMessage("All changes saved to backend successfully!");
      setShowModal(true);
    } catch (err) {
      console.error("Error saving all changes:", err);
      setModalMessage(err.message || "Failed to save changes to backend.");
      setShowModal(true);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>
        setProfile((prev) => ({ ...prev, image: reader.result }));
    }
  };

  // UPDATED: Function to upload video to backend
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({
        ...prev,
        videoIntro: URL.createObjectURL(file),
      }));
      // TODO: Implement API call to upload video and save video URL to backend 'videoIntro' field
    }
  };

  // ✅ UPDATED: Function to delete video from backend
  const handleVideoDelete = async () => {
    try {
      const token = Cookies.get("userToken");
      if (!token) throw new Error("No auth token");

      const formData = new FormData();
      formData.append("introvideo", "");

      const response = await fetch(
        "https://expertzcareers-backend.onrender.com/jobseeker/updateProfile",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete video.");
      }

      // Update local state to reflect the deletion
      setProfile((prev) => ({
        ...prev,
        videoIntro: null,
      }));

      setModalMessage("Intro video deleted successfully!");
      setShowModal(true);
    } catch (err) {
      console.error("Video deletion error:", err);
      setModalMessage(err.message || "Failed to delete video.");
      setShowModal(true);
    }
  };

  // UPDATED: No longer uses
  const handleCertificateSave = async () => {
    if (!newCertLink) {
      setModalMessage("Certification link cannot be empty.");
      setShowModal(true);
      return;
    }

    try {
      const token = Cookies.get("userToken");
      if (!token) throw new Error("No auth token");

      const formData = new FormData();
      formData.append("certificationlink", newCertLink);

      const res = await fetch(
        "https://expertzcareers-backend.onrender.com/jobseeker/updateProfile",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to save certificate link");

      setProfile((prev) => ({
        ...prev,
        certificationlink: data.user?.certificationlink || newCertLink,
      }));
      setModalMessage("Certificate link saved!");
      setShowModal(true);
      setNewCertLink("");
      setIsAddingCert(false);
    } catch (err) {
      console.error("Certificate save error:", err);
      setModalMessage("Failed to save certificate link");
      setShowModal(true);
    }
  };

  // const handleGenerateAndDownloadResume = () => {
  //   const resumeContent = generateResumeHtml(profile);
  //   const blob = new Blob([resumeContent], { type: "text/html" });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = `${profile.name || "Resume"}_CV.html`;
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   URL.revokeObjectURL(url);

  //   setModalMessage("Your resume has been generated and downloaded!");
  //   setShowModal(true);
  // };

  // const handlePreviewResume = () => {
  //   if (!profile.name && !profile.email) {
  //     setModalMessage(
  //       "Please fill in at least your name and email before previewing the resume."
  //     );
  //     setShowModal(true);
  //     return;
  //   }
  //   setShowPreview(true);
  // };

  const handleDownloadResume = () => {
    if (!profile.name && !profile.email) {
      setModalMessage(
        "Please fill in at least your name and email before generating the resume."
      );
      setShowModal(true);
      return;
    }
    generateResume(profile);
    setModalMessage("Your resume has been generated and downloaded!");
    setShowModal(true);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const token = Cookies.get("userToken");
      if (!token) throw new Error("No auth token");

      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch(
        "https://expertzcareers-backend.onrender.com/jobseeker/updateProfile",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload resume");

      setProfile((prev) => ({ ...prev, resume: data.user?.resume || "" }));
      setModalMessage("Resume uploaded successfully!");
      setShowModal(true);
    } catch (err) {
      console.error("Resume upload error:", err);
      setModalMessage("Failed to upload resume");
      setShowModal(true);
    }
  };

  // UPDATED: No longer uses window.prompt
  const handlePortfolioSave = async () => {
    if (!newPortfolioLink) {
      setModalMessage("Portfolio link cannot be empty.");
      setShowModal(true);
      return;
    }

    try {
      const token = Cookies.get("userToken");
      if (!token) throw new Error("No auth token");

      const formData = new FormData();
      formData.append("portfioliolink", newPortfolioLink);

      const res = await fetch(
        "https://expertzcareers-backend.onrender.com/jobseeker/updateProfile",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to save portfolio link");

      setProfile((prev) => ({
        ...prev,
        portfioliolink: data.user?.portfioliolink || newPortfolioLink,
      }));
      setModalMessage("Portfolio link saved!");
      setShowModal(true);
      setNewPortfolioLink("");
      setIsAddingPortfolio(false);
    } catch (err) {
      console.error("Portfolio save error:", err);
      setModalMessage("Failed to save portfolio link");
      setShowModal(true);
    }
  };

  // ✅ ----------------- Data for UI rendering -----------------
  const contactInfo = [
    {
      key: "location",
      icon: MapPin,
      value: profile.location,
      color: "text-[#caa057]",
    },
    {
      key: "phone",
      icon: Phone,
      value: profile.phone,
      color: "text-[#caa057]",
    },
    {
      key: "email",
      icon: Mail,
      value: profile.email,
      color: "text-[#caa057]",
    },
    {
      key: "experience",
      icon: Briefcase,
      value: profile.experience,
      color: "text-[#caa057]",
    },
    // {
    //   key: "availability",
    //   icon: Calendar,
    //   value: profile.availability,
    //   color: "text-orange-500",
    // },
  ];

  const jobStatsData = [
    {
      label: "Applied",
      value: jobStats.applied,
      icon: Rocket,
      color: "text-[#caa057]",
      bg: "bg-[#fff1ed]",
    },
    // {
    //  label: "Interviews",
    //  value: jobStats.interviews,
    //  icon: Users,
    //  color: "text-yellow-500",
    //  bg: "bg-yellow-100",
    // },
    {
      label: "Saved",
      value: jobStats.saved,
      icon: Heart,
      color: "text-red-500",
      bg: "bg-[#fff1ed]",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff1ed] via-[#fff1ed] to-[#fff1ed]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <Card className="overflow-hidden bg-gradient-to-br from-white via-[#fff1ed] to-[#fff1ed] border-2 border-[#fff1ed] shadow-2xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#caa057]/5 via-transparent to-[#caa057]/5"></div>
          <CardContent className="relative p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:gap-8">
              {/* Avatar and Video Intro Section */}
              <div className="relative group text-center md:text-left mb-6 md:mb-0">
                <div className="relative inline-block">
                  <Avatar className="w-32 h-32 sm:w-36 sm:h-36 border-4 border-gradient-to-br from-[#caa057] to-[#caa057] shadow-2xl ring-4 ring-[#fff1ed]">
                    <AvatarImage
                      src={profile.image || "/placeholder.svg"}
                      alt={profile.name}
                    />
                    <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-[#caa057] to-[#caa057] text-white">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#caa057] to-[#caa057] rounded-full flex items-center justify-center shadow-lg">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="mt-4">
                  {profile.videoIntro ? (
                    <div className="relative">
                      <video
                        src={profile.videoIntro}
                        className="w-full max-w-xs mx-auto h-24 rounded-xl object-cover border-2 border-[#caa057] shadow-lg"
                        controls
                      />
                      <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-[#caa057] to-[#caa057] text-white">
                        <Video className="w-3 h-3 mr-1" />
                        Intro
                      </Badge>

                      {/* ❌ Delete Button */}
                      <button
                        onClick={handleVideoDelete}
                        className="absolute bottom-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded-md shadow hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div className="relative group w-full max-w-xs mx-auto">
                      <div className="w-full h-24 bg-gradient-to-br from-[#fff1ed] to-[#fff1ed] rounded-xl border-2 border-dashed border-[#caa057] flex items-center justify-center cursor-pointer hover:from-[#fff1ed] hover:to-[#fff1ed] transition-all duration-300 group-hover:scale-105">
                        <div className="text-center">
                          <Video className="w-8 h-8 text-[#caa057] mx-auto mb-2" />
                          <p className="text-xs text-[#caa057] font-medium">
                            Add Video Intro
                          </p>
                          <p className="text-xs text-gray-500">
                            Stand out more!
                          </p>
                        </div>
                      </div>
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleVideoUpload}
                        accept="video/*"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info Section */}
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold flex items-center group">
                    <EditableField
                      field="name"
                      value={profile.name}
                      isEditing={editingField === "name"}
                      tempValue={tempValue}
                      onEdit={handleEdit}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      onTempChange={setTempValue}
                      className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                    />
                    {editingField !== "name" && (
                      <Edit3 className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#caa057]" />
                    )}
                  </h1>

                  <p className="text-base sm:text-xl text-gray-600 mt-1 sm:mt-2">
                    <EditableField
                      field="designation"
                      value={profile.designation}
                      isEditing={editingField === "designation"}
                      tempValue={tempValue}
                      onEdit={handleEdit}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      onTempChange={setTempValue}
                      className="text-base sm:text-xl text-gray-600"
                    />
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contactInfo.map(({ key, icon: Icon, value, color }) => (
                    <div
                      key={key}
                      className="flex items-center space-x-3 p-3 rounded-xl bg-white/60 hover:bg-[#fff1ed] transition-all duration-300 group border border-[#fff1ed] hover:border-[#caa057] hover:shadow-lg"
                    >
                      <Icon className={`w-5 h-5 ${color}`} />
                      <EditableField
                        field={key}
                        value={value}
                        isEditing={editingField === key}
                        tempValue={tempValue}
                        onEdit={handleEdit}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onTempChange={setTempValue}
                        className="flex-1 group-hover:text-[#caa057] transition-colors text-sm sm:text-base font-medium"
                      />
                    </div>
                  ))}
                </div>

                {/* Stats Grid */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                  <div className="text-center p-6 bg-gradient-to-br from-[#fff1ed] to-[#fff1ed] rounded-xl border border-[#fff1ed] hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl sm:text-3xl font-bold text-[#caa057]">
                      {profile.profileStrength}%
                    </div>
                    <div className="text-xs sm:text-sm text-[#caa057] font-medium">
                      Profile Strength
                    </div>
                    <Progress
                      value={profile.profileStrength}
                      className="mt-3 h-2"
                    />
                    <div className="flex items-center justify-center mt-2">
                      <Flame className="w-4 h-4 text-[#caa057] mr-1" />
                      <span className="text-xs text-[#caa057]">
                        Hot Profile!
                      </span>
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-[#fff1ed] to-[#fff1ed] rounded-xl border border-[#fff1ed] hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl sm:text-3xl font-bold text-[#caa057]">
                      {profile.responseRate}%
                    </div>
                    <div className="text-xs sm:text-sm text-[#caa057] font-medium">
                      Response Rate
                    </div>
                    <div className="flex items-center justify-center mt-2">
                      <Zap className="w-4 h-4 text-[#caa057] mr-1" />
                      <span className="text-xs text-[#caa057]">
                        Lightning Fast!
                      </span>
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-[#fff1ed] to-[#fff1ed] rounded-xl border border-[#fff1ed] hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl sm:text-3xl font-bold text-[#caa057]">
                      {jobStats.searchAppearances}
                    </div>
                    <div className="text-xs sm:text-sm text-[#caa057] font-medium">
                      Search Appearances
                    </div>
                    <div className="flex items-center justify-center mt-2">
                      <TrendingUp className="w-4 h-4 text-[#caa057] mr-1" />
                      <span className="text-xs text-[#caa057]">
                        Trending Up!
                      </span>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-14 sm:h-16 bg-white/80 backdrop-blur-sm border border-[#fff1ed] rounded-xl">
            {[
              {
                value: "overview",
                icon: Eye,
                label: "Overview",
              },
              {
                value: "Skills",
                icon: Brain,
                label: "Skills",
              },
              {
                value: "experience",
                icon: Briefcase,
                label: "Experience",
              },
              {
                value: "portfolio",
                icon: Trophy,
                label: "Portfolio",
              },
            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="text-sm sm:text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#caa057] data-[state=active]:to-[#caa057] data-[state=active]:text-white"
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Job Activity Dashboard */}
    <div className="lg:col-span-2">
      <Card className="border-[#fff1ed] h-full bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center text-lg sm:text-2xl">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#caa057]" />
            Job Activity Dashboard
          </CardTitle>
          <CardDescription>
            Your job search performance at a glance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {jobStatsData.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Career Recommendations (Side Card) */}
    <div className="lg:col-span-1">
      <Card className="bg-gradient-to-br from-[#fff1ed]/70 to-[#fff1ed]/30 border border-[#fff1ed] flex flex-col justify-center h-full shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Bot className="w-5 h-5 mr-2 text-[#caa057]" />
            Career Recommendations
          </CardTitle>
          <CardDescription>
            AI-powered recommendations to boost your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Example Recommendations List */}
            {/* Uncomment this if you want to show AI recommendations */}
            {/* {aiRecommendations.slice(0, 2).map((rec, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white/70 rounded-lg border border-[#fff1ed] hover:bg-[#fff1ed]/90 transition-colors duration-300"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      rec.priority === "high"
                        ? "bg-red-500"
                        : rec.priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  ></div>
                  <span className="font-medium text-sm">{rec.title}</span>
                </div>
                <Badge
                  variant="secondary"
                  className="text-xs bg-[#caa057]/20 text-[#caa057]"
                >
                  {rec.match}% match
                </Badge>
              </div>
            ))} */}

            {/* Button to view all recommendations */}
            <Button
              onClick={goToServices}
              size="sm"
              variant="outline"
              className="w-full border-[#caa057] text-[#caa057] hover:bg-[#fff1ed] transition-colors duration-300 bg-transparent"
            >
              <Compass className="w-4 h-4 mr-2" />
              View All Recommendations
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</TabsContent>


          <TabsContent value="Skills" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {SkillAssessments.map((skill, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow border-[#fff1ed]"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      {editingField === `skill-${index}` ? (
                        <div className="flex-grow">
                          <EditableField
                            field={`skill-${index}`}
                            value={skill.Skill}
                            isEditing={true}
                            tempValue={tempValue}
                            onEdit={handleEdit}
                            onSave={() => handleEditSkill(index)}
                            onCancel={handleCancel}
                            onTempChange={setTempValue}
                            className="w-full text-lg"
                          />
                        </div>
                      ) : (
                        <CardTitle className="text-lg">{skill.Skill}</CardTitle>
                      )}
                      <div className="flex items-center space-x-2">
                        {skill.verified && (
                          <Badge
                            variant="secondary"
                            className="bg-[#fff1ed] text-[#caa057]"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {skill.trending && (
                          <Badge className="bg-gradient-to-r from-[#caa057] to-[#caa057] text-white">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}

                        {editingField !== `skill-${index}` && (
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(`skill-${index}`, skill.Skill)
                            }
                            className="p-1 rounded-md hover:bg-[#fff1ed]"
                            title="Edit Skill"
                          >
                            <Edit3 className="w-4 h-4 text-[#caa057]" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="p-1 rounded-md hover:bg-red-50"
                          title="Remove Skill"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <Card className="border-2 border-dashed border-[#caa057] hover:border-[#caa057] transition-colors">
              <CardContent className="p-8 text-center">
                {isAddingSkill ? (
                  <div className="flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-2">
                      Enter new Skill name
                    </h3>
                    <input
                      type="text"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      placeholder="e.g., React, Node.js"
                      className="w-full max-w-sm p-2 border rounded-md mb-4 text-gray-900"
                    />
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleAddSkill}
                        className="bg-gradient-to-r from-[#caa057] to-[#caa057] hover:from-[#b4924c] hover:to-[#b4924c] text-white shadow-lg"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Save Skill
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsAddingSkill(false);
                          setNewSkillName("");
                        }}
                        className="border-[#caa057] text-[#caa057] hover:bg-[#fff1ed]"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Target className="w-12 h-12 text-[#caa057] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Add New Skill
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Showcase more of your expertise
                    </p>
                    <Button
                      onClick={() => setIsAddingSkill(true)}
                      className="bg-gradient-to-r from-[#caa057] to-[#caa057] hover:from-[#b4924c] hover:to-[#b4924c] text-white shadow-lg"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            {[
              {
                key: "currentSalary",
                title: "Current Salary",
                icon: DollarSign,
                description: "Your current compensation level",
              },
              {
                key: "expectedSalary",
                title: "Expected Salary",
                icon: TrendingUp,
                description: "Your compensation expectations for new roles",
              },
              {
                key: "previousCompany",
                title: "Previous Company",
                icon: Briefcase,
                description: "Your last company worked for",
              },
            ].map((field) => (
              <Card key={field.key} className="border-[#fff1ed]">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <field.icon className="w-5 h-5 mr-2 text-[#caa057]" />
                    {field.title}
                  </CardTitle>
                  <CardDescription>{field.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {editingField === field.key ? (
                    <EditableField
                      field={field.key}
                      value={profile[field.key]}
                      isEditing={true}
                      tempValue={tempValue}
                      onEdit={handleEdit}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      onTempChange={setTempValue}
                      multiline={field.key === "summary" ? 6 : 3}
                    />
                  ) : profile[field.key] ? (
                    <div className="space-y-4">
                      <p className="whitespace-pre-line text-sm sm:text-base">
                        {profile[field.key]}
                      </p>
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleEdit(field.key, profile[field.key])
                        }
                        className="border-[#caa057] text-[#caa057] hover:bg-[#fff1ed]"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <field.icon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Add Your {field.title}
                      </h3>
                      <p className="text-gray-500 mb-6">{field.description}</p>
                      <Button
                        onClick={() => handleEdit(field.key, "")}
                        className="bg-gradient-to-r from-[#caa057] to-[#caa057] hover:from-[#b4924c] hover:to-[#b4924c] text-white shadow-lg"
                      >
                        <ChevronRight className="w-4 h-4 mr-2" />
                        Get Started
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Card className="bg-gradient-to-br from-[#fff1ed] to-[#fff1ed] border-2 border-[#fff1ed]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-[#caa057]" />
                  Resume & Documents
                </CardTitle>
                <CardDescription>
                  Upload your resume and other important documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Resume Upload and Preview Section */}
                  <div className="text-center p-8 border-2 border-dashed border-[#caa057] rounded-lg hover:border-[#caa057] transition-colors">
                    <Upload className="w-12 h-12 text-[#caa057] mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Upload Resume</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      PDF, DOC, or DOCX (Max 5MB)
                    </p>

                    <input
                      id="resumeInput"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                    />

                    <div className="flex flex-col items-center space-y-4">
                      {/* Choose File Button */}
                      <Button
                        className="bg-gradient-to-r from-[#caa057] to-[#caa057] hover:from-[#b4924c] hover:to-[#b4924c] text-white shadow-lg w-full max-w-xs"
                        onClick={() =>
                          document.getElementById("resumeInput").click()
                        }
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </Button>

                      {/* Corrected: Persistent Preview Link that bypasses the router */}
                      {profile.resume && (
                        <a
                          href={profile.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full max-w-xs"
                        >
                          <div className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 w-full border-[#caa057] text-[#caa057] hover:bg-[#fff1ed] bg-transparent">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview Resume
                          </div>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* UPDATED: Portfolio Links */}
                  <div className="text-center p-8 border-2 border-dashed border-[#caa057] rounded-lg hover:border-[#caa057] transition-colors cursor-pointer">
                    {isAddingPortfolio ? (
                      <div className="flex flex-col items-center">
                        <h3 className="font-semibold mb-2">
                          Add Portfolio Link
                        </h3>
                        <input
                          type="text"
                          value={newPortfolioLink}
                          onChange={(e) => setNewPortfolioLink(e.target.value)}
                          placeholder="e.g., https://github.com/my-portfolio"
                          className="w-full max-w-sm p-2 border rounded-md mb-4 text-gray-900"
                        />
                        <div className="flex space-x-2">
                          <Button
                            onClick={handlePortfolioSave}
                            className="bg-gradient-to-r from-[#caa057] to-[#caa057] hover:from-[#b4924c] hover:to-[#b4924c] text-white shadow-lg"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Save Link
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsAddingPortfolio(false);
                              setNewPortfolioLink("");
                            }}
                            className="border-[#caa057] text-[#caa057] hover:bg-[#fff1ed]"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Lightbulb className="w-12 h-12 text-[#caa057] mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">Portfolio Links</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          GitHub, Behance, Personal Website
                        </p>
                        {profile.portfioliolink && (
                          <a
                            href={profile.portfioliolink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mb-4 text-[#caa057] hover:underline"
                          >
                            <ExternalLink className="w-4 h-4 inline-block mr-2" />
                            View Portfolio
                          </a>
                        )}
                        <Button
                          variant="secondary"
                          onClick={() => setIsAddingPortfolio(true)}
                          className="bg-gradient-to-r from-[#caa057] to-[#caa057] hover:from-[#b4924c] hover:to-[#b4924c] text-white shadow-lg"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          {profile.portfioliolink ? "Edit Link" : "Add Links"}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Other Sections */}
            {[
              {
                key: "qualification",
                title: "Qualification",
                icon: GraduationCap,
                description: "Your academic background and qualifications",
              },
              {
                key: "certificationlink",
                title: "Certificates & Achievements",
                icon: Award,
                description: "Professional Certificates and achievements",
              },
            ].map((field) => (
              <Card key={field.key} className="border-[#fff1ed]">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <field.icon className="w-5 h-5 mr-2 text-[#caa057]" />
                    {field.title}
                  </CardTitle>
                  <CardDescription>{field.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {field.key === "certificationlink" && isAddingCert ? (
                    <div className="flex flex-col items-center">
                      <h3 className="text-lg font-semibold mb-2">
                        Add Certificate Link
                      </h3>
                      <input
                        type="text"
                        value={newCertLink}
                        onChange={(e) => setNewCertLink(e.target.value)}
                        placeholder="e.g., https://coursera.org/certificate/..."
                        className="w-full max-w-sm p-2 border rounded-md mb-4 text-gray-900"
                      />
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleCertificateSave}
                          className="bg-gradient-to-r from-[#caa057] to-[#caa057] hover:from-[#b4924c] hover:to-[#b4924c] text-white shadow-lg"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Save Link
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsAddingCert(false);
                            setNewCertLink("");
                          }}
                          className="border-[#caa057] text-[#caa057] hover:bg-[#fff1ed]"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : editingField === field.key ? (
                    <EditableField
                      field={field.key}
                      value={profile[field.key]}
                      isEditing={true}
                      tempValue={tempValue}
                      onEdit={handleEdit}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      onTempChange={setTempValue}
                      multiline={6}
                    />
                  ) : profile[field.key] ? (
                    <div className="space-y-4">
                      <p className="whitespace-pre-line text-sm sm:text-base">
                        {profile[field.key]}
                      </p>
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleEdit(field.key, profile[field.key])
                        }
                        className="border-[#caa057] text-[#caa057] hover:bg-[#fff1ed]"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <field.icon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Add Your {field.title}
                      </h3>
                      <p className="text-gray-500 mb-6">{field.description}</p>
                      <Button
                        onClick={() => {
                          if (field.key === "certificationlink") {
                            setIsAddingCert(true);
                          } else {
                            handleEdit(field.key, "");
                          }
                        }}
                        className="bg-gradient-to-r from-[#caa057] to-[#caa057] hover:from-[#b4924c] hover:to-[#b4924c] text-white shadow-lg"
                      >
                        <ChevronRight className="w-4 h-4 mr-2" />
                        Get Started
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-12">
          <Button
            size="lg"
            onClick={handleSaveAll}
            className="px-8 bg-gradient-to-r from-[#caa057] to-[#caa057] hover:from-[#b4924c] hover:to-[#b4924c] text-white shadow-lg"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Save All Changes
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleDownloadResume}
            className="px-8 border-[#caa057] text-[#caa057] hover:bg-[#fff1ed] bg-transparent"
          >
            <Download className="w-5 h-5 mr-2" />
            Generate Resume
          </Button>
          {/* <ShareMenu>
            <Button
              size="lg"
              className="px-8 bg-gradient-to-r from-[#caa057] to-[#caa057] hover:from-[#b4924c] hover:to-[#b4924c] text-white shadow-lg"
            >
              Share Profile
            </Button>
          </ShareMenu> */}
        </div>
      </div>

      {/* Custom Alert Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative border-2 border-[#caa057]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-[#caa057] mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">
                Notification
              </h3>
            </div>
            <p className="text-gray-700 text-center mb-6">{modalMessage}</p>
            <Button
              onClick={() => setShowModal(false)}
              className="w-full bg-[#caa057] hover:bg-[#b4924c] text-white"
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
