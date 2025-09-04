// "use client"

// // src/Components/Navbar/RecruiterNavbar.jsx
// import { useState, useContext } from "react"
// import { useNavigate } from "react-router-dom"
// import LOGO from "../../../assets/Image/logo_2.png"
// import { signOut as firebaseSignOut } from "firebase/auth"
// import { auth } from "../../../firebase-config"
// import { Menu, X } from "lucide-react"
// import { AuthContext } from "../../../context/AuthContext"

// const RecruiterNavbar = () => {
//   const { user, logout } = useContext(AuthContext)
//   const navigate = useNavigate()
//   const [mobileOpen, setMobileOpen] = useState(false)

//   const handleLogout = async () => {
//     try {
//       if (user?.source === "firebase") await firebaseSignOut(auth)
//       logout()
//       navigate("/?login=true")
//     } catch (error) {
//       console.error("Logout Error:", error)
//       alert("Failed to logout")
//     }
//   }

//   return (
//     <nav className="backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-md sticky top-0 z-[9999]">
//       <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">
//         <img
//           src={LOGO || "/placeholder.svg"}
//           alt="Logo"
//           className="h-14 sm:h-18 w-22 sm:w-28 cursor-pointer transition-transform hover:scale-105"
//           onClick={() => navigate("/admin")}
//         />

//         {/* Desktop Logout */}
//         {user && (
//           <div className="hidden lg:block">
//             <button
//               onClick={handleLogout}
//               className="bg-gradient-to-r from-yellow-500 to-pink-500 text-white px-5 py-2 rounded-full hover:opacity-90 transition font-medium shadow"
//             >
//               Logout
//             </button>
//           </div>
//         )}

//         {/* Mobile Hamburger */}
//         <button className="lg:hidden text-gray-700" onClick={() => setMobileOpen(!mobileOpen)}>
//           {mobileOpen ? <X size={26} /> : <Menu size={26} />}
//         </button>
//       </div>

//       {/* Mobile action */}
//       {mobileOpen && (
//         <div className="lg:hidden bg-white border-t border-gray-200 shadow-md px-6 py-4">
//           {user && (
//             <button
//               onClick={() => {
//                 handleLogout()
//                 setMobileOpen(false)
//               }}
//               className="w-full bg-gradient-to-r from-yellow-500 to-pink-500 text-white px-6 py-2 rounded-full hover:opacity-90 transition font-medium shadow"
//             >
//               Logout
//             </button>
//           )}
//         </div>
//       )}
//     </nav>
//   )
// }

// export default RecruiterNavbar
