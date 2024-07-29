"use client";

import React from "react";

interface Worker {
  usuario: string;
  fecha: string;
  registradoPor: string;
  category: string; // Add this if needed
}

const WorkersTable: React.FC<{ workers: Worker[] }> = ({ workers }) => {
  return (
    <div className="relative overflow-x-auto shadow-md dark:border-strokedark dark:bg-boxdark sm:rounded-lg">
      <table className="w-full text-left text-sm text-white rtl:text-right">
        <thead className="bg-gray-300 text-xs font-extrabold uppercase text-white">
          <tr>
            <th scope="col" className="px-6 py-3">
              Usuario
            </th>
            <th scope="col" className="px-6 py-3">
              Fecha registro
            </th>
            <th scope="col" className="px-6 py-3">
              Quien registró
            </th>
            <th scope="col" className="px-6 py-3">
              Rango
            </th>{" "}
            {/* Added Rango */}
          </tr>
        </thead>
        <tbody>
          {workers.length > 0 ? (
            workers.map((worker, index) => (
              <tr
                key={index}
                className="bg-gray-700 border-gray-600 hover:bg-indigo-500"
              >
                <th
                  scope="row"
                  className="whitespace-nowrap px-6 py-4 font-medium text-white"
                >
                  {worker.usuario}
                </th>
                <td className="px-6 py-4">{worker.fecha}</td>
                <td className="px-6 py-4">{worker.registradoPor}</td>
                <td className="px-6 py-4">{worker.category}</td>{" "}
                {/* Added Rango */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center">
                No hay tabajadores aún :(
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WorkersTable;
