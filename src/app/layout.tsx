"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import RocketAnimation from "@/components/RocketAnimation/RocketAnimation";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [loading, setLoading] = useState<boolean>(true);
  const [loadingRocket, setLoadingRocket] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingRocket(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loadingRocket) {
    return (
      <html lang="en">
        <body suppressHydrationWarning={true}>
          <RocketAnimation />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
