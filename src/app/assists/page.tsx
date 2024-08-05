"use client";

import Assists from "@/components/Assists";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

const AssistsPage = () => {
  return (
    <ProtectedRoute>
      <DefaultLayout>
        <Assists />
      </DefaultLayout>
    </ProtectedRoute>
  );
};

export default AssistsPage;
