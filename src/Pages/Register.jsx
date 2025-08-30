import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { updateUserProfile } from "../../src/services/apis"; 

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    previousCompany: "",
    experience: "",
    previousSalary: "",
    salaryExpectation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const token = Cookies.get("userToken");

  if (!token) {
    alert("You must be logged in to update your profile.");
    return;
  }

  const payload = {
    username: formData.name,
    useremail: formData.email,
    designation: formData.designation,
    previousCompany: formData.previousCompany,
    experience: formData.experience,
    previousSalary: formData.previousSalary,
    salaryExpectation: formData.salaryExpectation,
  };

  try {
    const response = await updateUserProfile(token, payload);

    if (response?.msg === "User Update Succssfully") {
      const role = formData.designation?.toLowerCase().trim();
      const exp = formData.experience?.toLowerCase().trim();
      navigate(`/jobs?role=${role}&experience=${exp}`);
    } else {
      alert(response?.msg || "Profile update failed.");
    }
  } catch (err) {
    console.error("Update failed:", err);
    alert("Something went wrong.");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4 bg-[#fdfaf5]">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl p-8">
        <h2 className="text-3xl font-bold text-center text-[#D4AF37] mb-2">
          Register
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Create your profile to get started with Expertz Careers
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Form Fields */}
          {[
            { label: "Full Name", name: "name" },
            { label: "Email", name: "email", type: "email" },
            { label: "Designation", name: "designation", placeholder: "e.g. Frontend Developer" },
            { label: "Previous Company", name: "previousCompany", placeholder: "e.g. TCS" },
            { label: "Previous Salary (Monthly)", name: "previousSalary", placeholder: "e.g. ₹30,000" },
            { label: "Salary Expectation (Monthly)", name: "salaryExpectation", placeholder: "e.g. ₹40,000" },
          ].map(({ label, name, ...rest }) => (
            <div key={name}>
              <label className="block text-gray-700 mb-1">{label}</label>
              <input
                type={rest.type || "text"}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                placeholder={rest.placeholder}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          ))}

          <div>
            <label className="block text-gray-700 mb-1">Years of Experience</label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="">Select experience</option>
              <option value="0-1 years">0-1 years</option>
              <option value="1-3 years">1-3 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="More than 5 years">More than 5 years</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#D4AF37] hover:bg-[#c9a232] text-white font-semibold py-2 rounded-lg transition"
          >
            Register & Find Jobs
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
