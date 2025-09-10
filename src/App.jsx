import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./Components/Home/SearchContext";
import { SavedJobsProvider } from "./context/SavedJobsContext";
import ScrollToTop from "./Components/Common/ScrollToTop";
import Layout from "./Layout";
import Home from "./Pages/Home";
import JobBoard from "./Pages/JobBoard";
import JobDetailsPage from "./Components/JobAbt/JobDetailsPage";  
import SearchResults from "./Components/Home/SearchResults";
import Sign from "./Pages/Sign";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import ProfilePage from "./Pages/ProfilePage";
import ResumePreview from "./Pages/ResumePreview";
import RecSign from "./Pages/RecSign";
import Register from "./Pages/Register";
import MyJobsDashboard from "./Pages/MyJobsDashboard";
import Admin from "./Pages/Admin";
import ProtectedRoute from "./context/ProtectedRoute";
import Companies from "./Pages/Companies";
import CompanyPage from "./Pages/CompanyPage";
import Services from "./Pages/Services";
import PostJobPage from "./Components/Admin/Job/PostJobPage";

function App() {
  return (
    <SearchProvider>
      <AuthProvider>
        <SavedJobsProvider>
          <Router>
            <ScrollToTop />
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
                <Route
                  path="/post-job"
                  element={<PostJobPage />}
                />

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
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedtype={["recruter"]}>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </SavedJobsProvider>
      </AuthProvider>
    </SearchProvider>
  );
}

export default App;