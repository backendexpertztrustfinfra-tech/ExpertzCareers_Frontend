import React from "react";

const Mission = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-[#caa057] mb-6">Our Mission</h1>

      {/* Intro Paragraph */}
      <p className="text-gray-700 text-lg leading-relaxed mb-6">
        At Expertz Careers, our mission is to empower individuals and organizations by bridging the gap between talent and opportunity. We are committed to providing innovative career solutions, trusted guidance, and meaningful opportunities that help job seekers and employers grow together.
      </p>

      {/* Mission Highlights */}
      <div className="grid sm:grid-cols-2 gap-8 mt-6">
        <div className="bg-white p-6 shadow rounded-lg hover:shadow-lg transition">
          <h2 className="font-semibold text-xl mb-2">Empowering Job Seekers</h2>
          <p className="text-gray-600 text-sm">
            We provide tools, resources, and guidance to help candidates explore career paths, develop skills, and land their dream jobs.
          </p>
        </div>

        <div className="bg-white p-6 shadow rounded-lg hover:shadow-lg transition">
          <h2 className="font-semibold text-xl mb-2">Supporting Employers</h2>
          <p className="text-gray-600 text-sm">
            Our platform helps businesses connect with the right talent, streamline recruitment, and build high-performing teams efficiently.
          </p>
        </div>

        <div className="bg-white p-6 shadow rounded-lg hover:shadow-lg transition">
          <h2 className="font-semibold text-xl mb-2">Skill Development</h2>
          <p className="text-gray-600 text-sm">
            We believe in empowering talent through learning. Our mission includes creating opportunities for upskilling, internships, and professional growth.
          </p>
        </div>

        <div className="bg-white p-6 shadow rounded-lg hover:shadow-lg transition">
          <h2 className="font-semibold text-xl mb-2">Building Trust & Transparency</h2>
          <p className="text-gray-600 text-sm">
            We strive to maintain a platform that is reliable, secure, and transparent, ensuring a trustworthy experience for both candidates and employers.
          </p>
        </div>
      </div>

      {/* Closing Statement */}
      <p className="text-gray-700 text-lg leading-relaxed mt-8">
        Our mission goes beyond just connecting people with jobs. We aim to create an ecosystem where learning, growth, and opportunity are accessible to everyone, fostering a thriving professional community.
      </p>
    </div>
  );
};

export default Mission;