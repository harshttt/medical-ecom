import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "../utils/axios";
import { message } from "antd";

const ConstantsContext = createContext();

export const useConstants = () => useContext(ConstantsContext);

export function ConstantsProvider({ children }) {
  const [constants, setConstants] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConstants();
  }, []);

  const fetchConstants = async () => {
    try {
      const res = await axios.get("/constants");  // Assuming /constants is your endpoint
      setConstants(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load constants");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConstantsContext.Provider value={{ constants, loading, refetch: fetchConstants }}>
      {children}
    </ConstantsContext.Provider>
  );
}
