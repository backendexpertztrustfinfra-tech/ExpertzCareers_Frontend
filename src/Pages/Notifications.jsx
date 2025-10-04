import React, { useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../config";
import { Briefcase, Clock, Building2 } from "lucide-react";

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false); // 🔹 Added loader state
  const navigate = useNavigate();

  // 🔹 Fetch notifications
  const fetchNotifications = async () => {
    try {
      const token = Cookies.get("userToken");
      if (!token) return;

      setLoading(true); // 🔹 Start loader before fetching

      const res = await fetch(`${BASE_URL}/notification/getnotifications`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch notifications", res.statusText);
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("📦 Notifications response:", data);
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false); // 🔹 Stop loader
    }
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  // 🔹 Mark notification as read
  const markAsRead = async (id) => {
    try {
      const token = Cookies.get("userToken");
      if (!token) return;

      const res = await fetch(
        `${BASE_URL}/notification/readnotification/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to mark notification as read", res.statusText);
        return;
      }

      const updatedNotification = await res.json();

      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n?._id === updatedNotification?.notification?._id
            ? { ...n, isRead: true }
            : n
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // 🔹 Click handler
  const handleNotificationClick = async (n) => {
    if (!n) return;

    if (!n.isRead && n._id) {
      await markAsRead(n._id);
    }

    const job = n.extraData?.job;
    if (job?._id) {
      navigate(`/jobs/${job._id}`, { state: { job } });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        🔔 Notifications
      </h2>

      {/* 🔹 Loader while fetching */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-[#caa057] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 text-center">No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications
            .filter((n) => n && (n._id || n.title || n.description))
            .map((n) => {
              const job = n.extraData?.job;

              return (
                <li
                  key={n._id || Math.random()}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-4 shadow rounded-xl border cursor-pointer transition hover:shadow-md hover:bg-white ${
                    n.isRead
                      ? "bg-gray-100 border-gray-200"
                      : "bg-yellow-50 border-yellow-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                        <Briefcase size={18} className="text-[#caa057]" />
                        {job?.jobTitle || n.title || "New Notification"}
                      </p>
                      {job?.company && (
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <Building2 size={16} /> {job.company}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        {n.description || "No details provided"}
                      </p>
                      <span className="block text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <Clock size={12} />
                        {n.createdAt
                          ? new Date(n.createdAt).toLocaleString()
                          : "Unknown time"}
                      </span>
                    </div>
                    {!n.isRead && (
                      <span className="bg-[#caa057] text-white text-xs px-2 py-1 rounded-full shadow">
                        New
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
