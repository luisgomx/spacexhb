import React, { useState } from "react";
import EditWorkerModal from "./EditWorkerModal";

interface Worker {
  _id: string;
  usuario: string;
  fecha: string;
  registradoPor: string;
  category: string;
  savedPayment: boolean;
  halfTime: boolean;
}

const WorkersTable: React.FC<{
  workers: Worker[];
  setTriggerWorkers: any;
  triggerWorkers: any;
}> = ({ workers, setTriggerWorkers, triggerWorkers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchWorker = async (id: string) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/worker/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
          },
        },
      );
      if (response.ok) {
        const worker = await response.json();
        return worker;
      } else {
        console.error("Failed to fetch worker data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    return null;
  };

  const handleEditClick = async (worker: Worker) => {
    const latestWorkerData = await fetchWorker(worker._id);
    if (latestWorkerData) {
      setSelectedWorker(latestWorkerData);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWorker(null);
  };

  const handleSaveWorker = (updatedWorker: Worker) => {
    console.log("Updated worker:", updatedWorker);
  };

  const filteredWorkers = workers.filter((worker) =>
    worker.usuario.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar trabajador"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border p-3 text-black"
        />
      </div>
      <div className="relative h-150 overflow-x-auto shadow-md dark:border-strokedark dark:bg-boxdark sm:rounded-lg">
        <table className="w-full text-left text-sm text-white rtl:text-right">
          <thead className="bg-gray-300 sticky top-0 z-10 bg-black text-xs font-extrabold uppercase text-white">
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
              </th>
              <th scope="col" className="px-6 py-3">
                Acciones
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkers.length > 0 ? (
              filteredWorkers.map((worker, index) => (
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
                  <td className="px-6 py-4">{worker.category}</td>
                  <td className="">
                    <button
                      onClick={() => handleEditClick(worker)}
                      className="ml-7 rounded-lg bg-indigo-600 p-2"
                    >
                      Editar
                    </button>
                  </td>
                  <td>
                    {worker.halfTime && (
                      <span className="mr-2 rounded-3xl bg-yellow-800 p-2">
                        Recorte
                      </span>
                    )}
                    {worker.savedPayment && (
                      <span className="rounded-3xl bg-yellow-800 p-2">
                        Guarda
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  No hay trabajadores aún :(
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <EditWorkerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        worker={selectedWorker}
        onSave={handleSaveWorker}
        setTriggerWorkers={setTriggerWorkers}
        triggerWorkers={triggerWorkers}
      />
    </div>
  );
};

export default WorkersTable;
