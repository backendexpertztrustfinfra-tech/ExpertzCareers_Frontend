import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import LOGO from "../../assets/Image/LOGO.png";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-orange-50 via-white to-orange-100 text-gray-800 overflow-hidden">
      {/* Floating dots background */}
      <div className="absolute inset-0">
        <div className="w-full h-full animate-[float_20s_linear_infinite] bg-[radial-gradient(circle,rgba(255,165,0,0.12)_1px,transparent_1px)] bg-[length:35px_35px]"></div>
      </div>

      {/* Main Footer */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
        {/* Logo & About */}
        <div className="flex flex-col space-y-2 sm:space-y-3 col-span-2 sm:col-span-1">
          <img
            src={LOGO}
            alt="Logo"
            className="h-14 sm:h-16 w-auto object-contain" // bigger logo
          />
          <h2 className="text-base sm:text-lg font-bold">
            Expertz Trust Finfra Pvt Ltd
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Empowering futures with jobs, trust & technology.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-sm sm:text-md font-semibold mb-2 sm:mb-3">
            Company
          </h3>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            {[
              { name: "Home", route: "/" },
              { name: "About Us", route: "/about" },
              { name: "Mission", route: "/mission" },
              { name: "Vision", route: "/vision" },
            ].map((item, i) => (
              <li key={i}>
                <Link
                  className="hover:text-orange-500 transition-colors"
                  to={item.route}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-sm sm:text-md font-semibold mb-2 sm:mb-3">
            Support
          </h3>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            {[
              { name: "Contact", route: "/contact" },
              { name: "Privacy Policy", route: "/privacy-policy" },
              { name: "Terms & Conditions", route: "/terms" },
            ].map((item, i) => (
              <li key={i}>
                <Link
                  className="hover:text-orange-500 transition-colors"
                  to={item.route}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Subscribe */}
        <div className="col-span-2 sm:col-span-1">
          <h3 className="text-sm sm:text-md font-semibold mb-2 sm:mb-3">
            Stay Updated
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
            Subscribe for job alerts & latest updates.
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-2 sm:px-3 py-1 sm:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none w-full sm:flex-1 text-xs sm:text-sm transition-all duration-300 hover:scale-[1.02]"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 sm:px-5 py-1 sm:py-2 rounded-lg hover:scale-105 transition-transform text-xs sm:text-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Wave Separator */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180 z-0">
        <svg
          className="relative block w-full h-12 sm:h-20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <defs>
            <linearGradient
              id="waveGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="10%" stopColor="#fde68a" />
              <stop offset="50%" stopColor="#fcd34d" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
          <path
            d="M985 90C900 80 820 50 740 30c-80-20-170-15-250 5
        -60 15-115 40-175 50C230 95 120 85 0 50V120h1200V95
        c-70 10-140 5-215-5z"
            fill="url(#waveGradient)"
          />
        </svg>
      </div>

      {/* Social Icons & Copyright */}
      {/* <div className="relative z-10 bg-orange-100 py-4 sm:py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6">
          <div className="flex space-x-2 sm:space-x-3">
            {[FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-white rounded-full shadow text-gray-600 hover:text-orange-500 transition"
                >
                  <Icon className="text-xs sm:text-sm" />
                </a>
              )
            )}
          </div>
          <p className="text-xs text-gray-500 text-center sm:text-right">
            &copy; {new Date().getFullYear()} Expertz Trust Finfra. All rights
            reserved.
          </p>
        </div>
      </div> */}
      {/* Social Icons & Copyright */}
<div className="relative z-10 bg-orange-100 py-4 sm:py-6">
  <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6">
    <div className="flex space-x-2 sm:space-x-3">
      <a
        href="https://www.facebook.com/profile.php?id=61575748576224"
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-white rounded-full shadow text-gray-600 hover:text-orange-500 transition"
      >
        <FaFacebookF className="text-xs sm:text-sm" />
      </a>
      <a
        href="https://www.instagram.com/expertz_digital_it_solution/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-white rounded-full shadow text-gray-600 hover:text-orange-500 transition"
      >
        <FaInstagram className="text-xs sm:text-sm" />
      </a>
      <a
        href="https://x.com/home"
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-white rounded-full shadow text-gray-600 hover:text-orange-500 transition"
      >
        <FaTwitter className="text-xs sm:text-sm" />
      </a>
      <a
        href="https://www.youtube.com/@ExpertzTrustFinfra"
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-white rounded-full shadow text-gray-600 hover:text-orange-500 transition"
      >
        <FaYoutube className="text-xs sm:text-sm" />
      </a>
      {/* LinkedIn is not provided, you can remove or add your LinkedIn link */}
      <a
        href="https://www.linkedin.com"
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-white rounded-full shadow text-gray-600 hover:text-orange-500 transition"
      >
        <FaLinkedinIn className="text-xs sm:text-sm" />
      </a>
    </div>
    <p className="text-xs text-gray-500 text-center sm:text-right">
      &copy; {new Date().getFullYear()} Expertz Trust Finfra. All rights reserved.
    </p>
  </div>
</div>


      {/* Tagline */}
      <div className="relative z-10 bg-orange-50 py-2 sm:py-4 text-center">
        <p className="text-xs sm:text-sm font-medium text-orange-600">
          Made with ❤️ by Expertz Team | Powered by Innovation ✨
        </p>
      </div>

      <style>
        {`
          @keyframes float {
            0% { background-position: 0 0; }
            100% { background-position: 100px 100px; }
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;
