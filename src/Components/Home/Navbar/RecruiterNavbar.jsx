// "use client";

// import { useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import LOGO from "../../../assets/Image/logo_2.png";
// import { AuthContext } from "../../../context/AuthContext";
// import { Menu, X, UserRound } from "lucide-react";

// const RecruiterNavbar = ({ onToggleSidebar }) => {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   return (
//     <nav className="backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-md sticky top-0 z-[9999]">
//       <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">
//         <div className="flex items-center gap-2">
//           <img
//             src={LOGO || "/placeholder.svg"}
//             alt="Logo"
//             className="h-14 sm:h-18 w-22 sm:w-28 cursor-pointer transition-transform hover:scale-105"
//             onClick={() => navigate("/admin?tab=Home", { replace: true })}
//           />
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-yellow-100 to-pink-100 text-yellow-700 hover:scale-105 transition">
//               <UserRound size={20} />
//             </button>
//             {dropdownOpen && (
//               <div className="absolute right-0 mt-3 w-52 bg-white shadow-lg border rounded-xl overflow-hidden z-50">
//                 <ul className="text-gray-700">
//                   <li onClick={() => {navigate("/admin?tab=Profile"); setDropdownOpen(false)}} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
//                   <li onClick={() => {logout(); navigate("/?login=true")}} className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer">Logout</li>
//                 </ul>
//               </div>
//             )}
//           </div>

//           {/* Hamburger for mobile */}
//           <button className="lg:hidden text-gray-700" onClick={onToggleSidebar}>
//             <Menu size={26} />
//           </button>
//         </div>
//       </div>
//     </nav>
//   )
// }

// export default RecruiterNavbar;
