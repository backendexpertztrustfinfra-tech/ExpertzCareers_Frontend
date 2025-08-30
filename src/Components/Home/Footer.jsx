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
      <div className="absolute inset-0">
        <div className="w-full h-full animate-[float_18s_linear_infinite] bg-[radial-gradient(circle,rgba(255,165,0,0.12)_1px,transparent_1px)] bg-[length:40px_40px]"></div>
      </div>
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 z-0">
        <svg
          className="relative block w-full h-20"
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

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 py-16">
        <div className="flex flex-col items-start space-y-3">
          <img src={LOGO} alt="Logo" className="h-14 w-auto object-contain" />
          <h2 className="text-lg sm:text-xl font-bold">Expertz Trust Finfra Pvt Ltd</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Empowering futures with jobs, trust & technology.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            {[
              { name: "Home", route: "/" },
              { name: "About Us", route: "/about" },
              { name: "Mission", route: "/mission" },
              { name: "Vision", route: "/vision" },
            ].map((item, i) => (
              <li key={i}>
                <Link
                  to={item.route}
                  className="hover:text-orange-500 transition-colors duration-300"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            {[
              { name: "Contact", route: "/contact" },
              { name: "Privacy Policy", route: "/privacy-policy" },
              { name: "Terms & Conditions", route: "/terms" },
            ].map((item, i) => (
              <li key={i}>
                <Link
                  to={item.route}
                  className="hover:text-orange-500 transition-colors duration-300"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
          <p className="text-sm text-gray-600 mb-3">
            Subscribe for job alerts & latest updates.
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none w-full sm:flex-1 transition-all duration-300 hover:scale-[1.02]"
            />
            <button
              type="submit"
              className="relative bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-gray-200 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Social Icons */}
          <div className="flex space-x-4">
            {[
              { icon: <FaFacebookF />, link: "https://facebook.com" },
              { icon: <FaInstagram />, link: "https://instagram.com" },
              { icon: <FaTwitter />, link: "https://twitter.com" },
              { icon: <FaLinkedinIn />, link: "https://linkedin.com" },
              { icon: <FaYoutube />, link: "https://youtube.com" },
            ].map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md text-gray-600 hover:text-orange-500 hover:scale-110 transition-all"
              >
                {item.icon}
              </a>
            ))}
          </div>

          <p className="text-xs text-gray-500 text-center md:text-right">
            &copy; {new Date().getFullYear()} Expertz Trust Finfra. All rights
            reserved.
          </p>
        </div>
      </div>

      {/* Tagline */}
      <div className="relative z-10 text-center py-5">
        <p className="text-sm font-medium bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 text-transparent bg-clip-text animate-pulse">
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
