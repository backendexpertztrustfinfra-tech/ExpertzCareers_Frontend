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

import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(Cookies.get("userToken"));

  useEffect(() => {
    const token = Cookies.get("userToken");

    if (token) {
      try {
        const decoded = jwtDecode(token);

        // 🔥 Always load usertype from cookie if exists
        const usertype = Cookies.get("usertype") || decoded.usertype || null;

        setUser({ ...decoded, usertype, source: "api" });
        setUserToken(token);

        // 🔥 If usertype missing, force them to /signup
        const currentPath = window.location.pathname;
        if (!usertype && currentPath !== "/signup") {
          window.location.href = "/signup";
        }

        return;
      } catch (err) {
        console.error("❌ Invalid token:", err.message);
        Cookies.remove("userToken");
      }
    }

    // ✅ Handle Firebase login (Google login)
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({ ...firebaseUser, source: "firebase" });
      } else {
        setUser(null);
        setUserToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = (token, usertypeFromApi = null) => {
    // Save token
    Cookies.set("userToken", token, {
      expires: 7,
      secure: true,
      sameSite: "Lax",
    });
    setUserToken(token);

    try {
      const decoded = jwtDecode(token);

      // 🔥 Update usertype in cookie if backend sends it
      if (usertypeFromApi) {
        Cookies.set("usertype", usertypeFromApi, { expires: 7 });
      }

      const usertype = Cookies.get("usertype") || decoded.usertype || null;

      setUser({ ...decoded, usertype, source: "api" });

      // Redirect if usertype is still missing
      const currentPath = window.location.pathname;
      if (!usertype && currentPath !== "/signup") {
        window.location.href = "/signup";
      }
    } catch (err) {
      console.error("Failed to decode token:", err.message);
    }
  };

  const logout = () => {
    Cookies.remove("userToken");
    Cookies.remove("usertype");
    setUser(null);
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, userToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};