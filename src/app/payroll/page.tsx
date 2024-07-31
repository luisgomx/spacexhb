"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import Payroll from "@/components/Payroll";

const WorkersPage = () => {
  return (
    <ProtectedRoute>
      <DefaultLayout>
        <Payroll />
      </DefaultLayout>
    </ProtectedRoute>
  );
};

export default WorkersPage;
