"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Cookies from "js-cookie";
import { postJob, updateJob } from "../../../services/apis";
import { indianStates } from "../../Admin/Location/locations";
import { toast } from "react-toastify";

function RichTextEditor({
  label = "Description",
  value,
  onChange,
  placeholder = "Enter the job description, including the main responsibility and tasks...",
  required = false,
  name = "description",
  id = "description",
}) {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = (cmd) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(cmd, false, null);
    onChange(editorRef.current.innerHTML);
  };

  const plainText = (html) => {
    if (!html) return "";
    const el = document.createElement("div");
    el.innerHTML = html;
    return (el.textContent || "").trim();
  };
  const invalid = required && !plainText(value);

  return (
    <div className="w-full">
      <label className="block mb-1 font-medium text-gray-800" htmlFor={id}>
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <div
        className={`rounded-xl border overflow-hidden bg-white ${
          invalid ? "border-red-400" : "border-gray-300"
        }`}
      >
        {/* toolbar */}
        {/* (keep your toolbar buttons same) */}

        {/* editor area */}
        <div className="relative">
          {!value && !isFocused && (
            <div className="pointer-events-none absolute left-3 top-3 text-gray-400 text-sm pr-3">
              {placeholder}
            </div>
          )}
          <div
            id={id}
            ref={editorRef}
            className="min-h-[160px] max-h-[420px] overflow-y-auto p-3 leading-6 outline-none focus:ring-0 prose prose-sm prose-p:my-2 prose-li:my-1"
            contentEditable
            dir="ltr"
            role="textbox"
            aria-multiline="true"
            aria-label={label}
            aria-required={required}
            aria-invalid={invalid ? "true" : "false"}
            onInput={(e) => onChange(e.currentTarget.innerHTML)}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
          />
        </div>
      </div>
      {invalid && (
        <p className="mt-1 text-sm text-red-600">This field is required.</p>
      )}
    </div>
  );
}

