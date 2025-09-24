import React from "react";

const Terms = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-[#caa057] mb-6">Terms & Conditions</h1>

      {/* Intro Paragraph */}
      <p className="text-gray-700 text-lg leading-relaxed mb-6">
        Welcome to Expertz Careers. By accessing or using our website and services, you agree to comply with the following terms and conditions. Please read them carefully.
      </p>

      {/* Terms Sections */}
      <ol className="list-decimal list-inside text-gray-700 text-lg space-y-4">
        <li>
          <strong>Use of Website:</strong> You may use our website only for lawful purposes. Any misuse of the website, including posting false information or violating regulations, is strictly prohibited.
        </li>
        <li>
          <strong>Account Responsibility:</strong> Users are responsible for maintaining the confidentiality of their account details. All activities under your account are your responsibility.
        </li>
        <li>
          <strong>Content Accuracy:</strong> Expertz Careers strives to provide accurate and up-to-date information. However, we do not guarantee the completeness or accuracy of content.
        </li>
        <li>
          <strong>Job Placements:</strong> Our platform provides opportunities, guidance, and resources. We do not guarantee employment or job placement outcomes.
        </li>
        <li>
          <strong>Modification of Terms:</strong> We reserve the right to modify these terms at any time without prior notice. Continued use of the platform implies acceptance of the updated terms.
        </li>
        <li>
          <strong>Intellectual Property:</strong> All content, logos, and designs on this website are the property of Expertz Careers and may not be copied or reproduced without permission.
        </li>
        <li>
          <strong>Limitation of Liability:</strong> Expertz Careers is not liable for any direct or indirect damages arising from the use of this platform.
        </li>
      </ol>

      {/* Closing Statement */}
      <p className="text-gray-700 text-lg leading-relaxed mt-8">
        By using Expertz Careers, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.
      </p>
    </div>
  );
};

export default Terms;