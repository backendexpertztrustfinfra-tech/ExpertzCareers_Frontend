// "use client";

// import { useContext, useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import LOGO from "../../../assets/Image/logo_2.png";
// import { BellRing, BookmarkCheck, UserRound, Menu, X, ChevronDown } from "lucide-react";
// import { AuthContext } from "../../../context/AuthContext";

// // Hook to detect mobile
// const useIsMobile = () => {
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   return isMobile;
// };

// const JobSeekerNavbar = () => {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const isMobile = useIsMobile();

//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(null);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [mobileMegaOpen, setMobileMegaOpen] = useState(null);

//   const handleLogout = async () => {
//     try {
//       logout();
//       navigate("/?login=true");
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const navItems = [
//     { label: "Home", path: "/" },
//     { label: "Jobs", path: "/jobs" },
//     { label: "Companies", path: "/companies" },
//     { label: "Services", path: "/services" },
//     { label: "About", path: "/about" },
//   ];

//   const megaMenuData = {
//     Jobs: [
//       { title: "Popular categories", items: ["IT jobs", "Sales jobs", "Marketing jobs", "Data Science jobs"] },
//       { title: "Jobs in demand", items: ["Fresher jobs", "MNC jobs", "Remote jobs", "Work from home"] },
//       { title: "Jobs by location", items: ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai"] },
//     ],
//     Companies: [
//       { title: "Explore categories", items: ["Unicorn", "MNC", "Startup", "Product based"] },
//       { title: "Explore collections", items: ["Top companies", "IT companies", "Fintech companies"] },
//       { title: "Research companies", items: ["Interview Qs", "Company salaries", "Company reviews"] },
//     ],
//     Services: [
//       { title: "Resume writing", items: ["Text resume", "Visual resume", "Resume critique"] },
//       { title: "Recruiter’s attention", items: ["Resume display", "Monthly subscriptions"] },
//       { title: "Free resources", items: ["Resume maker", "Quality score", "Samples"] },
//     ],
//   };

//   return (
//     <nav className="backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-md sticky top-0 z-[9999]">
//       <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">
//         {/* Logo */}
//         <div className="flex items-center gap-2">
//           <img
//             src={LOGO || "/placeholder.svg"}
//             alt="Logo"
//             className="h-14 sm:h-18 w-22 sm:w-28 cursor-pointer transition-transform hover:scale-105"
//             onClick={() => {
//               if (location.pathname === "/") {
//                 navigate("/", { replace: true });
//               } else {
//                 navigate("/");
//               }
//             }}
//           />
//         </div>

//         {/* Desktop Menu */}
//         {!isMobile && (
//           <div className="hidden lg:flex flex-1 items-center justify-center gap-8">
//             {navItems.map((item, idx) => (
//               <div key={idx} className="relative group"
//                 onMouseEnter={() => setMenuOpen(item.label)}
//                 onMouseLeave={() => setMenuOpen(null)}>
//                 <button
//                   onClick={() => {
//                     if (location.pathname === item.path) {
//                       navigate(item.path, { replace: true });
//                     } else {
//                       navigate(item.path);
//                     }
//                   }}
//                   className={`relative text-gray-700 font-medium transition hover:text-yellow-600 ${location.pathname === item.path ? "text-yellow-600" : ""}`}
//                 >
//                   {item.label}
//                   <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-yellow-500 to-pink-500 transition-all group-hover:w-full" />
//                 </button>

//                 {["Jobs","Companies","Services"].includes(item.label) && menuOpen === item.label && (
//                   <div className="absolute left-0 mt-3 w-[700px] bg-white shadow-xl rounded-xl p-6 grid grid-cols-3 gap-6 border border-gray-100 animate-fadeIn z-50">
//                     {megaMenuData[item.label].map((col, i) => (
//                       <div key={i}>
//                         <h4 className="font-semibold text-gray-800 mb-2 text-sm">{col.title}</h4>
//                         {col.items.map((sub,j) => (
//                           <p key={j} className="text-sm px-2 py-1 rounded-md text-gray-600 hover:bg-yellow-50 hover:text-yellow-600 cursor-pointer"
//                              onClick={() => {
//                                navigate(item.path + "?" + sub);
//                                setMenuOpen(null);
//                              }}>
//                             {sub}
//                           </p>
//                         ))}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Right Section */}
//         <div className="flex items-center gap-4">
//           {user && (
//             <>
//               <button onClick={() => navigate("/notifications")}><BellRing size={22} /></button>
//               <button onClick={() => navigate("/my-jobs?tab=saved")}><BookmarkCheck size={22} /></button>
//             </>
//           )}
//           {!user ? (
//             <button onClick={() => navigate("/?login=true")} className="hidden sm:inline bg-gradient-to-r from-yellow-500 to-pink-500 text-white px-5 py-2 rounded-full hover:opacity-90 transition font-medium shadow">Login</button>
//           ) : (
//             <div className="relative">
//               <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-yellow-100 to-pink-100 text-yellow-700 hover:scale-105 transition">
//                 <UserRound size={20} />
//               </button>
//               {dropdownOpen && (
//                 <div className="absolute right-0 mt-3 w-52 bg-white shadow-lg border rounded-xl overflow-hidden z-50">
//                   <ul className="text-gray-700">
//                     <li onClick={() => {navigate("/profile"); setDropdownOpen(false)}} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
//                     <li onClick={() => {navigate("/my-jobs?tab=applied"); setDropdownOpen(false)}} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Applied Jobs</li>
//                     <li onClick={handleLogout} className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer">Logout</li>
//                   </ul>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Hamburger */}
//           <button className="lg:hidden text-gray-700" onClick={() => setMobileOpen(!mobileOpen)}>
//             {mobileOpen ? <X size={26} /> : <Menu size={26} />}
//           </button>
//         </div>
//       </div>
//     </nav>
//   )
// }

// export default JobSeekerNavbar;
