import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

export const metadata: Metadata = {
  title: "Agencia Space X",
  description: "This is made for Habbo Agency only",
};

export default function Home() {
  return (
    <>
      <AuthProvider>
        <DefaultLayout>
          <ProtectedRoute>
            <h1>BIENVENIDO</h1>
          </ProtectedRoute>
        </DefaultLayout>
      </AuthProvider>
    </>
  );
}
