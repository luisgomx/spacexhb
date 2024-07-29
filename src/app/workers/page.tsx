"use client";
import Workers from "@/components/Workers";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

// export const metadata: Metadata = {
//   title: "Next.js Calender | TailAdmin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
// };

const WorkersPage = () => {
  return (
    <ProtectedRoute>
      <DefaultLayout>
        <Workers />
      </DefaultLayout>
    </ProtectedRoute>
  );
};

export default WorkersPage;
