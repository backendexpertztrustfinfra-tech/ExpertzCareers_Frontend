import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { postJob, updateJob } from "../../../services/apis";
import { indianStates } from "../Location/locations";
import { toast } from "react-toastify";

const PostJobForm = ({ onClose, onSubmit, initialData }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [salaryAmount, setSalaryAmount] = useState("");
  const [incentiveAmount, setIncentiveAmount] = useState("");
  const [totalSalary, setTotalSalary] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    openings: "",
    type: "",
    location: "",
    address: "",
    gender: "",
    qualification: "",
    totalExp: "",
    relevantExp: "",
    salary: "",
    salaryType: "salary",
    benefits: [],
    skills: [],
    documents: [],
    timing: "",
    shift: "",
    workingDaysFrom: "",
    workingDaysTo: "",
    weekend: "",
    status: "",
    closedDate: "",
  });

  // Inputs for chips
  const [skillInput, setSkillInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [docInput, setDocInput] = useState("");

  // --- Predefined suggestions ---
  const defaultSkills = [
    "Good Communication Skills",
    "Fluent English",
    "Teamwork",
    "Problem Solving",
    "Time Management",
    "Leadership",
  ];

  const defaultDocuments = [
    "Aadhar Card",
    "PAN Card",
    "Bank Account",
    "Driving License",
    "Passport",
  ];

  const defaultBenefits = [
    "Health Insurance",
    "PF / ESI",
    "Work From Home",
    "Paid Leaves",
    "Performance Bonus",
  ];

  // For custom category & document
  const [otherCategory, setOtherCategory] = useState("");
  const [otherDocument, setOtherDocument] = useState("");

  // Normalize data when editing job
  const normalizeJobData = (job) => ({
    title: job.jobTitle || job.title || "",
    category: job.jobCategory || job.category || "",
    description: job.description || "",
    openings: job.noofOpening || job.opening || "",
    type: job.jobType || job.type || "",
    location: job.location || "",
    address: job.address || "",
    gender: job.gender || "",
    qualification: job.Qualification || job.qualification || "",
    totalExp: job.totalExperience || job.totalExp || "",
    relevantExp: job.relevantExperience || job.relevantExp || "",
    salary: job.SalaryIncentive || job.salary || "",
    salaryType: job.salaryType || "salary",
    benefits: job.jobBenefits ? job.jobBenefits.split(",") : [],
    skills: job.jobSkills ? job.jobSkills.split(",") : [],
    documents: job.documentRequired ? job.documentRequired.split(",") : [],
    timing: job.timing || "",
    shift: job.shift || "",
    workingDaysFrom: job.workingDaysFrom || "",
    workingDaysTo: job.workingDaysTo || "",
    weekend: job.weekend || "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(normalizeJobData(initialData));
    }
  }, [initialData]);

  // Generic input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---- Tag handlers ----
  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };
  const handleBenefitKeyDown = (e) => {
    if (e.key === "Enter" && benefitInput.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()],
      }));
      setBenefitInput("");
    }
  };
  const handleDocKeyDown = (e) => {
    if (e.key === "Enter" && docInput.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, docInput.trim()],
      }));
      setDocInput("");
    }
  };

  // Salary calculation
  useEffect(() => {
    if (formData.salaryType === "salary+incentives") {
      const total =
        (parseFloat(salaryAmount) || 0) + (parseFloat(incentiveAmount) || 0);
      setTotalSalary(total ? total.toString() : "");
      setFormData((prev) => ({ ...prev, salary: total.toString() }));
    } else {
      setFormData((prev) => ({ ...prev, salary: salaryAmount }));
      setTotalSalary("");
    }
  }, [salaryAmount, incentiveAmount, formData.salaryType]);

  // ---- Submit ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      jobTitle: formData.title,
      jobCategory: otherCategory || formData.category,
      description: formData.description,
      noofOpening: formData.openings,
      jobType: formData.type,
      location: formData.location,
      address: formData.address,
      gender: formData.gender,
      Qualification: formData.qualification,
      totalExperience: formData.totalExp,
      relevantExperience: formData.relevantExp,
      SalaryIncentive: formData.salary,
      salaryType: formData.salaryType,
      jobBenefits: formData.benefits.join(","),
      jobSkills: formData.skills.join(","),
      documentRequired: [...formData.documents, otherDocument]
        .filter(Boolean)
        .join(","),
      timing: formData.timing,
      shift: formData.shift,
      workingDays: `${formData.workingDaysFrom} - ${formData.workingDaysTo}`,
      weekend: formData.weekend,
      status: formData.status,
      ClosedDate: formData.closedDate,
    };

    try {
      const token = Cookies.get("userToken");
      const userId = Cookies.get("userId");

      let data;
      if (initialData) {
        data = await updateJob(token, initialData.id, payload);
        if (!data) throw new Error("Failed to update job");
        toast.success("✅ Job Updated Successfully");
        if (onSubmit) onSubmit(data.UpdatedData);
      } else {
        data = await postJob(token, payload, userId);
        if (!data) throw new Error("Failed to post job");
        toast.success("Job Posted Successfully");
        if (onSubmit) onSubmit(data.job);
      }
      onClose();
    } catch (err) {
      console.error("❌ Error saving job:", err);
      alert(err.message || "Something went wrong while saving the job.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]";

  return (
    <div className="h-full w-full flex items-center justify-center py-10 px-4 overflow-y-auto ">
      <div className="bg-white rounded-2xl overflow-y-auto w-full max-w-3xl p-8">
        <h2 className="text-3xl font-bold text-center text-[#D4AF37] mb-2">
          {initialData ? "Edit Job" : "Post a Job"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* -------- STEP 1 -------- */}
          {step === 1 && (
            <>
              {/* Job Title */}
              <div>
                <label className="block mb-1">Job Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Category</option>
                  <option value="IT">IT</option>
                  <option value="Marketing">Marketing</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Other">Other</option>
                </select>
                {formData.category === "Other" && (
                  <input
                    placeholder="Enter custom category"
                    value={otherCategory}
                    onChange={(e) => setOtherCategory(e.target.value)}
                    className={`${inputClass} mt-2`}
                  />
                )}
              </div>

              {/* Openings */}
              <div>
                <label className="block mb-1">No. of Openings</label>
                <select
                  name="openings"
                  value={formData.openings}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {[...Array(20)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
<div className="mt-4">
  <label className="block mb-1 font-medium text-gray-700">Description</label>
  <textarea
    name="description"
    value={formData.description || ""}
    onChange={(e) =>
      setFormData((prev) => ({ ...prev, description: e.target.value }))
    }
    placeholder="Write about yourself..."
    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-amber-400"
    rows="3"
  ></textarea>

  {/* Auto Suggestions */}
  <div className="flex flex-wrap gap-2 mt-2">
    {[
      "Experienced professional with a strong background in my field.",
      "Passionate about continuous learning and career growth.",
      "Skilled in teamwork, leadership, and problem-solving.",
      "Looking for opportunities to contribute and grow.",
      "Dedicated, punctual, and adaptable to new challenges.",
    ].map((suggestion, i) => (
      <button
        key={i}
        type="button"
        onClick={() =>
          setFormData((prev) => ({ ...prev, description: suggestion }))
        }
        className="px-3 py-1 text-sm rounded-full border bg-gray-100 hover:bg-amber-100 text-gray-700 transition"
      >
        {suggestion}
      </button>
    ))}
  </div>
</div>


              {/* Job Type */}
              <div>
                <label className="block mb-1">Job Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Type</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              {/*Location */}
              <div>
                <label className="block mb-1">Location</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select State/UT</option>
                  {indianStates.map((state, idx) => (
                    <option key={idx} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block mb-1">Address</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block mb-1">Preferred Gender</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="gender"
                      value=""
                      checked={formData.gender === ""}
                      onChange={handleChange}
                    />
                    Any
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleChange}
                    />
                    Male
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={handleChange}
                    />
                    Female
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="gender"
                      value="Other"
                      checked={formData.gender === "Other"}
                      onChange={handleChange}
                    />
                    Other
                  </label>
                </div>
              </div>

              {/* Qualification */}
              <div>
                <label className="block mb-1">Qualification</label>
                <select
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Qualification</option>
                  <option value="10th Pass">10th Pass</option>
                  <option value="12th Pass">12th Pass</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Post Graduate">Post Graduate</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-[#D4AF37] text-white px-6 py-2 rounded-lg"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* -------- STEP 2 -------- */}
          {step === 2 && (
            <>
              {/* Experience */}
              <div>
                <label className="block mb-1">Total Experience</label>
                <select
                  name="totalExp"
                  value={formData.totalExp}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  <option value="0-6 months">0–6 months</option>
                  <option value="6 months - 1 year">6 months–1 year</option>
                  <option value="1-3 years">1–3 years</option>
                  <option value="3-5 years">3–5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>

              {/* Salary */}
              <div>
                <label className="block mb-1">Salary</label>
                <div className="flex gap-4 mb-2">
                  <label>
                    <input
                      type="radio"
                      name="salaryType"
                      value="salary"
                      checked={formData.salaryType === "salary"}
                      onChange={handleChange}
                    />{" "}
                    Salary
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="salaryType"
                      value="salary+incentives"
                      checked={formData.salaryType === "salary+incentives"}
                      onChange={handleChange}
                    />{" "}
                    Salary + Incentives
                  </label>
                </div>

                {formData.salaryType === "salary" && (
                  <input
                    type="number"
                    value={salaryAmount}
                    onChange={(e) => setSalaryAmount(e.target.value)}
                    placeholder="Enter Salary"
                    className={inputClass}
                  />
                )}

                {formData.salaryType === "salary+incentives" && (
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      value={salaryAmount}
                      onChange={(e) => setSalaryAmount(e.target.value)}
                      placeholder="Salary"
                      className={inputClass}
                    />
                    <input
                      type="number"
                      value={incentiveAmount}
                      onChange={(e) => setIncentiveAmount(e.target.value)}
                      placeholder="Incentives"
                      className={inputClass}
                    />
                    <input
                      type="number"
                      value={totalSalary}
                      readOnly
                      placeholder="Total"
                      className={`${inputClass} bg-gray-100`}
                    />
                  </div>
                )}
              </div>

              {/* Benefits */}
              <div>
                <label className="block mb-1">Job Benefits</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.benefits.map((b) => (
                    <span
                      key={b}
                      className="px-3 py-1 bg-gray-200 rounded-full flex items-center gap-2"
                    >
                      {b}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            benefits: prev.benefits.filter((x) => x !== b),
                          }))
                        }
                        className="text-red-500 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  onKeyDown={handleBenefitKeyDown}
                  placeholder="Type benefit & press Enter"
                  className={inputClass}
                />

                {/* Suggested Benefits */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {defaultBenefits.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() =>
                        !formData.benefits.includes(s) &&
                        setFormData((prev) => ({
                          ...prev,
                          benefits: [...prev.benefits, s],
                        }))
                      }
                      className="px-3 py-1 border rounded-full text-sm hover:bg-[#D4AF37] hover:text-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block mb-1">Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gray-200 rounded-full flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            skills: prev.skills.filter((s) => s !== skill),
                          }))
                        }
                        className="text-red-500 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type skill & press Enter"
                  className={inputClass}
                />

                {/* Suggested Skills */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {defaultSkills.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() =>
                        !formData.skills.includes(s) &&
                        setFormData((prev) => ({
                          ...prev,
                          skills: [...prev.skills, s],
                        }))
                      }
                      className="px-3 py-1 border rounded-full text-sm hover:bg-[#D4AF37] hover:text-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div>
                <label className="block mb-1">Documents Required</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.documents.map((d) => (
                    <span
                      key={d}
                      className="px-3 py-1 bg-gray-200 rounded-full flex items-center gap-2"
                    >
                      {d}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            documents: prev.documents.filter((x) => x !== d),
                          }))
                        }
                        className="text-red-500 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  value={docInput}
                  onChange={(e) => setDocInput(e.target.value)}
                  onKeyDown={handleDocKeyDown}
                  placeholder="Type document & press Enter"
                  className={inputClass}
                />

                {/* Suggested Documents */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {defaultDocuments.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() =>
                        !formData.documents.includes(s) &&
                        setFormData((prev) => ({
                          ...prev,
                          documents: [...prev.documents, s],
                        }))
                      }
                      className="px-3 py-1 border rounded-full text-sm hover:bg-[#D4AF37] hover:text-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Working Days */}
              <div>
                <label className="block mb-1">Working Days</label>
                <div className="flex gap-2">
                  {/* From Dropdown */}
                  <select
                    name="workingFrom"
                    value={formData.workingFrom || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        workingFrom: e.target.value,
                        workingDays: `${e.target.value} - ${
                          prev.workingTo || ""
                        }`,
                      }))
                    }
                    className={inputClass}
                  >
                    <option value="">From</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>

                  {/* To Dropdown */}
                  <select
                    name="workingTo"
                    value={formData.workingTo || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        workingTo: e.target.value,
                        workingDays: `${prev.workingFrom || ""} - ${
                          e.target.value
                        }`,
                      }))
                    }
                    className={inputClass}
                  >
                    <option value="">To</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
              </div>

              {/* Timing */}
              <div>
                <label className="block mb-1">Timing</label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                        timing: `${e.target.value} - ${prev.endTime || ""}`,
                      }))
                    }
                    className={inputClass}
                  />
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        endTime: e.target.value,
                        timing: `${prev.startTime || ""} - ${e.target.value}`,
                      }))
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Shift</label>
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Shift</option>
                  <option value="Day">Day</option>
                  <option value="Night">Night</option>
                  <option value="Rotational">Rotational</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Weekend</label>
                <select
                  name="weekend"
                  value={formData.weekend}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  <option value="Saturday-Sunday Off">Sat-Sun Off</option>
                  <option value="Sunday Off">Sunday Off</option>
                  <option value="Rotational Off">Rotational</option>
                </select>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[#D4AF37]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-[#D4AF37] text-white px-6 py-2 rounded-lg"
                  disabled={loading}
                >
                  {loading ? "Saving..." : initialData ? "Update" : "Submit"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJobForm;
