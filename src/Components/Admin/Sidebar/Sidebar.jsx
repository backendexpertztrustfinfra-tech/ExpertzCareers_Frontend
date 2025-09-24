import React, { useEffect, useState, useContext, useRef } from "react";
import Cookies from "js-cookie";
import {
  FaHome,
  FaBriefcase,
  FaDatabase,
  FaCreditCard,
  FaFileInvoice,
  FaUser,
  FaEllipsisH,
  FaSignOutAlt,
} from "react-icons/fa";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../../../firebase-config";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { getRecruiterProfile } from "../../../services/apis";

const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => {
  const [userProfile, setUserProfile] = useState(null);
  const token = Cookies.get("userToken");
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  // ✅ Detect screen size (auto collapse on mobile)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setCollapsed]);

  // ✅ Fetch recruiter profile
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const profile = await getRecruiterProfile(token);
          setUserProfile(profile);
        } catch (err) {
          console.error("Profile fetch error:", err);
        }
      }
    };
    loadUser();
  }, [token]);

  // ✅ Close sidebar when clicking outside (on mobile)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        window.innerWidth < 768 &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setCollapsed(true);
      }
    };
    if (!collapsed) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [collapsed, setCollapsed]);

  const handleLogout = async () => {
    try {
      if (user?.source === "firebase") await firebaseSignOut(auth);
      logout();
      navigate("/?login=true");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  // ✅ Sidebar tabs
  const tabs = [
    { icon: <FaHome />, label: "Home" },
    { icon: <FaBriefcase />, label: "Job" },
    { icon: <FaUser />, label: "Candidate" },
    { icon: <FaDatabase />, label: "Database" },
    { icon: <FaCreditCard />, label: "Credits" },
    { icon: <FaFileInvoice />, label: "Billing" },
    { icon: <FaEllipsisH />, label: "Profile" },
  ];

  // ✅ Prevent duplicate history entries
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === activeTab) {
      navigate(`/admin?tab=${tab}`, { replace: true });
    } else {
      navigate(`/admin?tab=${tab}`);
    }
    if (window.innerWidth < 768) setCollapsed(true);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && window.innerWidth < 768 && (
        <div className="fixed inset-0 bg-black/40 z-30"></div>
      )}

      <div
        ref={sidebarRef}
        className={`fixed top-[100px] left-0 h-[calc(100vh-100px)] bg-white shadow-lg z-40
          flex flex-col justify-between
          transition-all duration-300 ease-in-out
          ${
            collapsed
              ? "-translate-x-full md:translate-x-0 w-20"
              : "translate-x-0 w-64"
          }
        `}
      >
        {/* Profile */}
        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md hover:shadow-lg transition p-5">
          <div className="flex items-center gap-4">
            {/* Profile Image (optional) */}
            {/* <img
      src={userProfile?.user?.recruterLogo || "/default-logo.png"}
      alt="Logo"
      className="w-16 h-16 rounded-full border border-orange-300 object-cover shadow-sm"
    /> */}

            {!collapsed && (
              <div className="flex flex-col w-full min-w-0">
                {/* Name */}
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug truncate">
                  {userProfile?.user?.username || "Recruiter"}
                </h2>

                {/* Email */}
                <div className="flex items-center gap-2 text-sm sm:text-base text-gray-700 truncate mt-1">
                  <HiOutlineMail className="text-[#caa057] w-5 h-5 flex-shrink-0" />
                  <span className="truncate">
                    {userProfile?.user?.useremail || "No Email"}
                  </span>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600 truncate mt-0.5">
                  <HiOutlinePhone className="text-[#caa057] w-5 h-5 flex-shrink-0" />
                  <span className="truncate">
                    {userProfile?.user?.recruterPhone || "No Phone"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4 space-y-2 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-[#caa057] scrollbar-track-transparent">
          {tabs.map((tab) => (
            <SidebarTab
              key={tab.label}
              {...tab}
              activeTab={activeTab}
              onClick={() => handleTabChange(tab.label)}
              collapsed={collapsed}
            />
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg 
              bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold 
              shadow hover:scale-105 transition-all duration-200"
          >
            <FaSignOutAlt className="text-lg" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

const SidebarTab = ({ icon, label, activeTab, onClick, collapsed }) => (
  <button
    onClick={onClick}
    title={collapsed ? label : ""}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
      ${
        activeTab === label
          ? "bg-gradient-to-r from-[#caa057] via-[#caa057] to-[#caa057] text-white shadow-md"
          : "text-gray-700 hover:bg-[#fff1ed] hover:text-[#caa057]"
      }`}
  >
    <span className="text-lg">{icon}</span>
    {!collapsed && <span>{label}</span>}
  </button>
);

export default Sidebar;