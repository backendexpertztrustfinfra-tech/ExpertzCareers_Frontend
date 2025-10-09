import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import LOGO from "../../assets/Image/logo_2.png";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-[#fff1ed] via-white to-[#fff1ed] text-gray-800 overflow-hidden">
      {/* Floating dots background */}
      <div className="absolute inset-0">
        <div className="w-full h-full animate-[float_20s_linear_infinite] bg-[radial-gradient(circle,rgba(202,160,87,0.08)_1px,transparent_1px)] bg-[length:35px_35px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 md:py-12">
        {/* Main Content Grid for Desktop */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between md:gap-12 mb-8">
          {/* Logo and Tagline Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 mb-8 md:mb-0 max-w-lg mx-auto md:mx-0">
            <img
              src={LOGO}
              alt="Expertz Career Logo"
              className="h-24 sm:h-28 w-auto object-contain drop-shadow-md"
            />
            <h2 className="text-lg sm:text-xl font-bold">Expertz Career</h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-sm">
              Building brighter futures with trust, innovation, and
              opportunities.
            </p>
          </div>

          {/* Links Grid for Desktop */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            <FooterLinks
              title="Company"
              links={[
                { name: "Home", route: "/", external: false },
                { name: "About Us", route: "/about", external: false },
                { name: "Mission", route: "/mission", external: false },
                { name: "Vision", route: "/vision", external: false },
              ]}
            />
            <FooterLinks
              title="Support"
              links={[
                { name: "Contact", route: "/contact", external: false },
                { name: "Privacy Policy", route: "/privacy-policy", external: false },
                { name: "Terms & Conditions", route: "/terms", external: false },
              ]}
            />
            <FooterLinks
              title="Our Wings"
              links={[
                { name: "Expertz Digital And IT Solution", route: "https://expertzdigitalsolution.com", external: true },
                { name: "Expertz DigiFinra Reality", route: "https://expertztrustfinfra.com/", external: true },
                { name: "Expertz DigiShop", route: "https://expertzdigishop.com/", external: true },
                { name: "Expertz Insta Services", route: "/", external: false },
                { name: "Expertz Q-Mart", route: "/", external: false },
                { name: "Expertz Fine Dine RestroCafe", route: "https://expertzfinedinerestrocafe.com/", external: true },
                { name: "Expertz Hotels", route: "/", external: false },
              ]}
            />
          </div>
        </div>

        {/* Mobile Accordions */}
        <div className="md:hidden space-y-4">
          <Accordion
            title="Company"
            links={[
              { name: "Home", route: "/", external: false },
              { name: "About Us", route: "/about", external: false },
              { name: "Mission", route: "/mission", external: false },
              { name: "Vision", route: "/vision", external: false },
            ]}
          />
          <Accordion
            title="Support"
            links={[
              { name: "Contact", route: "/contact", external: false },
              { name: "Privacy Policy", route: "/privacy-policy", external: false },
              { name: "Terms & Conditions", route: "/terms", external: false },
            ]}
          />
          <Accordion
            title="Our Wings"
            links={[
              { name: "Expertz Digital And IT Solution", route: "https://expertzdigitalsolution.com", external: true },
              { name: "Expertz DigiFinra Reality", route: "https://expertztrustfinfra.com/", external: true },
              { name: "Expertz DigiShop", route: "https://expertzdigishop.com/", external: true },
              { name: "Expertz Insta Services", route: "/", external: false },
              { name: "Expertz Q-Mart", route: "/terms", external: false },
              { name: "Expertz Fine Dine RestroCafe", route: "https://expertzfinedinerestrocafe.com/", external: true },
              { name: "Expertz Hotels", route: "/", external: false },
            ]}
          />
        </div>
      </div>

      {/* Combined Social, Copyright, and Tagline Section */}
      <div className="relative z-10 bg-[#fff1ed] py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6">
          <p className="text-xs sm:text-sm text-gray-600 text-center order-2 md:order-1">
            &copy; {new Date().getFullYear()} Expertz Trust Finfra. All rights reserved.
          </p>
          <div className="flex space-x-3 order-1 md:order-2">
            <SocialIcon
              Icon={FaFacebookF}
              href="https://www.facebook.com/profile.php?id=61575748576224"
            />
            <SocialIcon
              Icon={FaInstagram}
              href="https://www.instagram.com/expertz_digital_it_solution/"
            />
            <SocialIcon Icon={FaTwitter} href="https://x.com/home" />
            <SocialIcon
              Icon={FaYoutube}
              href="https://www.youtube.com/@ExpertzTrustFinfra"
            />
            <SocialIcon Icon={FaLinkedinIn} href="https://www.linkedin.com" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-[#caa057] text-center order-3 w-full md:w-auto mt-4 md:mt-0">
            Powered by <span className="font-semibold">Expertz Group</span>
          </p>
        </div>
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

/* Desktop Footer Links */
function FooterLinks({ title, links }) {
  return (
    <div>
      <h3 className="text-base font-semibold mb-4">{title}</h3>
      <ul className="space-y-2 text-sm">
        {links.map((item, i) => (
          <li key={i}>
            {item.external ? (
              <a
                href={item.route}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#caa057] transition-colors"
              >
                {item.name}
              </a>
            ) : (
              <Link
                to={item.route}
                className="hover:text-[#caa057] transition-colors"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Mobile Accordion */
function Accordion({ title, links }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <button
        className="w-full flex items-center justify-between px-4 py-3 font-medium text-gray-800"
        onClick={() => setOpen(!open)}
      >
        {title}
        <ChevronDown
          className={`w-5 h-5 transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <ul className="px-4 pb-3 space-y-2 text-sm">
          {links.map((item, i) => (
            <li key={i}>
              {item.external ? (
                <a
                  href={item.route}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#caa057] transition-colors"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  to={item.route}
                  className="hover:text-[#caa057] transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* Social Icon */
function SocialIcon({ Icon, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow hover:shadow-md text-gray-600 hover:text-[#caa057] transition"
    >
      <Icon className="text-sm" />
    </a>
  );
}

export default Footer;