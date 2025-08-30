"use client";

import { useParams } from "react-router-dom";
import companies from "../Components/Data/companiesData";
import { MapPin, Globe, Users, CalendarDays, Star } from "lucide-react";

const CompanyPage = () => {
  const { id } = useParams();
  const company = companies.find((c) => c.id.toString() === id);

  if (!company) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Company not found
          </h2>
          <p className="text-gray-600">
            The company you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl shadow-md border border-gray-100 p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src={company.logo || "/placeholder.svg"}
              alt={`${company.name} logo`}
              className="w-28 h-28 md:w-32 md:h-32 rounded-2xl border-2 border-gray-100 object-contain bg-white shadow-sm"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              {company.name}
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-4">
              {company.description}
            </p>

            {/* Rating */}
            {company.rating && (
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">
                    {company.rating}
                  </span>
                </div>
                <span className="text-gray-500 text-sm">Company Rating</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Company Info Grid */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Company Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Location */}
          <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-semibold text-gray-900">{company.location}</p>
            </div>
          </div>

          {/* Website */}
          <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl hover:shadow-md transition">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Website</p>
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Visit Website
              </a>
            </div>
          </div>

          {/* Size */}
          <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl hover:shadow-md transition">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Company Size</p>
              <p className="font-semibold text-gray-900">{company.size}</p>
            </div>
          </div>

          {/* Founded */}
          <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl hover:shadow-md transition">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Founded</p>
              <p className="font-semibold text-gray-900">{company.founded}</p>
            </div>
          </div>
        </div>
      </div>
            
      <div className="text-center">
        <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300">
          View Open Jobs
        </button>
      </div>
    </div>
  );
};

export default CompanyPage;
