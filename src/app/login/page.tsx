"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { push } = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(name, password);
    push("/profile");
  };

  const handleSignUp = () => {
    push("/signup");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  console.log("from login", isAuthenticated);

  return (
    <div
      style={{ backgroundImage: "url('/background.jpeg')" }}
      className="flex min-h-screen items-center justify-center bg-black bg-cover bg-center"
    >
      <div className="w-full max-w-md rounded-lg bg-transparent p-8 shadow-md">
        <div className="mb-6 flex justify-center">
          <img src="/logo.webp" alt="Logo" className="max-w-xs rounded-xl" />
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
          <button
            type="submit"
            className="w-full rounded-lg bg-purple-500 p-3 font-semibold text-white transition hover:bg-purple-600"
          >
            Entrar
          </button>
        </form>
        <div className="mt-4 rounded-lg bg-white p-2 text-center">
          <span>No te has registrado? </span>
          <button
            onClick={handleSignUp}
            className="font-semibold text-blue-500 hover:underline"
          >
            Registrate
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
