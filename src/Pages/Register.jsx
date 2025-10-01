// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Cookies from "js-cookie";

// const Register = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const signupData = location.state || {};

//   const [formData, setFormData] = useState({
//     username: signupData.username || "",
//     useremail: signupData.useremail || "",
//     phonenumber: "",
//     designation: "",
//     profilphoto: null,
//     resume: null,
//     Skill: [""],
//   });

//   // Qualification as array
//   const [qualifications, setQualifications] = useState([
//     {
//       degree: "",
//       institution: "",
//       board: "",
//       university: "",
//       fieldOfStudy: "",
//       startDate: "",
//       endDate: "",
//       pursuing: false,
//     },
//   ]);

//   // Experience as array
//   const [Experience, setExperience] = useState([
//     {
//       company: "",
//       designation: "",
//       startDate: "",
//       endDate: "",
//       currentlyWorking: false,
//     },
//   ]);

//   // General input handler
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       setFormData((prev) => ({ ...prev, [name]: files[0] }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   // Submit handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = Cookies.get("userToken");
//     if (!token) return alert("Please login again.");

//     const payload = new FormData();

//     // Append basic formData
//     Object.entries(formData).forEach(([key, value]) => {
//       if (value) {
//         if (key === "Skill") payload.append(key, JSON.stringify(value));
//         else payload.append(key, value);
//       }
//     });

//     // Append qualifications & Experience as JSON
//     payload.append("qualification", JSON.stringify(qualifications));
//     payload.append("experience", JSON.stringify(Experience));

//     try {
//       const res = await fetch(
//         "https://expertzcareers-backend.onrender.com/jobseeker/updateProfile",
//         {
//           method: "PUT",
//           headers: { Authorization: `Bearer ${token}` },
//           body: payload,
//         }
//       );
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Update failed");
//       alert("✅ Profile updated!");
//       navigate("/jobs");
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong!");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#fff1ed] p-4">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-4xl space-y-6"
//       >
//         <h2 className="text-3xl font-bold text-[#caa057] text-center mb-6">
//           Complete Your Profile
//         </h2>

//         {/* Basic Info */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             placeholder="Full Name"
//             className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//             required
//           />
//           <input
//             type="email"
//             name="useremail"
//             value={formData.useremail}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//             required
//           />
//           <input
//             type="text"
//             name="phonenumber"
//             value={formData.phonenumber}
//             onChange={handleChange}
//             placeholder="Phone Number"
//             className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//             required
//           />
//           <input
//             type="text"
//             name="designation"
//             value={formData.designation}
//             onChange={handleChange}
//             placeholder="Designation"
//             className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//             required
//           />
//         </div>

//         {/* Skills */}
//         <div>
//           <h3 className="font-semibold mb-2">Skills</h3>
//           {formData.Skill.map((skill, index) => (
//             <div key={index} className="flex gap-2 mb-2 items-center">
//               <input
//                 type="text"
//                 value={skill}
//                 onChange={(e) => {
//                   const newSkill = [...formData.Skill];
//                   newSkill[index] = e.target.value;
//                   setFormData((prev) => ({ ...prev, Skill: newSkill }));
//                 }}
//                 placeholder="Skill"
//                 className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//               />
//               {index > 0 && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     const newSkill = [...formData.Skill];
//                     newSkill.splice(index, 1);
//                     setFormData((prev) => ({ ...prev, Skill: newSkill }));
//                   }}
//                   className="text-red-500 font-bold"
//                 >
//                   X
//                 </button>
//               )}
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={() =>
//               setFormData((prev) => ({ ...prev, Skill: [...prev.Skill, ""] }))
//             }
//             className="text-[#caa057] font-semibold mb-4"
//           >
//             + Add Skill
//           </button>
//         </div>

//         {/* Qualifications */}
//         <div>
//           <h3 className="font-semibold mb-2">Qualifications</h3>
//           {qualifications.map((q, index) => (
//             <div
//               key={index}
//               className="border p-4 rounded-lg mb-3 bg-[#fff7f0] space-y-2"
//             >
//               <input
//                 type="text"
//                 name="degree"
//                 value={q.degree}
//                 onChange={(e) => {
//                   const updated = [...qualifications];
//                   updated[index].degree = e.target.value;
//                   setQualifications(updated);
//                 }}
//                 placeholder="Degree / Certification"
//                 className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//                 required
//               />
//               <input
//                 type="text"
//                 name="institution"
//                 value={q.institution}
//                 onChange={(e) => {
//                   const updated = [...qualifications];
//                   updated[index].institution = e.target.value;
//                   setQualifications(updated);
//                 }}
//                 placeholder="Institution"
//                 className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//                 required
//               />
//               <div className="flex gap-2">
//                 <input
//                   type="date"
//                   name="startDate"
//                   value={q.startDate}
//                   onChange={(e) => {
//                     const updated = [...qualifications];
//                     updated[index].startDate = e.target.value;
//                     setQualifications(updated);
//                   }}
//                   className="border px-2 py-1 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//                 />
//                 <input
//                   type="date"
//                   name="endDate"
//                   value={q.endDate}
//                   onChange={(e) => {
//                     const updated = [...qualifications];
//                     updated[index].endDate = e.target.value;
//                     setQualifications(updated);
//                   }}
//                   className="border px-2 py-1 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//                   disabled={q.pursuing}
//                 />
//               </div>
//               <label className="flex items-center gap-2 mt-1">
//                 <input
//                   type="checkbox"
//                   checked={q.pursuing}
//                   onChange={(e) => {
//                     const updated = [...qualifications];
//                     updated[index].pursuing = e.target.checked;
//                     if (e.target.checked) updated[index].endDate = "";
//                     setQualifications(updated);
//                   }}
//                 />
//                 Currently Pursuing
//               </label>
//               {index > 0 && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     const updated = [...qualifications];
//                     updated.splice(index, 1);
//                     setQualifications(updated);
//                   }}
//                   className="text-red-500 font-bold"
//                 >
//                   Remove
//                 </button>
//               )}
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={() =>
//               setQualifications((prev) => [
//                 ...prev,
//                 {
//                   degree: "",
//                   institution: "",
//                   board: "",
//                   university: "",
//                   fieldOfStudy: "",
//                   startDate: "",
//                   endDate: "",
//                   pursuing: false,
//                 },
//               ])
//             }
//             className="text-[#caa057] font-semibold mb-4"
//           >
//             + Add Qualification
//           </button>
//         </div>

//         {/* Experience */}
//         <div>
//           <h3 className="font-semibold mb-2">Experience</h3>
//           {Experience.map((exp, index) => (
//             <div
//               key={index}
//               className="border p-4 rounded-lg mb-3 bg-[#fff7f0] space-y-2"
//             >
//               <input
//                 type="text"
//                 name="company"
//                 value={exp.company}
//                 onChange={(e) => {
//                   const updated = [...Experience];
//                   updated[index].company = e.target.value;
//                   setExperience(updated);
//                 }}
//                 placeholder="Company Name"
//                 className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//               />
//               <input
//                 type="text"
//                 name="designation"
//                 value={exp.designation}
//                 onChange={(e) => {
//                   const updated = [...Experience];
//                   updated[index].designation = e.target.value;
//                   setExperience(updated);
//                 }}
//                 placeholder="Designation"
//                 className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//               />
//               <div className="flex gap-2">
//                 <input
//                   type="date"
//                   name="startDate"
//                   value={exp.startDate}
//                   onChange={(e) => {
//                     const updated = [...Experience];
//                     updated[index].startDate = e.target.value;
//                     setExperience(updated);
//                   }}
//                   className="border px-2 py-1 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//                 />
//                 <input
//                   type="date"
//                   name="endDate"
//                   value={exp.endDate}
//                   onChange={(e) => {
//                     const updated = [...Experience];
//                     updated[index].endDate = e.target.value;
//                     setExperience(updated);
//                   }}
//                   className="border px-2 py-1 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//                   disabled={exp.currentlyWorking}
//                 />
//               </div>
//               <label className="flex items-center gap-2 mt-1">
//                 <input
//                   type="checkbox"
//                   checked={exp.currentlyWorking}
//                   onChange={(e) => {
//                     const updated = [...Experience];
//                     updated[index].currentlyWorking = e.target.checked;
//                     if (e.target.checked) updated[index].endDate = "";
//                     setExperience(updated);
//                   }}
//                 />
//                 Currently Working
//               </label>
//               {index > 0 && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     const updated = [...Experience];
//                     updated.splice(index, 1);
//                     setExperience(updated);
//                   }}
//                   className="text-red-500 font-bold"
//                 >
//                   Remove
//                 </button>
//               )}
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={() =>
//               setExperience((prev) => [
//                 ...prev,
//                 { company: "", designation: "", startDate: "", endDate: "", currentlyWorking: false },
//               ])
//             }
//             className="text-[#caa057] font-semibold mb-4"
//           >
//             + Add Experience
//           </button>
//         </div>

//         {/* File Uploads */}
//         <div className="space-y-2">
//           <input
//             type="file"
//             name="profilphoto"
//             onChange={handleChange}
//             accept="image/*"
//             className="w-full border px-3 py-2 rounded"
//           />
//           <input
//             type="file"
//             name="resume"
//             onChange={handleChange}
//             accept=".pdf,.doc,.docx"
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-[#caa057] hover:bg-[#b4924c] text-white font-semibold px-4 py-2 rounded transition"
//         >
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };


















// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Cookies from "js-cookie";

// const Register = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const signupData = location.state || {};

//   const [formData, setFormData] = useState({
//     username: signupData.username || "",
//     useremail: signupData.useremail || "",
//     phonenumber: "",
//     designation: "",
//     profilphoto: null,
//     resume: null,
//     Skill: [""],
//   });

//   // Qualification as array
//   const [qualifications, setQualifications] = useState([
//     {
//       degree: "",
//       institution: "",
//       board: "",
//       university: "",
//       fieldOfStudy: "",
//       startDate: "",
//       endDate: "",
//       pursuing: false,
//     },
//   ]);

//   // Experience type selection
//   const [experienceType, setExperienceType] = useState("Fresher");

//   // Experience details array (only if not fresher)
//   const [Experience, setExperience] = useState([
//     {
//       company: "",
//       designation: "",
//       startDate: "",
//       endDate: "",
//       currentlyWorking: false,
//     },
//   ]);

//   // General input handler
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       setFormData((prev) => ({ ...prev, [name]: files[0] }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = Cookies.get("userToken");
//     if (!token) return alert("Please login again.");

//     const payload = new FormData();

//     // Append basic formData
//     Object.entries(formData).forEach(([key, value]) => {
//       if (value) {
//         if (key === "Skill") payload.append(key, JSON.stringify(value));
//         else payload.append(key, value);
//       }
//     });

//     // Append qualifications
//     payload.append("qualification", JSON.stringify(qualifications));

//     // Append experience based on selection
//     if (experienceType === "Fresher") {
//       payload.append("experience", JSON.stringify([]));
//     } else {
//       payload.append("experience", JSON.stringify(Experience));
//     }

//     try {
//       const res = await fetch(
//         "https://expertzcareers-backend.onrender.com/jobseeker/updateProfile",
//         {
//           method: "PUT",
//           headers: { Authorization: `Bearer ${token}` },
//           body: payload,
//         }
//       );
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Update failed");
//       alert("✅ Profile updated!");
//       navigate("/jobs");
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong!");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#fff1ed] p-4">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-4xl space-y-6"
//       >
//         <h2 className="text-3xl font-bold text-[#caa057] text-center mb-6">
//           Complete Your Profile
//         </h2>

//         {/* Basic Info */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             placeholder="Full Name"
//             className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//             required
//           />
//           <input
//             type="email"
//             name="useremail"
//             value={formData.useremail}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//             required
//           />
//           <input
//             type="text"
//             name="phonenumber"
//             value={formData.phonenumber}
//             onChange={handleChange}
//             placeholder="Phone Number"
//             className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//             required
//           />
//           <input
//             type="text"
//             name="designation"
//             value={formData.designation}
//             onChange={handleChange}
//             placeholder="Designation"
//             className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//             required
//           />
//         </div>

//         {/* Skills */}
//         <div>
//           <h3 className="font-semibold mb-2">Skills</h3>
//           {formData.Skill.map((skill, index) => (
//             <div key={index} className="flex gap-2 mb-2 items-center">
//               <input
//                 type="text"
//                 value={skill}
//                 onChange={(e) => {
//                   const newSkill = [...formData.Skill];
//                   newSkill[index] = e.target.value;
//                   setFormData((prev) => ({ ...prev, Skill: newSkill }));
//                 }}
//                 placeholder="Skill"
//                 className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//               />
//               {index > 0 && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     const newSkill = [...formData.Skill];
//                     newSkill.splice(index, 1);
//                     setFormData((prev) => ({ ...prev, Skill: newSkill }));
//                   }}
//                   className="text-red-500 font-bold"
//                 >
//                   X
//                 </button>
//               )}
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={() =>
//               setFormData((prev) => ({ ...prev, Skill: [...prev.Skill, ""] }))
//             }
//             className="text-[#caa057] font-semibold mb-4"
//           >
//             + Add Skill
//           </button>
//         </div>

//         {/* Qualifications */}
//         <div>
//           <h3 className="font-semibold mb-2">Qualifications</h3>
//           {qualifications.map((q, index) => (
//             <div
//               key={index}
//               className="border p-4 rounded-lg mb-3 bg-[#fff7f0] space-y-2"
//             >
//               <input
//                 type="text"
//                 name="degree"
//                 value={q.degree}
//                 onChange={(e) => {
//                   const updated = [...qualifications];
//                   updated[index].degree = e.target.value;
//                   setQualifications(updated);
//                 }}
//                 placeholder="Degree / Certification"
//                 className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//                 required
//               />
//               <input
//                 type="text"
//                 name="institution"
//                 value={q.institution}
//                 onChange={(e) => {
//                   const updated = [...qualifications];
//                   updated[index].institution = e.target.value;
//                   setQualifications(updated);
//                 }}
//                 placeholder="Institution"
//                 className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//                 required
//               />
//               <div className="flex gap-2">
//                 <input
//                   type="date"
//                   name="startDate"
//                   value={q.startDate}
//                   onChange={(e) => {
//                     const updated = [...qualifications];
//                     updated[index].startDate = e.target.value;
//                     setQualifications(updated);
//                   }}
//                   className="border px-2 py-1 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//                 />
//                 <input
//                   type="date"
//                   name="endDate"
//                   value={q.endDate}
//                   onChange={(e) => {
//                     const updated = [...qualifications];
//                     updated[index].endDate = e.target.value;
//                     setQualifications(updated);
//                   }}
//                   className="border px-2 py-1 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//                   disabled={q.pursuing}
//                 />
//               </div>
//               <label className="flex items-center gap-2 mt-1">
//                 <input
//                   type="checkbox"
//                   checked={q.pursuing}
//                   onChange={(e) => {
//                     const updated = [...qualifications];
//                     updated[index].pursuing = e.target.checked;
//                     if (e.target.checked) updated[index].endDate = "";
//                     setQualifications(updated);
//                   }}
//                 />
//                 Currently Pursuing
//               </label>
//               {index > 0 && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     const updated = [...qualifications];
//                     updated.splice(index, 1);
//                     setQualifications(updated);
//                   }}
//                   className="text-red-500 font-bold"
//                 >
//                   Remove
//                 </button>
//               )}
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={() =>
//               setQualifications((prev) => [
//                 ...prev,
//                 {
//                   degree: "",
//                   institution: "",
//                   board: "",
//                   university: "",
//                   fieldOfStudy: "",
//                   startDate: "",
//                   endDate: "",
//                   pursuing: false,
//                 },
//               ])
//             }
//             className="text-[#caa057] font-semibold mb-4"
//           >
//             + Add Qualification
//           </button>
//         </div>

//         {/* Experience */}
//         <div>
//           <h3 className="font-semibold mb-2">Experience</h3>
//           <select
//             value={experienceType}
//             onChange={(e) => setExperienceType(e.target.value)}
//             className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//           >
//             <option value="Fresher">Fresher</option>
//             <option value="0-1 year">0-1 year</option>
//             <option value="1-5 years">1-5 years</option>
//             <option value="5-10 years">5-10 years</option>
//             <option value="10+ years">10+ years</option>
//           </select>

//           {experienceType !== "Fresher" &&
//             Experience.map((exp, index) => (
//               <div
//                 key={index}
//                 className="border p-4 rounded-lg mb-3 bg-[#fff7f0] space-y-2"
//               >
//                 <input
//                   type="text"
//                   name="company"
//                   value={exp.company}
//                   onChange={(e) => {
//                     const updated = [...Experience];
//                     updated[index].company = e.target.value;
//                     setExperience(updated);
//                   }}
//                   placeholder="Company Name"
//                   className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//                 />
//                 <input
//                   type="text"
//                   name="designation"
//                   value={exp.designation}
//                   onChange={(e) => {
//                     const updated = [...Experience];
//                     updated[index].designation = e.target.value;
//                     setExperience(updated);
//                   }}
//                   placeholder="Job Role / Designation"
//                   className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//                 />
//                 <div className="flex gap-2">
//                   <input
//                     type="date"
//                     name="startDate"
//                     value={exp.startDate}
//                     onChange={(e) => {
//                       const updated = [...Experience];
//                       updated[index].startDate = e.target.value;
//                       setExperience(updated);
//                     }}
//                     className="border px-2 py-1 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//                   />
//                   <input
//                     type="date"
//                     name="endDate"
//                     value={exp.endDate}
//                     onChange={(e) => {
//                       const updated = [...Experience];
//                       updated[index].endDate = e.target.value;
//                       setExperience(updated);
//                     }}
//                     className="border px-2 py-1 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
//                     disabled={exp.currentlyWorking}
//                   />
//                 </div>
//                 <label className="flex items-center gap-2 mt-1">
//                   <input
//                     type="checkbox"
//                     checked={exp.currentlyWorking}
//                     onChange={(e) => {
//                       const updated = [...Experience];
//                       updated[index].currentlyWorking = e.target.checked;
//                       if (e.target.checked) updated[index].endDate = "";
//                       setExperience(updated);
//                     }}
//                   />
//                   Currently Working
//                 </label>
//                 {index > 0 && (
//                   <button
//                     type="button"
//                     onClick={() => {
//                       const updated = [...Experience];
//                       updated.splice(index, 1);
//                       setExperience(updated);
//                     }}
//                     className="text-red-500 font-bold"
//                   >
//                     Remove
//                   </button>
//                 )}
//               </div>
//             ))}

//           {experienceType !== "Fresher" && (
//             <button
//               type="button"
//               onClick={() =>
//                 setExperience((prev) => [
//                   ...prev,
//                   {
//                     company: "",
//                     designation: "",
//                     startDate: "",
//                     endDate: "",
//                     currentlyWorking: false,
//                   },
//                 ])
//               }
//               className="text-[#caa057] font-semibold mb-4"
//             >
//               + Add Experience
//             </button>
//           )}
//         </div>

//         {/* File Uploads */}
//         <div className="space-y-2">
//           <input
//             type="file"
//             name="profilphoto"
//             onChange={handleChange}
//             accept="image/*"
//             className="w-full border px-3 py-2 rounded"
//           />
//           <input
//             type="file"
//             name="resume"
//             onChange={handleChange}
//             accept=".pdf,.doc,.docx"
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-[#caa057] hover:bg-[#b4924c] text-white font-semibold px-4 py-2 rounded transition"
//         >
//           Submit
//         </button>
//         </form>
//         </div>)}
// export default Register;








import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const signupData = location.state || {};

  const [formData, setFormData] = useState({
    username: signupData.username || "",
    useremail: signupData.useremail || "",
    phonenumber: "",
    designation: "",
    profilphoto: null,
    resume: null,
    Skill: [""],
  });

  // Qualifications array
  const [qualifications, setQualifications] = useState([
    {
      degree: "",
      institution: "",
      board: "",
      university: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      pursuing: false,
    },
  ]);

  // Experience type
  const [experienceType, setExperienceType] = useState("Fresher");

  // Experience array (only for non-Fresher)
  const [Experience, setExperience] = useState([
    { company: "", designation: "", startDate: "", endDate: "", currentlyWorking: false },
  ]);

  // General input handler
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("userToken");
    if (!token) return alert("Please login again.");

    const payload = new FormData();

    // Append basic info
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        if (key === "Skill") payload.append(key, JSON.stringify(value));
        else payload.append(key, value);
      }
    });

    // Append multiple qualifications
    payload.append("qualification", JSON.stringify(qualifications));

    // Append experience based on type
    payload.append("experience", JSON.stringify(experienceType === "Fresher" ? [] : Experience));

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
      alert("✅ Profile updated!");
      navigate("/jobs");
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff1ed] p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-4xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-[#caa057] text-center mb-6">
          Complete Your Profile
        </h2>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
            required
          />
          <input
            type="email"
            name="useremail"
            value={formData.useremail}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
            required
          />
          <input
            type="text"
            name="phonenumber"
            value={formData.phonenumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
            required
          />
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Designation"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
            required
          />
        </div>

        {/* Skills */}
        <div>
          <h3 className="font-semibold mb-2">Skills</h3>
          {formData.Skill.map((skill, index) => (
            <div key={index} className="flex gap-2 mb-2 items-center">
              <input
                type="text"
                value={skill}
                onChange={(e) => {
                  const newSkill = [...formData.Skill];
                  newSkill[index] = e.target.value;
                  setFormData((prev) => ({ ...prev, Skill: newSkill }));
                }}
                placeholder="Skill"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const newSkill = [...formData.Skill];
                    newSkill.splice(index, 1);
                    setFormData((prev) => ({ ...prev, Skill: newSkill }));
                  }}
                  className="text-red-500 font-bold"
                >
                  X
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, Skill: [...prev.Skill, ""] }))
            }
            className="text-[#caa057] font-semibold mb-4"
          >
            + Add Skill
          </button>
        </div>

        {/* Qualifications */}
        <div>
          <h3 className="font-semibold mb-2">Qualifications</h3>
          {qualifications.map((q, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg mb-3 bg-[#fff7f0] space-y-2"
            >
              <input
                type="text"
                name="degree"
                value={q.degree}
                onChange={(e) => {
                  const updated = [...qualifications];
                  updated[index].degree = e.target.value;
                  setQualifications(updated);
                }}
                placeholder="Degree / Certification"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
                required
              />
              <input
                type="text"
                name="institution"
                value={q.institution}
                onChange={(e) => {
                  const updated = [...qualifications];
                  updated[index].institution = e.target.value;
                  setQualifications(updated);
                }}
                placeholder="Institution"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
                required
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  name="startDate"
                  value={q.startDate}
                  onChange={(e) => {
                    const updated = [...qualifications];
                    updated[index].startDate = e.target.value;
                    setQualifications(updated);
                  }}
                  className="border px-2 py-1 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
                />
                <input
                  type="date"
                  name="endDate"
                  value={q.endDate}
                  onChange={(e) => {
                    const updated = [...qualifications];
                    updated[index].endDate = e.target.value;
                    setQualifications(updated);
                  }}
                  className="border px-2 py-1 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
                  disabled={q.pursuing}
                />
              </div>
              <label className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  checked={q.pursuing}
                  onChange={(e) => {
                    const updated = [...qualifications];
                    updated[index].pursuing = e.target.checked;
                    if (e.target.checked) updated[index].endDate = "";
                    setQualifications(updated);
                  }}
                />
                Currently Pursuing
              </label>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...qualifications];
                    updated.splice(index, 1);
                    setQualifications(updated);
                  }}
                  className="text-red-500 font-bold"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setQualifications((prev) => [
                ...prev,
                {
                  degree: "",
                  institution: "",
                  board: "",
                  university: "",
                  fieldOfStudy: "",
                  startDate: "",
                  endDate: "",
                  pursuing: false,
                },
              ])
            }
            className="text-[#caa057] font-semibold mb-4"
          >
            + Add Qualification
          </button>
        </div>

        {/* Experience */}
        <div>
          <h3 className="font-semibold mb-2">Experience</h3>
          <select
            value={experienceType}
            onChange={(e) => setExperienceType(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
          >
            <option value="Fresher">Fresher</option>
            <option value="0-1 year">0-1 year</option>
            <option value="1-5 years">1-5 years</option>
            <option value="5-10 years">5-10 years</option>
            <option value="10+ years">10+ years</option>
          </select>

          {experienceType !== "Fresher" &&
            Experience.map((exp, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg mb-3 bg-[#fff7f0] space-y-2"
              >
                <input
                  type="text"
                  name="company"
                  value={exp.company}
                  onChange={(e) => {
                    const updated = [...Experience];
                    updated[index].company = e.target.value;
                    setExperience(updated);
                  }}
                  placeholder="Company Name"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
                  required
                />
                <input
                  type="text"
                  name="designation"
                  value={exp.designation}
                  onChange={(e) => {
                    const updated = [...Experience];
                    updated[index].designation = e.target.value;
                    setExperience(updated);
                  }}
                  placeholder="Job Role / Designation"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#caa057]"
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="date"
                    name="startDate"
                    value={exp.startDate}
                    onChange={(e) => {
                      const updated = [...Experience];
                      updated[index].startDate = e.target.value;
                      setExperience(updated);
                    }}
                    className="border px-2 py-1 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
                  />
                  <input
                    type="date"
                    name="endDate"
                    value={exp.endDate}
                    onChange={(e) => {
                      const updated = [...Experience];
                      updated[index].endDate = e.target.value;
                      setExperience(updated);
                    }}
                    className="border px-2 py-1 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-[#caa057]"
                    disabled={exp.currentlyWorking}
                  />
                </div>
                <label className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    checked={exp.currentlyWorking}
                    onChange={(e) => {
                      const updated = [...Experience];
                      updated[index].currentlyWorking = e.target.checked;
                      if (e.target.checked) updated[index].endDate = "";
                      setExperience(updated);
                    }}
                  />
                  Currently Working
                </label>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...Experience];
                      updated.splice(index, 1);
                      setExperience(updated);
                    }}
                    className="text-red-500 font-bold"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

          {experienceType !== "Fresher" && (
            <button
              type="button"
              onClick={() =>
                setExperience((prev) => [
                  ...prev,
                  { company: "", designation: "", startDate: "", endDate: "", currentlyWorking: false },
                ])
              }
              className="text-[#caa057] font-semibold mb-4"
            >
              + Add Experience
            </button>
          )}
        </div>

        {/* File Uploads */}
        <div className="space-y-2">
          <input
            type="file"
            name="profilphoto"
            onChange={handleChange}
            accept="image/*"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="file"
            name="resume"
            onChange={handleChange}
            accept=".pdf,.doc,.docx"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#caa057] hover:bg-[#b4924c] text-white font-semibold px-4 py-2 rounded transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;
