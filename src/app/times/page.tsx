"use client";
import Profile from "@/components/UserProfile";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import Times from "@/components/Times";

// export const metadata: Metadata = {
//   title: "Next.js Calender | TailAdmin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
// };

const TimesPage = () => {
  return (
    <ProtectedRoute>
      <DefaultLayout>
        <Times />
      </DefaultLayout>
    </ProtectedRoute>
  );
};

export default TimesPage;
