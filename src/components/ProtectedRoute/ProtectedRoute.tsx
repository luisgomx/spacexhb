// src/components/ProtectedRoute/ProtectedRoute.tsx
"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLoading(false);
      if (!isAuthenticated) {
        router.push("/login");
      }
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (!storedAuth) {
      router.push("/login");
    }
  }, [router]);

  if (!isAuthenticated && !loading) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
};

export default ProtectedRoute;
