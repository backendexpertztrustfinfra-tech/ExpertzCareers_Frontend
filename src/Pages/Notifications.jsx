// import React, { useEffect, useState, useContext } from "react";
// import { fetchNotifications,  } from "../services/apis";
// import Cookies from "js-cookie";
// import { AuthContext } from "../context/AuthContext";

// const Notifications = () => {
//   const { user } = useContext(AuthContext);
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const token = Cookies.get("userToken");
//         if (!token) return;

//         let data = [];
//         if (user?.usertype === "recruiter") {
//           data = await fetchNotifications(token);
//         } else {
//           data = await fetchNotifications(token);
//         }
//         setNotifications(data.notifications || []);
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//       }
//     };
//     fetchNotifications();
//   }, [user]);

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h2 className="text-xl font-bold mb-4">Notifications</h2>
//       {notifications.length === 0 ? (
//         <p className="text-gray-500">No notifications yet.</p>
//       ) : (
//         <ul className="space-y-3">
//           {notifications.map((n, i) => (
//             <li
//               key={i}
//               className="p-3 bg-white shadow rounded-md border border-gray-200"
//             >
//               {n.message}
//               <span className="block text-xs text-gray-400">
//                 {new Date(n.createdAt).toLocaleString()}
//               </span>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Notifications;





import React, { useEffect, useState, useContext } from "react";
import { fetchNotifications } from "../services/apis";
import Cookies from "js-cookie";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../config";

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = Cookies.get("userToken");
      if (!token) return;

      const url = `${BASE_URL}/notification/getnotifications`;
      // console.log("Fetching notifications from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Fetch error:", response.status, response.statusText);
        return;
      }

      const data = await response.json();
      // console.log("Fetched Notifications:", data);

      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  fetchData();
}, [user]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`p-3 shadow rounded-md border ${n.isRead ? "bg-gray-100 border-gray-200" : "bg-yellow-50 border-yellow-300"
                }`}
            >
              <p className="font-medium">{n.title}</p>
              <p className="text-sm text-gray-600">{n.description}</p>
              <span className="block text-xs text-gray-400 mt-1">
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
