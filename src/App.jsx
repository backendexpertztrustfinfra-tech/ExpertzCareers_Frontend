// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import { SearchProvider } from "./Components/Home/SearchContext";
// import { SavedJobsProvider } from "./context/SavedJobsContext";
// import ScrollToTop from "./Components/Common/ScrollToTop";
// import Layout from "./Layout";
// import Home from "./Pages/Home";
// import JobBoard from "./Pages/JobBoard";
// import JobDetailsPage from "./Components/JobAbt/JobDetailsPage";
// import SearchResults from "./Components/Home/SearchResults";
// import Sign from "./Pages/Sign";
// import About from "./Pages/About";
// import Contact from "./Pages/Contact";
// import ProfilePage from "./Pages/ProfilePage";
// import ResumePreview from "./Pages/ResumePreview";
// import RecSign from "./Pages/RecSign";
// import Register from "./Pages/Register";
// import MyJobsDashboard from "./Pages/MyJobsDashboard";
// import Admin from "./Pages/Admin";
// import ProtectedRoute from "./context/ProtectedRoute";
// import Companies from "./Pages/Companies";
// import CompanyPage from "./Pages/CompanyPage";
// import Services from "./Pages/Services";
// import PostJobPage from "./Components/Admin/Job/PostJobPage";
// import Mission from "./Pages/Mission";
// import Vision from "./Pages/Vision.jsx";
// import Terms from "./Pages/Terms.jsx";
// import PrivacyPolicy from "./Pages/PrivacyPolicy";

// function App() {
//   return (
//     <SearchProvider>
//       <AuthProvider>
//         <SavedJobsProvider>
//           <Router>
//             <ScrollToTop />
//             <Routes>
//               <Route path="/" element={<Layout />}>
//                 <Route index element={<Home />} />
//                 <Route path="/jobs" element={<JobBoard />} />
//                 <Route path="/jobs/:id" element={<JobDetailsPage />} />
//                 <Route path="/search" element={<SearchResults />} />
//                 <Route path="/signup" element={<Sign />} />
//                 <Route path="/about" element={<About />} />
//                 <Route path="/contact" element={<Contact />} />
//                 <Route path="/companies" element={<Companies />} />
//                 <Route path="/companies/:id" element={<CompanyPage />} />
//                 <Route path="/services" element={<Services />} />
//                 <Route path="/post-job" element={<PostJobPage />} />
//                 <Route path="/mission" element={<Mission />} />
//                 <Route path="/vision" element={<Vision />} />
//                 <Route path="/terms" element={<Terms />} />
//                 <Route path="/privacy-policy" element={<PrivacyPolicy />} />

//                 <Route
//                   path="/my-jobs"
//                   element={
//                     <ProtectedRoute allowedtype={["jobseeker"]}>
//                       <MyJobsDashboard />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/profile"
//                   element={
//                     <ProtectedRoute allowedtype={["jobseeker"]}>
//                       <ProfilePage />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/resume"
//                   element={
//                     <ProtectedRoute allowedtype={["jobseeker"]}>
//                       <ResumePreview />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route path="/rec" element={<RecSign />} />
//                 <Route path="/reg" element={<Register />} />
//               </Route>

//               {/* Recruiter route (protected) */}
//               <Route
//                 path="/admin"
//                 element={
//                   <ProtectedRoute allowedtype={["recruter"]}>
//                     <Admin />
//                   </ProtectedRoute>
//                 }
//               />
//             </Routes>
//           </Router>
//         </SavedJobsProvider>
//       </AuthProvider>
//     </SearchProvider>
//   );
// }

// export default App;

















"use client"

import { useContext } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider, AuthContext } from "./context/AuthContext"
import { SearchProvider } from "./Components/Home/SearchContext"
import { SavedJobsProvider } from "./context/SavedJobsContext"
import ScrollToTop from "./Components/Common/ScrollToTop"
import Layout from "./Layout"
import Home from "./Pages/Home"
import JobBoard from "./Pages/JobBoard"
import JobDetailsPage from "./Components/JobAbt/JobDetailsPage"
import SearchResults from "./Components/Home/SearchResults"
import Sign from "./Pages/Sign"
import About from "./Pages/About"
import Contact from "./Pages/Contact"
import ProfilePage from "./Pages/ProfilePage"
import ResumePreview from "./Pages/ResumePreview"
import RecSign from "./Pages/RecSign"
import Register from "./Pages/Register"
import MyJobsDashboard from "./Pages/MyJobsDashboard"
import Admin from "./Pages/Admin"
import ProtectedRoute from "./context/ProtectedRoute"
import Companies from "./Pages/Companies"
import CompanyPage from "./Pages/CompanyPage"
import Services from "./Pages/Services"
import PostJobPage from "./Components/Admin/Job/PostJobPage"
import Mission from "./Pages/Mission"
import Vision from "./Pages/Vision.jsx"
import Terms from "./Pages/Terms.jsx"
import PrivacyPolicy from "./Pages/PrivacyPolicy"
import Notifications from "../src/Pages/Notifications"
import ResetPassword from "./Pages/ResetPassword"

const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-50 to-yellow-100 flex items-center justify-center">
    <div className="flex flex-col items-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-700 font-medium text-lg">Loading your session...</p>
    </div>
  </div>
)

const AppContent = () => {
  const { isLoading } = useContext(AuthContext)

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/jobs" element={<JobBoard />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/signup" element={<Sign />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:id" element={<CompanyPage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/post-job" element={<PostJobPage />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/vision" element={<Vision />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/notification" element={<Notifications/>}/>
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/my-jobs"
          element={
            <ProtectedRoute allowedtype={["jobseeker"]}>
              <MyJobsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedtype={["jobseeker"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume"
          element={
            <ProtectedRoute allowedtype={["jobseeker"]}>
              <ResumePreview />
            </ProtectedRoute>
          }
        />
        <Route path="/rec" element={<RecSign />} />
        <Route path="/reg" element={<Register />} />
      </Route>

      {/* Recruiter route (protected) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedtype={["recruter", "recruiter"]}>
            <Admin />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <SearchProvider>
      <AuthProvider>
        <SavedJobsProvider>
          <Router>
            <ScrollToTop />
            <AppContent />
          </Router>
        </SavedJobsProvider>
      </AuthProvider>
    </SearchProvider>
  )
}

export default App
