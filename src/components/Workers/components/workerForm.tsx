"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const WorkerForm: React.FC<{ onWorkerAdded: () => void }> = ({
  onWorkerAdded,
}) => {
  const { username } = useAuth();

  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Get today's date in yyyy-mm-dd format
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const dd = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    setCurrentDate(formattedDate);
  }, []);

  const [formData, setFormData] = useState({
    usuario: "",
    registradoPor: username,
    fecha: currentDate,
    category: "",
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      fecha: currentDate,
    }));
  }, [currentDate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/worker`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 201) {
        onWorkerAdded();
      } else {
        console.error("Failed to add worker");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="flex justify-center">
        <h1 className="text-title-md font-extrabold">
          Registro de trabajadores
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-gray-700 block text-sm font-medium">
            Usuario
          </label>
          <input
            type="text"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            className="border-gray-300 mt-1 block w-full rounded-md p-2.5  text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base"
          />
        </div>
        <div>
          <label className="text-gray-700 block text-sm font-medium">
            Rango
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border-gray-300 mt-1 block w-full rounded-md p-2.5  text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base"
          >
            <option value="" disabled>
              Selecciona rango
            </option>
            <option value="SEG">SEG</option>
            <option value="TRN">TEC</option>
            <option value="LOG">LOG</option>
            <option value="HR">HR</option>
            <option value="DIR">DIR</option>
            <option value="OP">OP</option>
          </select>
        </div>
        <div>
          <label className="text-gray-700 block text-sm font-medium">
            Fecha
          </label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            readOnly
            className="border-gray-300 mt-1 block w-full rounded-md p-2.5  text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base"
          />
        </div>
        <div>
          <label className="text-gray-700 block text-sm font-medium">
            Registrado por
          </label>
          <input
            type="text"
            name="registradoPor"
            value={formData.registradoPor}
            readOnly
            className="border-gray-300 mt-1 block w-full rounded-md p-2.5  text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-base"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full rounded-lg bg-purple-500 px-4 py-2 font-semibold text-white transition hover:bg-purple-600"
          >
            Registrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkerForm;
