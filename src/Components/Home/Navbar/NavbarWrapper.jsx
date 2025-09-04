// "use client"

// // src/Components/Home/Navbar/NavbarWrapper.jsx
// import { useContext } from "react"
// import Cookies from "js-cookie"
// import { AuthContext } from "../../../context/AuthContext"
// import JobseekerNavbar from "./"
// import RecruiterNavbar from "./RecruiterNavbar"

// const NavbarWrapper = () => {
//   const { user } = useContext(AuthContext)

//   const ctxRole = (user?.usertype || "").toLowerCase()
//   const cookieRole = (Cookies.get("usertype") || "").toLowerCase()
//   const token = Cookies.get("userToken")
//   const role = ctxRole || cookieRole

//   if (role === "recruiter") return <RecruiterNavbar />
//   if (role === "jobseeker") return <JobseekerNavbar />

//   // If token exists but role not resolved yet, default to jobseeker navbar (safe)
//   if (token) return <JobseekerNavbar />

//   // Guest
//   return <JobseekerNavbar />
// }

// export default NavbarWrapper
