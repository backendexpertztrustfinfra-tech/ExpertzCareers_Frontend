
// // import React, { useState } from "react";
// // import { useNavigate, useLocation } from "react-router-dom";
// // import Cookies from "js-cookie";
// // import { updateUserProfile } from "../../src/services/apis";

// // const Register = () => {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const signupData = location.state?.signupData || {};
// //   const verifiedEmail = location.state?.verifiedEmail || "";

// //   const [formData, setFormData] = useState({
// //     useremail: verifiedEmail,
// //     qualification: "",
// //     fieldOfStudy: "",
// //     designation: "",
// //     experienceType: "",
// //     experienceYears: "",
// //     previousCompany: "",
// //     previousSalary: "",
// //     salaryExpectation: "",
// //   });

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   // ✅ Submit form
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     const token = Cookies.get("userToken");
// //     if (!token) {
// //       alert("You must be logged in to update your profile.");
// //       return;
// //     }

// //     const payload = {
// //       ...formData,
// //     };

// //     try {
// //       const response = await updateUserProfile(token, payload);

// //       if (response?.msg === "User Update Succssfully") {
// //         const role = formData.designation?.toLowerCase().trim();
// //         const exp =
// //           formData.experienceType === "Experienced"
// //             ? formData.experienceYears
// //             : "fresher";
// //         navigate(`/jobs?role=${role}&experience=${exp}`);
// //       } else {
// //         alert(response?.msg || "Profile update failed.");
// //       }
// //     } catch (err) {
// //       console.error("Update failed:", err);
// //       alert("Something went wrong.");
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center py-10 px-4 bg-[#fff1ed]">
// //       <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-8">
// //         <h2 className="text-3xl font-bold text-center text-[#caa057] mb-2">
// //           Register
// //         </h2>
// //         <p className="text-center text-gray-600 mb-8">
// //           Verify your email first, then complete your profile.
// //         </p>

// //         <form onSubmit={handleSubmit} className="space-y-5">
// //           {/* Email field */}
// //           <div>
// //             <label className="block text-gray-700 mb-1">Email</label>
// //             <input
// //               type="email"
// //               name="useremail"
// //               value={formData.useremail}
// //               disabled
// //               className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
// //             />
// //           </div>


// //           {/* Qualification */}
// //           <div>
// //             <label className="block text-gray-700 mb-1">Qualification</label>
// //             <select
// //               name="qualification"
// //               value={formData.qualification}
// //               onChange={handleChange}
// //               required
// //               className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
// //             >
// //               <option value="">Select</option>
// //               <option value="10th">10th Passed</option>
// //               <option value="12TH">12th Passed</option>
// //               <option value="Pursuing">Pursuing</option>
// //               <option value="Graduate">Graduate</option>
// //               <option value="Post Graduate">Post Graduate</option>
// //             </select>
// //           </div>

// //           {/* Field of Study (only if Graduate or Post Graduate) */}
// //           {(formData.qualification === "Pursuing" ||
// //             formData.qualification === "Graduate" ||
// //             formData.qualification === "Post Graduate") && (
// //               <div>
// //                 <label className="block text-gray-700 mb-1">
// //                   Field of Study
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="fieldOfStudy"
// //                   value={formData.fieldOfStudy}
// //                   onChange={handleChange}
// //                   placeholder="e.g. Computer Science, Commerce"
// //                   className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
// //                 />
// //               </div>
// //             )}

// //           {/* Skills */}
// //           <div>
// //             <label className="block text-gray-700 mb-1">Skills</label>
// //             <div className="grid grid-cols-2 gap-2 mb-3">
// //               {["Adaptability", "Teamwork", "Problem Solving", "Leadership", "Project Management", " Good Communication skills"].map((skill) => (
// //                 <label key={skill} className="flex items-center space-x-2">
// //                   <input
// //                     type="checkbox"
// //                     value={skill}
// //                     checked={formData.skills?.includes(skill)}
// //                     onChange={(e) => {
// //                       if (e.target.checked) {
// //                         setFormData((prev) => ({
// //                           ...prev,
// //                           skills: [...(prev.skills || []), skill],
// //                         }));
// //                       } else {
// //                         setFormData((prev) => ({
// //                           ...prev,
// //                           skills: prev.skills.filter((s) => s !== skill),
// //                         }));
// //                       }
// //                     }}
// //                     className="rounded text-[#caa057] focus:ring-[#caa057]"
// //                   />
// //                   <span>{skill}</span>
// //                 </label>
// //               ))}
// //             </div>

// //             {/* Manual skill input */}
// //             <input
// //               type="text"
// //               placeholder="Add other skills"
// //               onKeyDown={(e) => {
// //                 if (e.key === "Enter" && e.target.value.trim() !== "") {
// //                   e.preventDefault();
// //                   const newSkill = e.target.value.trim();
// //                   if (!formData.skills?.includes(newSkill)) {
// //                     setFormData((prev) => ({
// //                       ...prev,
// //                       skills: [...(prev.skills || []), newSkill],
// //                     }));
// //                   }
// //                   e.target.value = "";
// //                 }
// //               }}
// //               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#caa057] disabled:bg-gray-100"
// //             />

// //             {/* Show selected skills */}
// //             {formData.skills?.length > 0 && (
// //               <div className="flex flex-wrap gap-2 mt-2">
// //                 {formData.skills.map((skill, idx) => (
// //                   <span
// //                     key={idx}
// //                     className="bg-[#caa057] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
// //                   >
// //                     {skill}
// //                     <button
// //                       type="button"
// //                       onClick={() =>
// //                         setFormData((prev) => ({
// //                           ...prev,
// //                           skills: prev.skills.filter((s) => s !== skill),
// //                         }))
// //                       }
// //                       className="ml-1 text-white hover:text-gray-200"
// //                     >
// //                       ✕
// //                     </button>
// //                   </span>
// //                 ))}
// //               </div>
// //             )}
// //           </div>

// //           {/* Designation */}
// //           <div>
// //             <label className="block text-gray-700 mb-1">Designation</label>
// //             <input
// //               type="text"
// //               name="designation"
// //               value={formData.designation}
// //               onChange={handleChange}
// //               required
// //               placeholder="e.g. Frontend Developer"
// //               className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
// //             />
// //           </div>

// //           {/* Experience Type */}
// //           <div>
// //             <label className="block text-gray-700 mb-1">Experience</label>
// //             <select
// //               name="experienceType"
// //               value={formData.experienceType}
// //               onChange={handleChange}
// //               required
// //               className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
// //             >
// //               <option value="">Select</option>
// //               <option value="Fresher">Fresher</option>
// //               <option value="Experienced">Experienced</option>
// //             </select>
// //           </div>

// //           {/* Show only if Experienced */}
// //           {formData.experienceType === "Experienced" && (
// //             <>
// //               <div>
// //                 <label className="block text-gray-700 mb-1">
// //                   Years of Experience
// //                 </label>
// //                 <select
// //                   name="experienceYears"
// //                   value={formData.experienceYears}
// //                   onChange={handleChange}
// //                   required
// //                   className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
// //                 >
// //                   <option value="">Select</option>
// //                   <option value="0-1 years">0-1 years</option>
// //                   <option value="1-3 years">1-3 years</option>
// //                   <option value="3-5 years">3-5 years</option>
// //                   <option value="5+ years">More than 5 years</option>
// //                 </select>
// //               </div>

// //               <div>
// //                 <label className="block text-gray-700 mb-1">
// //                   Previous Company
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="previousCompany"
// //                   value={formData.previousCompany}
// //                   onChange={handleChange}
// //                   placeholder="e.g. TCS"
// //                   className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-gray-700 mb-1">
// //                   Previous Salary (Monthly)
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="previousSalary"
// //                   value={formData.previousSalary}
// //                   onChange={handleChange}
// //                   placeholder="e.g. ₹30,000"
// //                   className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
// //                 />
// //               </div>
// //             </>
// //           )}

// //           {/* Salary Expectation */}
// //           <div>
// //             <label className="block text-gray-700 mb-1">
// //               Salary Expectation (Monthly)
// //             </label>
// //             <input
// //               type="text"
// //               name="salaryExpectation"
// //               value={formData.salaryExpectation}
// //               onChange={handleChange}
// //               required
// //               placeholder="e.g. ₹40,000"
// //               className="w-full border border-gray-300 rounded-lg px-4 py-2 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
// //             />
// //           </div>

// //           <button
// //             type="submit"
// //             className="w-full bg-[#caa057] hover:bg-[#b4924c] text-white font-semibold py-2 rounded-lg transition disabled:bg-gray-400"
// //           >
// //             Register & Find Jobs
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Register;

















// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Cookies from "js-cookie";
// import Cropper from "react-easy-crop";
// import Cropper from "react-easy-crop";
// import { updateUserProfile } from "../../src/services/apis";

// const Register = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const signupData = location.state?.signupData || {};
//   const verifiedEmail = location.state?.verifiedEmail || "";

//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     username: signupData.username || "",
//     useremail: verifiedEmail,
//     phonenumber: "",
//     designation: "",
//     profilphoto: null,
//     qualification: "",
//     passingYear: "",
//     college: "",
//     university: "",
//     skills: [],
//     experienceType: "",
//     experiences: [], // [{ company, role, duration, salary }]
//     resume: null,
//     salaryExpectation: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const addExperience = () => {
//     setFormData((prev) => ({
//       ...prev,
//       experiences: [...prev.experiences, { company: "", role: "", duration: "", salary: "" }],
//     }));
//   };

//   const handleSubmit = async () => {
//     const token = Cookies.get("userToken");
//     if (!token) return alert("Please login again.");

//     const payload = { ...formData };

//     const res = await updateUserProfile(token, payload);
//     if (res?.msg?.includes("Succssfully")) {
//       alert("✅ Profile updated!");
//       navigate("/jobs");
//     } else {
//       alert(res?.msg || "Update failed");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#fff1ed] flex items-center justify-center">
//       <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-8">
//         <h2 className="text-2xl font-bold text-[#caa057] mb-4">
//           Step {step} of 5
//         </h2>

//         {/* Step 1: Basic Info */}
//         {step === 1 && (
//           <div className="space-y-4">
//             <input type="text" value={formData.username} disabled className="w-full border px-3 py-2 bg-gray-100" />
//             <input type="email" value={formData.useremail} disabled className="w-full border px-3 py-2 bg-gray-100" />
//             <input type="text" name="phonenumber" placeholder="Phone" value={formData.phonenumber} onChange={handleChange} className="w-full border px-3 py-2" />
//             <input type="text" name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} className="w-full border px-3 py-2" />
//           </div>
//         )}

//         {/* Step 2: Profile Photo */}
//         {step === 2 && (
//           <div>
//             <p>Upload & Crop Profile Photo</p>
//             <input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, profilphoto: e.target.files[0] })} />
//             {/* TODO: integrate Cropper with react-easy-crop */}
//           </div>
//         )}

//         {/* Step 3: Qualification */}
//         {step === 3 && (
//           <div className="space-y-4">
//             <select name="qualification" value={formData.qualification} onChange={handleChange} className="w-full border px-3 py-2">
//               <option value="">Select Qualification</option>
//               <option value="10th">10th Passed</option>
//               <option value="12th">12th Passed</option>
//               <option value="Pursuing">Pursuing</option>
//               <option value="Graduate">Graduate</option>
//               <option value="Post Graduate">Post Graduate</option>
//             </select>

//             {(formData.qualification === "Pursuing" || formData.qualification === "Graduate" || formData.qualification === "Post Graduate") && (
//               <>
//                 <input type="text" name="passingYear" placeholder="Passing Year" value={formData.passingYear} onChange={handleChange} className="w-full border px-3 py-2" />
//                 <input type="text" name="college" placeholder="College Name" value={formData.college} onChange={handleChange} className="w-full border px-3 py-2" />
//                 <input type="text" name="university" placeholder="University Name" value={formData.university} onChange={handleChange} className="w-full border px-3 py-2" />
//               </>
//             )}
//           </div>
//         )}

//         {/* Step 4: Skills & Experience */}
//         {step === 4 && (
//           <div>
//             <p>Skills</p>
//             <div className="grid grid-cols-2 gap-2">
//               {["Adaptability", "Teamwork", "Leadership"].map((skill) => (
//                 <label key={skill}>
//                   <input type="checkbox" value={skill} checked={formData.skills.includes(skill)} onChange={(e) => {
//                     if (e.target.checked) setFormData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
//                     else setFormData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
//                   }} />
//                   {skill}
//                 </label>
//               ))}
//             </div>
//             <input type="text" placeholder="Add skill" onKeyDown={(e) => {
//               if (e.key === "Enter" && e.target.value.trim() !== "") {
//                 setFormData((prev) => ({ ...prev, skills: [...prev.skills, e.target.value.trim()] }));
//                 e.target.value = "";
//               }
//             }} className="border px-3 py-2 w-full" />

//             <p className="mt-4">Experience</p>
//             <select name="experienceType" value={formData.experienceType} onChange={handleChange} className="w-full border px-3 py-2">
//               <option value="">Select</option>
//               <option value="Fresher">Fresher</option>
//               <option value="Experienced">Experienced</option>
//             </select>

//             {formData.experienceType === "Experienced" && (
//               <div>
//                 {formData.experiences.map((exp, i) => (
//                   <div key={i} className="border p-2 my-2">
//                     <input type="text" placeholder="Company" value={exp.company} onChange={(e) => {
//                       const updated = [...formData.experiences];
//                       updated[i].company = e.target.value;
//                       setFormData({ ...formData, experiences: updated });
//                     }} className="w-full border px-3 py-2" />
//                     <input type="text" placeholder="Role" value={exp.role} onChange={(e) => {
//                       const updated = [...formData.experiences];
//                       updated[i].role = e.target.value;
//                       setFormData({ ...formData, experiences: updated });
//                     }} className="w-full border px-3 py-2" />
//                   </div>
//                 ))}
//                 <button type="button" onClick={addExperience} className="bg-[#caa057] text-white px-3 py-1 rounded">+ Add Experience</button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Step 5: Resume */}
//         {step === 5 && (
//           <div>
//             <p>Upload Resume</p>
//             <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFormData({ ...formData, resume: e.target.files[0] })} />
//             <input type="text" name="salaryExpectation" placeholder="Salary Expectation" value={formData.salaryExpectation} onChange={handleChange} className="w-full border px-3 py-2 mt-2" />
//           </div>
//         )}

//         {/* Navigation */}
//         <div className="flex justify-between mt-6">
//           {step > 1 && <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-200 rounded">Back</button>}
//           {step < 5 && <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-[#caa057] text-white rounded">Next</button>}
//           {step === 5 && <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;











import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import Cropper from "react-easy-crop";
import { updateUserProfile } from "../../src/services/apis";
import getCroppedImg from "../utils/cropImage";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const signupData = location.state?.signupData || {};
  const verifiedEmail = location.state?.verifiedEmail || "";

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: signupData.username || "",
    useremail: verifiedEmail,
    phone: "",
    designation: "",
    profilphoto: null,
    croppedPhoto: null,
    qualification: "",
    passingYear: "",
    college: "",
    university: "",
    skills: [],
    experienceType: "",
    experiences: [], 
    resume: null,
    salaryExpectation: "",
  });

  // Cropper states
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setFormData((prev) => ({ ...prev, croppedPhoto: croppedImage }));
      setImageSrc(null); 
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { company: "", role: "", duration: "", salary: "" },
      ],
    }));
  };

  const handleSubmit = async () => {
    const token = Cookies.get("userToken");
    if (!token) return alert("Please login again.");

    const payload = { ...formData };
    const res = await updateUserProfile(token, payload);
console.log(res, payload)
    if (res?.msg?.includes("Succssfully")) {
      alert("✅ Profile updated!");
      navigate("/jobs");
    } else {
      alert(res?.msg || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#fff1ed] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-8">
        <h2 className="text-2xl font-bold text-[#caa057] mb-6 text-center">
          Step {step} of 5
        </h2>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <input
              type="text"
              value={signupData.username}
              disabled
              className="w-full border px-3 py-2 bg-gray-100 rounded"
            />
            <input
              type="email"
              value={formData.useremail}
              disabled
              className="w-full border px-3 py-2 bg-gray-100 rounded"
            />
            <input
              type="text"
              name="phonenumber"
              placeholder="Phone"
              value={formData.phonenumber}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="designation"
              placeholder="Designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        )}

        {/* Step 2: Profile Photo */}
        {step === 2 && (
          <div className="space-y-4 text-center">
            <p className="font-medium text-gray-700">Upload & Crop Profile Photo</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => setImageSrc(reader.result);
                  reader.readAsDataURL(file);
                }
              }}
            />

            {imageSrc && (
              <div className="relative w-full h-64 bg-black mt-4">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
            )}

            {imageSrc && (
              <button
                onClick={showCroppedImage}
                className="mt-4 px-4 py-2 bg-[#caa057] text-white rounded"
              >
                Save Cropped Photo
              </button>
            )}

            {formData.croppedPhoto && (
              <div className="mt-4">
                <p className="text-gray-600">Preview:</p>
                <img
                  src={formData.croppedPhoto}
                  alt="Cropped"
                  className="w-32 h-32 rounded-full mx-auto border"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Qualification */}
        {step === 3 && (
          <div className="space-y-4">
            <select
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Qualification</option>
              <option value="10th">10th Passed</option>
              <option value="12th">12th Passed</option>
              <option value="Pursuing">Pursuing</option>
              <option value="Graduate">Graduate</option>
              <option value="Post Graduate">Post Graduate</option>
            </select>

            {(formData.qualification === "Pursuing" ||
              formData.qualification === "Graduate" ||
              formData.qualification === "Post Graduate") && (
              <>
                <input
                  type="text"
                  name="passingYear"
                  placeholder="Passing Year"
                  value={formData.passingYear}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="text"
                  name="college"
                  placeholder="College Name"
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="text"
                  name="university"
                  placeholder="University Name"
                  value={formData.university}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </>
            )}
          </div>
        )}

        {/* Step 4: Skills & Experience */}
        {step === 4 && (
          <div className="space-y-4">
            <p className="font-medium">Skills</p>
            <div className="grid grid-cols-2 gap-2">
              {["Adaptability", "Teamwork", "Leadership"].map((skill) => (
                <label key={skill} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={skill}
                    checked={formData.skills.includes(skill)}
                    onChange={(e) => {
                      if (e.target.checked)
                        setFormData((prev) => ({
                          ...prev,
                          skills: [...prev.skills, skill],
                        }));
                      else
                        setFormData((prev) => ({
                          ...prev,
                          skills: prev.skills.filter((s) => s !== skill),
                        }));
                    }}
                  />
                  {skill}
                </label>
              ))}
            </div>

            <input
              type="text"
              placeholder="Add skill"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim() !== "") {
                  setFormData((prev) => ({
                    ...prev,
                    skills: [...prev.skills, e.target.value.trim()],
                  }));
                  e.target.value = "";
                }
              }}
              className="border px-3 py-2 w-full rounded"
            />

            <p className="font-medium mt-4">Experience</p>
            <select
              name="experienceType"
              value={formData.experienceType}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select</option>
              <option value="Fresher">Fresher</option>
              <option value="Experienced">Experienced</option>
            </select>

            {formData.experienceType === "Experienced" && (
              <div className="space-y-4">
                {formData.experiences.map((exp, i) => (
                  <div key={i} className="border p-3 rounded space-y-2">
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...formData.experiences];
                        updated[i].company = e.target.value;
                        setFormData({ ...formData, experiences: updated });
                      }}
                      className="w-full border px-3 py-2 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Job Role"
                      value={exp.role}
                      onChange={(e) => {
                        const updated = [...formData.experiences];
                        updated[i].role = e.target.value;
                        setFormData({ ...formData, experiences: updated });
                      }}
                      className="w-full border px-3 py-2 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Time Period (e.g. 2021-2023)"
                      value={exp.duration}
                      onChange={(e) => {
                        const updated = [...formData.experiences];
                        updated[i].duration = e.target.value;
                        setFormData({ ...formData, experiences: updated });
                      }}
                      className="w-full border px-3 py-2 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Salary"
                      value={exp.salary}
                      onChange={(e) => {
                        const updated = [...formData.experiences];
                        updated[i].salary = e.target.value;
                        setFormData({ ...formData, experiences: updated });
                      }}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addExperience}
                  className="bg-[#caa057] text-white px-3 py-1 rounded"
                >
                  + Add Experience
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Resume */}
        {step === 5 && (
          <div className="space-y-4">
            <p className="font-medium">Upload Resume</p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                setFormData({ ...formData, resume: e.target.files[0] })
              }
            />
            <input
              type="text"
              name="salaryExpectation"
              placeholder="Salary Expectation"
              value={formData.salaryExpectation}
              onChange={handleChange}
              className="w-full border px-3 py-2 mt-2 rounded"
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Back
            </button>
          )}
          {step < 5 && (
            <button
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 bg-[#caa057] text-white rounded"
            >
              Next
            </button>
          )}
          {step === 5 && (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
