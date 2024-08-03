"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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

  // Function to validate the user's session with the server
  const validateSession = async () => {
    const response = await fetch(`${apiUrl}/api/validate-session`, {
      method: "GET",
      credentials: "include", // Use credentials for cookies
    });

    if (!response.ok) {
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
    const response = await fetch(`${apiUrl}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
      credentials: "include", // Use credentials for cookies
    });

    if (response.ok) {
      setUsername(name);
      setIsAuthenticated(true);
    } else {
      const result = await response.json();
      throw new Error(result.error || "Login failed");
    }
  };

  const logout = async () => {
    await fetch(`${apiUrl}/api/logout`, {
      method: "POST",
      credentials: "include", // Use credentials for cookies
    });
    setIsAuthenticated(false);
    setUsername("");
  };

  const signUp = async (
    name: string,
    password: string,
  ): Promise<string | undefined> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      },
    );

    if (response.ok) {
      return "User registered";
    } else {
      const result = await response.json();
      return result.error;
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
