import React from "react";

const Vision = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-[#caa057] mb-6">Our Vision</h1>

      {/* Intro Paragraph */}
      <p className="text-gray-700 text-lg leading-relaxed mb-6">
        At Expertz Careers, our vision is to become the most trusted platform for career growth, connecting talent with meaningful opportunities across industries. We aim to empower individuals, support organizations, and foster a culture of continuous learning and professional development.
      </p>

      {/* Vision Highlights */}
      <div className="grid sm:grid-cols-2 gap-8 mt-6">
        <div className="bg-white p-6 shadow rounded-lg hover:shadow-lg transition">
          <h2 className="font-semibold text-xl mb-2">Connecting Talent & Opportunity</h2>
          <p className="text-gray-600 text-sm">
            We envision a platform where every skilled individual can find the right job and every employer can access the right talent seamlessly.
          </p>
        </div>

        <div className="bg-white p-6 shadow rounded-lg hover:shadow-lg transition">
          <h2 className="font-semibold text-xl mb-2">Fostering Skill Development</h2>
          <p className="text-gray-600 text-sm">
            Our goal is to encourage continuous learning through internships, workshops, and upskilling programs, helping professionals stay ahead in their careers.
          </p>
        </div>

        <div className="bg-white p-6 shadow rounded-lg hover:shadow-lg transition">
          <h2 className="font-semibold text-xl mb-2">Promoting Transparency & Trust</h2>
          <p className="text-gray-600 text-sm">
            We aim to build a trustworthy ecosystem where candidates and employers can interact with confidence and transparency.
          </p>
        </div>

        <div className="bg-white p-6 shadow rounded-lg hover:shadow-lg transition">
          <h2 className="font-semibold text-xl mb-2">Empowering Communities</h2>
          <p className="text-gray-600 text-sm">
            Our vision includes creating an inclusive platform that nurtures communities, fosters collaboration, and drives meaningful professional growth.
          </p>
        </div>
      </div>

      {/* Closing Statement */}
      <p className="text-gray-700 text-lg leading-relaxed mt-8">
        Ultimately, our vision is to transform the way people approach careers — from job hunting to skill development — creating opportunities that lead to success, satisfaction, and lifelong growth for every professional.
      </p>
    </div>
  );
};

export default Vision;