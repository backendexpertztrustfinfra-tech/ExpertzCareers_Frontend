// import React, { createContext, useEffect, useState } from "react";
// import { auth } from "../firebase-config";
// import { onAuthStateChanged } from "firebase/auth";
// import { jwtDecode } from "jwt-decode";
// import Cookies from "js-cookie";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [userToken, setUserToken] = useState(Cookies.get("userToken"));

//   useEffect(() => {
//     const token = Cookies.get("userToken");

//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setUser({ ...decoded, source: "api" });
//         setUserToken(token);

//         const usertype = Cookies.get("usertype");
//         const currentPath = window.location.pathname;

//         if (!usertype && currentPath !== "/signup") {
//           window.location.href = "/signup"; // ✅ safe redirect
//         }

//         return;
//       } catch (err) {
//         console.error("❌ Invalid token:", err.message);
//         Cookies.remove("userToken");
//       }
//     }

//     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//       if (firebaseUser) {
//         setUser({ ...firebaseUser, source: "firebase" });
//       } else {
//         setUser(null);
//         setUserToken(null);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const login = (token) => {
//     Cookies.set("userToken", token, {
//       expires: 7,
//       secure: true,
//       sameSite: "Lax",
//     });
//     setUserToken(token);
//     try {
//       const decoded = jwtDecode(token);
//       setUser({ ...decoded, source: "api" });

//       const usertype = Cookies.get("usertype");
//       const currentPath = window.location.pathname;

//       if (!usertype && currentPath !== "/signup") {
//         window.location.href = "/signup"; // ✅ safe redirect
//       }
//     } catch (err) {
//       console.error("Failed to decode token:", err.message);
//     }
//   };

//   const logout = () => {
//     Cookies.remove("userToken");
//     Cookies.remove("usertype");
//     setUser(null);
//     setUserToken(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, userToken, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// import React, { createContext, useEffect, useState } from "react";
// import { auth } from "../firebase-config";
// import { onAuthStateChanged } from "firebase/auth";
// import { jwtDecode } from "jwt-decode";
// import Cookies from "js-cookie";


// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [userToken, setUserToken] = useState(Cookies.get("userToken"));

//   useEffect(() => {
//     const token = Cookies.get("userToken");

//     if (token) {
//       try {
//         const decoded = jwtDecode(token);

//         // 🔥 Always load usertype from cookie if exists
//         const usertype = Cookies.get("usertype") || decoded.usertype || null;

//         setUser({ ...decoded, usertype, source: "api" });
//         setUserToken(token);

//         // 🔥 If usertype missing, force them to /signup
//         const currentPath = window.location.pathname;
//         if (!usertype && currentPath !== "/signup") {
//           window.location.href = "/signup";
//         }

//         return;
//       } catch (err) {
//         console.error("❌ Invalid token:", err.message);
//         Cookies.remove("userToken");
//       }
//     }

//     // ✅ Handle Firebase login (Google login)
//     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//       if (firebaseUser) {
//         setUser({ ...firebaseUser, source: "firebase" });
//       } else {
//         setUser(null);
//         setUserToken(null);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const login = (token, usertypeFromApi = null) => {
//     // Save token
//     Cookies.set("userToken", token, {
//       expires: 7,
//       secure: true,
//       sameSite: "Lax",
//     });
//     setUserToken(token);

//     try {
//       const decoded = jwtDecode(token);
//       if (usertypeFromApi) {
//         Cookies.set("usertype", usertypeFromApi, { expires: 7 });
//       }

//       const usertype = Cookies.get("usertype") || decoded.usertype || null;

//       setUser({ ...decoded, usertype, source: "api" });

//       const currentPath = window.location.pathname;
//       if (!usertype && currentPath !== "/") {
//         window.location.href = "/";
//       }
//     } catch (err) {
//       console.error("Failed to decode token:", err.message);
//     }
//   };

//   const logout = () => {
//     Cookies.remove("userToken");
//     Cookies.remove("usertype");
//     setUser(null);
//     setUserToken(null);
//     window.dispatchEvent(new Event("tokenChange"));
//   };

//   return (
//     <AuthContext.Provider value={{ user, userToken, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };











"use client"

import { createContext, useEffect, useState } from "react"
import { auth } from "../firebase-config"
import { onAuthStateChanged } from "firebase/auth"
import { jwtDecode } from "jwt-decode"
import Cookies from "js-cookie"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userToken, setUserToken] = useState(Cookies.get("userToken"))
  const [isLoading, setIsLoading] = useState(true) // Added loading state for initial auth check

  useEffect(() => {
    const token = Cookies.get("userToken")

    if (token) {
      try {
        const decoded = jwtDecode(token)

        // 🔥 Always load usertype from cookie if exists
        const usertype = Cookies.get("usertype") || decoded.usertype || null

        setUser({ ...decoded, usertype, source: "api" })
        setUserToken(token)

        const currentPath = window.location.pathname

        // Only redirect if we're on the home page or signup page
        if (usertype && (currentPath === "/" || currentPath === "/signup")) {
          setTimeout(() => {
            if (usertype === "recruter" || usertype === "recruiter") {
              window.location.href = "/admin"
            } else if (usertype === "jobseeker") {
              window.location.href = "/jobs"
            }
          }, 100) // Small delay to ensure proper loading
        }

        // 🔥 If usertype missing, force them to /signup
        if (!usertype && currentPath !== "/signup") {
          window.location.href = "/signup"
        }

        setIsLoading(false) // Set loading to false after processing
        return
      } catch (err) {
        console.error("❌ Invalid token:", err.message)
        Cookies.remove("userToken")
        Cookies.remove("usertype") // Also remove usertype cookie
        setIsLoading(false)
      }
    } else {
      setIsLoading(false) // Set loading to false if no token
    }

    // ✅ Handle Firebase login (Google login)
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({ ...firebaseUser, source: "firebase" })
      } else {
        setUser(null)
        setUserToken(null)
      }
      setIsLoading(false) // Set loading to false after Firebase auth check
    })

    return () => unsubscribe()
  }, [])

  const login = (token, usertypeFromApi = null) => {
    // Save token
    Cookies.set("userToken", token, {
      expires: 7,
      secure: true,
      sameSite: "Lax",
    })
    setUserToken(token)

    try {
      const decoded = jwtDecode(token)
      if (usertypeFromApi) {
        Cookies.set("usertype", usertypeFromApi, { expires: 7 })
      }

      const usertype = Cookies.get("usertype") || decoded.usertype || null

      setUser({ ...decoded, usertype, source: "api" })

      if (usertype) {
        setTimeout(() => {
          if (usertype === "recruter" || usertype === "recruiter") {
            window.location.href = "/admin"
          } else if (usertype === "jobseeker") {
            window.location.href = "/jobs"
          }
        }, 100)
      } else {
        const currentPath = window.location.pathname
        if (currentPath !== "/") {
          window.location.href = "/"
        }
      }
    } catch (err) {
      console.error("Failed to decode token:", err.message)
    }
  }

  const logout = () => {
    Cookies.remove("userToken")
    Cookies.remove("usertype")
    setUser(null)
    setUserToken(null)
    window.dispatchEvent(new Event("tokenChange"))
    window.location.href = "/"
  }

  return <AuthContext.Provider value={{ user, userToken, login, logout, isLoading }}>{children}</AuthContext.Provider>
}
