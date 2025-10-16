
import React, { useState, useContext } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthContext } from "../context/AuthContext";
import { updateRecruiterProfile, getRecruiterProfile } from "../services/apis";
import { Download, UploadCloud, XCircle } from "lucide-react";
import { useLocation } from "react-router-dom";

const RecSign = () => {
    const [companyType, setCompanyType] = useState(null);
    const [verificationType, setVerificationType] = useState(null);
    const [documentFile, setDocumentFile] = useState(null);
    const [selectedDocType, setSelectedDocType] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const signupData = location.state?.signupData || {};
    const verifiedEmail = location.state?.verifiedEmail || "";
    const { user, login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
         name: user?.username || Cookies.get("prefillName") || "",
  email: user?.useremail || Cookies.get("prefillEmail") || "",
        recruterPhone: "",
        recruterCompany: "",
        recruterCompanyAddress: "",
        recruterGstIn: "",
        recruterIndustry: "",
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
        { value: "gst", label: "GST Verification" },
        { value: "document", label: "Upload Company Document" },
    ];

    const companyDocs = [
        "PAN Card",
        "CIN Certificate",
        "Incorporation Certificate",
        "Trade License",
        "Shop & Establishment Certificate",
    ];

    const handleChange = (e) =>
        setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

    const handleFileChange = (e) => {
        setDocumentFile(e.target.files?.[0] || null);
    };

    const removeFile = () => {
        setDocumentFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.name ||
            !formData.email ||
            !formData.recruterPhone ||
            !formData.recruterCompany ||
            !formData.recruterCompanyAddress ||
            !formData.recruterIndustry
        ) {
            alert("Please fill all required fields.");
            return;
        }
        if (!companyType) {
            alert("Please select company type.");
            return;
        }
        if (!verificationType) {
            alert("Please select verification type.");
            return;
        }
        if (verificationType.value === "gst") {
            if (!formData.recruterGstIn || formData.recruterGstIn.length !== 15) {
                alert("Please enter a valid 15-digit GSTIN.");
                return;
            }
            if (!documentFile) {
                alert("Please upload GST certificate.");
                return;
            }
        }
        if (verificationType.value === "document") {
            if (!selectedDocType) {
                alert("Please select a document type.");
                return;
            }
            if (!documentFile) {
                alert("Please upload the selected company document.");
                return;
            }
        }

        const token = Cookies.get("userToken");
        if (!token) {
            alert("Not authenticated");
            return;
        }

        setLoading(true);

        const fd = new FormData();
        if (documentFile) fd.append("recruterCompanyDoc", documentFile);

        // map UI values to backend fields:
        fd.append("username", formData.name);
        fd.append("useremail", formData.email);
        fd.append("recruterPhone", formData.recruterPhone);
        fd.append("recruterCompany", formData.recruterCompany);
        fd.append("recruterCompanyAddress", formData.recruterCompanyAddress);
        fd.append("recruterGstIn", formData.recruterGstIn || "");
        fd.append("recruterIndustry", formData.recruterIndustry);
        fd.append("recruterCompanyType", companyType.value);
        fd.append("verificationType", verificationType.value);
        fd.append("selectedDocType", selectedDocType || "");

        try {
            const response = await updateRecruiterProfile(token, fd);

            if (response?.msg === "User Update Succssfully") {
                if (response.token && login) {
                    // ⚡ Pass full data into login so context stays consistent
                    login(
                        response.token,
                        "recruiter", 
                        true,      
                        formData.name,
                        formData.email
                    );
                }

                const updatedProfile = await getRecruiterProfile(token);
                console.log("Profile re-fetched successfully after update.");

                alert("Profile updated successfully");
                navigate("/admin", { replace: true });
            }
            else {
                alert(response?.msg || "Failed to update profile.");
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            alert("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center py-10 px-4">
            <div className="w-full max-w-4xl bg-white p-10 rounded-2xl shadow-2xl border border-gray-200">
                <h2 className="text-3xl text-center mb-8 text-[#D4AF37] font-bold">
                    Recruiter / Company Registration
                </h2>

                <form onSubmit={handleSubmit} className="space-y-8 text-black">
                    {/* Personal Info */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                                required
                                readOnly
                            />
                            <input
                                type="tel"
                                name="recruterPhone"
                                placeholder="Phone Number"
                                value={formData.recruterPhone}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                                required
                            />
                            <input
                                type="text"
                                name="recruterCompany"
                                placeholder="Company Name"
                                value={formData.recruterCompany}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Company Information</h3>
                        <div className="space-y-4">
                            <Select
                                options={companyTypes}
                                value={companyType}
                                onChange={setCompanyType}
                                placeholder="Select Company Type"
                                isSearchable={false}
                            />

                            <textarea
                                name="recruterCompanyAddress"
                                placeholder="Company Address"
                                rows="3"
                                value={formData.recruterCompanyAddress}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                                required
                            ></textarea>

                            <input
                                type="text"
                                name="recruterIndustry"
                                placeholder="Industry"
                                value={formData.recruterIndustry}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Verification */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Verification</h3>
                        <Select
                            options={verificationOptions}
                            value={verificationType}
                            onChange={setVerificationType}
                            placeholder="Select Verification Type"
                            isSearchable={false}
                        />

                        {verificationType?.value === "gst" && (
                            <div className="mt-6 space-y-4">
                                <input
                                    type="text"
                                    name="recruterGstIn"
                                    placeholder="Enter GSTIN (15 digits)"
                                    value={formData.recruterGstIn}
                                    onChange={handleChange}
                                    maxLength={15}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                                />

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#D4AF37] transition">
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="gstFile"
                                    />
                                    <label
                                        htmlFor="gstFile"
                                        className="flex flex-col items-center cursor-pointer"
                                    >
                                        <UploadCloud className="w-8 h-8 text-gray-500" />
                                        <span className="text-sm text-gray-600 mt-2">
                                            Click to upload GST Certificate
                                        </span>
                                    </label>
                                </div>

                                {documentFile && (
                                    <div className="mt-3 flex items-center gap-3">
                                        {documentFile.type === "application/pdf" ? (
                                            <a
                                                href={URL.createObjectURL(documentFile)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 underline"
                                            >
                                                <Download size={16} /> {documentFile.name}
                                            </a>
                                        ) : (
                                            <img
                                                src={URL.createObjectURL(documentFile)}
                                                alt="Preview"
                                                className="w-20 h-20 object-cover rounded-lg border"
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="flex items-center gap-1 text-red-500 hover:text-red-700"
                                        >
                                            <XCircle size={18} /> Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {verificationType?.value === "document" && (
                            <div className="mt-6 space-y-4">
                                <p className="font-medium">Select a document type</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {companyDocs.map((doc) => (
                                        <div
                                            key={doc}
                                            onClick={() => setSelectedDocType(doc)}
                                            className={`p-3 text-center border rounded-lg cursor-pointer transition ${selectedDocType === doc
                                                ? "bg-[#D4AF37] text-white border-[#D4AF37]"
                                                : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                                                }`}
                                        >
                                            {doc}
                                        </div>
                                    ))}
                                </div>

                                {selectedDocType && (
                                    <>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#D4AF37] transition">
                                            <input
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="companyDoc"
                                            />
                                            <label
                                                htmlFor="companyDoc"
                                                className="flex flex-col items-center cursor-pointer"
                                            >
                                                <UploadCloud className="w-8 h-8 text-gray-500" />
                                                <span className="text-sm text-gray-600 mt-2">
                                                    Click to upload {selectedDocType}
                                                </span>
                                            </label>
                                        </div>

                                        {documentFile && (
                                            <div className="mt-3 flex items-center gap-3">
                                                {documentFile.type === "application/pdf" ? (
                                                    <a
                                                        href={URL.createObjectURL(documentFile)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 text-blue-600 underline"
                                                    >
                                                        <Download size={16} /> {documentFile.name}
                                                    </a>
                                                ) : (
                                                    <img
                                                        src={URL.createObjectURL(documentFile)}
                                                        alt="Preview"
                                                        className="w-20 h-20 object-cover rounded-lg border"
                                                    />
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={removeFile}
                                                    className="flex items-center gap-1 text-red-500 hover:text-red-700"
                                                >
                                                    <XCircle size={18} /> Remove
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#D4AF37] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
                    >
                        Verify & Signup
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RecSign;