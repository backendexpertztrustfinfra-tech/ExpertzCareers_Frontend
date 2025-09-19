import React, { useEffect, useState, useContext } from "react";
import { getRecruiterNotifications, getJobseekerNotifications } from "../services/apis";
import Cookies from "js-cookie";
import { AuthContext } from "../context/AuthContext";

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = Cookies.get("userToken");
        if (!token) return;

        let data = [];
        if (user?.usertype === "recruiter") {
          data = await getRecruiterNotifications(token);
        } else {
          data = await getJobseekerNotifications(token);
        }
        setNotifications(data.notifications || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n, i) => (
            <li
              key={i}
              className="p-3 bg-white shadow rounded-md border border-gray-200"
            >
              {n.message}
              <span className="block text-xs text-gray-400">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
