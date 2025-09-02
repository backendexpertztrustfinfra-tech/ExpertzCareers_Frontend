
import React, { useEffect, useState, useContext, useRef } from "react";
import Cookies from "js-cookie";
import {
  FaHome,
  FaBriefcase,
  FaDatabase,
  FaCreditCard,
  FaFileInvoice,
  FaEllipsisH,
  FaSignOutAlt,
} from "react-icons/fa";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../../../firebase-config";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../../../services/apis";

const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("userToken");
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);

  // ✅ Detect screen size for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setCollapsed(true); 
      } else {
        setIsMobile(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setCollapsed]);

  // ✅ Fetch user profile
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      const profile = await fetchUserProfile(token);
      setUserProfile(profile);
      setLoading(false);
    };
    loadUser();
  }, [token]);

  // ✅ Collapse when clicking/tapping outside sidebar on mobile
  useEffect(() => {
    if (isMobile && !collapsed) {
      const handleOutside = (e) => {
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
          setCollapsed(true);
        }
      };

      document.addEventListener("touchstart", handleOutside);
      document.addEventListener("hover", handleOutside);

      return () => {
        document.removeEventListener("touchstart", handleOutside);
        document.removeEventListener("hover", handleOutside);
      };
    }
  }, [isMobile, collapsed, setCollapsed]);

  const handleLogout = async () => {
    try {
      if (user?.source === "firebase") await firebaseSignOut(auth);
      logout();
      navigate("/?login=true");
    } catch (err) {
      console.error("Logout Error:", err);
      alert("Failed to logout");
    }
  };

  if (loading)
    return (
      <div className="fixed top-0 left-0 h-full w-20 bg-white flex items-center justify-center shadow-lg z-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );

  if (!userProfile)
    return (
      <div className="fixed top-0 left-0 h-full w-20 bg-white flex items-center justify-center shadow-lg z-50">
        <p className="text-red-500">No user data</p>
      </div>
    );

  const tabs = [
    { icon: <FaHome />, label: "Home" },
    { icon: <FaBriefcase />, label: "Job" },
    { icon: <FaDatabase />, label: "Database" },
    { icon: <FaCreditCard />, label: "Credits" },
    { icon: <FaFileInvoice />, label: "Billing" },
    { icon: <FaEllipsisH />, label: "More" },
  ];

  const handleTabClick = (label) => {
    setActiveTab(label);

    if (isMobile) {
      setCollapsed(true); 
    } else if (label === "Database") {
      setCollapsed(true);
    }
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-[15vh] left-0 mt-4 h-[calc(100vh-100px)] bg-white shadow-lg z-50 
  transition-all duration-300 overflow-hidden
  ${collapsed ? "w-20" : "w-64"}
`}

      onMouseEnter={() => isMobile && setCollapsed(false)}
    >
      {/* Profile Section */}
      <div className="flex items-center gap-3 p-5 bg-gradient-to-r from-yellow-100 to-white shadow-md">
        <img
          src={userProfile.logo}
          alt="Logo"
          className="w-12 h-12 rounded-full border-2 border-yellow-400 object-cover"
        />
        {!collapsed && (
          <div className="transition-all duration-300">
            <h2 className="font-bold text-gray-800">{userProfile.name}</h2>
            <p className="text-xs text-gray-600">{userProfile.email}</p>
            <p className="text-xs text-gray-500">{userProfile.phone}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-4 space-y-2 px-2">
        {tabs.map((tab) => (
          <SidebarTab
            key={tab.label}
            icon={tab.icon}
            label={tab.label}
            activeTab={activeTab}
            onClick={() => handleTabClick(tab.label)}
            collapsed={collapsed}
          />
        ))}
      </nav>

     

      {/* Logout */}
      <div className="absolute bottom-0 w-full p-4">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold shadow hover:shadow-lg hover:scale-105 transition-all duration-200`}
        >
          <FaSignOutAlt />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

const SidebarTab = ({ icon, label, activeTab, onClick, collapsed }) => (
  <button
    onClick={onClick}
    title={collapsed ? label : ""}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300
      ${
        activeTab === label
          ? "bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white shadow-md"
          : "text-gray-700 hover:bg-yellow-100 hover:text-yellow-700"
      }
    `}
  >
    <span className="text-lg">{icon}</span>
    {!collapsed && <span>{label}</span>}
  </button>
);

export default Sidebar;
