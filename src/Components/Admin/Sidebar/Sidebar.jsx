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
import { getRecruiterProfile } from "../../../services/apis";

const Sidebar = ({ activeTab, setActiveTab }) => {
  // Sidebar collapse state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("userToken");
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  // Detect screen size for mobile
  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch user profile
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        const profile = await getRecruiterProfile(token);
        setUserProfile(profile);
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  // Collapse when clicking outside (mobile)
  useEffect(() => {
    const handleOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsCollapsed(true);
      }
    };
    if (!isCollapsed) {
      document.addEventListener("mousedown", handleOutside);
      document.addEventListener("touchstart", handleOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [isCollapsed]);

  const handleLogout = async () => {
    try {
      if (user?.source === "firebase") await firebaseSignOut(auth);
      logout();
      navigate("/?login=true");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  if (loading) return <Loader text="Loading..." />;
  if (!userProfile) return <Loader text="No user data" error />;

  const tabs = [
    { icon: <FaHome />, label: "Home" },
    { icon: <FaBriefcase />, label: "Job" },
    { icon: <FaDatabase />, label: "Database" },
    { icon: <FaCreditCard />, label: "Credits" },
    { icon: <FaFileInvoice />, label: "Billing" },
    { icon: <FaEllipsisH />, label: "More" },
  ];

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-[15vh] left-0 mt-4 h-[calc(100vh-100px)] bg-white shadow-lg z-50
        transition-all duration-300 overflow-hidden
        ${isCollapsed ? "w-20" : "w-64"}`}
    >
      {/* Profile */}
      <div className="flex items-center gap-3 p-5 bg-gradient-to-r from-yellow-100 to-white shadow-md">
        <img
          src={userProfile?.user?.recruterLogo || "/default-logo.png"}
          alt="Logo"
          className="w-12 h-12 rounded-full border-2 border-yellow-400 object-cover"
        />
        {!isCollapsed && (
          <div>
            <h2 className="font-bold text-gray-800">
              {userProfile?.user?.username || "Recruiter"}
            </h2>
            <p className="text-xs text-gray-600">
              {userProfile?.user?.useremail || "No Email"}
            </p>
            <p className="text-xs text-gray-500">
              {userProfile?.user?.recruterPhone || "No Phone"}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-4 space-y-2 px-2">
        {tabs.map((tab) => (
          <SidebarTab
            key={tab.label}
            {...tab}
            activeTab={activeTab}
            onClick={() => setActiveTab(tab.label)}
            collapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 w-full p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold shadow hover:scale-105 transition-all duration-200"
        >
          <FaSignOutAlt />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

const SidebarTab = ({ icon, label, activeTab, onClick, collapsed }) => (
  <button
    onClick={onClick}
    title={collapsed ? label : ""}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
      ${
        activeTab === label
          ? "bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white shadow-md"
          : "text-gray-700 hover:bg-yellow-100 hover:text-yellow-700"
      }`}
  >
    <span className="text-lg">{icon}</span>
    {!collapsed && <span>{label}</span>}
  </button>
);

const Loader = ({ text, error }) => (
  <div className="fixed top-0 left-0 h-full w-20 bg-white flex items-center justify-center shadow-lg z-50">
    <p className={error ? "text-red-500" : "text-gray-500"}>{text}</p>
  </div>
);

export default Sidebar;
