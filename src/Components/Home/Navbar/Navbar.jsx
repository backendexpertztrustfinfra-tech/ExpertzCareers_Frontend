import { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LOGO from "../../../assets/Image/logo_2.png";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../../../firebase-config";
import {
  BellRing,
  BookmarkCheck,
  UserRound,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import Cookies from "js-cookie";
import { fetchNotifications } from "../../../services/apis";

// Hook to detect mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMegaOpen, setMobileMegaOpen] = useState(null);

  // Fetch notifications only for jobseekers
  useEffect(() => {
    if (!user || user.usertype !== "jobseeker") return; // Skip for recruiters or no user

    const loadNotifications = async () => {
      const token = Cookies.get("userToken");
      if (!token) return;

      try {
        const data = await fetchNotifications({ token });
        if (!data || !Array.isArray(data)) setNotifications([]);
        else setNotifications(data);
      } catch (err) {
        console.warn("Notifications fetch skipped or failed:", err.message);
        setNotifications([]); // fallback empty
      }
    };

    loadNotifications();
  }, [user]);

  const handleLogout = async () => {
    try {
      if (user?.source === "firebase") await firebaseSignOut(auth);
      logout();
      navigate("/?login=true");
    } catch (error) {
      console.error("Logout Error:", error);
      alert("Failed to logout");
    }
  };

  const isAdminRoute = location.pathname.startsWith("/admin");

  const navItems = []; // Add desktop menu items if needed

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <nav className="backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-md sticky top-0 z-[9999]">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src={LOGO || "/placeholder.svg"}
            alt="Logo"
            className="h-14 sm:h-18 w-22 sm:w-28 cursor-pointer transition-transform hover:scale-105"
            onClick={() => navigate(isAdminRoute ? "/admin?tab=Home" : "/")}
          />
        </div>

        {/* Desktop Menu */}
        {!isAdminRoute && !isMobile && (
          <div className="hidden lg:flex flex-1 items-center justify-center gap-8">
            {navItems.map((item, idx) => (
              <div
                key={idx}
                className="relative group"
                onMouseEnter={() => setMenuOpen(item.label)}
                onMouseLeave={() => setMenuOpen(null)}
              >
                <button
                  onClick={() => navigate(item.path)}
                  className={`relative text-gray-700 font-medium transition hover:text-yellow-600 ${
                    location.pathname === item.path ? "text-yellow-600" : ""
                  }`}
                >
                  {item.label}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Show only for jobseekers */}
          {/* Show only for logged-in jobseekers */}
          {!isAdminRoute && user && user.usertype !== "recruiter" && (
            <>
              {/* Notifications */}
              <button
                title="Notification"
                type="button"
                className="relative text-gray-600 hover:text-yellow-600 transition"
                onClick={() => navigate("/notification")}
              >
                <BellRing size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[11px] font-bold text-white bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Saved Jobs */}
              <button
                title="Saved Jobs"
                type="button"
                className="text-gray-600 hover:text-yellow-600 transition"
                onClick={() => navigate("/my-jobs?tab=saved")}
              >
                <BookmarkCheck size={22} />
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-yellow-100 to-pink-100 text-yellow-700 hover:scale-105 transition"
                >
                  <UserRound size={20} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-white shadow-lg border rounded-xl overflow-hidden z-50">
                    <ul className="text-gray-700">
                      <li
                        onClick={() => {
                          navigate("/profile");
                          setDropdownOpen(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        Profile
                      </li>
                      <li
                        onClick={() => {
                          navigate("/my-jobs?tab=applied");
                          setDropdownOpen(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        Applied Jobs
                      </li>
                      <li
                        onClick={handleLogout}
                        className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
                      >
                        Logout
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Hamburger for all users */}
          <button
            className="lg:hidden text-gray-700"
            onClick={() =>
              isAdminRoute ? onToggleSidebar?.() : setMobileOpen(!mobileOpen)
            }
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {!isAdminRoute && isMobile && mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-md">
          {/* You can add mobile menu content here */}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
