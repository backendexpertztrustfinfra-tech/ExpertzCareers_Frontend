import Cookies from "js-cookie";

export const saveTokenInCookie = (token, usertype) => {
  Cookies.set("userToken", token, { expires: 7 });
  Cookies.set("usertype", usertype, { expires: 7 });
};