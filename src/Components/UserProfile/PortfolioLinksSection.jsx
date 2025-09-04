// components/PortfolioLinksSection.jsx
import React, { useState } from "react";
import Cookies from "js-cookie";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, PlusCircle, Edit3, X, ExternalLink } from "lucide-react";

/**
 *
 * @param {object} props - Component props.
 * @param {object} props.profile - The current user profile object.
 * @param {function} props.setProfile - Function to update the parent profile state.
 * @param {object} props.uiToBackendMap - Mapping from UI state keys to backend schema keys.
 * @param {function} props.setShowModal - Function to show the custom modal.
 * @param {function} props.setModalMessage - Function to set the custom modal message.
 */
const PortfolioLinksSection = ({ profile, setProfile, uiToBackendMap, setShowModal, setModalMessage }) => {
  const [newPortfolioLink, setNewPortfolioLink] = useState("");
  const [editingPortfolioLinkIndex, setEditingPortfolioLinkIndex] = useState(null);
  const [tempLinkValue, setTempLinkValue] = useState(""); // Temporary value for editing a link

  const handleAddPortfolioLink = async () => {
    if (newPortfolioLink.trim() === "") {
      setModalMessage("Portfolio link cannot be empty.");
      setShowModal(true);
      return;
    }

    const updatedLinks = [...profile.portfolioLinks, newPortfolioLink.trim()];
    try {
      // Update profile state with new links
      const updatedProfile = { ...profile, portfolioLinks: updatedLinks };
      setProfile(updatedProfile);
      setNewPortfolioLink("");

      // Send update to the backend
      const token = Cookies.get("userToken");
      const updatedBackendPayloadForPortfolio = {};
      for (const uiKey in updatedProfile) {
        if (uiToBackendMap[uiKey]) {
          updatedBackendPayloadForPortfolio[uiToBackendMap[uiKey]] = updatedProfile[uiKey];
        }
      }

      const response = await fetch(
        "https://expertzcareers-backend.onrender.com/jobseeker/updatejobseekerprofile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedBackendPayloadForPortfolio), 
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add portfolio link to backend");

      setModalMessage("Portfolio link added successfully!");
      setShowModal(true);
    } catch (error) {
      console.error("Error adding portfolio link:", error);
      setModalMessage("Failed to add portfolio link.");
      setShowModal(true);
    }
  };

  const handleEditPortfolioLink = async (index, updatedLink) => {
    if (updatedLink.trim() === "") {
      setModalMessage("Portfolio link cannot be empty.");
      setShowModal(true);
      return;
    }

    const updatedLinks = [...profile.portfolioLinks];
    updatedLinks[index] = updatedLink.trim();

    try {
      // Update profile state with edited links
      const updatedProfile = { ...profile, portfolioLinks: updatedLinks };
      setProfile(updatedProfile);
      setEditingPortfolioLinkIndex(null); // Exit editing mode
      setTempLinkValue(""); // Clear temp value

      // Send update to the backend
      const token = Cookies.get("userToken");
      const updatedBackendPayloadForPortfolioEdit = {};
      for (const uiKey in updatedProfile) {
        if (uiToBackendMap[uiKey]) {
          updatedBackendPayloadForPortfolioEdit[uiToBackendMap[uiKey]] = updatedProfile[uiKey];
        }
      }

      const response = await fetch(
        "https://expertzcareers-backend.onrender.com/jobseeker/updatejobseekerprofile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedBackendPayloadForPortfolioEdit), 
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update portfolio link in backend");

      setModalMessage("Portfolio link updated successfully!");
      setShowModal(true);
    } catch (error) {
      console.error("Error updating portfolio link:", error);
      setModalMessage("Failed to update portfolio link.");
      setShowModal(true);
    }
  };

  const handleRemovePortfolioLink = async (index) => {
    const updatedLinks = profile.portfolioLinks.filter((_, i) => i !== index);
    try {
      // Update profile state with removed link
      const updatedProfile = { ...profile, portfolioLinks: updatedLinks };
      setProfile(updatedProfile);

      // Send update to the backend
      const token = Cookies.get("userToken");
      const updatedBackendPayloadForPortfolioRemoval = {};
      for (const uiKey in updatedProfile) {
        if (uiToBackendMap[uiKey]) {
          updatedBackendPayloadForPortfolioRemoval[uiToBackendMap[uiKey]] = updatedProfile[uiKey];
        }
      }

      const response = await fetch(
        "https://expertzcareers-backend.onrender.com/jobseeker/updatejobseekerprofile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedBackendPayloadForPortfolioRemoval), // Send updated links
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to remove portfolio link from backend");

      setModalMessage("Portfolio link removed successfully!");
      setShowModal(true);
    } catch (error) {
      console.error("Error removing portfolio link:", error);
      setModalMessage("Failed to remove portfolio link.");
      setShowModal(true);
    }
  };

  return (
    <Card className="p-8 border-2 border-dashed border-yellow-300/50 rounded-lg hover:border-yellow-500 transition-colors dark:border-yellow-700/50 dark:hover:border-yellow-400">
      <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
      <h3 className="font-semibold mb-2">Portfolio Links</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">GitHub, Behance, Personal Website</p>

      {/* Input for new link */}
      <div className="flex space-x-2 mb-4">
        <input
          type="url"
          placeholder="Add new portfolio link (URL)"
          value={newPortfolioLink}
          onChange={(e) => setNewPortfolioLink(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <Button
          onClick={handleAddPortfolioLink}
          className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-lg"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      {/* List of existing links */}
      {profile.portfolioLinks && profile.portfolioLinks.length > 0 && (
        <div className="space-y-2 mt-4">
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200">Your Links:</h4>
          {profile.portfolioLinks.map((link, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
              {editingPortfolioLinkIndex === index ? (
                <input
                  type="url"
                  value={tempLinkValue}
                  onChange={(e) => setTempLinkValue(e.target.value)}
                  className="flex-1 p-1 border border-blue-300 rounded-md focus:outline-none dark:bg-gray-600 dark:text-white"
                />
              ) : (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-blue-600 dark:text-blue-400 hover:underline truncate"
                >
                  {link}
                </a>
              )}
              {editingPortfolioLinkIndex === index ? (
                <div className="flex space-x-1">
                  <Button size="sm" onClick={() => handleEditPortfolioLink(index, tempLinkValue)} className="bg-green-500 hover:bg-green-600 text-white">Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingPortfolioLinkIndex(null)} className="border-gray-300 text-gray-600 hover:bg-gray-100">Cancel</Button>
                </div>
              ) : (
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingPortfolioLinkIndex(index);
                      setTempLinkValue(link);
                    }}
                    className="text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemovePortfolioLink(index)}
                    className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default PortfolioLinksSection;
