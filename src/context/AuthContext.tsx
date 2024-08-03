"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

// Define the shape of the AuthContext value
interface AuthContextProps {
  isAuthenticated: boolean;
  login: (name: string, password: string) => Promise<void>;
  logout: () => void;
  signUp: (name: string, password: string) => Promise<string | undefined>;
  username: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create Context with a default value
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Auth Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const storedAuth = localStorage.getItem("isAuthenticated");
      return storedAuth ? JSON.parse(storedAuth) : false;
    }
    return false;
  });

  const [username, setUsername] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("username") || "";
    }
    return "";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
      localStorage.setItem("username", username);
    }
  }, [isAuthenticated, username]);

  // Set default axios configuration to include credentials
  axios.defaults.withCredentials = true;

  // Function to validate the user's session with the server
  const validateSession = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/validate-session`);
      if (response.status !== 200) {
        logout();
      }
    } catch (error) {
      logout();
    }
  };

  // Run validation when component mounts or isAuthenticated changes
  useEffect(() => {
    if (isAuthenticated) {
      validateSession();
    }
  }, [isAuthenticated]);

  // Example login function
  const login = async (name: string, password: string) => {
    try {
      const response = await axios.post(`${apiUrl}/api/login`, {
        name,
        password,
      });

      if (response.status === 200) {
        setUsername(name);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.data.error || "Login failed");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${apiUrl}/api/logout`);
      setIsAuthenticated(false);
      setUsername("");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const signUp = async (
    name: string,
    password: string,
  ): Promise<string | undefined> => {
    try {
      const response = await axios.post(`${apiUrl}/api/users`, {
        name,
        password,
      });

      if (response.status === 201) {
        return "User registered";
      } else {
        return response.data.error;
      }
    } catch (error: any) {
      return error.response?.data?.error || "Registration failed";
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, signUp, username }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
