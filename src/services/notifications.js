// import Cookies from "js-cookie"
// import { BASE_URL } from "../config";

// function isNetworkError(err) {
//   return err instanceof TypeError && /fetch/i.test(err.message)
// }

// function normalizeNotificationsResponse(body) {
//   if (Array.isArray(body)) return body
//   if (Array.isArray(body?.notifications)) return body.notifications
//   if (Array.isArray(body?.data)) return body.data
//   if (Array.isArray(body?.results)) return body.results
//   return []
// }

// export async function sendNotification({ type, userId, jobId, extraData }) {
//   const token = Cookies.get("userToken")
//   if (!token) throw new Error("No auth token")

//   try {
//     const res = await fetch(`${BASE_URL}/notification/sentnotification`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         type,
//         userId,
//         ...(jobId ? { jobId } : {}),
//         ...(extraData ? { extraData } : {}),
//       }),
//     })
//     if (!res.ok) {
//       const t = await res.text()
//       throw new Error(t || "Failed to send notification")
//     }
//     return res.json()
//   } catch (err) {
//     if (isNetworkError(err)) {
//       throw new Error(
//         `Network error contacting ${BASE_URL}. Set BASE_URL to your API or ensure the server is running.`,
//       )
//     }
//     throw err
//   }
// }

// export async function getNotifications() {
//   const token = Cookies.get("userToken")
//   if (!token) throw new Error("No auth token")

//   try {
//     const res = await fetch(`${BASE_URL}/notification/getnotifications`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     if (!res.ok) {
//       const t = await res.text()
//       throw new Error(t || "Failed to fetch notifications")
//     }
//     const body = await res.json()
//     const list = normalizeNotificationsResponse(body)
//     return { notifications: list }
//   } catch (err) {
//     if (isNetworkError(err)) {
//       throw new Error(
//         `Network error contacting ${BASE_URL}. Set BASE_URL to your API or ensure the server is running.`,
//       )
//     }
//     throw err
//   }
// }

// export async function markNotificationRead(id) {
//   const token = Cookies.get("userToken")
//   if (!token) throw new Error("No auth token")

//   try {
//     const res = await fetch(`${BASE_URL}/notification/readnotification/${id}`, {
//       method: "PUT",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     if (!res.ok) {
//       const t = await res.text()
//       throw new Error(t || "Failed to mark notification as read")
//     }
//     return res.json()
//   } catch (err) {
//     if (isNetworkError(err)) {
//       throw new Error(
//         `Network error contacting ${BASE_URL}. Set BASE_URL to your API or ensure the server is running.`,
//       )
//     }
//     throw err
//   }
// }

// export function unreadCount(notifications = []) {
//   return notifications.filter((n) => !n.isRead).length
// }
