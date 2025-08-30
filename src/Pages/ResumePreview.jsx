import React from "react";

const ResumePreview = () => {
  const data = JSON.parse(localStorage.getItem("resumeData"));
  if (!data) return <p>No resume data found. Please fill and save your profile first.</p>;

  const { profile, fieldValues } = data;

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white border rounded-lg shadow font-sans">
      <div className="flex items-center mb-4">
        <img
          src={profile.image}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mr-4"
        />
        <div>
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-gray-600">{profile.email} | {profile.phone} | {profile.location}</p>
          <p className="text-gray-600">{profile.experience} | Available: {profile.Date}</p>
        </div>
      </div>
      <hr className="my-4" />

      {Object.entries(fieldValues).map(([key, value]) => (
        value && (
          <div key={key} className="mb-4">
            <h2 className="text-xl font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</h2>
            <p className="text-gray-700 whitespace-pre-line">{value}</p>
          </div>
        )
      ))}
    </div>
  );
};

export default ResumePreview;