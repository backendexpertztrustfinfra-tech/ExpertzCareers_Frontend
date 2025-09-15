import React, { useState, useContext } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthContext } from "../context/AuthContext";
import { updateRecruiterProfile } from "../../src/services/apis";

const RecSign = () => {
  const [companyType, setCompanyType] = useState(null);
  const [verificationType, setVerificationType] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    recruterPhone: "",
    recruterCompany: "",
    recruterCompanyAddress: "",
    recruterGstIn: "",
    recruterIndustry: "",
    logo: "",
  });

  const companyTypes = [
    { value: "Proprietorship", label: "Proprietorship" },
    { value: "Partnership", label: "Partnership" },
    { value: "OPC", label: "OPC" },
    { value: "LLP", label: "LLP" },
    { value: "PVT LTD", label: "PVT LTD" },
    { value: "LTD", label: "LTD" },
  ];

  const verificationOptions = [
    { value: "gst", label: "GST Number" },
    { value: "document", label: "Upload Company Document" },
  ];

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "white",
      borderColor: "#D4AF37",
      color: "#000",
      boxShadow: "none",
      "&:hover": { borderColor: "#D4AF37" },
    }),
    option: (styles, { isFocused }) => ({
      ...styles,
      backgroundColor: isFocused ? "#FDF8F0" : "white",
      color: "#000",
      cursor: "pointer",
    }),
    singleValue: (base) => ({ ...base, color: "#000" }),
    placeholder: (base) => ({ ...base, color: "#888" }),
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyType) {
      alert("Please select company type.");
      return;
    }

    if (!verificationType) {
      alert("Please select verification type.");
      return;
    }

    // GST validation
    if (verificationType.value === "gst") {
      if (!formData.recruterGstIn || formData.recruterGstIn.length !== 15) {
        alert("Please enter a valid 15-digit GSTIN.");
        return;
      }
    }

    // Document validation
    if (verificationType.value === "document" && !documentFile) {
      alert("Please upload a valid company document.");
      return;
    }

    const token = Cookies.get("userToken");
    const payload = {
      ...formData,
      recruterCompanyType: companyType.value,
      verificationType: verificationType.value,
      documentFile: documentFile ? documentFile.name : null, // आप backend में file upload भी भेज सकते हैं FormData से
    };

    try {
      const response = await updateRecruiterProfile(token, payload, login);

      if (response.msg === "User Update Succssfully") {
        console.log("Profile updated:", response.ObjectUpdatedData);

        if (response.ObjectUpdatedData) {
          await login(response.ObjectUpdatedData);
        }

        navigate("/admin", { replace: true });
      } else {
        alert(response.msg || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] flex justify-center items-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg border-2 border-[#D4AF37]">
        <h2 className="text-3xl text-center mb-6 text-[#D4AF37] font-bold">
          Build your dream team with trusted local talent – start hiring today!
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white border border-[#D4AF37] focus:outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white border border-[#D4AF37] focus:outline-none"
            required
          />

          <input
            type="tel"
            name="recruterPhone"
            placeholder="Enter Phone Number"
            value={formData.recruterPhone}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white border border-[#D4AF37] focus:outline-none"
            required
          />
          <input
            type="text"
            name="recruterCompany"
            placeholder="Company Name"
            value={formData.recruterCompany}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white border border-[#D4AF37] focus:outline-none"
            required
          />

          <label className="block">Company Type</label>
          <Select
            options={companyTypes}
            value={companyType}
            onChange={setCompanyType}
            styles={customStyles}
            placeholder="Select Company Type"
            isSearchable={false}
          />

          <textarea
            name="recruterCompanyAddress"
            placeholder="Company’s Address"
            rows="3"
            value={formData.recruterCompanyAddress}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white border border-[#D4AF37] focus:outline-none"
            required
          ></textarea>

          {/* Verification Section */}
          <label className="block">Verification Type</label>
          <Select
            options={verificationOptions}
            value={verificationType}
            onChange={setVerificationType}
            styles={customStyles}
            placeholder="Select Verification Type"
            isSearchable={false}
          />

          {verificationType?.value === "gst" && (
            <input
              type="text"
              name="recruterGstIn"
              placeholder="Enter GSTIN (15 digits)"
              value={formData.recruterGstIn}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white border border-[#D4AF37] focus:outline-none"
              required
            />
          )}

          {verificationType?.value === "document" && (
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full p-2 rounded bg-white border border-[#D4AF37] focus:outline-none"
              required
            />
          )}

          <input
            type="text"
            name="recruterIndustry"
            placeholder="Industry"
            value={formData.recruterIndustry}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white border border-[#D4AF37] focus:outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-[#D4AF37] text-white py-2 rounded hover:opacity-90"
          >
            Verify & Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecSign;