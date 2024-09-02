mi"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const { signUp } = useAuth();
  const { push } = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true); // Set loading state to true
    const message = await signUp(name, password);
    setIsLoading(false); // Set loading state to false

    if (message === "User registered") {
      push("/login");
    } else {
      alert(message);
    }
  };

  const handleLogin = () => {
    push("/login");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div
      style={{ backgroundImage: "url('/background.jpeg')" }}
      className="flex min-h-screen items-center justify-center bg-black bg-cover bg-center"
    >
      <div className="w-full max-w-md rounded-lg bg-transparent p-8 shadow-md">
        <div className="mb-6 flex justify-center">
          <img
            src="/logo.webp" // Replace with the path to your image
            alt="Logo"
            className="max-w-xs rounded-xl" // Adjust as needed
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Usuario"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gray-300 w-full rounded-lg border p-3 text-center"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-gray-300 w-full rounded-lg border p-3 text-center"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-600 absolute right-2 top-1/2 -translate-y-1/2 transform"
            >
              {showPassword ? "Esconder" : "Mostrar"}
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-gray-300 w-full rounded-lg border p-3 text-center"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-600 absolute right-2 top-1/2 -translate-y-1/2 transform"
            >
              {showPassword ? "Esconder" : "Mostrar"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-purple-500 p-3 font-semibold text-white transition hover:bg-purple-600 disabled:bg-purple-300"
            disabled={isLoading}
            //disabled
          >
            {isLoading ? (
              <svg
                className="mx-auto h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                ></path>
              </svg>
            ) : (
              "Registrarse"
            )}
          </button>
        </form>
        <div className="mt-4 rounded-lg bg-white p-2 text-center">
          <span>Ya tienes una cuenta? </span>
          <button
            onClick={handleLogin}
            className="font-semibold text-blue-500 hover:underline"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
