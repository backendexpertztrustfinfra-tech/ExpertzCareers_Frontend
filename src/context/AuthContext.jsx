import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(Cookies.get("userToken") || null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async () => {
      const token = Cookies.get("userToken");
      const usertype = Cookies.get("usertype");
      const isVerified = Cookies.get("isVerified") === "true";
      const username = Cookies.get("username");
      const useremail = Cookies.get("useremail");

      // ✅ list of routes that don’t require authentication
      const publicRoutes = [
        "/",
        "/signup",
        "/register",
        "/reset-password",
        "/emailverification",
        "/forgot-password",
        "/about",
        "/contact",
        "/services",
        "/companies",
        "/mission",
        "/vision",
        "/terms",
        "/privacy-policy",
      ];

      if (!token) {
        setUser(null);
        setUserToken(null);
        setIsLoading(false);

        if (!publicRoutes.includes(location.pathname)) {
          navigate("/", { replace: true });
        }
        return;
      }

      try {
        const decoded = jwtDecode(token);

        setUser({
          id: decoded._id,
          usertype,
          isVerified,
          username,
          useremail,
          source: "api",
        });
        setUserToken(token);

        if (!isVerified && location.pathname !== "/emailverification") {
          navigate("/emailverification", { replace: true });
          setIsLoading(false);
          return;
        }

        if (isVerified) {
          if (usertype === "recruiter" && location.pathname === "/") {
            navigate("/admin", { replace: true });
          } else if (usertype === "jobseeker" && location.pathname === "/") {
            navigate("/", { replace: true });
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Invalid token:", err.message);
        Cookies.remove("userToken");
        Cookies.remove("usertype");
        Cookies.remove("isVerified");
        Cookies.remove("username");
        Cookies.remove("useremail");
        setUser(null);
        setUserToken(null);
        setIsLoading(false);
        navigate("/", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate, location.pathname]);

  const login = (token, usertypeFromApi, isVerifiedFromApi, username, useremail) => {
    const verifiedFlag = Boolean(isVerifiedFromApi);

    Cookies.set("userToken", token, { expires: 7, secure: true, sameSite: "Lax" });
    Cookies.set("usertype", usertypeFromApi, { expires: 7 });
    Cookies.set("isVerified", verifiedFlag ? "true" : "false", { expires: 7 });
    if (username) Cookies.set("username", username, { expires: 7 });
    if (useremail) Cookies.set("useremail", useremail, { expires: 7 });

    setUserToken(token);
    setUser({
      id: jwtDecode(token)._id,
      usertype: usertypeFromApi,
      isVerified: verifiedFlag,
      username,
      useremail,
      source: "api",
    });
  };

  const logout = () => {
    Cookies.remove("userToken");
    Cookies.remove("usertype");
    Cookies.remove("isVerified");
    Cookies.remove("username");
    Cookies.remove("useremail");
    setUser(null);
    setUserToken(null);
    navigate("/", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, userToken, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
