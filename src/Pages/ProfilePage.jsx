"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

// ✅ UI Components (tumne already JSX me convert kiye hain)
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Components/ui/tabs";

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
  Heart,
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
} from "lucide-react";

// ✅ Custom Components
import generateResumeHtml from "../Components/UserProfile/generateResume";
import ShareMenu from "../Components/UserProfile/ShareMenu";



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
            className={`w-full p-3 border border-orange-300/50 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-200/20 ${className}`}
            rows={multiline === true ? 3 : multiline}
          />
        ) : (
          <input
            value={tempValue}
            onChange={(e) => onTempChange(e.target.value)}
            className={`bg-transparent border-b-2 border-orange-500 outline-none ${className}`}
          />
        )}
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={onSave}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
            className="border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <span
      className={`cursor-pointer hover:text-orange-600 transition-colors ${className}`}
      onClick={() => onEdit(field, value)}
    >
      {value || "Click to add..."}
    </span>
  );
};

const StatCard = ({ label, value, icon: Icon, color, bg, trend }) => (
  <div
    className={`text-center p-4 ${bg} rounded-xl hover:scale-105 transition-transform duration-300 border border-orange-100/50 yellow:border-orange-800/50`}
  >
    <Icon className={`w-8 h-8 mx-auto mb-2 ${color}`} />
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm text-gray-600 yellow:text-gray-400">{label}</div>
    {trend && <div className="text-xs text-green-600 mt-1">{trend}</div>}
  </div>
);

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    location: "",
    phone: "",
    email: "",
    experience: "",
    availability: "",
    image: "",
    headline: "",
    bio: "",
    profileViews: 0,
    profileStrength: 0,
    responseRate: 0,
    videoIntro: null,
    summary: "",
    currentSalary: "", // Mapped to previousSalary
    expectedSalary: "", // Mapped to salaryExpectation
    preferredLocation: "",
    Skills: "", // Mapped to Skills (string)
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

  const [aiRecommendations, setAiRecommendations] = useState([
    { type: "Skill", title: "Learn TypeScript", priority: "high", match: 95 },
    {
      type: "job",
      title: "Senior React Developer at TechCorp",
      priority: "medium",
      match: 88,
    },
    {
      type: "course",
      title: "Advanced Node.js Patterns",
      priority: "low",
      match: 76,
    },
  ]);

  const [jobStats, setJobStats] = useState({
    applied: 23,
    pending: 8,
    saved: 45,
    rejected: 3,
    interviews: 12,
    offers: 2,
    profileViews: 1247,
    searchAppearances: 3421,
  });

  const [SkillAssessments, setSkillAssessments] = useState([]);

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

  const handleAddSkill = async () => {
    const name = window.prompt("Enter new Skill name:");
    if (!name) return;
    const newSkill = {
      Skill: name.trim(),
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
    } catch {
      setModalMessage("Failed to save new Skill.");
      setShowModal(true);
    }
  };

  const handleEditSkill = async (index) => {
    const current = SkillAssessments[index];
    if (!current) return;
    const name = window.prompt("Edit Skill name:", current.Skill);
    if (name === null) return;
    const next = SkillAssessments.map((s, i) =>
      i === index ? { ...s, Skill: name.trim() } : s
    );
    setSkillAssessments(next);
    syncProfileSkillsFromAssessments(next);
    try {
      await saveSkillsToBackend(next);
      setModalMessage("Skill updated!");
      setShowModal(true);
    } catch {
      setModalMessage("Failed to update Skill.");
      setShowModal(true);
    }
  };

  const handleRemoveSkill = async (index) => {
    const ok = window.confirm("Remove this Skill?");
    if (!ok) return;
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

  // ----------------- END SKILLS HELPERS & HANDLERS ----------------- //

  const [achievements, setAchievements] = useState([
    {
      title: "Profile Completionist",
      icon: CheckCircle,
      earned: true,
      description: "Completed 100% of profile",
    },
    {
      title: "Skill Master",
      icon: Trophy,
      earned: true,
      description: "Verified 5+ Skills",
    },
    {
      title: "Interview Pro",
      icon: Star,
      earned: false,
      description: "Complete 10 interviews",
    },
    {
      title: "Network Builder",
      icon: Users,
      earned: false,
      description: "Connect with 50+ professionals",
    },
  ]);

  const [editingField, setEditingField] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const uiToBackendMap = {
    name: "username",
    email: "useremail",
    phone: "phonenumber",
    headline: "designation",
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
    availability: "availability",
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
        console.log("Fetched profile:", data);

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch profile");
        }

        const u = data?.user || {};
        setProfile((prev) => ({
          ...prev,
          name: u.username || "",
          email: u.useremail || "",
          phone: u.phonenumber || "",
          headline: u.designation || "",
          location: u.location || "",
          image: u.profilphoto || "",
          videoIntro: u.introvideo || "",
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
          availability: u.availability || "",
          bio: u.bio || "",
          recruterPhone: u.recruterPhone || "",
          recruterCompany: u.recruterCompany || "",
          recruterCompanyType: u.recruterCompanyType || "",
          recruterGstIn: u.recruterGstIn || "",
          recruterCompanyAddress: u.recruterCompanyAddress || "",
          recruterIndustry: u.recruterIndustry || "",
        }));

        // ✅ FIX: Initialize SkillAssessments from the fetched data
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

    // ✅ FIX: Correctly map the editing field to the backend key
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
          headline: u.designation || "",
          location: u.location || "",
          experience: u.yearsofExperience || "",
          availability: u.availability || "",
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
          videoIntro: u.introvideo || "",
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

        // ✅ FIX: Re-sync skills from the backend response
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
      reader.readAsDataURL(file);
      // TODO: Implement API call to upload image and save image URL to backend 'image' field
    }
  };

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

  const handleCertificateSave = async () => {
    const link = window.prompt("Enter your certification link:");
    if (!link) return;

    try {
      const token = Cookies.get("userToken");
      if (!token) throw new Error("No auth token");

      const formData = new FormData();
      formData.append("certificationlink", link);

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
        certificationlink: data.user?.certificationlink || link,
      }));
      setModalMessage("Certificate link saved!");
      setShowModal(true);
    } catch (err) {
      console.error("Certificate save error:", err);
      setModalMessage("Failed to save certificate link");
      setShowModal(true);
    }
  };

  const handleGenerateAndDownloadResume = () => {
    const resumeContent = generateResumeHtml(profile);
    const blob = new Blob([resumeContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.name || "Resume"}_CV.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

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

  const handlePortfolioSave = async () => {
    const link = window.prompt(
      "Enter your portfolio link (GitHub, Behance, etc.):"
    );
    if (!link) return;

    try {
      const token = Cookies.get("userToken");
      if (!token) throw new Error("No auth token");

      const formData = new FormData();
      formData.append("portfioliolink", link);

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
        portfioliolink: data.user?.portfioliolink || link,
      }));
      setModalMessage("Portfolio link saved!");
      setShowModal(true);
    } catch (err) {
      console.error("Portfolio save error:", err);
      setModalMessage("Failed to save portfolio link");
      setShowModal(true);
    }
  };

  const contactInfo = [
    {
      key: "location",
      icon: MapPin,
      value: profile.location,
      color: "text-orange-500",
    },
    {
      key: "phone",
      icon: Phone,
      value: profile.phone,
      color: "text-yellow-500",
    },
    {
      key: "email",
      icon: Mail,
      value: profile.email,
      color: "text-orange-600",
    },
    {
      key: "experience",
      icon: Briefcase,
      value: profile.experience,
      color: "text-yellow-600",
    },
    {
      key: "availability",
      icon: Calendar,
      value: profile.availability,
      color: "text-orange-500",
    },
  ];

  const jobStatsData = [
    {
      label: "Applied",
      value: jobStats.applied,
      icon: Rocket,
      color: "text-orange-500",
      bg: "bg-orange-100 yellow:bg-orange-900/30",
    },
    {
      label: "Interviews",
      value: jobStats.interviews,
      icon: Users,
      color: "text-yellow-500",
      bg: "bg-yellow-100 yellow:bg-yellow-900/30",
    },
    {
      label: "Offers",
      value: jobStats.offers,
      icon: Trophy,
      color: "text-amber-500",
      bg: "bg-amber-100 yellow:bg-amber-900/30",
    },
    {
      label: "Saved",
      value: jobStats.saved,
      icon: Heart,
      color: "text-red-500",
      bg: "bg-red-100 yellow:bg-red-900/30",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 yellow:from-orange-950/20 yellow:via-yellow-950/20 yellow:to-amber-950/20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header Card */}
        <Card className="overflow-hidden bg-gradient-to-br from-white via-orange-50 to-yellow-50 yellow:from-gray-900 yellow:via-orange-950/30 yellow:to-yellow-950/30 border-2 border-orange-200/50 yellow:border-orange-800/50 shadow-2xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-yellow-500/5"></div>
          <CardContent className="relative p-8">
            <div className="w-full max-w-5xl mx-auto space-y-8"></div>
            <div className="flex flex-col md:flex-row md:items-start md:gap-8">
              {/* Avatar Section */}
              <div className="relative group">
                <div className="relative">
                  <Avatar className="w-36 h-36 border-4 border-gradient-to-br from-orange-400 to-yellow-400 shadow-2xl ring-4 ring-orange-200/50 yellow:ring-orange-800/50">
                    <AvatarImage
                      src={profile.image || "/placeholder.svg"}
                      alt={profile.name}
                    />
                    <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-orange-500 to-yellow-500 text-white">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Video Intro Section */}
                <div className="mt-4 text-center">
                  {profile.videoIntro ? (
                    <div className="relative">
                      <video
                        src={profile.videoIntro}
                        className="w-36 h-24 rounded-xl object-cover border-2 border-orange-300/50 shadow-lg"
                        controls
                      />
                      <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                        <Video className="w-3 h-3 mr-1" />
                        Intro
                      </Badge>
                    </div>
                  ) : (
                    <div className="relative group">
                      <div className="w-36 h-24 bg-gradient-to-br from-orange-100 to-yellow-100 yellow:from-orange-900/30 yellow:to-yellow-900/30 rounded-xl border-2 border-dashed border-orange-300/50 flex items-center justify-center cursor-pointer hover:from-orange-200 hover:to-yellow-200 yellow:hover:from-orange-800/50 yellow:hover:to-yellow-800/50 transition-all duration-300 group-hover:scale-105">
                        <div className="text-center">
                          <Video className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                          <p className="text-xs text-orange-600 yellow:text-orange-400 font-medium">
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
                  <h1 className="text-4xl font-bold cursor-pointer hover:text-orange-600 transition-colors flex items-center group">
                    <EditableField
                      field="name"
                      value={profile.name}
                      isEditing={editingField === "name"}
                      tempValue={tempValue}
                      onEdit={handleEdit}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      onTempChange={setTempValue}
                      className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 yellow:from-white yellow:to-gray-200 bg-clip-text text-transparent"
                    />
                    {editingField !== "name" && (
                      <Edit3 className="w-6 h-6 ml-3 opacity-0 group-hover:opacity-100 transition-opacity text-orange-500" />
                    )}
                  </h1>

                  <p className="text-xl text-gray-600 yellow:text-gray-300 cursor-pointer hover:text-orange-600 transition-colors mt-2">
                    <EditableField
                      field="headline"
                      value={profile.headline}
                      isEditing={editingField === "headline"}
                      tempValue={tempValue}
                      onEdit={handleEdit}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      onTempChange={setTempValue}
                      className="text-xl text-gray-600 yellow:text-gray-300"
                    />
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contactInfo.map(({ key, icon: Icon, value, color }) => (
                    <div
                      key={key}
                      className="flex items-center space-x-3 p-4 rounded-xl bg-white/60 yellow:bg-gray-800/60 hover:bg-orange-50 yellow:hover:bg-orange-900/20 transition-all duration-300 group border border-orange-100/50 yellow:border-orange-800/50 hover:border-orange-300/50 hover:shadow-lg"
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
                        className="flex-1 group-hover:text-orange-600 transition-colors font-medium"
                      />
                    </div>
                  ))}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="text-center p-6 bg-gradient-to-br from-orange-100 to-orange-200 yellow:from-orange-900/30 yellow:to-orange-800/30 rounded-xl border border-orange-200/50 yellow:border-orange-700/50 hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl font-bold text-orange-600 yellow:text-orange-400">
                      {profile.profileStrength}%
                    </div>
                    <div className="text-sm text-orange-700 yellow:text-orange-300 font-medium">
                      Profile Strength
                    </div>
                    <Progress
                      value={profile.profileStrength}
                      className="mt-3 h-2"
                    />
                    <div className="flex items-center justify-center mt-2">
                      <Flame className="w-4 h-4 text-orange-500 mr-1" />
                      <span className="text-xs text-orange-600">
                        Hot Profile!
                      </span>
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-yellow-100 to-yellow-200 yellow:from-yellow-900/30 yellow:to-yellow-800/30 rounded-xl border border-yellow-200/50 yellow:border-yellow-700/50 hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl font-bold text-yellow-600 yellow:text-yellow-400">
                      {profile.responseRate}%
                    </div>
                    <div className="text-sm text-yellow-700 yellow:text-yellow-300 font-medium">
                      Response Rate
                    </div>
                    <div className="flex items-center justify-center mt-2">
                      <Zap className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-xs text-yellow-600">
                        Lightning Fast!
                      </span>
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-amber-100 to-amber-200 yellow:from-amber-900/30 yellow:to-amber-800/30 rounded-xl border border-amber-200/50 yellow:border-amber-700/50 hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl font-bold text-amber-600 yellow:text-amber-400">
                      {jobStats.searchAppearances}
                    </div>
                    <div className="text-sm text-amber-700 yellow:text-amber-300 font-medium">
                      Search Appearances
                    </div>
                    <div className="flex items-center justify-center mt-2">
                      <TrendingUp className="w-4 h-4 text-amber-500 mr-1" />
                      <span className="text-xs text-amber-600">
                        Trending Up!
                      </span>
                    </div>
                  </div>
                </div>
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
          <TabsList className="grid w-full grid-cols-4 h-16 bg-white/80 yellow:bg-gray-900/80 backdrop-blur-sm border border-orange-200/50 yellow:border-orange-800/50 rounded-xl">
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
                className="text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white"
              >
                <Icon className="w-5 h-5 mr-2" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Job Activity Dashboard */}
              <div className="lg:col-span-2">
                <Card className="border-orange-200/50 yellow:border-orange-800/50 h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-orange-500" />
                      Job Activity Dashboard
                    </CardTitle>
                    <CardDescription>
                      Your job search performance at a glance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {jobStatsData.map((stat) => (
                        <StatCard key={stat.label} {...stat} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Career Recommendations (now on the side) */}
              <div className="lg:col-span-1">
                <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 yellow:from-orange-950/20 yellow:to-yellow-950/20 border border-orange-200/50 yellow:border-orange-800/50 h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <Bot className="w-5 h-5 mr-2 text-orange-500" />
                      Career Recommendations
                    </CardTitle>
                    <CardDescription>
                      AI-powered recommendations to boost your profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {aiRecommendations.slice(0, 2).map((rec, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-white/60 yellow:bg-gray-800/60 rounded-lg border border-orange-100/50 yellow:border-orange-800/50"
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
                            <span className="font-medium text-sm">
                              {rec.title}
                            </span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {rec.match}% match
                          </Badge>
                        </div>
                      ))}
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent"
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
              {SkillAssessments.map((Skill, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow border-orange-200/50 yellow:border-orange-800/50"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{Skill.Skill}</CardTitle>
                      <div className="flex items-center space-x-2">
                        {Skill.verified && (
                          <Badge
                            variant="secondary"
                            className="bg-orange-100 text-orange-800 yellow:bg-orange-900 yellow:text-orange-200"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {Skill.trending && (
                          <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}

                        {/* Edit button */}
                        <button
                          type="button"
                          onClick={() => handleEditSkill(index)}
                          className="px-2 py-1 rounded-md hover:bg-orange-50"
                          title="Edit Skill"
                        >
                          <Edit3 className="w-4 h-4 text-orange-600" />
                        </button>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="px-2 py-1 rounded-md hover:bg-red-50"
                          title="Remove Skill"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Proficiency Level</span>
                      <span className="font-bold">{Skill.level}%</span>
                    </div>
                    <Progress
                      value={Skill.level}
                      className="h-3 bg-orange-100 yellow:bg-orange-900"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-sm text-gray-500 yellow:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{Skill.endorsements} endorsements</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-orange-300 text-orange-600 hover:bg-orange-50 yellow:border-orange-700 yellow:text-orange-400 yellow:hover:bg-orange-900/20 bg-transparent"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Take Test
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Learn
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-2 border-dashed border-orange-300/50 hover:border-orange-500 transition-colors yellow:border-orange-700/50 yellow:hover:border-orange-400">
              <CardContent className="p-8 text-center">
                <Target className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Add New Skill</h3>
                <p className="text-gray-500 yellow:text-gray-400 mb-4">
                  Showcase more of your expertise
                </p>
                <Button
                  onClick={handleAddSkill}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            {[
              {
                key: "summary",
                title: "Professional Summary",
                icon: FileText,
                description: "Brief overview of your professional background",
              },
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
                key: "preferredLocation",
                title: "Preferred Locations",
                icon: MapPin,
                description: "Cities or regions where you want to work",
              },
              {
                key: "previousCompany",
                title: "Previous Company",
                icon: Briefcase,
                description: "Your last company worked for",
              },
            ].map((field) => (
              <Card
                key={field.key}
                className="border-orange-200/50 yellow:border-orange-800/50"
              >
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <field.icon className="w-5 h-5 mr-2 text-orange-500" />
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
                      <p className="whitespace-pre-line">
                        {profile[field.key]}
                      </p>
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleEdit(field.key, profile[field.key])
                        }
                        className="border-orange-300 text-orange-600 hover:bg-orange-50"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <field.icon className="w-16 h-16 text-gray-500 yellow:text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Add Your {field.title}
                      </h3>
                      <p className="text-gray-500 yellow:text-gray-400 mb-6">
                        {field.description}
                      </p>
                      <Button
                        onClick={() => handleEdit(field.key, "")}
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg"
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
            <Card className="bg-gradient-to-br from-orange-50/5 to-yellow-50/5 border-2 border-orange-200/50 yellow:border-orange-800/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-orange-500" />
                  Resume & Documents
                </CardTitle>
                <CardDescription>
                  Upload your resume and other important documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ✅ Resume Upload */}
                  <div
                    className="text-center p-8 border-2 border-dashed border-orange-300/50 rounded-lg hover:border-orange-500 transition-colors cursor-pointer yellow:border-orange-700/50 yellow:hover:border-orange-400"
                    onClick={() =>
                      document.getElementById("resumeInput").click()
                    }
                  >
                    <Upload className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Upload Resume</h3>
                    <p className="text-sm text-gray-500 yellow:text-gray-400 mb-4">
                      PDF, DOC, or DOCX (Max 5MB)
                    </p>
                    <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                    <input
                      id="resumeInput"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                    />
                  </div>

                  {/* ✅ Portfolio Links */}
                  <div className="text-center p-8 border-2 border-dashed border-yellow-300/50 rounded-lg hover:border-yellow-500 transition-colors cursor-pointer yellow:border-yellow-700/50 yellow:hover:border-yellow-400">
                    <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Portfolio Links</h3>
                    <p className="text-sm text-gray-500 yellow:text-gray-400 mb-4">
                      GitHub, Behance, Personal Website
                    </p>
                    <Button
                      variant="secondary"
                      onClick={handlePortfolioSave}
                      className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-lg"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Add Links
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ✅ Other Sections */}
            {[
              {
                key: "projects",
                title: "Featured Projects",
                icon: Lightbulb,
                description: "Showcase your best work and achievements",
              },
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
              <Card
                key={field.key}
                className="border-orange-200/50 yellow:border-orange-800/50"
              >
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <field.icon className="w-5 h-5 mr-2 text-orange-500" />
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
                      multiline={6}
                    />
                  ) : profile[field.key] ? (
                    <div className="space-y-4">
                      <div className="prose max-w-none">
                        <p className="whitespace-pre-line">
                          {profile[field.key]}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleEdit(field.key, profile[field.key])
                        }
                        className="border-orange-300 text-orange-600 hover:bg-orange-50"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <field.icon className="w-16 h-16 text-gray-500 yellow:text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Add Your {field.title}
                      </h3>
                      <p className="text-gray-500 yellow:text-gray-400 mb-6">
                        {field.description}
                      </p>
                      <Button
                        onClick={() =>
                          field.key === "certificationlink"
                            ? handleCertificateSave()
                            : handleEdit(field.key, "")
                        }
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg"
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
        <div className="flex justify-center space-x-4 mt-12">
          <Button
            size="lg"
            onClick={handleSaveAll}
            className="px-8 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Save All Changes
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleGenerateAndDownloadResume}
            className="px-8 border-orange-300 text-orange-600 hover:bg-orange-50 yellow:border-orange-700 yellow:text-orange-400 yellow:hover:bg-orange-900/20 bg-transparent"
          >
            <Download className="w-5 h-5 mr-2" />
            Generate Resume
          </Button>
          <ShareMenu>
            <Button
              size="lg"
              className="px-8 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-lg"
            >
              Share Profile
            </Button>
          </ShareMenu>
        </div>
      </div>

      {/* Custom Alert Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white yellow:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm relative border-2 border-orange-400">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 yellow:text-gray-400 yellow:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-orange-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800 yellow:text-white">
                Notification
              </h3>
            </div>
            <p className="text-gray-700 yellow:text-gray-300 text-center mb-6">
              {modalMessage}
            </p>
            <Button
              onClick={() => setShowModal(false)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
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
