import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-[#caa057] mb-6">Privacy Policy</h1>

      {/* Intro Paragraph */}
      <p className="text-gray-700 text-lg leading-relaxed mb-6">
        At Expertz Careers, your privacy is very important to us. This Privacy Policy explains how we collect, use, and protect your personal information.
      </p>

      {/* Privacy Sections */}
      <ul className="list-disc list-inside text-gray-700 text-lg space-y-4">
        <li>
          <strong>Information Collection:</strong> We collect information you provide during registration, profile creation, subscription, and job applications. This includes name, email, phone number, resume, and other relevant data.
        </li>
        <li>
          <strong>Use of Information:</strong> Your information is used to provide services, improve user experience, send job alerts, and connect you with relevant opportunities.
        </li>
        <li>
          <strong>Information Sharing:</strong> We do not sell, rent, or trade your personal information. We may share data with trusted partners for legitimate business purposes only.
        </li>
        <li>
          <strong>Data Security:</strong> We implement industry-standard security measures to protect your data from unauthorized access or misuse.
        </li>
        <li>
          <strong>Cookies:</strong> We use cookies to improve website functionality, track performance, and provide personalized content. You can manage cookies via your browser settings.
        </li>
        <li>
          <strong>Your Rights:</strong> You can access, update, or delete your personal information by contacting our support team.
        </li>
        <li>
          <strong>Policy Updates:</strong> We may update this Privacy Policy from time to time. Continued use of the platform indicates acceptance of the changes.
        </li>
      </ul>

      {/* Closing Statement */}
      <p className="text-gray-700 text-lg leading-relaxed mt-8">
        By using Expertz Careers, you consent to the collection and use of your information as described in this Privacy Policy.
      </p>
    </div>
  );
};

export default PrivacyPolicy;