import Cookies from "js-cookie";

export const saveTokenInCookie = (token, usertype, isVerified) => {
  Cookies.set("userToken", token, { expires: 7 });
  Cookies.set("usertype", usertype, { expires: 7 });
   Cookies.set("isVerified", isVerified ? "true" : "false", { expires: 7 });
};