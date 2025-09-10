import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { BASE_URL } from "../config";

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("userToken");

  const fetchSubscription = async () => {
    if (!token) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/recruiter/getActiveSubscription`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setSubscription(data.subscription || null);
      } else {
        setSubscription(null);
      }
    } catch (err) {
      console.error("Error fetching subscription:", err);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [token]);

  return (
    <SubscriptionContext.Provider
      value={{ subscription, loading, refreshSubscription: fetchSubscription }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