const PostJobForm = ({ onClose, onSubmit, initialData }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [salaryAmount, setSalaryAmount] = useState("");
  const [incentiveAmount, setIncentiveAmount] = useState("");
  const [totalSalary, setTotalSalary] = useState("");
  const [skills, setSkills] = useState(initialData?.skills || []);
  const [input, setInput] = useState("");

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
    startTime: "",
    endTime: "",
  });

  // Inputs for chips
  const [skillInput, setSkillInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [docInput, setDocInput] = useState("");

  // --- Predefined suggestions ---
  const defaultSkills = useMemo(
    () => [
      "Good Communication Skills",
      "Fluent English",
      "Teamwork",
      "Problem Solving",
      "Time Management",
      "Leadership",
    ],
    []
  );

  const defaultDocuments = useMemo(
    () => [
      "Aadhar Card",
      "PAN Card",
      "Bank Account",
      "Driving License",
      "Passport",
    ],
    []
  );

  const defaultBenefits = useMemo(
    () => [
      "Health Insurance",
      "PF / ESI",
      "Work From Home",
      "Paid Leaves",
      "Performance Bonus",
    ],
    []
  );

  // For custom category & document
  const [otherCategory, setOtherCategory] = useState("");
  const [otherDocument, setOtherDocument] = useState("");

  // Normalize data when editing job
  const normalizeJobData = (job) => {
    // Split salary and incentives if they exist
    let initialSalary = job.SalaryIncentive || job.salary || "";
    let initialSalaryType = job.salaryType || "salary";
    let initialSalaryAmount = "";
    let initialIncentiveAmount = "";

    if (initialSalaryType === "salary+incentives" && initialSalary) {
      const parts = initialSalary.split('+').map(s => s.trim());
      initialSalaryAmount = parts[0] || "";
      initialIncentiveAmount = parts[1] || "";
    } else {
      initialSalaryAmount = initialSalary;
    }

    // Split timing
    const [startTime, endTime] = (job.timing || "").split(' - ').map(t => t.trim());

    // Split working days
    const [workingDaysFrom, workingDaysTo] = (job.workingDays || "").split(' - ').map(d => d.trim());

    return {
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
      salary: initialSalary,
      salaryType: initialSalaryType,
      benefits: job.jobBenefits ? job.jobBenefits.split(",").map(b => b.trim()) : [],
      skills: job.jobSkills ? job.jobSkills.split(",").map(s => s.trim()) : [],
      documents: job.documentRequired ? job.documentRequired.split(",").map(d => d.trim()) : [],
      shift: job.shift || "",
      workingDaysFrom: workingDaysFrom,
      workingDaysTo: workingDaysTo,
      weekend: job.weekend || "",
      startTime: startTime,
      endTime: endTime,
    };
  };

  useEffect(() => {
    if (initialData) {
      const normalized = normalizeJobData(initialData);
      setFormData(normalized);
      if (normalized.salaryType === 'salary+incentives') {
        const parts = normalized.salary.split('+').map(s => s.trim());
        setSalaryAmount(parts[0] || '');
        setIncentiveAmount(parts[1] || '');
      } else {
        setSalaryAmount(normalized.salary);
      }
      setTotalSalary(normalized.salary);
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
      // Check if the skill already exists (case-insensitive)
      if (!formData.skills.some(s => s.toLowerCase() === skillInput.trim().toLowerCase())) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, skillInput.trim()],
        }));
        setSkillInput("");
      } else {
        toast.warn("Skill already exists!");
      }
    }
  };
  const handleBenefitKeyDown = (e) => {
    if (e.key === "Enter" && benefitInput.trim()) {
      e.preventDefault();
      // Check if the benefit already exists (case-insensitive)
      if (!formData.benefits.some(b => b.toLowerCase() === benefitInput.trim().toLowerCase())) {
        setFormData((prev) => ({
          ...prev,
          benefits: [...prev.benefits, benefitInput.trim()],
        }));
        setBenefitInput("");
      } else {
        toast.warn("Benefit already exists!");
      }
    }
  };
  const handleDocKeyDown = (e) => {
    if (e.key === "Enter" && docInput.trim()) {
      e.preventDefault();
      // Check if the document already exists (case-insensitive)
      if (!formData.documents.some(d => d.toLowerCase() === docInput.trim().toLowerCase())) {
        setFormData((prev) => ({
          ...prev,
          documents: [...prev.documents, docInput.trim()],
        }));
        setDocInput("");
      } else {
        toast.warn("Document already exists!");
      }
    }
  };

  // Salary calculation
  useEffect(() => {
    if (formData.salaryType === "salary+incentives") {
      const total =
        (Number.parseFloat(salaryAmount) || 0) +
        (Number.parseFloat(incentiveAmount) || 0);
      setTotalSalary(total ? total.toString() : "");
      setFormData((prev) => ({
        ...prev,
        salary: total ? total.toString() : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, salary: salaryAmount }));
      setTotalSalary("");
    }
  }, [salaryAmount, incentiveAmount, formData.salaryType]);

  const scrollToField = (selector) => {
    const el =
      typeof selector === "string"
        ? document.querySelector(selector)
        : selector;
    if (el && "scrollIntoView" in el)
      el.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const getDescriptionText = () => {
    const div = document.createElement("div");
    div.innerHTML = formData.description || "";
    return (div.textContent || "").trim();
  };

  const handleNextStep = () => {
    const missing = [];
    if (!formData.title) missing.push("Job Title");
    if (!formData.category) missing.push("Category");
    if (formData.category === "Other" && !otherCategory.trim())
      missing.push("Custom Category");
    if (!formData.openings) missing.push("No. of Openings");
    if (!formData.type) missing.push("Job Type");
    if (!formData.location) missing.push("Location");
    if (!formData.address) missing.push("Address");
    if (!formData.qualification) missing.push("Qualification");
    if (!getDescriptionText()) missing.push("Job Description");

    if (missing.length) {
      toast.error(`Please fill: ${missing.join(", ")}`);
      if (!formData.title) return scrollToField("[name='title']");
      if (!formData.category) return scrollToField("[name='category']");
      if (formData.category === "Other" && !otherCategory.trim())
        return scrollToField("#otherCategory");
      if (!formData.openings) return scrollToField("[name='openings']");
      if (!formData.type) return scrollToField("[name='type']");
      if (!formData.location) return scrollToField("[name='location']");
      if (!formData.address) return scrollToField("[name='address']");
      if (!formData.qualification)
        return scrollToField("[name='qualification']");
      return;
    }
    setStep(2);
  };

  // ---- Submit ----
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formEl = e.currentTarget;
    if (formEl && !formEl.checkValidity()) {
      formEl.reportValidity();
      return;
    }

    const descText = getDescriptionText();
    if (!descText) {
      toast.error("Job Description is required.");
      return scrollToField("#description");
    }
    if (formData.category === "Other" && !otherCategory.trim()) {
      toast.error("Please enter a custom category.");
      return scrollToField("#otherCategory");
    }
    if (formData.salaryType === "salary" && !salaryAmount) {
      toast.error("Please enter Salary amount.");
      return;
    }
    if (
      formData.salaryType === "salary+incentives" &&
      (!salaryAmount || !incentiveAmount || !totalSalary)
    ) {
      toast.error(
        "Please enter Salary, Incentives and ensure Total is calculated."
      );
      return;
    }
    if (!formData.workingDaysFrom || !formData.workingDaysTo) {
      toast.error("Please select Working Days range.");
      return;
    }
    if (!formData.startTime || !formData.endTime) {
      toast.error("Please set Timing (start and end).");
      return;
    }

    setLoading(true);

    const salaryValue = formData.salaryType === 'salary+incentives'
      ? `${salaryAmount} + ${incentiveAmount}`
      : salaryAmount;

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
      SalaryIncentive: salaryValue,
      salaryType: formData.salaryType,
      jobBenefits: formData.benefits.join(","),
      jobSkills: formData.skills.join(","),
      documentRequired: formData.documents.join(","),
      workingDays: `${formData.workingDaysFrom} - ${formData.workingDaysTo}`,
      weekend: formData.weekend,
      timing: `${formData.startTime} - ${formData.endTime}`,
      shift: formData.shift,
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
      onClose && onClose();
    } catch (err) {
      console.error("❌ Error saving job:", err);
      alert(err.message || "Something went wrong while saving the job.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white";

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-6 px-3 md:py-10 md:px-6 overflow-y-auto bg-transparent">
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 w-full max-w-4xl">
        {/* Header */}
        <div className="px-6 md:px-8 pt-6 pb-4 border-b">
          <h2 className="text-2xl md:text-3xl font-bold text-[#D4AF37]">
            {initialData ? "Edit Job" : "Post a Job"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill the details below. Fields marked with * are required. Mobile
            responsive and accessible.
          </p>

          <div className="mt-4 flex items-center gap-3" aria-hidden="true">
            <div
              className={`h-2 flex-1 rounded-full ${
                step >= 1 ? "bg-[#D4AF37]" : "bg-gray-200"
              }`}
            />
            <div
              className={`h-2 flex-1 rounded-full ${
                step >= 2 ? "bg-[#D4AF37]" : "bg-gray-200"
              }`}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>Job Details</span>
            <span>Requirements & Schedule</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {/* -------- STEP 1 -------- */}
          {step === 1 && (
            <>
              {/* grid layout for better responsiveness */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Job Title */}
                <div className="md:col-span-2">
                  <label
                    className="block mb-1 font-medium text-gray-800"
                    htmlFor="title"
                  >
                    Job Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="e.g., Frontend Developer"
                  />
                </div>

                {/* Category */}
                <div>
                  <label
                    className="block mb-1 font-medium text-gray-800"
                    htmlFor="category"
                  >
                    Category <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={inputClass}
                    required
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
                      id="otherCategory"
                      placeholder="Enter custom category"
                      value={otherCategory}
                      onChange={(e) => setOtherCategory(e.target.value)}
                      className={`${inputClass} mt-2`}
                      required
                    />
                  )}
                </div>

                {/* Openings */}
                <div>
                  <label
                    className="block mb-1 font-medium text-gray-800"
                    htmlFor="openings"
                  >
                    No. of Openings <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="openings"
                    name="openings"
                    value={formData.openings}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select</option>
                    {[...Array(20)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job Type */}
                <div>
                  <label
                    className="block mb-1 font-medium text-gray-800"
                    htmlFor="type"
                  >
                    Job Type <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label
                    className="block mb-1 font-medium text-gray-800"
                    htmlFor="location"
                  >
                    Location <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={inputClass}
                    required
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
                <div className="md:col-span-2">
                  <label
                    className="block mb-1 font-medium text-gray-800"
                    htmlFor="address"
                  >
                    Address <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={inputClass}
                    required
                    placeholder="Street, City, Zip"
                  />
                </div>

                {/* Gender */}
                <div className="md:col-span-2">
                  <fieldset>
                    <legend className="block mb-1 font-medium text-gray-800">
                      Preferred Gender
                    </legend>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { label: "Any", value: "" },
                        { label: "Male", value: "Male" },
                        { label: "Female", value: "Female" },
                        { label: "Other", value: "Other" },
                      ].map((g) => (
                        <label
                          key={g.label}
                          className="flex items-center gap-2 text-gray-700"
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={g.value}
                            checked={formData.gender === g.value}
                            onChange={handleChange}
                          />
                          {g.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>

                {/* Qualification */}
                <div className="md:col-span-2">
                  <label
                    className="block mb-1 font-medium text-gray-800"
                    htmlFor="qualification"
                  >
                    Qualification <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className={inputClass}
                    required
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

                {/* Description -> Rich Text Editor */}
                <div className="md:col-span-2">
                  <RichTextEditor
                    id="description"
                    name="description"
                    value={formData.description || ""}
                    onChange={(html) =>
                      setFormData((prev) => ({ ...prev, description: html }))
                    }
                    label="Job Description"
                    placeholder="Describe the responsibilities of this job and other specific requirements here..."
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-[#D4AF37] text-white px-5 py-2 rounded-lg hover:brightness-95"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* -------- STEP 2 -------- */}
          {step === 2 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Experience */}
                <div>
                  <label
                    className="block mb-1 font-medium text-gray-800"
                    htmlFor="totalExp"
                  >
                    Total Experience <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="totalExp"
                    name="totalExp"
                    value={formData.totalExp}
                    onChange={handleChange}
                    className={inputClass}
                    required
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
                <div className="md:col-span-2">
                  <fieldset>
                    <legend className="block mb-1 font-medium text-gray-800">
                      Salary <span className="text-red-600">*</span>
                    </legend>
                    <div className="flex flex-wrap gap-4 mb-2 text-gray-700">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="salaryType"
                          value="salary"
                          checked={formData.salaryType === "salary"}
                          onChange={handleChange}
                          required
                        />
                        Salary
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="salaryType"
                          value="salary+incentives"
                          checked={formData.salaryType === "salary+incentives"}
                          onChange={handleChange}
                          required
                        />
                        Salary + Incentives
                      </label>
                    </div>
                  </fieldset>

                  {formData.salaryType === "salary" && (
                    <input
                      type="number"
                      name="salaryOnly"
                      value={salaryAmount}
                      onChange={(e) => setSalaryAmount(e.target.value)}
                      placeholder="Enter Salary"
                      className={inputClass}
                      min="0"
                      required
                    />
                  )}

                  {formData.salaryType === "salary+incentives" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="number"
                        name="salaryBase"
                        value={salaryAmount}
                        onChange={(e) => setSalaryAmount(e.target.value)}
                        placeholder="Salary"
                        className={inputClass}
                        min="0"
                        required
                      />
                      <input
                        type="number"
                        name="salaryIncentive"
                        value={incentiveAmount}
                        onChange={(e) => setIncentiveAmount(e.target.value)}
                        placeholder="Incentives"
                        className={inputClass}
                        min="0"
                        required
                      />
                      <input
                        type="number"
                        name="salaryTotal"
                        value={totalSalary}
                        readOnly
                        placeholder="Total"
                        className={`${inputClass} bg-gray-100`}
                      />
                    </div>
                  )}
                </div>

                {/* Benefits */}
                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium text-gray-800">
                    Job Benefits
                  </label>
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
                          aria-label={`Remove ${b}`}
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
                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium text-gray-800">
                    Skills
                  </label>
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
                          aria-label={`Remove ${skill}`}
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
                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium text-gray-800">
                    Documents Required
                  </label>
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
                          aria-label={`Remove ${d}`}
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
                  <div className="mt-2">
                    <input
                      placeholder="Add another document (optional)"
                      value={otherDocument}
                      onChange={(e) => setOtherDocument(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Working Days */}
                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium text-gray-800">
                    Working Days <span className="text-red-600">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* From Dropdown */}
                    <select
                      name="workingDaysFrom"
                      value={formData.workingDaysFrom}
                      onChange={handleChange}
                      className={inputClass}
                      required
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
                      name="workingDaysTo"
                      value={formData.workingDaysTo}
                      onChange={handleChange}
                      className={inputClass}
                      required
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
                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium text-gray-800">
                    Timing <span className="text-red-600">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          startTime: e.target.value,
                        }))
                      }
                      className={inputClass}
                      required
                    />
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          endTime: e.target.value,
                        }))
                      }
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                {/* Shift */}
                <div>
                  <label
                    className="block mb-1 font-medium text-gray-800"
                    htmlFor="shift"
                  >
                    Shift <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="shift"
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select Shift</option>
                    <option value="Day">Day</option>
                    <option value="Night">Night</option>
                    <option value="Rotational">Rotational</option>
                  </select>
                </div>

                {/* Weekend */}
                <div>
                  <label
                    className="block mb-1 font-medium text-gray-800"
                    htmlFor="weekend"
                  >
                    Weekend <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="weekend"
                    name="weekend"
                    value={formData.weekend}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Saturday-Sunday Off">Sat-Sun Off</option>
                    <option value="Sunday Off">Sunday Off</option>
                    <option value="Rotational Off">Rotational</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[#D4AF37] hover:underline"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-[#D4AF37] text-white px-6 py-2 rounded-lg hover:brightness-95 disabled:opacity-60"
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