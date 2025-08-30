import React from "react";
import ProfileHeader from "../Components/UserProfile/ProfileHeader";
import ProfileSections from "../Components/UserProfile/ProfileSections";
import ResumeUploader from "../Components/UserProfile/ResumeUploader";
import SidebarLinks from "../Components/UserProfile/SidebarLinks";

const UserProfile = () => {
  return (
    <>
      <ProfileHeader />
      <ProfileSections />
      <ResumeUploader />
      <SidebarLinks />
    </>
  );
};

export default UserProfile;
