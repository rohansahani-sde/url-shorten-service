import { createContext, useState, useEffect } from "react";
// import axios from "../api/axiosInstance";
import axios from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

 const fetchMe = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    const res = await axios.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUser(res.data.user);
  } catch {
    setUser(null);
  }
};


  useEffect(() => {
    fetchMe();
  }, []); 

  return (
    <AuthContext.Provider value={{ user, setUser, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};
